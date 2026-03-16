import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { getOrCreateLocalUserId } from '@/lib/user-session';
import { analyzePose, submitYogaFeedback } from '../api';
import type { PoseAnalysisResult, PoseLandmark, YogaPose } from '../types';
import { analyzePoseLandmarks, hasReliablePoseLandmarks } from '../utils/poseAnalyzer';

export type AnalysisStatus =
  | { tone: 'success'; title: string; description: string }
  | { tone: 'warning'; title: string; description: string }
  | null;

export interface YogaFeedbackFormState {
  rating: number;
  helpful: boolean | null;
  targetedConcern: string;
  moodAfter: string;
  notes: string;
}

export interface YogaAttemptMeta {
  sessionId: string | null;
  poseAttemptId: string | null;
}

function getPoseMentalHealthTags(pose: YogaPose | null | undefined) {
  return Array.isArray(pose?.mentalHealthTags) ? pose.mentalHealthTags : [];
}

function createInitialFeedback(pose: YogaPose | null): YogaFeedbackFormState {
  const poseTags = getPoseMentalHealthTags(pose);
  return {
    rating: 4,
    helpful: null,
    targetedConcern: poseTags[0] ?? '',
    moodAfter: '',
    notes: '',
  };
}

export interface UseAnalysisReturn {
  snapshotDataUrl: string | null;
  analysisResult: PoseAnalysisResult | null;
  analysisStatus: AnalysisStatus;
  feedbackForm: YogaFeedbackFormState;
  setFeedbackForm: React.Dispatch<React.SetStateAction<YogaFeedbackFormState>>;
  attemptMeta: YogaAttemptMeta;
  isSavingFeedback: boolean;
  isFeedbackSaved: boolean;
  captureAndAnalyze: () => Promise<void>;
  retryCurrentPose: () => void;
  handleSubmitFeedback: () => Promise<void>;
  resetAnalysis: (pose: YogaPose | null) => void;
}

export function useAnalysis(
  selectedPose: YogaPose | null,
  latestLandmarksRef: React.MutableRefObject<PoseLandmark[] | null>,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  snapshotCanvasRef: React.RefObject<HTMLCanvasElement | null>,
  stopCamera: () => void,
  startCamera: () => Promise<void>,
  setError: (error: string | null) => void,
  onStateChange: (state: 'analyzing' | 'result' | 'camera') => void
): UseAnalysisReturn {
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(null);
  const [feedbackForm, setFeedbackForm] = useState<YogaFeedbackFormState>(
    createInitialFeedback(null)
  );
  const [attemptMeta, setAttemptMeta] = useState<YogaAttemptMeta>({
    sessionId: null,
    poseAttemptId: null,
  });
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [isFeedbackSaved, setIsFeedbackSaved] = useState(false);

  const resetAnalysis = useCallback((pose: YogaPose | null) => {
    setAnalysisResult(null);
    setSnapshotDataUrl(null);
    setAnalysisStatus(null);
    setAttemptMeta({ sessionId: null, poseAttemptId: null });
    setFeedbackForm(createInitialFeedback(pose));
    setIsFeedbackSaved(false);
  }, []);

  const captureAndAnalyze = useCallback(async () => {
    if (!selectedPose || !videoRef.current || !snapshotCanvasRef.current) {
      return;
    }

    const landmarks = latestLandmarksRef.current;
    if (!landmarks || !hasReliablePoseLandmarks(landmarks)) {
      setError('Pose not detected clearly. Step back, hold steady, and try again.');
      return;
    }

    const localAnalysis = analyzePoseLandmarks(selectedPose.name, landmarks);
    if (!localAnalysis.isDetected) {
      setError('Unable to analyze this frame. Ensure your entire body is visible.');
      return;
    }

    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      setError('Camera frame is not ready yet. Try again in a moment.');
      return;
    }

    onStateChange('analyzing');

    const canvas = snapshotCanvasRef.current;
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Could not prepare the analysis frame.');
      onStateChange('camera');
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const snapshot = canvas.toDataURL('image/jpeg', 0.8);
    setSnapshotDataUrl(snapshot);
    setAttemptMeta({ sessionId: null, poseAttemptId: null });
    setIsFeedbackSaved(false);
    setFeedbackForm(createInitialFeedback(selectedPose));

    stopCamera();

    try {
      const userId = getOrCreateLocalUserId();
      const response = await analyzePose({
        poseName: selectedPose.name,
        userId,
        landmarks,
      });

      setAnalysisResult(response.analysisResult);
      setAttemptMeta({
        sessionId: response.sessionId,
        poseAttemptId: response.poseAttemptId,
      });
      if (!response.historySaved && response.persistenceError) {
        setAnalysisStatus({
          tone: 'warning',
          title: 'Analysis complete',
          description: 'Pose scoring worked, but session history could not be saved right now.',
        });
      } else {
        setAnalysisStatus({
          tone: 'success',
          title: 'Backend analysis active',
          description: 'Your pose was scored by the backend and synced successfully.',
        });
      }
      setError(null);
    } catch (requestError) {
      console.error('Yoga analysis request failed:', requestError);
      setAnalysisResult(localAnalysis);
      setAttemptMeta({ sessionId: null, poseAttemptId: null });
      setAnalysisStatus({
        tone: 'warning',
        title: 'Using local analysis',
        description: 'The backend could not be reached, so this score was generated in the browser.',
      });
      setError(null);
    }

    onStateChange('result');
  }, [selectedPose, videoRef, snapshotCanvasRef, latestLandmarksRef, stopCamera, setError, onStateChange]);

  const retryCurrentPose = useCallback(() => {
    resetAnalysis(selectedPose);
    setError(null);
    void startCamera();
  }, [selectedPose, startCamera, resetAnalysis, setError]);

  const handleSubmitFeedback = useCallback(async () => {
    if (!attemptMeta.sessionId || !attemptMeta.poseAttemptId) {
      toast.error('Feedback can only be saved when backend sync succeeds.');
      return;
    }

    if (feedbackForm.helpful === null) {
      toast.error('Choose whether this pose felt helpful before submitting.');
      return;
    }

    setIsSavingFeedback(true);
    try {
      await submitYogaFeedback({
        sessionId: attemptMeta.sessionId,
        poseAttemptId: attemptMeta.poseAttemptId,
        rating: feedbackForm.rating,
        helpful: feedbackForm.helpful,
        targetedConcern: feedbackForm.targetedConcern,
        moodAfter: feedbackForm.moodAfter,
        notes: feedbackForm.notes.trim(),
      });
      setIsFeedbackSaved(true);
      toast.success('Yoga feedback saved.');
    } catch (submitError) {
      console.error('yoga feedback submit failed:', submitError);
      toast.error('Could not save yoga feedback right now.');
    } finally {
      setIsSavingFeedback(false);
    }
  }, [attemptMeta, feedbackForm]);

  return {
    snapshotDataUrl,
    analysisResult,
    analysisStatus,
    feedbackForm,
    setFeedbackForm,
    attemptMeta,
    isSavingFeedback,
    isFeedbackSaved,
    captureAndAnalyze,
    retryCurrentPose,
    handleSubmitFeedback,
    resetAnalysis,
  };
}

export { createInitialFeedback, getPoseMentalHealthTags };

export const moodAfterOptions = [
  'Calmer',
  'More focused',
  'Grounded',
  'Lighter',
  'Still tense',
];

export function formatWellnessTag(tag: string) {
  return tag
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
