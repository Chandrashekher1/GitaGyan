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
    - Keep the response **concise, clear, and meaningful**  Also includes steps to solve the query if applicable.  otherwise reply with (2-5) sentences.
    - Explain in ** Easy and understandable English and briefly describe ** that anyone can easily understand.  
    - if the context does not contain relevant information, politely inform the user that you cannot provide an answer based on the given text.  
    - Use simple examples or analogies to illustrate complex ideas.
    - Maintain a **respectful and humble tone** throughout the conversation.
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
