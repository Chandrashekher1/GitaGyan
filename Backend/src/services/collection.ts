import { connectToDatabase } from "../config/db.astra.js";

export async function Collection() {
  const database = connectToDatabase();
  const collection = await database.createCollection(
    "Bhagwat_Gita",
    {
      vector: {
        service: {
          provider: "nvidia",
          modelName: "NV-Embed-QA",
        },
      },
    },
  );

  // console.log(`Created collection ${collection.keyspace}.${collection.name}`);
}