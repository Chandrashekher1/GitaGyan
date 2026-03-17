import express from "express";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();

// Lazy-init: only create the client when actually needed (prevents crash at startup
// when Google Cloud credentials are not configured).
let client: textToSpeech.TextToSpeechClient | null = null;

function getClient() {
  if (!client) {
    client = new textToSpeech.TextToSpeechClient();
  }
  return client;
}

router.post("/", async (req, res) => {
  try {
    const { text, language } = req.body;
    const ttsClient = getClient();

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

    const [response] = await ttsClient.synthesizeSpeech(request);

    res.set("Content-Type", "audio/mpeg");
    res.json({success: true, status:200, audioContent: response.audioContent?.toString("base64") });
  } catch (err: any) {
    console.error("ERROR:", err.message || err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
