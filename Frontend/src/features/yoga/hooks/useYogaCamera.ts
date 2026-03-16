import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { Pose, POSE_CONNECTIONS } from '@mediapipe/pose';
import type { PoseLandmark } from '../types';
import { getRealtimeCorrections, hasReliablePoseLandmarks } from '../utils/poseAnalyzer';

export interface UseYogaCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  snapshotCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  realTimeFeedback: string[];
  isStable: boolean;
  latestLandmarksRef: React.MutableRefObject<PoseLandmark[] | null>;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export function useYogaCamera(
  poseName: string | null,
  isActive: boolean
): UseYogaCameraReturn {
  const [realTimeFeedback, setRealTimeFeedback] = useState<string[]>([]);
  const [isStable, setIsStable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const snapshotCanvasRef = useRef<HTMLCanvasElement>(null);
  const mpCameraRef = useRef<Camera | null>(null);
  const poseRef = useRef<Pose | null>(null);
  const latestLandmarksRef = useRef<PoseLandmark[] | null>(null);
  const stabilityHistoryRef = useRef<PoseLandmark[][]>([]);

  const stopCamera = useCallback(() => {
    console.log("[useYogaCamera] Stopping camera and cleanup...");
    if (mpCameraRef.current) {
      try {
        mpCameraRef.current.stop();
      } catch (e) {
        console.error("[useYogaCamera] Error stopping MP camera:", e);
      }
      mpCameraRef.current = null;
    }

    if (poseRef.current) {
      try {
        poseRef.current.close();
      } catch (e) {
        console.error("[useYogaCamera] Error closing Pose:", e);
      }
      poseRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
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
    console.log("[useYogaCamera] startCamera invoked");
    setError(null);
    setRealTimeFeedback([]);
    setIsStable(false);
    latestLandmarksRef.current = null;
    stabilityHistoryRef.current = [];
    return Promise.resolve();
  }, []);

  // MediaPipe Pose setup
  useEffect(() => {
    // If not active or no pose, we cleanup but don't try to start
    if (!isActive || !poseName) {
      return;
    }

    // If refs are missing but we ARE active, we need to wait/retry
    if (!videoRef.current || !overlayCanvasRef.current) {
      console.log("[useYogaCamera] Refs missing, scheduling retry...", { 
        isActive, 
        video: !!videoRef.current, 
        canvas: !!overlayCanvasRef.current 
      });
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1);
      }, 150);
      return () => clearTimeout(timer);
    }

    console.log("[useYogaCamera] Initializing MediaPipe for:", poseName);

    let disposed = false;
    const videoElement = videoRef.current;
    const canvasElement = overlayCanvasRef.current;

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
      if (disposed) return;
      
      const width = videoElement.videoWidth || 960;
      const height = videoElement.videoHeight || 720;
      const context = canvasElement.getContext('2d');
      if (!context) return;

      canvasElement.width = width;
      canvasElement.height = height;
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

        if (poseName) {
          setRealTimeFeedback(getRealtimeCorrections(poseName, landmarks));
        }

        stabilityHistoryRef.current.push(landmarks);
        if (stabilityHistoryRef.current.length > 15) {
          stabilityHistoryRef.current.shift();
        }

        if (stabilityHistoryRef.current.length === 15) {
          const history = stabilityHistoryRef.current;
          const anchorIndex = 23; // Left hip
          const meanX = history.reduce((sum, frame) => sum + (frame[anchorIndex]?.x || 0), 0) / history.length;
          const meanY = history.reduce((sum, frame) => sum + (frame[anchorIndex]?.y || 0), 0) / history.length;
          const variance = history.reduce((sum, frame) => {
            const deltaX = (frame[anchorIndex]?.x || 0) - meanX;
            const deltaY = (frame[anchorIndex]?.y || 0) - meanY;
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

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        if (!disposed && poseRef.current) {
          await poseRef.current.send({ image: videoElement });
        }
      },
      width: 960,
      height: 720,
    });

    console.log("[useYogaCamera] Starting Camera helper...");
    camera.start()
      .then(() => console.log("[useYogaCamera] Camera helper started successfully"))
      .catch((err) => {
        console.error("[useYogaCamera] Failed to start MediaPipe camera:", err);
        if (!disposed) {
          setError('Camera access was denied or failed to start. Allow camera permissions and try again.');
        }
      });
      
    mpCameraRef.current = camera;

    return () => {
      console.log("[useYogaCamera] Cleaning up Pose and Camera effect...");
      disposed = true;
      camera.stop();
      try {
        pose.close();
      } catch (e) {
        console.warn("[useYogaCamera] pose.close() handled:", e);
      }
      if (mpCameraRef.current === camera) mpCameraRef.current = null;
      if (poseRef.current === pose) poseRef.current = null;
    };
  }, [poseName, isActive, retryCount]);

  return {
    videoRef,
    overlayCanvasRef,
    snapshotCanvasRef,
    realTimeFeedback,
    isStable,
    latestLandmarksRef,
    startCamera,
    stopCamera,
    error,
    setError,
  };
}

export { hasReliablePoseLandmarks };
