import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import type pdfParse from "pdf-parse";
import { createRequire } from "module";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { connectToDatabase } from "../config/db.astra.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

export async function InsertCollection() {
  const database = await connectToDatabase();
  const collection = database.collection("Bhagwat_Gita");

  const pdfPath = path.resolve(__dirname, "../../src/data/Bhagavad-gita.pdf");
  const dataBuffer = fs.readFileSync(pdfPath);

  const pdf: typeof pdfParse = require("pdf-parse");
  const parsed = await pdf(dataBuffer);

  const splitter = new TokenTextSplitter({
    encodingName: "cl100k_base",
    chunkSize: 512,
    chunkOverlap: 50,
  });
  
  const chunks = await splitter.splitText(parsed.text);
  console.log(`Split document into ${chunks.length} chunks`);

  const documents = chunks.map((chunk, index) => ({
    title: "Bhagavad_gita", 
    path: pdfPath,
    text: chunk, 
    $vectorize: chunk, 
    chunkIndex: index,
    totalChunks: chunks.length,
    created_at: new Date(),
  }));

  const inserted = await collection.insertMany(documents);
  // console.log(`Inserted ${inserted.insertedCount} document chunks into quickstart_collection`);
  // if ((inserted as any).insertedIds) {
  //   console.log("Inserted IDs:", Object.values((inserted as any).insertedIds));
  // } else {
  //   console.log("Insert result:", inserted);
  // }
}