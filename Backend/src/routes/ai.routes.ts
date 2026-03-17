import express from "express";
import { GoogleGenAI } from "@google/genai";
import { connectToDatabase } from "../config/db.astra.js";
import { classifySafety } from "../services/safetyClassifier.js";
import {
  detectEmotion,
  type EmotionResult,
} from "../services/emotionDetect.js";
import {
  tripleRAGQuery,
  saveChatTurn,
  getRecentChatHistory,
} from "../services/ragPipeline.js";
import { getUserWellnessSnapshot } from "../services/wellnessInsights.js";
import { Session } from "../models/Session.model.js";
import auth from "../middleware/auth.middleware.js";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });
const CHAT_HISTORY_COLLECTION = "chat_history";

interface AssistantResponse {
  ui_component:
  | "breathing"
  | "grounding"
  | "journal"
  | "insight"
  | "stories"
  | "gratitude"
  | "crisis";
  component_params: Record<string, unknown>;
  insight_text: string;
  follow_up_suggestion: "breathing" | "grounding" | "journal" | null;
  gita_reference: string | null;
  recommended_practices: string[];
  helplines?: string[];
}

const SYSTEM_PROMPT = `You are Lord Krishna, the eternal teacher and guide, explaining the wisdom of the Bhagavad Gita to a user who may be experiencing mental or emotional challenges.
You have access to ancient wisdom, mental health resources, and tracked wellness activities the user has already completed.

When the user's tracked yoga or meditation history is relevant, refer to it naturally and prefer actions that helped them before.

IMPORTANT RESPONSE RULES:
- Answer ONLY using the provided conversational context and retrieved wisdom.
- If the context does not contain relevant information, politely reply with: <p>Context not found.</p>
- Keep the response concise, clear, and meaningful.
- Write the final text in the language the user is speaking in.
- Maintain a respectful, compassionate, and humble tone throughout.

Respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{
  "ui_component": "breathing" | "grounding" | "journal" | "insight" | "stories" | "gratitude",
  "component_params": {},
  "insight_text": "[HTML content here according to the structure below]",
  "follow_up_suggestion": "breathing" | "grounding" | "journal" | null,
  "gita_reference": "chapter.verse" | null,
  "recommended_practices": ["0-3 short, specific practices personalized to the user's mood and past helpful actions"]
}

The \`insight_text\` MUST be formatted using HTML tags following this exact structure:

<h1 className="font-bold text-xl my-2">🌿 From the Bhagavad Gita</h1> 
(if the user is speaking in Hindi, write: <h1 className="font-bold text-xl my-2">🌿 भगवद् गीता के अनुसार</h1>)

<ul>
  <li>Point 1 (in simple, easy-to-understand language. Numbered 1, 2, 3...)</li>
  <li>Point 2 (use examples/analogies inside if needed)</li>
  <li>Point 3</li>
</ul>

<h1 className="font-bold text-xl my-2">🌿 Practical Guidance</h1>
(if the user is speaking in Hindi, write: <h1 className="font-bold text-xl my-2">🌿 व्यावहारिक मार्गदर्शन</h1>)

<ul>
  <li>Step 1 (numbered list)</li>
  <li>Step 2</li>
</ul>

Choose ui_component based on the user's primary need:
- anxiety/panic → breathing
- overwhelmed/exam stress → grounding
- sadness/processing emotions → journal
- seeking meaning/clarity → insight
- feeling alone → stories
- positive/want to build on good feeling → gratitude`;

function resolveUserId(user: any) {
  if (typeof user?._id === "string") {
    return user._id;
  }

  if (user?._id?.toString) {
    return user._id.toString();
  }

  if (typeof user?.guestId === "string") {
    return user.guestId;
  }

  return "anonymous";
}

function createSessionTitle(content?: string | null) {
  const normalized = typeof content === "string" ? content.replace(/\s+/g, " ").trim() : "";
  if (!normalized) {
    return "Reflection session";
  }

  return normalized.length > 64 ? `${normalized.slice(0, 64).trimEnd()}...` : normalized;
}

