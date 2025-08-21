import { connectToDatabase } from "../config/db.astra.js";
import { LLMQuery } from "../services/LLM.js";

export async function embedding({query}:{query:string}) {
  const database =  connectToDatabase();

  const collection = database.collection("Bhagwat_Gita");
  const vectorCursor = collection.find(
    {},
    {
      sort: { $vectorize: query },
      limit: 3,
      projection: { text: true},
    },
  );
  let context = ""
  for await (const document of vectorCursor) {
    // console.log(document);
    context += `\n- ${document.text}`
  }

  return await LLMQuery(query, context)

}