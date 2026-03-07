import { useState, useEffect, useRef } from "react";
import { Asana } from "../data/asanasData";

export interface AmbientSound {
  id: string;
  name: string;
  description: string;
  type: "chanting" | "instrumental" | "nature" | "bells";
  file: string;
}

interface UseYogaSessionProps {
  selectedAsana: Asana | null;
  selectedSound: AmbientSound | null;
  focusMode: boolean;
  showSessionModal: boolean;
  onSessionComplete: (asanaId: string) => void;
}

export interface YogaSessionState {
  currentStepIndex: number;
  stepTimeRemaining: number;
  isPlaying: boolean;
  sessionStarted: boolean;
}

export interface YogaSessionHandlers {
  handleStart: () => void;
  handlePause: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  handleReset: () => void;
  handleStartSession: (asana: Asana) => void;
  handleExit: () => void;
  setCurrentStepIndex: (index: number | ((prev: number) => number)) => void;
  setStepTimeRemaining: (time: number | ((prev: number) => number)) => void;
}

export const useYogaSession = ({
  selectedAsana,
  selectedSound,
  showSessionModal,
  onSessionComplete,
}: UseYogaSessionProps): {
  state: YogaSessionState;
  handlers: YogaSessionHandlers;
  audioRef: React.MutableRefObject<HTMLAudioElement | null>;
} => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);

  const stepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize step timer when step changes
  useEffect(() => {
    if (selectedAsana && showSessionModal) {
      const currentStep = selectedAsana.steps[currentStepIndex];
      setStepTimeRemaining(currentStep.duration);
    }
  }, [currentStepIndex, selectedAsana, showSessionModal]);

  // Step timer effect
  useEffect(() => {
    if (isPlaying && stepTimeRemaining > 0 && sessionStarted) {
      stepIntervalRef.current = setInterval(() => {
        setStepTimeRemaining((prev) => {
          if (prev <= 1) {
            // Move to next step automatically
            if (selectedAsana && currentStepIndex < selectedAsana.steps.length - 1) {
              const nextIndex = currentStepIndex + 1;
              setCurrentStepIndex(nextIndex);
              return selectedAsana.steps[nextIndex].duration;
            } else {
              // Session complete
              setIsPlaying(false);
              setSessionStarted(false);
              audioRef.current?.pause();
              if (selectedAsana) {
                onSessionComplete(selectedAsana.id);
              }
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    }
    return () => {
      if (stepIntervalRef.current) {
        clearInterval(stepIntervalRef.current);
      }
    };
  }, [isPlaying, stepTimeRemaining, sessionStarted, currentStepIndex, selectedAsana, onSessionComplete]);

  useEffect(() => {
    if (isPlaying && selectedSound?.file && sessionStarted) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      
      audioRef.current = new Audio(selectedSound.file);
      audioRef.current.loop = true;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((err) => {
        console.error("Error playing ambient sound:", err);
      });
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        if (!isPlaying) {
          audioRef.current.currentTime = 0;
        }
      }
    }

    return () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [isPlaying, selectedSound, sessionStarted]);

  const handleStartSession = (asana: Asana) => {
    setCurrentStepIndex(0);
    setStepTimeRemaining(asana.steps[0].duration);
    setSessionStarted(false);
    setIsPlaying(false);
  };

  const handleStart = () => {
    if (!selectedAsana) return;
    setSessionStarted(true);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!selectedAsana) return;
    if (currentStepIndex < selectedAsana.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setStepTimeRemaining(selectedAsana.steps[currentStepIndex + 1].duration);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
      if (selectedAsana) {
        setStepTimeRemaining(selectedAsana.steps[currentStepIndex - 1].duration);
      }
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setSessionStarted(false);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (selectedAsana) {
      setCurrentStepIndex(0);
      setStepTimeRemaining(selectedAsana.steps[0].duration);
    }
  };

  const handleExit = () => {
    setIsPlaying(false);
    setSessionStarted(false);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    setCurrentStepIndex(0);
  };

  return {
    state: {
      currentStepIndex,
      stepTimeRemaining,
      isPlaying,
      sessionStarted,
    },
    handlers: {
      handleStart,
      handlePause,
      handleNext,
      handlePrev,
      handleReset,
      handleStartSession,
      handleExit,
      setCurrentStepIndex,
      setStepTimeRemaining,
    },
    audioRef,
  };
};

