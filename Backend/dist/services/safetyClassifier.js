import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv";
dotenv.config();
const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
export async function classifySafety(userMessage) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash",
            contents: userMessage,
            config: {
                systemInstruction: `You are a safety classifier for a mental wellness app.
Classify the user message safety level. Return ONLY valid JSON:
{
  "safe": true | false,
  "level": "safe" | "distress" | "crisis",
  "reason": "brief reason"
}
crisis = suicidal ideation, self-harm intent, wanting to disappear or die.
distress = strong hopelessness, panic attacks, breakdown language.
safe = everything else. When uncertain, classify as safe.`,
                responseMimeType: "application/json",
            },
        });
        return JSON.parse(response.text ?? "{}");
    }
    catch (err) {
        console.error("safetyClassifier error:", err);
        return { safe: true, level: "safe", reason: "classifier unavailable" };
    }
}
//# sourceMappingURL=safetyClassifier.js.map