import express from "express";
import textToSpeech, { protos } from "@google-cloud/text-to-speech";
import dotenv from "dotenv";
import auth from "../middleware/auth.middleware.js";

dotenv.config();

const router = express.Router();
const client = new textToSpeech.TextToSpeechClient();

router.post("/", [auth], async (req: any, res: any) => {
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
        audioEncoding: protos.google.cloud.texttospeech.v1.AudioEncoding.MP3,
      },
    };

    const [response] = await client.synthesizeSpeech(request);

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": "inline; filename=output.mp3",
    });

    if (response.audioContent instanceof Uint8Array) {
      res.send(Buffer.from(response.audioContent));
    } else if (typeof response.audioContent === "string") {
      res.send(Buffer.from(response.audioContent, "base64"));
    } else {
      throw new Error("Invalid audio content format received from TTS API");
    }
  } catch (err: any) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
