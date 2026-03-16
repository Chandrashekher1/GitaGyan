import express from "express";
import { GoogleGenAI } from "@google/genai";
import { classifySafety } from "../services/safetyClassifier.js";
import { detectEmotion } from "../services/emotionDetect.js";
import { tripleRAGQuery, saveChatTurn, getRecentChatHistory } from "../services/ragPipeline.js";
import { Session } from "../models/Session.model.js";
import auth from "../middleware/auth.middleware.js";
import * as dotenv from "dotenv";
dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

const SYSTEM_PROMPT = `You are a compassionate mental wellness companion for Indian youth aged 16-25.
You have access to ancient wisdom and modern mental health resources.
Never mention the Bhagavad Gita by name unless the user explicitly asks about it.
Never say "I am an AI" or "As an AI".
Speak like a warm, knowledgeable friend — not a therapist, not a religious teacher.
You remember past conversations with this user — refer to them naturally when relevant.
Respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{
  "ui_component": "breathing" | "grounding" | "journal" | "insight" | "stories" | "gratitude",
  "component_params": {},
  "insight_text": "1-2 sentence wisdom-grounded insight in simple modern language",
  "follow_up_suggestion": "breathing" | "grounding" | "journal" | null,
  "gita_reference": "chapter.verse" | null
}
Choose ui_component based on the user's primary need:
- anxiety/panic → breathing
- overwhelmed/exam stress → grounding
- sadness/processing emotions → journal
- seeking meaning/clarity → insight
- feeling alone → stories
- positive/want to build on good feeling → gratitude`;

// Helper to build the enriched prompt from RAG context
function buildEnrichedPrompt(
  message: string,
  emotionData: { emotion: string; severity: number; themes: string[] },
  ragData: {
    gitaContext: string[];
    mentalHealthContext: string[];
    semanticHistory: { role: string; content: string }[];
    recentHistory: { role: string; content: string }[];
  }
) {
  const historyContext = [
    ...ragData.recentHistory.slice(-4).map((h) => `[${h.role}]: ${h.content}`),
    ...(ragData.semanticHistory.length
      ? [`\n[Relevant past conversations]:\n${ragData.semanticHistory.map((h) => `- ${h.content}`).join("\n")}`]
      : []),
  ].join("\n");

  return `
${historyContext ? `Conversation context:\n${historyContext}\n` : ""}
Current message: "${message}"
Detected emotion: ${emotionData.emotion} (severity: ${emotionData.severity}/5)
Themes: ${emotionData.themes.join(", ")}

Relevant wisdom:
${ragData.gitaContext.slice(0, 3).map((c, i) => `[Gita ${i + 1}]: ${c}`).join("\n")}

Relevant mental health resources:
${ragData.mentalHealthContext.slice(0, 3).map((c, i) => `[Resource ${i + 1}]: ${c}`).join("\n")}

Respond to the current message using the above context.`;
}

const CRISIS_RESPONSE = {
  ui_component: "crisis",
  component_params: {},
  insight_text: "You're not alone in this. Please reach out to someone right now.",
  follow_up_suggestion: null,
  gita_reference: null,
  helplines: [
    "iCall: 9152987821 (Mon–Sat, 8am–10pm)",
    "Vandrevala Foundation: 1860-2662-345 (24/7)",
    "iCall chat: icallhelpline.org",
  ],
};

