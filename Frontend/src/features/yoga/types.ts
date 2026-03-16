export interface YogaPose {
  id: number;
  name: string;
  nameHindi: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  benefits: string[];
  imageUrl: string;
}

export interface PoseAnalysisResult {
  score: number;
  feedback: string;
  corrections: string[];
  alignment_issues: string[];
  nextPose: string;
  encouragement: string;
  analysisSource: 'rules';
  isDetected: boolean;
}

export interface PoseLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface YogaSessionData {
  _id: string;
  userId: string;
  sessionDate: string;
  posesAttempted: {
    poseName: string;
    poseNameHindi: string;
    analysisResult: PoseAnalysisResult;
    timestamp: string;
  }[];
  overallScore: number;
  streakDay: number;
}

export interface AnalyzeResponse {
  analysisResult: PoseAnalysisResult;
  sessionId: string | null;
  overallScore: number;
  historySaved: boolean;
  persistenceError?: string;
  apiBaseUsed?: string;
}
