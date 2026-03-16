import express from "express";
import { GoogleGenAI } from "@google/genai";
import { classifySafety } from "../services/safetyClassifier.js";
import { detectEmotion, } from "../services/emotionDetect.js";
import { tripleRAGQuery, saveChatTurn, getRecentChatHistory, } from "../services/ragPipeline.js";
import { getUserWellnessSnapshot } from "../services/wellnessInsights.js";
import { Session } from "../models/Session.model.js";
import auth from "../middleware/auth.middleware.js";
import * as dotenv from "dotenv";
dotenv.config();
const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const SYSTEM_PROMPT = `You are a compassionate mental wellness companion for Indian youth aged 16-25.
You have access to ancient wisdom, mental health resources, and tracked wellness activities the user has already completed.
Never mention the Bhagavad Gita by name unless the user explicitly asks about it.
Never say "I am an AI" or "As an AI".
Speak like a warm, knowledgeable friend — not a therapist, not a religious teacher.
When the user's tracked yoga or meditation history is relevant, refer to it naturally and prefer actions that helped them before.
Respond ONLY in this exact JSON format with no markdown, no backticks, no extra text:
{
  "ui_component": "breathing" | "grounding" | "journal" | "insight" | "stories" | "gratitude",
  "component_params": {},
  "insight_text": "1-2 sentence wisdom-grounded insight in simple modern language",
  "follow_up_suggestion": "breathing" | "grounding" | "journal" | null,
  "gita_reference": "chapter.verse" | null,
  "recommended_practices": ["0-3 short, specific practices personalized to the user's mood and past helpful actions"]
}
Choose ui_component based on the user's primary need:
- anxiety/panic → breathing
- overwhelmed/exam stress → grounding
- sadness/processing emotions → journal
- seeking meaning/clarity → insight
- feeling alone → stories
- positive/want to build on good feeling → gratitude`;
function resolveUserId(user) {
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
function normalizePractices(value, fallback) {
    if (!Array.isArray(value)) {
        return fallback.slice(0, 3);
    }
    const practices = value
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    return practices.length ? practices.slice(0, 3) : fallback.slice(0, 3);
}
function normalizeAssistantResponse(raw, fallbackPractices) {
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
        component_params: raw?.component_params && typeof raw.component_params === "object"
            ? raw.component_params
            : {},
        insight_text: typeof raw?.insight_text === "string" && raw.insight_text.trim()
            ? raw.insight_text
            : "Take a breath. Something went wrong on our end, but you can try again.",
        follow_up_suggestion: allowedFollowUps.has(raw?.follow_up_suggestion)
            ? raw.follow_up_suggestion
            : null,
        gita_reference: typeof raw?.gita_reference === "string" && raw.gita_reference.trim()
            ? raw.gita_reference
            : null,
        recommended_practices: normalizePractices(raw?.recommended_practices, fallbackPractices),
        helplines: Array.isArray(raw?.helplines)
            ? raw.helplines.filter((item) => typeof item === "string")
            : undefined,
    };
}
function parseAssistantResponse(rawText, fallbackPractices) {
    try {
        return normalizeAssistantResponse(JSON.parse(rawText), fallbackPractices);
    }
    catch {
        const cleaned = rawText.replace(/```json\n?|\n?```/g, "").trim();
        return normalizeAssistantResponse(JSON.parse(cleaned), fallbackPractices);
    }
}
function buildEnrichedPrompt(message, emotionData, ragData, wellnessData) {
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
    return `
${historyContext ? `Conversation context:\n${historyContext}\n` : ""}
${wellnessContext ? `${wellnessContext}\n` : ""}
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
const CRISIS_RESPONSE = {
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
const FALLBACK_RESPONSE = {
    ui_component: "insight",
    component_params: {},
    insight_text: "Take a breath. Something went wrong on our end, but you can try again.",
    follow_up_suggestion: "breathing",
    gita_reference: null,
    recommended_practices: [],
};
//@ts-ignore
router.post("/chat", auth, async (req, res) => {
    try {
        const { message, sessionId } = req.body;
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
        const enrichedPrompt = buildEnrichedPrompt(message, emotionData, ragData, wellnessData);
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: enrichedPrompt,
            config: {
                systemInstruction: SYSTEM_PROMPT,
                responseMimeType: "application/json",
            },
        });
        const aiResponse = parseAssistantResponse(result.text ?? "{}", wellnessData.recommendedPractices);
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
        await Session.findOneAndUpdate({ sessionId }, {
            $push: {
                moodTimeline: {
                    date: new Date(),
                    emotion: emotionData.emotion,
                    severity: emotionData.severity,
                },
            },
            $inc: { messageCount: 2 },
            $set: { lastActive: new Date(), userId },
        }, { upsert: true });
        return res.json(aiResponse);
    }
    catch (error) {
        console.error("AI chat error:", error);
        return res.status(500).json(FALLBACK_RESPONSE);
    }
});
//@ts-ignore
router.post("/chat/stream", auth, async (req, res) => {
    const { message, sessionId } = req.body;
    const userId = resolveUserId(req.user);
    if (!message || !sessionId) {
        return res.status(400).json({ error: "message and sessionId are required" });
    }
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders();
    const send = (event, data) => {
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
        const enrichedPrompt = buildEnrichedPrompt(message, emotionData, ragData, wellnessData);
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
        const aiResponse = parseAssistantResponse(fullText, wellnessData.recommendedPractices);
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
        Session.findOneAndUpdate({ sessionId }, {
            $push: {
                moodTimeline: {
                    date: new Date(),
                    emotion: emotionData.emotion,
                    severity: emotionData.severity,
                },
            },
            $inc: { messageCount: 2 },
            $set: { lastActive: new Date(), userId },
        }, { upsert: true }).catch((error) => console.error("Session update error:", error));
        res.end();
    }
    catch (error) {
        console.error("stream error:", error);
        send("error", { message: "Something went wrong. Please try again." });
        res.end();
    }
});
//@ts-ignore
router.get("/history/:sessionId", auth, async (req, res) => {
    try {
        const { sessionId } = req.params;
        const limit = parseInt(req.query.limit) || 20;
        const history = await getRecentChatHistory(sessionId, limit);
        const session = await Session.findOne({ sessionId }).select("moodTimeline messageCount createdAt lastActive");
        res.json({ history, session });
    }
    catch (error) {
        console.error("history fetch error:", error);
        res.status(500).json({ error: "Could not fetch history" });
    }
});
export default router;
//# sourceMappingURL=ai.routes.js.map