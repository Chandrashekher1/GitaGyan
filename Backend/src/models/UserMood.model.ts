import mongoose from "mongoose";

const userMoodSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  moodType: { 
    type: String, 
    enum: ["HEU", "LEU", "HEP", "LEP"], 
    required: true 
  },
  answers: [{
    question: String,
    response: mongoose.Schema.Types.Mixed
  }],
  intensity: { type: Number, min: 1, max: 10 },
  duration: { type: Number, min: 1, max: 3 }, // 1: short, 2: medium, 3: long
  frequency: { type: Number, min: 1, max: 3 }, // 1: rare, 2: often, 3: constant
  severityScore: { type: Number },
  severityLevel: { 
    type: String, 
    enum: ["Mild", "Moderate", "Severe"] 
  },
  createdAt: { type: Date, default: Date.now, index: true }
});

const UserMood = mongoose.model("UserMood", userMoodSchema);

export default UserMood;
