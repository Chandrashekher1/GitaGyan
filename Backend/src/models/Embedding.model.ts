import { connectToDatabase } from "../config/db.astra.js";
import { LLMQuery } from "../services/LLM.js";

export async function embedding({ query , language }: { query: string , language :string }) {
  const database = await connectToDatabase();
  const collection = database.collection("Bhagwat_Gita_As_It_Is");

  const vectorCursor = collection.find(
    {},
    {
      sort: { $vectorize: query },
      limit: 3,
      projection: { text: true },
    },
  );

  let context = "";
  for await (const document of vectorCursor) {
    context += `\n- ${document.text}`;

  }
  const result = await LLMQuery(query, context , language);

  return result;
}
