import express from "express";
import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
import auth from "../middleware/auth.middleware.js";

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

/* ── Types ── */
interface AvatarAnalyzeBody {
  /** The already-generated chat response text to analyze for expression/animation. */
  text: string;
}

const ANALYSIS_INSTRUCTIONS = `
You analyze an assistant reply and select:
- facialExpression: one of [default, smile, sad, angry, surprised]
- animation: one of [Idle, Talking_0, Talking_1, Laughing, Crying]

Return ONLY a JSON object:
{"facialExpression":"smile","animation":"Talking_1"}
`;

function mapExpressionAndAnimation(raw: any) {
  const expressions = new Set(["default", "smile", "sad", "angry", "surprised"]);
  const animations = new Set(["Idle", "Talking_0", "Talking_1", "Laughing", "Crying"]);

  const expression =
    typeof raw?.facialExpression === "string" && expressions.has(raw.facialExpression)
      ? raw.facialExpression
      : "default";
  const animation =
    typeof raw?.animation === "string" && animations.has(raw.animation)
      ? raw.animation
      : "Talking_0";

  return { facialExpression: expression, animation };
}

/**
 * POST /api/avatar/analyze
 * Accepts { text } — the already-generated chat response.
 * Returns { facialExpression, animation } for the avatar to play.
 * The frontend handles TTS via browser SpeechSynthesis.
 */
router.post("/analyze", auth, async (req: any, res) => {
  try {
    const { text } = req.body as AvatarAnalyzeBody;

    if (!text || typeof text !== "string") {
      return res.json({
        id: `msg_${Date.now()}`,
        text: "Hello!",
        facialExpression: "smile",
        animation: "Talking_0",
      });
    }

    // Analyze expression + animation via Gemini
    let expression = "smile";
    let animation = "Talking_0";

    try {
      const analysisResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              { text: ANALYSIS_INSTRUCTIONS },
              { text: `Reply: "${text}"` },
            ],
          },
        ],
        config: { responseMimeType: "application/json" },
      });

      const raw = JSON.parse(analysisResult.text ?? "{}");
      const mapped = mapExpressionAndAnimation(raw);
      expression = mapped.facialExpression;
      animation = mapped.animation;
    } catch {
      // fall back to defaults — Gemini might be rate limited
    }

    return res.json({
      id: `msg_${Date.now()}`,
      text,
      facialExpression: expression,
      animation,
    });
  } catch (error: any) {
    console.error("avatar analyze error:", error?.message ?? error);

    // Graceful fallback
    const { text: bodyText } = req.body as AvatarAnalyzeBody;
    return res.json({
      id: `msg_${Date.now()}`,
      text: bodyText || "Take a moment.",
      facialExpression: "smile",
      animation: "Talking_0",
    });
  }
});

// Keep the old /chat endpoint as an alias for backwards compat
router.post("/chat", auth, async (req: any, res) => {
  const { message } = req.body;
  const text = message || req.body.text || "";
  
  let expression = "smile";
  let animation = "Talking_0";

  if (text) {
    try {
      const analysisResult = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: "user",
          parts: [
            { text: ANALYSIS_INSTRUCTIONS },
            { text: `Reply: "${text}"` },
          ],
        }],
        config: { responseMimeType: "application/json" },
      });
      const raw = JSON.parse(analysisResult.text ?? "{}");
      const mapped = mapExpressionAndAnimation(raw);
      expression = mapped.facialExpression;
      animation = mapped.animation;
    } catch {
      // defaults
    }
  }

  return res.json({
    id: `msg_${Date.now()}`,
    text: text || "Hello!",
    facialExpression: expression,
    animation,
  });
});

export default router;
