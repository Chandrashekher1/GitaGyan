import { connectToDatabase } from "../config/db.astra.js";

export async function Collection() {
  const database = connectToDatabase();
  const collection = await database.createCollection(
    "Bhagwat_Gita_As_It_Is",
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
  return database.collection("Bhagwat_Gita_As_It_Is");
}