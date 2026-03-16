import mongoose from 'mongoose';

const poseResultSchema = new mongoose.Schema({
  poseName: { type: String, required: true },
  poseNameHindi: { type: String, default: '' },
  imageBase64: { type: String, default: '' },
  analysisResult: {
    score: { type: Number, min: 0, max: 100 },
    feedback: String,
    corrections: [String],
    alignment_issues: [String],
    nextPose: String,
    encouragement: String,
  },
  timestamp: { type: Date, default: Date.now },
});

const yogaSessionSchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  sessionDate: { type: Date, default: Date.now },
  posesAttempted: [poseResultSchema],
  overallScore: { type: Number, default: 0 },
  streakDay: { type: Number, default: 0 },
});

const YogaSession = mongoose.model('YogaSession', yogaSessionSchema);

export default YogaSession;
