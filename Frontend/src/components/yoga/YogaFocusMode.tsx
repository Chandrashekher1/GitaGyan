import React from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Volume2,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/context/Language";
import { Asana } from "./data/asanasData";
import { formatTime } from "./utils/timeUtils";
import { YogaSessionHandlers } from "./hooks/useYogaSession";
import { AmbientSound } from "./YogaAmbientSoundSelector";

interface YogaFocusModeProps {
  asana: Asana;
  currentStep: Asana["steps"][0] | undefined;
  stepTimeRemaining: number;
  isPlaying: boolean;
  currentStepIndex: number;
  handlers: YogaSessionHandlers;
  selectedSound: AmbientSound | null;
  onSelectSound: (sound: AmbientSound | null) => void;
  ambientSounds: AmbientSound[];
  onExitFocusMode: () => void;
}

export const YogaFocusMode: React.FC<YogaFocusModeProps> = ({
  asana,
  currentStep,
  stepTimeRemaining,
  isPlaying,
  currentStepIndex,
  handlers,
  selectedSound,
  onSelectSound,
  ambientSounds,
  onExitFocusMode,
}) => {
  const { t } = useLanguage();
  const { handlePrev, handleNext, handleReset, handlePause } = handlers;

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center text-white p-8 max-w-4xl w-full"
      >
        <Button
          onClick={onExitFocusMode}
          variant="outline"
          className="absolute top-4 right-4 text-white border-white/30 hover:bg-white/10"
        >
          <X className="w-4 h-4 mr-2" />
          {t("exitFocusMode")}
        </Button>

        <div className="mb-8">
          <h2 className="text-4xl font-bold mb-2">{asana.name}</h2>
          <p className="text-xl text-gray-300">{asana.sanskritName}</p>
          <p className="text-lg text-gray-400 mt-2">
            {t("step")} {currentStepIndex + 1} {t("of")} {asana.steps.length}
          </p>
        </div>

        {/* Step Image in Focus Mode */}
        {currentStep?.image && (
          <div className="w-full max-w-lg mx-auto mb-8 rounded-xl overflow-hidden shadow-2xl">
            <img 
              src={currentStep.image} 
              alt={currentStep.title}
              className="w-full h-80 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = asana.image;
              }}
            />
          </div>
        )}

        <div className="relative inline-flex items-center justify-center w-64 h-64 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-primary transition-all duration-1000"
            style={{
              background: `conic-gradient(from 0deg, var(--color-primary) ${
                currentStep
                  ? ((currentStep.duration - stepTimeRemaining) / currentStep.duration) * 360
                  : 0
              }deg, transparent 0deg)`,
            }}
          ></div>
          <div className="relative z-10 text-center">
            <div className="text-6xl font-bold mb-2">
              {formatTime(stepTimeRemaining)}
            </div>
            <div className="text-gray-300">
              {isPlaying ? t("practicing") : t("pause")}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold mb-4">{currentStep?.title}</h3>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            {currentStep?.instruction}
          </p>
        </div>

        {/* Ambient Sound in Focus Mode */}
        <div className="mb-6 max-w-md mx-auto">
          <div className="flex items-center justify-center mb-3">
            <Volume2 className="w-5 h-5 text-white/70 mr-2" />
            <h4 className="text-lg font-semibold text-white/90">{t("ambientSound")}</h4>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {ambientSounds.map((sound) => (
              <button
                key={sound.id}
                onClick={() => onSelectSound(sound)}
                className={`p-2 rounded-lg text-left transition-all duration-200 ${
                  selectedSound?.id === sound.id
                    ? "bg-primary text-white shadow-lg"
                    : "bg-white/10 text-white/70 hover:bg-white/20"
                }`}
              >
                <div className="font-semibold text-sm">{sound.name}</div>
                <div className="text-xs opacity-80">{sound.description}</div>
              </button>
            ))}
          </div>
          {selectedSound && (
            <div className="text-center">
              <p className="text-sm text-white/70">
                {t("currentlyPlaying")}: <span className="font-semibold text-white">{selectedSound.name}</span>
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            variant="outline"
            size="lg"
            className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            {t("previous")}
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            {t("reset")}
          </Button>

          <Button
            onClick={handlePause}
            size="lg"
            className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8 ml-1" />
            )}
          </Button>

          <Button
            onClick={handleNext}
            disabled={currentStepIndex === asana.steps.length - 1}
            variant="outline"
            size="lg"
            className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
          >
            {t("next")}
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

