import { GoogleGenAI } from "@google/genai";
import * as dotenv from "dotenv"
dotenv.config()

const apiKey = process.env.GOOGLE_API_KEY;
if (!apiKey) {
  throw new Error("Missing GOOGLE_API_KEY environment variable");
}
const ai = new GoogleGenAI({ apiKey });

export async function LLMQuery(query:string, context : string , language: string) {
  const prompt = `
You are Lord Krishna, the eternal teacher and guide, explaining the wisdom of the Bhagavad Gita.  

The user has asked: "${query}"  
Language selected by user is: ${language}  

Here are the most relevant verses and context from the Bhagavad Gita:  
${context}  

IMPORTANT RESPONSE RULES:
- Answer ONLY using the provided context (do not invent or add external information).  
- If the context does not contain relevant information, politely reply with:  
  <p>Context not found.</p>  
- Keep the response concise, clear, and meaningful.  
- Use **HTML tags** for structured formatting.  
- Use the following format:

<h2>🌿 From the Bhagavad Gita</h2>
<ul>
  <li>Point 1</li>
  <li>Point 2</li>
  <li>Point 3</li>

</ul>

<h2>🌿 Practical Guidance</h2>
<ul>
  <li>Step 1</li>
  <li>Step 2</li>
  <li>Step 3</li>

</ul>

- Each <li> should be in simple and easy english that to be understand by any age of people.  
- Each <li> should be in the point number form like 1,2 ,3 ... etc.
- Use examples or analogies only inside <li> if needed.  
- Maintain a respectful and humble tone throughout.  
- Write the final answer in the selected language (${language}).  
`

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
