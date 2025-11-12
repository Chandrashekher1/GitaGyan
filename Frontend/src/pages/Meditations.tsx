import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  Sparkles,
} from "lucide-react";
import useFocusMode from "../Hooks/useFocusMode";

interface MeditationSession {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: "chanting" | "instrumental" | "nature" | "bells";
  file: string
}

const Meditation: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedSound, setSelectedSound] = useState<MeditationSession | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  useFocusMode(focusMode);

  const durations = [5, 10, 15, 20, 30];

  const meditationSounds: MeditationSession[] = [
    {
      id: "om-chanting",
      name: "Om Chanting",
      description: "Sacred Om vibrations",
      duration: 0,
      type: "chanting",
      file: "/sounds/om_Chanting.mp3",
    },
    {
      id: "krishna-flute",
      name: "Krishna's Flute",
      description: "Peaceful flute melodies",
      duration: 0,
      type: "instrumental",
      file: "/sounds/krishna.mp3",
    },
    {
      id: "temple-bells",
      name: "Temple Bells",
      description: "Gentle temple ambience",
      duration: 0,
      type: "bells",
      file: "/sounds/temple_Sound.mp3",
    },
    {
      id: "nature-sounds",
      name: "Nature Sounds",
      description: "Forest and water sounds",
      duration: 0,
      type: "nature",
      file: "/sounds/nature.mp3",
    },
  ];

  useEffect(() => {
    if (selectedSound) {
      setTimeRemaining(selectedDuration * 60);
    }
  }, [selectedDuration, selectedSound]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setSessionStarted(false);
            audioRef.current?.pause();
            audioRef.current!.currentTime = 0;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, timeRemaining]);


  useEffect(() => {
    if (isPlaying && selectedSound?.file) {
      if (!audioRef.current) {
        audioRef.current = new Audio(selectedSound.file);
      } else {
        audioRef.current.src = selectedSound.file;
      }
      audioRef.current.loop = true;
      audioRef.current.play();
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, selectedSound]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlay = () => {
    if (!selectedSound) {
      setSelectedSound(meditationSounds[0]);
    }
    if (!sessionStarted) {
      setTimeRemaining(selectedDuration * 60);
      setSessionStarted(true);
      setFocusMode(true);
    }
    setIsPlaying(!isPlaying);
    
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFocusMode(false);
    setSessionStarted(false);
    setTimeRemaining(selectedDuration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6 shadow-xl bg-primary"
          >
            <Sparkles className="w-8 h-8 text-white animate-wisdom" />
          </div>
          <h1 className="text-5xl font-bold text-primary mb-4">
            Meditation Mode
          </h1>
          <p className="text-xl text-accent-foreground wisdom-text">
            Find inner peace through guided meditation with sacred sounds and
            cosmic visualizations
          </p>
        </div>

        <div className="bg-[var(--color-card)] rounded-3xl border border-[var(--color-border)] p-8 mb-8 shadow-xl glass-effect">
          <div className="text-center mb-8">
            <div className="relative inline-flex items-center justify-center w-64 h-64 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
              <div
                className="absolute inset-0 rounded-full border-4 transition-all duration-1000"
                style={{
                  background: `conic-gradient(from 0deg, var(--color-primary) ${
                    sessionStarted
                      ? ((selectedDuration * 60 - timeRemaining) /
                          (selectedDuration * 60)) *
                        360
                      : 0
                  }deg, transparent 0deg)`,
                }}
              ></div>
              <div className="relative z-10 text-center">
                <div className="text-6xl font-bold mb-2 ">
                  {sessionStarted
                    ? formatTime(timeRemaining)
                    : `${selectedDuration}:00`}
                </div>
                <div className="text-[var(--color-muted-foreground)]">
                  {sessionStarted
                    ? isPlaying
                      ? "Meditating..."
                      : "Paused"
                    : "Ready to begin"}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleReset}
                className="w-12 h-12 bg-[var(--color-input)] hover:bg-[var(--color-muted)] rounded-full flex items-center justify-center transition-all duration-200"
              >
                <RotateCcw className="w-6 h-6 text-[var(--color-primary)]" />
              </button>

              <button
                onClick={handlePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg shadow-[var(--color-ring)] bg-primary"
              >
                {isPlaying ? (
                  <Pause className="w-8 h-8 text-white" />
                ) : (
                  <Play className="w-8 h-8 text-white ml-1" />
                )}
              </button>

              <button className="w-12 h-12 bg-[var(--color-input)] hover:bg-[var(--color-muted)] rounded-full flex items-center justify-center transition-all duration-200">
                <Volume2 className="w-6 h-6 text-[var(--color-primary)]" />
              </button>
            </div>

            {selectedSound && (
              <div className="mt-6">
                <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-1">
                  {selectedSound.name}
                </h3>
                <p className="text-[var(--color-muted-foreground)]">
                  {selectedSound.description}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xl glass-effect">
            <div className="flex items-center mb-6">
              <Clock className="w-6 h-6 text-[var(--color-primary)] mr-3" />
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                Duration
              </h2>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration}
                  onClick={() => setSelectedDuration(duration)}
                  className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                    selectedDuration === duration
                      ? "text-white shadow-lg"
                      : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                  }`}
                  style={
                    selectedDuration === duration
                      ? { background: "var(--gradient-sunrise)" }
                      : {}
                  }
                >
                  {duration}m
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xl glass-effect">
            <div className="flex items-center mb-6">
              <Volume2 className="w-6 h-6 text-[var(--color-primary)] mr-3" />
              <h2 className="text-2xl font-bold text-[var(--color-primary)]">
                Ambient Sound
              </h2>
            </div>
            <div className="space-y-3">
              {meditationSounds.map((sound) => (
                <button
                  key={sound.id}
                  onClick={() => setSelectedSound(sound)}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                    selectedSound?.id === sound.id
                      ? "text-white shadow-lg"
                      : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-primary hover:text-primary-foreground"
                  }`}
                  style={
                    selectedSound?.id === sound.id
                      ? { background: "var(--gradient-serenity)" }
                      : {}
                  }
                >
                  <div className="font-semibold">{sound.name}</div>
                  <div className="text-sm opacity-80">{sound.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-8 shadow-xl glass-effect">
          <div className="flex items-center mb-6">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center mr-3 bg-primary"
              // style={{ background: "var(--gradient-sunrise)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
              Meditation Tips
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                Posture
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Sit comfortably with your spine straight and shoulders relaxed
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                Breathing
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Focus on natural breath rhythm, inhaling and exhaling slowly
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-xl font-semibold text-[var(--color-primary)] mb-3">
                Mind
              </h3>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                Let thoughts pass without judgment, returning focus to breath
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Meditation;