async function getSessionTitle(sessionId: string) {
  try {
    const collection = connectToDatabase().collection(CHAT_HISTORY_COLLECTION);
    const cursor = collection.find(
      { sessionId, role: "user" },
      {
        sort: { timestamp: 1 },
        limit: 1,
      }
    );

    for await (const doc of cursor) {
      return createSessionTitle(doc.content);
    }
  } catch (error) {
    console.error("session title fetch error:", error);
  }

  return "Reflection session";
}

async function getSessionMessages(sessionId: string, limit: number) {
  try {
    const collection = connectToDatabase().collection(CHAT_HISTORY_COLLECTION);
    const cursor = collection.find(
      { sessionId },
      {
        sort: { timestamp: -1 },
        limit,
      }
    );

    const messages: Array<{
      role: string;
      content: string;
      timestamp: string;
      emotion: string | null;
      uiComponent: string | null;
    }> = [];

    for await (const doc of cursor) {
      messages.push({
        role: doc.role,
        content: doc.content,
        timestamp: doc.timestamp,
        emotion: doc.emotion ?? null,
        uiComponent: doc.uiComponent ?? null,
      });
    }

    return messages.reverse();
  } catch (error) {
    console.error("session messages fetch error:", error);
    return [];
  }
}

function normalizePractices(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback.slice(0, 3);
  }

  const practices = value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);

  return practices.length ? practices.slice(0, 3) : fallback.slice(0, 3);
}

function normalizeAssistantResponse(
  raw: any,
  fallbackPractices: string[]
): AssistantResponse {
  const allowedUiComponents = new Set([
    "breathing",
    "grounding",
    "journal",
    "insight",
    "stories",
    "gratitude",
    "crisis",
  ]);
  const allowedFollowUps = new Set(["breathing", "grounding", "journal"]);

  return {
    ui_component: allowedUiComponents.has(raw?.ui_component)
      ? raw.ui_component
      : "insight",
    component_params:
      raw?.component_params && typeof raw.component_params === "object"
        ? raw.component_params
        : {},
    insight_text:
      typeof raw?.insight_text === "string" && raw.insight_text.trim()
        ? raw.insight_text
        : "Take a breath. Something went wrong on our end, but you can try again.",
    follow_up_suggestion: allowedFollowUps.has(raw?.follow_up_suggestion)
      ? raw.follow_up_suggestion
      : null,
    gita_reference:
      typeof raw?.gita_reference === "string" && raw.gita_reference.trim()
        ? raw.gita_reference
        : null,
    recommended_practices: normalizePractices(
      raw?.recommended_practices,
      fallbackPractices
    ),
    helplines: Array.isArray(raw?.helplines)
      ? raw.helplines.filter((item: unknown): item is string => typeof item === "string")
      : undefined,
  };
}

function parseAssistantResponse(
  rawText: string,
  fallbackPractices: string[]
): AssistantResponse {
  try {
    return normalizeAssistantResponse(JSON.parse(rawText), fallbackPractices);
  } catch {
    const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
    return normalizeAssistantResponse(JSON.parse(cleaned), fallbackPractices);
  }
}

