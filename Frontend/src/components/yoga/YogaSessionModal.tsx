import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { useLanguage } from "@/context/Language";
import { Asana } from "./data/asanasData";
import { formatTime } from "./utils/timeUtils";
import { YogaSessionState, YogaSessionHandlers } from "./hooks/useYogaSession";
import { AmbientSound } from "./YogaAmbientSoundSelector";
import { YogaAmbientSoundSelector } from "./YogaAmbientSoundSelector";

interface YogaSessionModalProps {
  asana: Asana;
  isOpen: boolean;
  onClose: () => void;
  sessionState: YogaSessionState;
  handlers: YogaSessionHandlers;
  ambientSounds: AmbientSound[];
  selectedSound: AmbientSound | null;
  onSelectSound: (sound: AmbientSound | null) => void;
}

export const YogaSessionModal: React.FC<YogaSessionModalProps> = ({
  asana,
  isOpen,
  onClose,
  sessionState,
  handlers,
  ambientSounds,
  selectedSound,
  onSelectSound,
}) => {
  const { t } = useLanguage();
  const { currentStepIndex, stepTimeRemaining, isPlaying, sessionStarted } = sessionState;
  const { handleStart, handlePause, handleNext, handlePrev, handleReset, setCurrentStepIndex, setStepTimeRemaining } = handlers;

  const currentStep = asana.steps[currentStepIndex];
  const progress = ((currentStepIndex + 1) / asana.steps.length) * 100;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-3xl font-bold text-[var(--color-primary)] mb-2">
                    {asana.name}
                  </h3>
                  <p className="text-xl text-accent-foreground">
                    {asana.sanskritName}
                  </p>
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Asana Main Image */}
              {/* <div className="w-full max-w-2xl mx-auto mb-6 rounded-xl overflow-hidden shadow-lg">
                <img 
                  src={asana.image} 
                  alt={asana.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://source.unsplash.com/800x600/?yoga";
                  }}
                />
              </div> */}

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-sm text-[var(--color-muted-foreground)] mb-2">
                  <span>Step {currentStepIndex + 1} of {asana.steps.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <div className="w-full h-2 bg-[var(--color-input)] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Current Step Display */}
              <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 mb-6">
                <div className="text-center mb-6">
                  {/* Step Image */}
                  {/* {currentStep?.image && (
                    <div className="w-full max-w-md mx-auto mb-6 rounded-xl overflow-hidden shadow-lg">
                      <img 
                        src={currentStep.image} 
                        alt={currentStep.title}
                        className="w-full h-64 object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = asana.image;
                        }}
                      />
                    </div>
                  )} */}
                  
                  <div className="relative inline-flex items-center justify-center w-48 h-48 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
                    <div
                      className="absolute inset-0 rounded-full border-4 transition-all duration-1000"
                      style={{
                        background: `conic-gradient(from 0deg, var(--color-primary) ${
                          currentStep
                            ? ((currentStep.duration - stepTimeRemaining) / currentStep.duration) * 360
                            : 0
                        }deg, transparent 0deg)`,
                      }}
                    ></div>
                    <div className="relative z-10 text-center">
                      <div className="text-5xl font-bold mb-2">
                        {formatTime(stepTimeRemaining)}
                      </div>
                      <div className="text-[var(--color-muted-foreground)]">
                        {sessionStarted
                          ? isPlaying
                            ? t("practicing")
                            : t("pause")
                          : t("readyToBegin")}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-2xl font-semibold text-[var(--color-primary)] mb-3">
                    {currentStep?.title}
                  </h4>
                  <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                    {currentStep?.instruction}
                  </p>
                </div>

                {/* Step Navigation */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Button
                    onClick={handlePrev}
                    disabled={currentStepIndex === 0}
                    variant="outline"
                    className="disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    {t("previous")}
                  </Button>

                  {!sessionStarted ? (
                    <Button onClick={handleStart} size="lg" className="px-8">
                      <Play className="w-5 h-5 mr-2" />
                      {t("startSession")}
                    </Button>
                  ) : (
                    <>
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="w-12 h-12 rounded-full"
                      >
                        <RotateCcw className="w-5 h-5" />
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
                    </>
                  )}

                  <Button
                    onClick={handleNext}
                    disabled={currentStepIndex === asana.steps.length - 1}
                    variant="outline"
                    className="disabled:opacity-50"
                  >
                    {t("next")}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              {/* Ambient Sound Selection in Modal */}
              <YogaAmbientSoundSelector
                selectedSound={selectedSound}
                onSelectSound={onSelectSound}
                ambientSounds={ambientSounds}
                compact={true}
              />

              {/* Benefits & Precautions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <h5 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {t("benefits")}
                      </h5>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {asana.benefits}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                      <h5 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        {t("precautions")}
                      </h5>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    {asana.precautions}
                  </p>
                </div>
              </div>

                  {/* Step List */}
                  <div>
                    <h5 className="font-semibold text-[var(--color-primary)] mb-3">
                      {t("allSteps")}
                    </h5>
                <div className="space-y-2">
                  {asana.steps.map((step, index) => (
                    <button
                      key={step.id}
                      onClick={() => {
                        setCurrentStepIndex(index);
                        setStepTimeRemaining(step.duration);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all duration-200 ${
                        index === currentStepIndex
                          ? "text-white shadow-lg"
                          : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                      }`}
                      style={
                        index === currentStepIndex
                          ? { background: "var(--gradient-serenity)" }
                          : {}
                      }
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold">
                            {index + 1}. {step.title}
                          </div>
                          <div className="text-sm opacity-80 mt-1">
                            {step.instruction}
                          </div>
                        </div>
                        <div className="text-sm opacity-80">
                          {formatTime(step.duration)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

