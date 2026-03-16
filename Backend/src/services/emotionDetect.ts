import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY! });

export interface EmotionResult {
  emotion: "anxiety" | "sadness" | "overwhelmed" | "anger" | "positive" | "neutral" | "crisis";
  severity: number;
  themes: string[];
}

export async function detectEmotion(userMessage: string): Promise<EmotionResult> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: `You are an emotion classifier for a mental wellness app serving Indian youth.
Classify the user message and return ONLY valid JSON, no markdown, no explanation.
Return exactly this structure:
{
  "emotion": "anxiety" | "sadness" | "overwhelmed" | "anger" | "positive" | "neutral" | "crisis",
  "severity": 1 | 2 | 3 | 4 | 5,
  "themes": ["theme1", "theme2"]
}
Themes examples: exams, sleep, family, relationships, career, loneliness, self-worth.
Severity 5 = severe crisis, 1 = very mild.`,
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text ?? "{}");
  } catch (err) {
    console.error("emotionDetect error:", err);
    return { emotion: "neutral", severity: 1, themes: [] };
  }
}
