import React, { useState, useEffect } from "react";
import { Sparkles, Focus } from "lucide-react";
import useFocusMode from "../../Hooks/useFocusMode";
import { asanasData, Asana } from "./data/asanasData";
import { YogaLevelSelector } from "./YogaLevelSelector";
import { YogaAsanaList } from "./YogaAsanaList";
import { YogaAmbientSoundSelector, AmbientSound } from "./YogaAmbientSoundSelector";
import { YogaSessionModal } from "./YogaSessionModal";
import { YogaFocusMode } from "./YogaFocusMode";
import { useYogaSession } from "./hooks/useYogaSession";

// Ambient sounds
const ambientSounds: AmbientSound[] = [
  {
    id: "om-chanting",
    name: "Om Chanting",
    description: "Sacred Om vibrations",
    type: "chanting",
    file: "/sounds/om_Chanting.mp3",
  },
  {
    id: "krishna-flute",
    name: "Krishna's Flute",
    description: "Peaceful flute melodies",
    type: "instrumental",
    file: "/sounds/krishna.mp3",
  },
  {
    id: "temple-bells",
    name: "Temple Bells",
    description: "Gentle temple ambience",
    type: "bells",
    file: "/sounds/temple_Sound.mp3",
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "Forest and water sounds",
    type: "nature",
    file: "/sounds/nature.mp3",
  },
];

const YogaTab: React.FC = () => {
  // State management
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [selectedAsana, setSelectedAsana] = useState<Asana | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);
  const [selectedSound, setSelectedSound] = useState<AmbientSound | null>(null);

  // Load completed sessions from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('gitagyan-yoga-completed');
    if (saved) {
      setCompletedSessions(JSON.parse(saved));
    }
  }, []);

  // Save completed sessions to localStorage
  useEffect(() => {
    if (completedSessions.length > 0) {
      localStorage.setItem('gitagyan-yoga-completed', JSON.stringify(completedSessions));
    }
  }, [completedSessions]);

  // Handle session completion
  const handleSessionComplete = (asanaId: string) => {
    setCompletedSessions((prev) => {
      if (!prev.includes(asanaId)) {
        const updated = [...prev, asanaId];
        // Save yoga session to history
        const asana = asanasData.find(a => a.id === asanaId);
        if (asana) {
          const yogaHistory = JSON.parse(localStorage.getItem('gitagyan-yoga-history') || '[]');
          yogaHistory.push({
            id: Date.now().toString(),
            asanaId: asana.id,
            asanaName: asana.name,
            sanskritName: asana.sanskritName,
            level: asana.level,
            completedAt: new Date().toISOString(),
            duration: asana.totalDuration,
            steps: asana.steps.length,
          });
          localStorage.setItem('gitagyan-yoga-history', JSON.stringify(yogaHistory));
        }
        return updated;
      }
      return prev;
    });
  };

  // Use yoga session hook
  const { state: sessionState, handlers: sessionHandlers} = useYogaSession({
    selectedAsana,
    selectedSound,
    focusMode,
    showSessionModal,
    onSessionComplete: handleSessionComplete,
  });

  // Use focus mode hook - activate when focus mode is enabled and session is active
  useFocusMode(focusMode && sessionState.sessionStarted);

  // Filter asanas by level
  const filteredAsanas = selectedLevel ? asanasData.filter((asana) => asana.level === selectedLevel) : [];

  const handleStartSession = (asana: Asana) => {
    setSelectedAsana(asana);
    sessionHandlers.handleStartSession(asana);
    setShowSessionModal(true);
  };

  const handleExit = () => {
    sessionHandlers.handleExit();
    setFocusMode(false);
    setShowSessionModal(false);
    setSelectedAsana(null);
  };

  const currentStep = selectedAsana?.steps[sessionState.currentStepIndex];

  // Focus Mode Overlay - show when focus mode is enabled and session is active
  if (focusMode && sessionState.sessionStarted && selectedAsana && showSessionModal) {
    return (
      <YogaFocusMode
        asana={selectedAsana}
        currentStep={currentStep}
        stepTimeRemaining={sessionState.stepTimeRemaining}
        isPlaying={sessionState.isPlaying}
        currentStepIndex={sessionState.currentStepIndex}
        handlers={sessionHandlers}
        selectedSound={selectedSound}
        onSelectSound={setSelectedSound}
        ambientSounds={ambientSounds}
        onExitFocusMode={() => setFocusMode(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 shadow-xl bg-primary">
            <Sparkles className="w-8 h-8 text-white animate-wisdom" />
          </div>
          <h1 className="text-5xl font-bold text-primary mb-4">Yoga Mode</h1>
          <p className="text-xl text-accent-foreground wisdom-text">
            Find balance and strength through guided yoga practice
          </p>
        </div>

        {/* Level Selection */}
        <YogaLevelSelector
          selectedLevel={selectedLevel}
          onLevelSelect={setSelectedLevel}
        />

        {/* Focus Mode Toggle */}
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xl glass-effect mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Focus className="w-6 h-6 text-[var(--color-primary)] mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                  Focus Mode
                </h3>
                <p className="text-sm text-[var(--color-muted-foreground)]">
                  Fullscreen mode with minimal distractions during practice
                </p>
              </div>
            </div>
            <button
              onClick={() => setFocusMode(!focusMode)}
              className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                focusMode
                  ? "text-white shadow-lg"
                  : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              }`}
              style={
                focusMode
                  ? { background: "var(--gradient-serenity)" }
                  : {}
              }
            >
              {focusMode ? "Enabled" : "Enable"}
            </button>
          </div>
        </div>

        {/* Ambient Sounds Selection */}
        <YogaAmbientSoundSelector
          selectedSound={selectedSound}
          onSelectSound={setSelectedSound}
          ambientSounds={ambientSounds}
        />

        {/* Asana List */}
        <div className="mb-8">
          <YogaAsanaList
            asanas={filteredAsanas}
            onStartSession={handleStartSession}
            completedSessions={completedSessions}
          />
        </div>

        {/* Session Modal */}
        {showSessionModal && selectedAsana && (
          <YogaSessionModal
            asana={selectedAsana}
            isOpen={showSessionModal}
            onClose={handleExit}
            sessionState={sessionState}
            handlers={sessionHandlers}
            ambientSounds={ambientSounds}
            selectedSound={selectedSound}
            onSelectSound={setSelectedSound}
          />
        )}
      </div>
    </div>
  );
};

export default YogaTab;