function buildEnrichedPrompt(
  message: string,
  emotionData: EmotionResult,
  ragData: {
    gitaContext: string[];
    mentalHealthContext: string[];
    semanticHistory: { role: string; content: string }[];
    recentHistory: { role: string; content: string }[];
  },
  wellnessData: {
    recentActions: string[];
    helpfulPatterns: string[];
    recommendedPractices: string[];
  },
  moodContext?: any
) {
  const historyContext = [
    ...ragData.recentHistory.slice(-4).map((item) => `[${item.role}]: ${item.content}`),
    ...(ragData.semanticHistory.length
      ? [
        `\n[Relevant past conversations]:\n${ragData.semanticHistory
          .map((item) => `- ${item.content}`)
          .join("\n")}`,
      ]
      : []),
  ].join("\n");

  const wellnessContext = [
    wellnessData.recentActions.length
      ? `Recent tracked actions:\n${wellnessData.recentActions
        .map((item) => `- ${item}`)
        .join("\n")}`
      : "",
    wellnessData.helpfulPatterns.length
      ? `What has worked before:\n${wellnessData.helpfulPatterns
        .map((item) => `- ${item}`)
        .join("\n")}`
      : "",
    wellnessData.recommendedPractices.length
      ? `Most relevant practices right now:\n${wellnessData.recommendedPractices
        .map((item) => `- ${item}`)
        .join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const moodInstruction = moodContext ? `
User's Latest Mood Check-in:
- Type: ${moodContext.moodType}
- Severity: ${moodContext.severityLevel} (Score: ${moodContext.severityScore}/15)
- Survey Highlights: ${moodContext.answers?.map((a: any) => `${a.question}: ${a.response}`).join("; ")}
Please acknowledge this mood gently in your guidance.` : "";

  return `
${historyContext ? `Conversation context:\n${historyContext}\n` : ""}
${wellnessContext ? `${wellnessContext}\n` : ""}
${moodInstruction}
Current message: "${message}"
Detected emotion: ${emotionData.emotion} (severity: ${emotionData.severity}/5)
Themes: ${emotionData.themes.join(", ") || "none"}

Relevant wisdom:
${ragData.gitaContext.slice(0, 3).map((item, index) => `[Gita ${index + 1}]: ${item}`).join("\n")}

Relevant mental health resources:
${ragData.mentalHealthContext
      .slice(0, 3)
      .map((item, index) => `[Resource ${index + 1}]: ${item}`)
      .join("\n")}

Use the user's history only when it genuinely helps. If a tracked practice fits the current emotion and has helped before, prioritize that in recommended_practices.`;
}

const CRISIS_RESPONSE: AssistantResponse = {
  ui_component: "crisis",
  component_params: {},
  insight_text: "You're not alone in this. Please reach out to someone right now.",
  follow_up_suggestion: null,
  gita_reference: null,
  recommended_practices: [],
  helplines: [
    "iCall: 9152987821 (Mon–Sat, 8am–10pm)",
    "Vandrevala Foundation: 1860-2662-345 (24/7)",
    "iCall chat: icallhelpline.org",
  ],
};

const FALLBACK_RESPONSE: AssistantResponse = {
  ui_component: "insight",
  component_params: {},
  insight_text: "Take a breath. Something went wrong on our end, but you can try again.",
  follow_up_suggestion: "breathing",
  gita_reference: null,
  recommended_practices: [],
};

//@ts-ignore
router.post("/chat", auth, async (req: any, res: any) => {
  try {
    const { message, sessionId, moodContext } = req.body;
    const userId = resolveUserId(req.user);

    if (!message || !sessionId) {
      return res.status(400).json({ error: "message and sessionId are required" });
    }

    const safety = await classifySafety(message);
    if (safety.level === "crisis") {
      return res.json(CRISIS_RESPONSE);
    }

    const emotionData = await detectEmotion(message);
    const [ragData, wellnessData] = await Promise.all([
      tripleRAGQuery(message, emotionData.emotion, sessionId),
      getUserWellnessSnapshot(userId, emotionData),
    ]);

    const enrichedPrompt = buildEnrichedPrompt(
      message,
      emotionData,
      ragData,
      wellnessData,
      moodContext
    );

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enrichedPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const aiResponse = parseAssistantResponse(
      result.text ?? "{}",
      wellnessData.recommendedPractices
    );

    saveChatTurn({
      sessionId,
      userId,
      role: "user",
      content: message,
      emotion: emotionData.emotion,
      severity: emotionData.severity,
    });
    saveChatTurn({
      sessionId,
      userId,
      role: "assistant",
      content: aiResponse.insight_text,
      emotion: emotionData.emotion,
      uiComponent: aiResponse.ui_component,
    });

    await Session.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          moodTimeline: {
            date: new Date(),
            emotion: emotionData.emotion,
            severity: emotionData.severity,
          },
        },
        $inc: { messageCount: 2 },
        $set: { lastActive: new Date(), userId },
      },
      { upsert: true }
    );

    return res.json(aiResponse);
  } catch (error: any) {
    console.error("AI chat error:", error);
    return res.status(500).json(FALLBACK_RESPONSE);
  }
});

