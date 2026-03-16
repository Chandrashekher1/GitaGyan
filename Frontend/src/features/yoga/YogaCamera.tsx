import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { getYogaPoses } from './api';
import type { YogaPose } from './types';
import { useYogaCamera } from './hooks/useYogaCamera';
import { useAnalysis } from './hooks/useAnalysis';
import PoseSelector from './components/PoseSelector';
import CameraView from './components/CameraView';
import AnalysisResultView from './components/AnalysisResult';

type CameraState = 'selecting' | 'camera' | 'analyzing' | 'result';

const YogaCamera: React.FC = () => {
  const [state, setState] = useState<CameraState>('selecting');
  const [poses, setPoses] = useState<YogaPose[]>([]);
  const [selectedPose, setSelectedPose] = useState<YogaPose | null>(null);
  const [loadingPoses, setLoadingPoses] = useState(true);
  const [poseLoadError, setPoseLoadError] = useState<string | null>(null);

  // Camera hook
  const camera = useYogaCamera(
    selectedPose?.name ?? null,
    state === 'camera' || state === 'analyzing'
  );

  // Analysis hook
  const analysis = useAnalysis(
    selectedPose,
    camera.latestLandmarksRef,
    camera.videoRef,
    camera.snapshotCanvasRef,
    camera.stopCamera,
    async () => {
      await camera.startCamera();
      setState('camera');
    },
    camera.setError,
    (newState) => setState(newState)
  );

  // Load poses
  useEffect(() => {
    getYogaPoses()
      .then((data) => {
        setPoses(data);
        setLoadingPoses(false);
      })
      .catch(() => {
        setPoseLoadError('Could not load yoga poses. Please refresh and try again.');
        setLoadingPoses(false);
      });
  }, []);

  const handleSelectPose = useCallback(
    (pose: YogaPose) => {
      setSelectedPose(pose);
      analysis.resetAnalysis(pose);
      camera.setError(null);
      void camera.startCamera().then(() => {
        setState('camera');
      }).catch(() => {
        setState('selecting');
      });
    },
    [camera, analysis]
  );

  const handleChangePose = useCallback(() => {
    camera.stopCamera();
    setSelectedPose(null);
    analysis.resetAnalysis(null);
    camera.setError(null);
    setState('selecting');
  }, [camera, analysis]);

  const handleCapture = useCallback(() => {
    void analysis.captureAndAnalyze();
  }, [analysis]);

  const handleRetry = useCallback(() => {
    analysis.retryCurrentPose();
    setState('camera');
  }, [analysis]);

  return (
    <>
      <AnimatePresence mode="wait">
        {state === 'selecting' && (
          <PoseSelector
            key="selector"
            poses={poses}
            loading={loadingPoses}
            error={poseLoadError}
            onSelectPose={handleSelectPose}
          />
        )}

        {(state === 'camera' || state === 'analyzing') && selectedPose && (
          <CameraView
            key="camera"
            selectedPose={selectedPose}
            videoRef={camera.videoRef}
            overlayCanvasRef={camera.overlayCanvasRef}
            snapshotCanvasRef={camera.snapshotCanvasRef}
            realTimeFeedback={camera.realTimeFeedback}
            isStable={camera.isStable}
            isAnalyzing={state === 'analyzing'}
            error={camera.error}
            onCapture={handleCapture}
            onChangePose={handleChangePose}
          />
        )}

        {state === 'result' && selectedPose && analysis.analysisResult && (
          <AnalysisResultView
            key="result"
            selectedPose={selectedPose}
            analysisResult={analysis.analysisResult}
            analysisStatus={analysis.analysisStatus}
            snapshotDataUrl={analysis.snapshotDataUrl}
            attemptMeta={analysis.attemptMeta}
            feedbackForm={analysis.feedbackForm}
            setFeedbackForm={analysis.setFeedbackForm}
            isSavingFeedback={analysis.isSavingFeedback}
            isFeedbackSaved={analysis.isFeedbackSaved}
            onRetry={handleRetry}
            onChangePose={handleChangePose}
            onSubmitFeedback={() => void analysis.handleSubmitFeedback()}
          />
        )}
      </AnimatePresence>

      <canvas ref={camera.snapshotCanvasRef} className="hidden" />
    </>
  );
};

export default YogaCamera;
