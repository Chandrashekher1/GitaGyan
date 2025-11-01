import express from "express";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";
// import fs from "fs";
// import util from "util";
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();
const client = new textToSpeech.TextToSpeechClient();

router.post("/", async (req, res) => {
  try {
    const { text, language } = req.body;
    const request: protos.google.cloud.texttospeech.v1.ISynthesizeSpeechRequest = {
      input: { text },
      voice: {
        languageCode: language || "hi-IN",
        ssmlGender:
          protos.google.cloud.texttospeech.v1.SsmlVoiceGender.NEUTRAL,
      },
      audioConfig: {
        audioEncoding:
          protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    // Optional: Save locally for debugging
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile("output.mp3", response.audioContent!, "binary");

    res.set("Content-Type", "audio/mpeg");
    res.json({success: true, status:200, audioContent: response.audioContent?.toString("base64") });
  } catch (err: any) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;