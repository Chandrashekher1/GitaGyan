import { DataAPIClient, Db } from "@datastax/astra-db-ts";
import * as dotenv from "dotenv"
dotenv.config()

let dbAstra: Db | null = null

export function connectToDatabase(): Db {
  if(dbAstra) return dbAstra
  const { ASTRA_DB_API_ENDPOINT: endpoint, ASTRA_DB_APPLICATION_TOKEN: token } = process.env;


  if (!token || !endpoint) {
    throw new Error(
      "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined.",
    );
  }

  const client = new DataAPIClient({timeoutDefaults: { requestTimeoutMs: 60000 }});
  dbAstra = client.db(endpoint, { token, 
    timeoutDefaults: {
      requestTimeoutMs: 60000,
      generalMethodTimeoutMs: 120000
    }
   });
  console.log(`Connected to database ${dbAstra.id}`);
  return dbAstra;
}