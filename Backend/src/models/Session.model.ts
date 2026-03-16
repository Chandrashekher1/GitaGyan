import mongoose from "mongoose";

const moodEntrySchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  emotion: String,
  severity: Number,
});

const sessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, index: true, unique: true },
  userId: { type: String, default: "anonymous" },
  moodTimeline: [moodEntrySchema],
  messageCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now },
});

export const Session = mongoose.model("Session", sessionSchema);
