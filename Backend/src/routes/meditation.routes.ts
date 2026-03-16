import express from "express";
import MeditationSession from "../models/MeditationSession.model.js";
import {
  MEDITATION_SOUNDS,
  findMeditationSoundById,
} from "../utils/wellnessCatalog.js";

const router = express.Router();

router.get("/sounds", (_req: any, res: any) => {
  res.json(MEDITATION_SOUNDS);
});

router.post("/complete", async (req: any, res: any) => {
  try {
    const {
      userId,
      soundId,
      plannedDurationMinutes,
      actualDurationSeconds,
      status,
      startedAt,
      feedback,
    } = req.body as {
      userId?: string;
      soundId?: string;
      plannedDurationMinutes?: number;
      actualDurationSeconds?: number;
      status?: "completed" | "stopped_early";
      startedAt?: string;
      feedback?: {
        rating?: number;
        helpful?: boolean;
        targetedConcern?: string;
        moodAfter?: string;
        notes?: string;
      };
    };

    if (!userId || !soundId || !plannedDurationMinutes) {
      return res.status(400).json({
        error: "userId, soundId, and plannedDurationMinutes are required",
      });
    }

    const sound = findMeditationSoundById(soundId);
    if (!sound) {
      return res.status(404).json({ error: "Meditation sound not found" });
    }

    if (MeditationSession.db.readyState !== 1) {
      return res
        .status(503)
        .json({ error: "Meditation history is unavailable right now" });
    }

    const session = await MeditationSession.create({
      userId,
      soundId: sound.id,
      soundName: sound.name,
      soundType: sound.type,
      mentalHealthTags: sound.mentalHealthTags,
      plannedDurationMinutes,
      actualDurationSeconds:
        typeof actualDurationSeconds === "number"
          ? Math.max(0, actualDurationSeconds)
          : plannedDurationMinutes * 60,
      status: status === "stopped_early" ? "stopped_early" : "completed",
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: new Date(),
      feedback,
    });

    res.status(201).json({
      success: true,
      sessionId: String(session._id),
    });
  } catch (error: any) {
    console.error("meditation complete error:", error);
    res.status(500).json({
      error: error?.message || "Could not save meditation session",
    });
  }
});

router.get("/history/:userId", async (req: any, res: any) => {
  try {
    if (MeditationSession.db.readyState !== 1) {
      return res.json({ sessions: [], historyAvailable: false });
    }

    const sessions = await MeditationSession.find({ userId: req.params.userId })
      .sort({ completedAt: -1 })
      .limit(10);

    res.json({ sessions, historyAvailable: true });
  } catch (error) {
    console.error("meditation history error:", error);
    res.json({ sessions: [], historyAvailable: false });
  }
});

export default router;
