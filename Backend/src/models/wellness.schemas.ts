import mongoose from "mongoose";

export const completionFeedbackSchema = new mongoose.Schema(
  {
    rating: { type: Number, min: 1, max: 5 },
    helpful: { type: Boolean },
    targetedConcern: { type: String, trim: true, default: "" },
    moodAfter: { type: String, trim: true, default: "" },
    notes: { type: String, trim: true, maxlength: 500, default: "" },
    submittedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);
