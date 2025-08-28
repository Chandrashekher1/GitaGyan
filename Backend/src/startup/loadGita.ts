import * as dotenv from "dotenv";
dotenv.config();

import { Collection } from "../services/collection.js";
import { InsertCollection } from "../services/insert_collection.js";
import { connectToDatabase } from "../config/db.astra.js";

async function loadGita() {
  try {
    try {
      await Collection();
      
    } catch (err: any) {
      if (err.message.includes("already exists")) {
        console.log(" Collection already exists.");
      } else {
        throw err;
      }
    }
    const existing  = await connectToDatabase().collection("Bhagwat_Gita").findOne({})
    if(existing){
      console.log("Bhagvad Gita is already inserted.");
      return
    }
    else{
      await InsertCollection();
      console.log("Bhagavad Gita inserted successfully!");
    }
  } catch (err) {
    console.error("Failed to load Gita:", err);
  }
}

loadGita();
