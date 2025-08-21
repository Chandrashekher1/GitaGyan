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
      You are an expert Bhagavad Gita teacher. 
      The user's query is: "${query}"

      Here are the most relevant context passages from Bhagavad Gita:
      ${context}
      Answer the query in a **concise, and in better manner** without adding irrelevant information and only give in english. 
      Only use the given context. 
      If the answer is not present in the context, reply: "Not found in given context."
        `
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt
  });
  return response.text
}
