import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import {
  AlertCircle,
  ArrowLeft,
  Camera as CameraIcon,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { analyzePose, getYogaPoses } from './api';
import type { PoseAnalysisResult, PoseLandmark, YogaPose } from './types';
import {
  analyzePoseLandmarks,
  getRealtimeCorrections,
  hasReliablePoseLandmarks,
} from './utils/poseAnalyzer';

type CameraState = 'selecting' | 'camera' | 'analyzing' | 'result';

type AnalysisStatus =
  | {
      tone: 'success';
      title: string;
      description: string;
    }
  | {
      tone: 'warning';
      title: string;
      description: string;
    }
  | null;

const difficultyColors: Record<string, string> = {
  beginner: 'bg-green-100 text-green-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-red-100 text-red-800',
};

const YogaCamera: React.FC = () => {
  const [state, setState] = useState<CameraState>('selecting');
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [loadingPoses, setLoadingPoses] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<PoseAnalysisResult | null>(null);
  const [realTimeFeedback, setRealTimeFeedback] = useState<string[]>([]);
  const [isStable, setIsStable] = useState(false);
  const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const latestLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const stabilityHistoryRef = useRef<PoseLandmark[][]>([]);

  useEffect(() => {
    getYogaPoses()
      .then((data) => {
        setPoses(data);
        setLoadingPoses(false);
      })
      .catch(() => {
        setError('Could not load yoga poses. Please refresh and try again.');
        setLoadingPoses(false);
      });
  }, []);

  const stopCamera = useCallback(() => {
    if (mpCameraRef.current) {
      mpCameraRef.current.stop();
      mpCameraRef.current = null;
    }

    poseRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    latestLandmarksRef.current = null;
    stabilityHistoryRef.current = [];
    setRealTimeFeedback([]);
    setIsStable(false);
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const startCamera = useCallback(async () => {
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 960 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      latestLandmarksRef.current = null;
      stabilityHistoryRef.current = [];
      setRealTimeFeedback([]);
      setIsStable(false);
      setState('camera');
    } catch {
      setError('Camera access was denied. Allow camera permissions and try again.');
      setState('selecting');
    }
  }, []);

  const handleSelectPose = useCallback(
    (pose: YogaPose) => {
      setSelectedPose(pose);
      setSnapshotDataUrl(null);
      setAnalysisResult(null);
      setAnalysisStatus(null);
      void startCamera();
    },
    [startCamera]
  );

  const handleChangePose = useCallback(() => {
    stopCamera();
    setSelectedPose(null);
    setSnapshotDataUrl(null);
    setAnalysisResult(null);
    setAnalysisStatus(null);
    setError(null);
    setState('selecting');
  }, [stopCamera]);

  useEffect(() => {
    if (state !== 'camera' || !selectedPose || !videoRef.current || !overlayCanvasRef.current) {
      return;
    }

    let disposed = false;
    let latestSend: Promise<void> = Promise.resolve();
    const pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });
    poseRef.current = pose;

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: false,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    pose.onResults((results) => {
      const canvas = overlayCanvasRef.current;
      const video = videoRef.current;
      if (!canvas || !video) {
        return;
      }

      const width = video.videoWidth || 960;
      const height = video.videoHeight || 720;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.save();
      context.clearRect(0, 0, width, height);
      context.translate(width, 0);
      context.scale(-1, 1);

      if (results.poseLandmarks) {
        const landmarks = results.poseLandmarks.map((item) => ({
          x: item.x,
          y: item.y,
          z: item.z,
          visibility: item.visibility,
        }));

        latestLandmarksRef.current = landmarks;
        drawConnectors(context, results.poseLandmarks, POSE_CONNECTIONS, {
          color: '#10b981',
          lineWidth: 4,
        });
        drawLandmarks(context, results.poseLandmarks, {
          color: '#f59e0b',
          lineWidth: 2,
          radius: 4,
        });

        setRealTimeFeedback(getRealtimeCorrections(selectedPose.name, landmarks));

        stabilityHistoryRef.current.push(landmarks);
        if (stabilityHistoryRef.current.length > 15) {
          stabilityHistoryRef.current.shift();
        }

        if (stabilityHistoryRef.current.length === 15) {
          const history = stabilityHistoryRef.current;
          const anchorIndex = 23;
          const meanX =
            history.reduce((sum, frame) => sum + frame[anchorIndex]!.x, 0) / history.length;
          const meanY =
            history.reduce((sum, frame) => sum + frame[anchorIndex]!.y, 0) / history.length;
          const variance =
            history.reduce((sum, frame) => {
              const deltaX = frame[anchorIndex]!.x - meanX;
              const deltaY = frame[anchorIndex]!.y - meanY;
              return sum + deltaX * deltaX + deltaY * deltaY;
            }, 0) / history.length;

          setIsStable(variance < 0.00012);
        }
      } else {
        latestLandmarksRef.current = null;
        setRealTimeFeedback([]);
        setIsStable(false);
      }

      context.restore();
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (disposed || poseRef.current !== pose || !videoRef.current) {
          return;
        }

        latestSend = latestSend.then(async () => {
          if (disposed || poseRef.current !== pose || !videoRef.current) {
            return;
          }

          try {
            await pose.send({ image: videoRef.current });
          } catch (frameError) {
            if (!disposed) {
              console.error('MediaPipe pose frame failed:', frameError);
            }
          }
        });

        await latestSend;
      },
      width: 960,
      height: 720,
    });

    camera.start();
    mpCameraRef.current = camera;

    return () => {
      disposed = true;
      camera.stop();
      if (mpCameraRef.current === camera) {
        mpCameraRef.current = null;
      }
      if (poseRef.current === pose) {
        poseRef.current = null;
      }

      void latestSend.finally(() => {
        if (typeof pose.close === 'function') {
          void pose.close();
        }
      });
    };
  }, [selectedPose, state]);

  const captureAndAnalyze = useCallback(async () => {
    if (
      state !== 'camera' ||
      !selectedPose ||
      !videoRef.current ||
      !snapshotCanvasRef.current
    ) {
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

    setState('analyzing');

    const canvas = snapshotCanvasRef.current;
    canvas.width = video.videoWidth || 960;
    canvas.height = video.videoHeight || 720;
    const context = canvas.getContext('2d');
    if (!context) {
      setError('Could not prepare the analysis frame.');
      setState('camera');
      return;
    }

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    context.setTransform(1, 0, 0, 1, 0, 0);

    const snapshot = canvas.toDataURL('image/jpeg', 0.8);
    setSnapshotDataUrl(snapshot);

    stopCamera();

    try {
      const userId = localStorage.getItem('uid') ?? `guest_${Date.now()}`;
      const response = await analyzePose({
        poseName: selectedPose.name,
        userId,
        landmarks,
      });

      setAnalysisResult(response.analysisResult);
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
      setAnalysisStatus({
        tone: 'warning',
        title: 'Using local analysis',
        description: 'The backend could not be reached, so this score was generated in the browser.',
      });
      setError(null);
    }

    setState('result');
  }, [selectedPose, state, stopCamera]);

  const retryCurrentPose = useCallback(() => {
    setAnalysisResult(null);
    setSnapshotDataUrl(null);
    setAnalysisStatus(null);
    setError(null);
    void startCamera();
  }, [startCamera]);

  if (state === 'selecting') {
    return (
      <div className="w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {error && (
          <Card className="mb-6 border-red-500/50 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)] backdrop-blur-md">
            <CardContent className="py-4 text-center text-sm font-medium text-red-500">
              {error}
            </CardContent>
          </Card>
        )}

        {loadingPoses ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_20px_var(--color-primary)]" />
            <p className="mt-4 text-muted-foreground font-medium animate-pulse">Loading poses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-2">
            {poses.map((pose, index) => (
              <Card
                key={pose.id}
                className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-[0_8px_30px_rgba(244,162,97,0.3)] hover:-translate-y-1 border-border/50 bg-card/80 backdrop-blur-sm"
                onClick={() => handleSelectPose(pose)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <CardHeader className="pb-3 relative z-10">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {pose.name}
                      </CardTitle>
                      <p className="text-[15px] text-muted-foreground mt-1 font-medium font-comic">
                        {pose.nameHindi}
                      </p>
                    </div>
                    <span
                      className={`text-[12px] font-bold px-2.5 py-1 rounded-full capitalize tracking-wide shadow-sm ${difficultyColors[pose.difficulty]}`}
                    >
                      {pose.difficulty}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="pt-0 relative z-10">
                  <p className="text-sm text-foreground/80 mb-4 line-clamp-2 leading-relaxed">
                    {pose.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {pose.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-[12px] bg-background/50 border border-border/50 text-muted-foreground px-2.5 py-1 rounded-full shadow-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (state === 'result' && selectedPose && analysisResult) {
    return (
      <div className="w-full max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-6 duration-500 relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            className="h-12 px-6 rounded-full hover:bg-white/10 text-stone-100 font-semibold gap-2 border border-white/5 backdrop-blur-md transition-all shadow-sm"
            onClick={retryCurrentPose}
          >
            <ArrowLeft className="w-5 h-5 text-stone-300" /> Retry Pose
          </Button>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex-1 text-center sm:text-left drop-shadow-md">
            Analysis Results
          </h2>
        </div>

        {analysisStatus && (
          <div
            className={`mb-6 rounded-3xl border px-5 py-4 sm:px-6 sm:py-5 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${
              analysisStatus.tone === 'success'
                ? 'border-emerald-400/25 bg-emerald-500/10'
                : 'border-amber-400/25 bg-amber-500/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                  analysisStatus.tone === 'success'
                    ? 'bg-emerald-400/15 text-emerald-300'
                    : 'bg-amber-400/15 text-amber-300'
                }`}
              >
                {analysisStatus.tone === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-white">
                  {analysisStatus.title}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-stone-300">
                  {analysisStatus.description}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6 sm:gap-8">
          <div className="bg-card text-card-foreground rounded-3xl border border-border/50 p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col h-full relative overflow-hidden isolate">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-inner">
                <CameraIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-bold tracking-wide text-foreground">{selectedPose.name}</h3>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {selectedPose.nameHindi}
                </p>
              </div>
            </div>

            <div className="relative w-full aspect-[4/3] rounded-2xl bg-black/50 border border-white/10 shadow-inner overflow-hidden flex items-center justify-center z-10 group">
              {snapshotDataUrl ? (
                <img src={snapshotDataUrl} alt="Your pose snapshot" className="w-full h-full object-contain" />
              ) : (
                <span className="text-stone-500">Snapshot unavailable</span>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl pointer-events-none" />
            </div>

            <div className="mt-6 rounded-2xl border border-border/50 bg-muted/30 p-5">
              <p className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.18em]">
                Summary
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground/90">
                {analysisResult.feedback}
              </p>
              <p className="mt-3 text-sm text-muted-foreground">
                Next pose: {analysisResult.nextPose}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {analysisStatus?.tone === 'warning' ? 'Local score' : 'Backend score'}
                </span>
                <span className="rounded-full border border-border/60 bg-background/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {analysisResult.analysisSource}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-card text-card-foreground rounded-3xl border border-border/50 p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] relative overflow-hidden text-center isolate">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-8 relative z-10">
                Form Match
              </h3>

              <div className="relative w-40 h-40 mx-auto flex items-center justify-center mb-8 shrink-0 z-10">
                <div
                  className={`absolute inset-0 rounded-full border-[6px] opacity-20 ${
                    analysisResult.score > 85
                      ? 'border-green-500'
                      : analysisResult.score > 70
                        ? 'border-amber-500'
                        : 'border-orange-500'
                  }`}
                />
                <div className="absolute inset-2 bg-background/50 rounded-full shadow-inner border border-border/50 backdrop-blur-xl" />
                <div
                  className={`text-5xl font-extrabold tracking-tighter drop-shadow-xl ${
                    analysisResult.score > 85
                      ? 'text-green-400'
                      : analysisResult.score > 70
                        ? 'text-amber-400'
                        : 'text-orange-400'
                  }`}
                >
                  {analysisResult.score}
                  <span className="text-3xl font-bold opacity-50 ml-1">%</span>
                </div>
              </div>

              {analysisResult.score > 85 ? (
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-4 py-2 rounded-full text-sm font-semibold shadow-inner mt-2">
                  <CheckCircle2 className="w-4 h-4" /> Excellent Form
                </div>
              ) : analysisResult.score > 70 ? (
                <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-4 py-2 rounded-full text-sm font-semibold shadow-inner mt-2">
                  <RotateCcw className="w-4 h-4" /> Almost there
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-2 rounded-full text-sm font-semibold shadow-inner mt-2">
                  <AlertCircle className="w-4 h-4" /> Needs adjustment
                </div>
              )}
            </div>

            <div className="bg-card text-card-foreground rounded-3xl border border-border/50 p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex-1 justify-center flex flex-col min-h-[220px]">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full" /> Coaching Notes
              </h3>
              <ul className="space-y-4 text-[15px] font-medium leading-relaxed max-w-[95%]">
                {analysisResult.corrections.length > 0 ? (
                  analysisResult.corrections.map((correction, index) => (
                    <li
                      key={correction}
                      className="flex gap-3 items-start p-3 bg-muted/50 rounded-xl border border-border/50 shadow-sm"
                    >
                      <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-background flex items-center justify-center text-[10px] text-muted-foreground font-bold border border-border">
                        {index + 1}
                      </span>
                      <span className="pt-0.5 text-foreground/90">{correction}</span>
                    </li>
                  ))
                ) : (
                  <li className="flex gap-3 items-center text-green-600 dark:text-green-400 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                    <CheckCircle2 className="w-6 h-6 shrink-0" /> Focus on your breath. Your alignment looks strong.
                  </li>
                )}
              </ul>

              <div className="mt-6 rounded-2xl border border-primary/20 bg-primary/5 px-5 py-4 text-sm text-foreground/80">
                {analysisResult.encouragement}
              </div>
            </div>

            <Button
              className="w-full h-14 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 gap-2 mt-2"
              onClick={handleChangePose}
            >
              Choose Another Pose <ChevronRight className="w-5 h-5 opacity-70" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <Card className="border-border/50 bg-card/90 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.1)] overflow-hidden rounded-3xl">
        <CardHeader className="text-center pb-4 pt-6 bg-gradient-to-b from-primary/5 to-transparent relative border-b border-border/50 flex flex-col sm:flex-row justify-between items-center px-8">
          <div className="text-left">
            <CardTitle className="flex flex-col items-start gap-1">
              <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                {selectedPose?.name}
              </span>
              <span className="text-base font-comic text-muted-foreground font-medium">
                {selectedPose?.nameHindi}
              </span>
            </CardTitle>
          </div>

          <div className="mt-4 sm:mt-0 flex items-center gap-4">
            <Button
              variant="outline"
              className="h-10 rounded-full border-border/50 font-bold hover:bg-muted"
              onClick={handleChangePose}
              disabled={state === 'analyzing'}
            >
              End Practice
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row w-full h-[650px] divide-y lg:divide-y-0 lg:divide-x divide-border/50">
            <div className="w-full lg:w-[350px] shrink-0 bg-stone-50/50 p-6 sm:p-8 flex flex-col relative overflow-y-auto hidden lg:flex">
              <div className="absolute inset-0 bg-gradient-to-br from-stone-100/50 to-transparent" />
              <div className="relative z-10 w-full flex flex-col h-full">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                  Target Pose
                </h3>

                <div className="w-full aspect-[4/5] rounded-2xl bg-white shadow-sm border border-stone-200 overflow-hidden mb-6 relative group isolate">
                  {selectedPose?.imageUrl ? (
                    <img src={selectedPose.imageUrl} alt={selectedPose.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-400 text-sm font-medium">
                      Image loading...
                    </div>
                  )}
                  <div className="absolute inset-0 border-[3px] border-black/5 rounded-2xl pointer-events-none" />
                </div>

                <div className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm mt-auto">
                  <h4 className="text-[14px] font-bold text-stone-800 mb-2">Instructions</h4>
                  <p className="text-[13px] text-stone-600 leading-relaxed font-medium">
                    {selectedPose?.description}
                    <br />
                    <br />
                    <span className="text-stone-400">
                      Match the skeleton overlay and hold the pose steady before capture.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-grow p-4 sm:p-6 bg-stone-900 relative flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full max-h-[600px] flex justify-center items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-contain rounded-2xl shadow-2xl border-2 border-white/10 transition-all duration-700 ${
                    state === 'analyzing' ? 'filter contrast-110 brightness-110 scale-[1.02]' : 'scale-100'
                  }`}
                  style={{ transform: state === 'analyzing' ? 'scaleX(-1) scale(1.02)' : 'scaleX(-1)' }}
                />

                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                />

                <div className="absolute inset-4 md:inset-8 border border-white/20 border-dashed rounded-xl pointer-events-none transition-all duration-300 z-20" />

                <div className="absolute top-6 left-6 right-6 z-30 flex flex-col gap-3 pointer-events-none">
                  {realTimeFeedback.map((feedback) => (
                    <div
                      key={feedback}
                      className="bg-orange-500/20 backdrop-blur-md border border-orange-500/40 text-orange-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 duration-300 shadow-lg"
                    >
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      {feedback}
                    </div>
                  ))}

                  {isStable && (
                    <div className="bg-green-500/20 backdrop-blur-md border border-green-500/40 text-green-200 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-in zoom-in duration-500 shadow-lg self-start">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      Pose Stabilized
                    </div>
                  )}
                </div>

                {state === 'camera' && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
                    <Button
                      onClick={() => void captureAndAnalyze()}
                      className="h-16 w-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/50 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 group"
                    >
                      <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center text-primary group-hover:scale-95 transition-transform">
                        <CameraIcon className="w-6 h-6 text-stone-900" />
                      </div>
                    </Button>
                    <span className="text-white/80 text-sm font-medium drop-shadow-md">Capture Pose</span>
                  </div>
                )}

                {state === 'analyzing' && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-2xl">
                    <div className="flex flex-col items-center gap-4 p-8 bg-stone-900/90 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in-95">
                      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-white font-medium text-lg tracking-wide">Analyzing your form...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && state === 'camera' && (
        <div className="mt-5 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm font-medium text-red-100">
          {error}
        </div>
      )}

      <canvas ref={snapshotCanvasRef} className="hidden" />
    </div>
  );
};

export default YogaCamera;