//@ts-ignore
router.post("/chat/stream", auth, async (req: any, res: any) => {
    const { message, sessionId, moodContext } = req.body;
    const userId = resolveUserId(req.user);

    if (!message || !sessionId) {
      return res.status(400).json({ error: "message and sessionId are required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();

    const send = (event: string, data: any) => {
      res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
    };

    try {
      send("thinking", { message: "Thinking..." });

      const safety = await classifySafety(message);
      if (safety.level === "crisis") {
        send("done", CRISIS_RESPONSE);
        return res.end();
      }

      send("thinking", { message: "Understanding your message..." });
      const emotionData = await detectEmotion(message);

      send("thinking", { message: "Finding relevant guidance..." });
      const [ragData, wellnessData] = await Promise.all([
        tripleRAGQuery(message, emotionData.emotion, sessionId),
        getUserWellnessSnapshot(userId, emotionData),
      ]);

      send("thinking", { message: "Reviewing what helped before..." });
      const enrichedPrompt = buildEnrichedPrompt(
        message,
        emotionData,
        ragData,
        wellnessData,
        moodContext
      );

    send("thinking", { message: "Crafting a response..." });
    const streamResult = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: enrichedPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    let fullText = "";
    for await (const chunk of streamResult) {
      const chunkText = chunk.text;
      if (chunkText) {
        fullText += chunkText;
        send("token", { chunk: chunkText });
      }
    }

    const aiResponse = parseAssistantResponse(
      fullText,
      wellnessData.recommendedPractices
    );
    send("done", aiResponse);

    saveChatTurn({
      sessionId,
      userId,
      role: "user",
      content: message,
      emotion: emotionData.emotion,
      severity: emotionData.severity,
    });
    saveChatTurn({
      sessionId,
      userId,
      role: "assistant",
      content: aiResponse.insight_text,
      emotion: emotionData.emotion,
      uiComponent: aiResponse.ui_component,
    });
    Session.findOneAndUpdate(
      { sessionId },
      {
        $push: {
          moodTimeline: {
            date: new Date(),
            emotion: emotionData.emotion,
            severity: emotionData.severity,
          },
        },
        $inc: { messageCount: 2 },
        $set: { lastActive: new Date(), userId },
      },
      { upsert: true }
    ).catch((error: any) => console.error("Session update error:", error));

    res.end();
  } catch (error: any) {
    console.error("stream error:", error);
    send("error", { message: "Something went wrong. Please try again." });
    res.end();
  }
});

//@ts-ignore
router.get("/history/:sessionId", auth, async (req: any, res: any) => {
  try {
    const { sessionId } = req.params;
    const limit = parseInt(req.query.limit as string) || 20;
    const history = await getRecentChatHistory(sessionId, limit);
    const session = await Session.findOne({ sessionId }).select(
      "moodTimeline messageCount createdAt lastActive"
    );
    res.json({ history, session });
  } catch (error: any) {
    console.error("history fetch error:", error);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

//@ts-ignore
router.get("/sessions", auth, async (req: any, res: any) => {
  try {
    const userId = resolveUserId(req.user);
    const requestedLimit = Number.parseInt(req.query.limit as string, 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 15)
      : 10;

    const sessionDocs = await Session.find({ userId })
      .sort({ lastActive: -1 })
      .limit(limit)
      .select("sessionId moodTimeline messageCount createdAt lastActive")
      .lean();

    const sessions = await Promise.all(
      sessionDocs.map(async (sessionDoc: any) => {
        const [title, messages] = await Promise.all([
          getSessionTitle(sessionDoc.sessionId),
          getSessionMessages(sessionDoc.sessionId, 12),
        ]);

        const moodTimeline = Array.isArray(sessionDoc.moodTimeline) ? sessionDoc.moodTimeline : [];
        const lastMood = moodTimeline.length ? moodTimeline[moodTimeline.length - 1] : null;

        return {
          sessionId: sessionDoc.sessionId,
          title,
          createdAt: sessionDoc.createdAt,
          lastUpdated: sessionDoc.lastActive,
          messageCount: typeof sessionDoc.messageCount === "number" ? sessionDoc.messageCount : messages.length,
          lastMood,
          messages,
        };
      })
    );

    res.json({ success: true, sessions });
  } catch (error: any) {
    console.error("session list fetch error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Could not fetch chat sessions",
      sessions: [],
    });
  }
});

export default router;
