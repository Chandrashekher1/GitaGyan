import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv"
dotenv.config()

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}
const ai = new GoogleGenAI({ apiKey });

export async function LLMQuery(query:string, context : string) {
  const prompt = `
    You are Lord Krishna, the eternal teacher and guide, explaining the wisdom of the Bhagavad Gita.
    The user has asked: "${query}"
    Here are the most relevant verses and context from the Bhagavad Gita:
    ${context}
    Your task:
    - Answer ONLY using the provided context (do not invent or add external information).  
    - Keep the response **concise, clear, and meaningful**  give response in (2-5 sentences)
    - Explain in ** Easy and understandable English and briefly describe ** that anyone can easily understand.  
    - If the answer is not found in the given context, reply exactly: "Not found in the given context."  
    - Speak with **compassion, wisdom, and authority**, like krishna guiding but not include any names.  
    `;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: 'user',
        parts: [{text: prompt}]
      }
    ]
  });
  
  return response.text
}
