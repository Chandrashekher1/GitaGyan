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
const BATCH_SIZE = 200


export async function InsertCollection() {
  const database = await connectToDatabase();
  const collection = database.collection("Bhagwat_Gita");

  const pdfPath = path.resolve(__dirname, "../../src/data/Bhagavad_gita.pdf")
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


  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = documents.slice(i, i + BATCH_SIZE);
    try {
      await collection.insertMany(batch);
      console.log(`Inserted batch ${i / BATCH_SIZE + 1}`);
    } catch (err) {
      console.error(`Failed batch ${i / BATCH_SIZE + 1}`, err);
    }
  }

 
}