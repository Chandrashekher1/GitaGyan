import mongoose from "mongoose";
import { completionFeedbackSchema } from "./wellness.schemas.js";

const meditationSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  soundId: { type: String, required: true },
  soundName: { type: String, required: true },
  soundType: { type: String, required: true },
  mentalHealthTags: { type: [String], default: [] },
  plannedDurationMinutes: { type: Number, required: true, min: 1 },
  actualDurationSeconds: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["completed", "stopped_early"],
    default: "completed",
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: Date.now, index: true },
  feedback: { type: completionFeedbackSchema, default: undefined },
});

const MeditationSession = mongoose.model(
  "MeditationSession",
  meditationSessionSchema
);

export default MeditationSession;
