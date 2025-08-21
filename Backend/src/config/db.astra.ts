import { DataAPIClient, Db } from "@datastax/astra-db-ts";
import * as dotenv from "dotenv"
dotenv.config()

export function connectToDatabase(): Db {
  const { ASTRA_DB_API_ENDPOINT: endpoint, ASTRA_DB_APPLICATION_TOKEN: token } = process.env;

  if (!token || !endpoint) {
    throw new Error(
      "Environment variables API_ENDPOINT and APPLICATION_TOKEN must be defined.",
    );
  }

  const client = new DataAPIClient();
  const database = client.db(endpoint, { token });
  console.log(`Connected to database ${database.id}`);
  return database;
}