// ── POST /api/ai/chat ── (NON-STREAMING)
//@ts-ignore
router.post("/chat", auth, async (req: any, res: any) => {
  try {
    const { message, sessionId } = req.body;
    const userId = req.user?._id?.toString() || "anonymous";

    if (!message || !sessionId) {
      return res.status(400).json({ error: "message and sessionId are required" });
    }

    // Safety check
    const safety = await classifySafety(message);
    if (safety.level === "crisis") {
      return res.json(CRISIS_RESPONSE);
    }

    // Emotion detection + RAG in parallel
    const [emotionData, ragData] = await Promise.all([
      detectEmotion(message),
      tripleRAGQuery(message, "neutral", sessionId),
    ]);

    // Re-run RAG with the actual detected emotion for better results
    const finalRag = await tripleRAGQuery(message, emotionData.emotion, sessionId);

    const enrichedPrompt = buildEnrichedPrompt(message, emotionData, finalRag);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: enrichedPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
      },
    });

    const aiResponse = JSON.parse(result.text ?? "{}");

    // Save both turns to Astra DB (non-blocking)
    saveChatTurn({ sessionId, userId, role: "user", content: message, emotion: emotionData.emotion, severity: emotionData.severity });
    saveChatTurn({ sessionId, userId, role: "assistant", content: aiResponse.insight_text, emotion: emotionData.emotion, uiComponent: aiResponse.ui_component });

    // Update MongoDB session metadata
    await Session.findOneAndUpdate(
      { sessionId },
      {
        $push: { moodTimeline: { date: new Date(), emotion: emotionData.emotion, severity: emotionData.severity } },
        $inc: { messageCount: 2 },
        $set: { lastActive: new Date(), userId },
      },
      { upsert: true }
    );

    return res.json(aiResponse);
  } catch (err: any) {
    console.error("AI chat error:", err);
    return res.status(500).json({
      ui_component: "insight",
      component_params: {},
      insight_text: "Take a breath. Something went wrong on our end, but you can try again.",
      follow_up_suggestion: "breathing",
      gita_reference: null,
    });
  }
});

// ── POST /api/ai/chat/stream ── (SSE STREAMING)
//@ts-ignore
router.post("/chat/stream", auth, async (req: any, res: any) => {
  const { message, sessionId } = req.body;
  const userId = req.user?._id?.toString() || "anonymous";

  if (!message || !sessionId) {
    return res.status(400).json({ error: "message and sessionId are required" });
  }

  // Set SSE headers
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

    // Safety check
    const safety = await classifySafety(message);
    if (safety.level === "crisis") {
      send("done", CRISIS_RESPONSE);
      return res.end();
    }

    send("thinking", { message: "Understanding your message..." });
    const emotionData = await detectEmotion(message);

    send("thinking", { message: "Finding relevant guidance..." });
    const ragData = await tripleRAGQuery(message, emotionData.emotion, sessionId);

    send("thinking", { message: "Crafting a response..." });
    const enrichedPrompt = buildEnrichedPrompt(message, emotionData, ragData);

    // Stream from Gemini
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

    // Parse the complete JSON and send done event
    let aiResponse;
    try {
      aiResponse = JSON.parse(fullText);
    } catch {
      const cleaned = fullText.replace(/```json\n?|\n?```/g, "").trim();
      aiResponse = JSON.parse(cleaned);
    }

    send("done", aiResponse);

    // Save turns and update session (fire-and-forget after response)
    saveChatTurn({ sessionId, userId, role: "user", content: message, emotion: emotionData.emotion, severity: emotionData.severity });
    saveChatTurn({ sessionId, userId, role: "assistant", content: aiResponse.insight_text, emotion: emotionData.emotion, uiComponent: aiResponse.ui_component });
    Session.findOneAndUpdate(
      { sessionId },
      {
        $push: { moodTimeline: { date: new Date(), emotion: emotionData.emotion, severity: emotionData.severity } },
        $inc: { messageCount: 2 },
        $set: { lastActive: new Date(), userId },
      },
      { upsert: true }
    ).catch((err: any) => console.error("Session update error:", err));

    res.end();
  } catch (err: any) {
    console.error("stream error:", err);
    send("error", { message: "Something went wrong. Please try again." });
    res.end();
  }
});

// ── GET /api/ai/history/:sessionId ── (fetch past chat for a session)
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
  } catch (err: any) {
    console.error("history fetch error:", err);
    res.status(500).json({ error: "Could not fetch history" });
  }
});

export default router;
