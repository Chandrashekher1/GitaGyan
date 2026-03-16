import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Clock,
  Sparkles,
  ArrowRight,
  Heart,
  Smile,
  Zap,
  Moon,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import useFocusMode from "../Hooks/useFocusMode";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Backend_Url } from "@/utils/constant";
import { getOrCreateLocalUserId } from "@/lib/user-session";
import { cn } from "@/lib/utils";

// --- Types & Constants ---

interface MeditationSound {
  id: string;
  name: string;
  description: string;
  duration: number;
  type: "chanting" | "instrumental" | "nature" | "bells";
  file: string;
  mentalHealthTags: string[];
  icon: React.ReactNode;
  color: string;
}

interface MeditationFeedbackState {
  rating: number;
  helpful: boolean | null;
  targetedConcern: string;
  moodAfter: string;
  notes: string;
}

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutCurve },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const moodAfterOptions = [
  { label: "Calmer", icon: <Wind className="w-4 h-4" /> },
  { label: "More focused", icon: <Zap className="w-4 h-4" /> },
  { label: "Grounded", icon: <Heart className="w-4 h-4" /> },
  { label: "Sleepier", icon: <Moon className="w-4 h-4" /> },
  { label: "Still restless", icon: <Smile className="w-4 h-4" /> },
];

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function TreeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19 3-7.062Q15.395 11 16.5 11q1.25 0 2 1t0 2q0 .5-.25 1.062L15 22h-6l-3.25-6.938Q5.5 14.5 5.5 14q0-1 .75-2t2-1q1.105 0 1.5.938L12 19Z" />
      <path d="M12 2v10" />
      <path d="m17 12 3-2" />
      <path d="m7 12-3-2" />
    </svg>
  );
}

const meditationSounds: MeditationSound[] = [
  {
    id: "om-chanting",
    name: "Om Chanting",
    description: "Sacred Om vibrations for deep focus",
    duration: 0,
    type: "chanting",
    file: "/sounds/om_Chanting.mp3",
    mentalHealthTags: ["anxiety", "overwhelmed", "focus"],
    icon: <Sparkles className="w-6 h-6" />,
    color: "bg-[#f5ecde]",
  },
  {
    id: "krishna-flute",
    name: "Krishna's Flute",
    description: "Peaceful melodies to soothe the soul",
    duration: 0,
    type: "instrumental",
    file: "/sounds/krishna.mp3",
    mentalHealthTags: ["sadness", "stress", "sleep"],
    icon: <Wind className="w-6 h-6" />,
    color: "bg-[#edf3ee]",
  },
  {
    id: "temple-bells",
    name: "Temple Bells",
    description: "Gentle ambience for spiritual balance",
    duration: 0,
    type: "bells",
    file: "/sounds/temple_Sound.mp3",
    mentalHealthTags: ["overwhelmed", "balance", "focus"],
    icon: <BellIcon className="w-6 h-6" />,
    color: "bg-[#fff7ef]",
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "Forest and water for natural grounding",
    duration: 0,
    type: "nature",
    file: "/sounds/nature.mp3",
    mentalHealthTags: ["stress", "sleep", "grounding"],
    icon: <TreeIcon className="w-6 h-6" />,
    color: "bg-[#f0f4f8]",
  },
];

function formatWellnessTag(tag: string) {
  return tag
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function createInitialFeedback(
  sound: MeditationSound | null
): MeditationFeedbackState {
  return {
    rating: 4,
    helpful: null,
    targetedConcern: sound?.mentalHealthTags[0] ?? "",
    moodAfter: "",
    notes: "",
  };
}

const Meditation: React.FC = () => {
  const [selectedDuration, setSelectedDuration] = useState(10);
  const [selectedSound, setSelectedSound] = useState<MeditationSound>(meditationSounds[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState<string | null>(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [feedback, setFeedback] = useState<MeditationFeedbackState>(
    createInitialFeedback(meditationSounds[0])
  );
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [isSessionSaved, setIsSessionSaved] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [focusMode, setFocusMode] = useState(false);

  useFocusMode(focusMode);

  const durations = [5, 10, 15, 20, 30];

  useEffect(() => {
    if (!sessionStarted) {
      setTimeRemaining(selectedDuration * 60);
    }
  }, [selectedDuration, sessionStarted]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining((previous) => {
          if (previous <= 1) {
            handleComplete();
            return 0;
          }
          return previous - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
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
      void audioRef.current.play().catch((error) => {
        console.error("audio playback error:", error);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, selectedSound]);

  const handleComplete = () => {
    setIsPlaying(false);
    setSessionStarted(false);
    setSessionCompleted(true);
    setFocusMode(false);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    toast.success("Meditation session completed. Take a moment to reflect.");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlayToggle = () => {
    if (!sessionStarted) {
      setSessionStarted(true);
      setSessionStartedAt(new Date().toISOString());
      setSessionCompleted(false);
      setIsSessionSaved(false);
      setFeedback(createInitialFeedback(selectedSound));
      setFocusMode(true);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((previous) => !previous);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setFocusMode(false);
    setSessionStarted(false);
    setSessionStartedAt(null);
    setSessionCompleted(false);
    setIsSessionSaved(false);
    setTimeRemaining(selectedDuration * 60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleSaveSession = async () => {
    if (!selectedSound || !sessionStartedAt) {
      toast.error("Meditation details are incomplete.");
      return;
    }

    if (feedback.helpful === null) {
      toast.error("Choose whether the session felt helpful before saving.");
      return;
    }

    setIsSavingSession(true);
    try {
      const actualDurationSeconds = Math.max(0, selectedDuration * 60 - timeRemaining);
      const response = await fetch(`${Backend_Url}/meditation/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: getOrCreateLocalUserId(),
          soundId: selectedSound.id,
          plannedDurationMinutes: selectedDuration,
          actualDurationSeconds:
            actualDurationSeconds > 0 ? actualDurationSeconds : selectedDuration * 60,
          status: "completed",
          startedAt: sessionStartedAt,
          feedback: {
            rating: feedback.rating,
            helpful: feedback.helpful,
            targetedConcern:
              feedback.targetedConcern || selectedSound.mentalHealthTags[0] || "",
            moodAfter: feedback.moodAfter,
            notes: feedback.notes.trim(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Could not save meditation session");
      }

      setIsSessionSaved(true);
      toast.success("Reflections saved to your history.");
    } catch (error) {
      console.error("meditation session save error:", error);
      toast.error("Could not save meditation session");
    } finally {
      setIsSavingSession(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 pb-24 pt-8 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Orbs (Consistent with Home) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,174,88,0.12),rgba(214,174,88,0)_70%)] blur-3xl" />
        <div className="absolute left-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full border border-primary/5" />
      </div>

      <div className="mx-auto max-w-5xl flex flex-col gap-12">
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="text-center space-y-4"
        >
          <div className="section-label mx-auto w-fit border-primary/12 bg-white/55">
            <span className="eyebrow-dot" />
            Find your inner silence
          </div>
          <h1 className="display-font text-5xl font-semibold text-foreground sm:text-6xl tracking-tight">
            Sacred Meditation
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            A minimalist space designed to help you transition from mental noise to grounded presence through ancient vibrations.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!sessionCompleted ? (
            <motion.div
              key="active-session"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: easeOutCurve }}
              className="grid gap-8 lg:grid-cols-[1fr_0.4fr]"
            >
              {/* Main Meditation Block */}
              <div className="relative overflow-hidden rounded-[2.4rem] border border-border/70 bg-[linear-gradient(145deg,#fffcf9_0%,#f9f3e9_100%)] p-8 shadow-xl sm:p-12">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.4),transparent_100%)]" />

                <div className="relative flex flex-col items-center text-center space-y-12">
                  {/* Timer Visual */}
                  <div className="relative flex items-center justify-center w-72 h-72">
                    {/* Pulsing ring when playing */}
                    {isPlaying && (
                      <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-full border-2 border-primary/20"
                      />
                    )}

                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="144"
                        cy="144"
                        r="140"
                        className="stroke-primary/5 fill-none"
                        strokeWidth="4"
                      />
                      <motion.circle
                        cx="144"
                        cy="144"
                        r="140"
                        className="stroke-primary fill-none"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ strokeDasharray: "880", strokeDashoffset: "880" }}
                        animate={{
                          strokeDashoffset:
                            880 -
                            (880 * (selectedDuration * 60 - timeRemaining)) /
                              (selectedDuration * 60),
                        }}
                        transition={{ duration: 1, ease: "linear" }}
                      />
                    </svg>

                    <div className="z-10 flex flex-col items-center">
                      <span className="display-font text-7xl font-semibold text-foreground">
                        {formatTime(timeRemaining)}
                      </span>
                      <span className="mt-2 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
                        {sessionStarted ? (isPlaying ? "Breathing" : "Paused") : "Ready"}
                      </span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-6">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={handleReset}
                      className="w-14 h-14 rounded-full border-border/50 bg-white/50 backdrop-blur-sm hover:bg-white"
                    >
                      <RotateCcw className="w-6 h-6 text-primary" />
                    </Button>

                    <Button
                      onClick={handlePlayToggle}
                      className="w-20 h-20 rounded-full bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                    >
                      {isPlaying ? (
                        <Pause className="w-10 h-10" />
                      ) : (
                        <Play className="w-10 h-10 ml-1" />
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full border-border/50 bg-white/50 backdrop-blur-sm hover:bg-white"
                    >
                      <Volume2 className="w-6 h-6 text-primary" />
                    </Button>
                  </div>

                  {/* Active Sound Info */}
                  <AnimatePresence mode="wait">
                    {sessionStarted && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-2"
                      >
                        <h3 className="text-xl font-semibold text-foreground">
                          {selectedSound.name}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-2">
                          {selectedSound.mentalHealthTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-primary/5 text-primary border-primary/10"
                            >
                              {formatWellnessTag(tag)}
                            </Badge>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sidebar: Setup */}
              <div className="flex flex-col gap-6">
                {/* Duration Picker */}
                <Card className="rounded-[2rem] border-border/70 bg-white/60 p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-primary/8 text-primary">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">Duration</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {durations.map((d) => (
                      <button
                        key={d}
                        disabled={sessionStarted}
                        onClick={() => setSelectedDuration(d)}
                        className={cn(
                          "py-3 rounded-xl text-sm font-semibold transition-all border",
                          selectedDuration === d
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-white/50 border-border/50 text-muted-foreground hover:bg-white hover:border-primary/30"
                        )}
                      >
                        {d} min
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Sound Library */}
                <Card className="flex-1 rounded-[2rem] border-border/70 bg-white/60 p-6 backdrop-blur-sm overflow-hidden flex flex-col">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-xl bg-secondary/8 text-secondary">
                      <Volume2 className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-foreground">Ambient Sound</span>
                  </div>
                  <div className="space-y-3 overflow-y-auto pr-1">
                    {meditationSounds.map((sound) => (
                      <button
                        key={sound.id}
                        disabled={sessionStarted}
                        onClick={() => setSelectedSound(sound)}
                        className={cn(
                          "w-full p-4 rounded-2xl text-left transition-all border group",
                          selectedSound.id === sound.id
                            ? "bg-white border-primary/40 shadow-md"
                            : "bg-transparent border-transparent hover:bg-white/40"
                        )}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={cn(
                              "p-3 rounded-xl transition-colors",
                              selectedSound.id === sound.id
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary"
                            )}
                          >
                            {sound.icon}
                          </div>
                          <div>
                            <p
                              className={cn(
                                "font-semibold",
                                selectedSound.id === sound.id
                                  ? "text-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              {sound.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              {sound.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </Card>
              </div>
            </motion.div>
          ) : (
            /* Reflection Phase */
            <motion.div
              key="reflection-phase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easeOutCurve }}
              className="mx-auto max-w-3xl w-full"
            >
              <div className="rounded-[2.4rem] border border-border/70 bg-white p-8 shadow-2xl sm:p-12">
                <div className="flex flex-col items-center text-center space-y-6 mb-12">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <h2 className="display-font text-4xl font-semibold text-foreground">
                      Session Complete
                    </h2>
                    <p className="text-muted-foreground mt-2">
                      Take a deep breath. How are you feeling after this time of stillness?
                    </p>
                  </div>
                </div>

                <div className="space-y-10">
                  {/* Rating */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">How was your experience?</Label>
                    <div className="flex justify-center gap-4">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setFeedback({ ...feedback, rating: val })}
                          className={cn(
                            "group relative flex flex-col items-center gap-1 transition-all",
                            feedback.rating >= val ? "text-primary" : "text-muted-foreground/30"
                          )}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Heart
                              className={cn(
                                "w-10 h-10 transition-colors",
                                feedback.rating >= val ? "fill-current" : "fill-none"
                              )}
                            />
                          </motion.div>
                          <span className="text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                            {val}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Helpful Toggle */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Did this session feel helpful?</Label>
                    <div className="flex gap-4">
                      <Button
                        variant={feedback.helpful === true ? "default" : "outline"}
                        onClick={() => setFeedback({ ...feedback, helpful: true })}
                        className="flex-1 h-14 rounded-2xl text-base"
                      >
                        Yes, it helped
                      </Button>
                      <Button
                        variant={feedback.helpful === false ? "default" : "outline"}
                        onClick={() => setFeedback({ ...feedback, helpful: false })}
                        className="flex-1 h-14 rounded-2xl text-base"
                      >
                        Not quite
                      </Button>
                    </div>
                  </div>

                  {/* Mood After */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Current State</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {moodAfterOptions.map((opt) => (
                        <button
                          key={opt.label}
                          onClick={() => setFeedback({ ...feedback, moodAfter: opt.label })}
                          className={cn(
                            "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                            feedback.moodAfter === opt.label
                              ? "bg-primary/5 border-primary text-primary"
                              : "bg-white border-border/70 text-muted-foreground hover:border-primary/30"
                          )}
                        >
                          {opt.icon}
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">Reflections</Label>
                      <span className="text-xs text-muted-foreground italic">Optional</span>
                    </div>
                    <Textarea
                      placeholder="Any thoughts or sensations you'd like to remember?"
                      className="min-h-[120px] rounded-[1.4rem] border-border/70 bg-muted/30 focus-visible:ring-primary/20"
                      value={feedback.notes}
                      onChange={(e) => setFeedback({ ...feedback, notes: e.target.value })}
                    />
                  </div>

                  <div className="pt-4 flex flex-col gap-4">
                    <Button
                      onClick={handleSaveSession}
                      disabled={isSavingSession || isSessionSaved}
                      size="lg"
                      className="h-14 rounded-2xl text-lg font-semibold w-full bg-primary hover:bg-primary/95 shadow-lg shadow-primary/10 transition-all active:scale-[0.98]"
                    >
                      {isSavingSession ? (
                        "Saving..."
                      ) : isSessionSaved ? (
                        "Saved successfully"
                      ) : (
                        <>
                          Save & Finish
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      onClick={handleReset}
                      className="h-12 rounded-xl text-muted-foreground hover:text-foreground"
                    >
                      Skip and Start New
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tips Section (Bento style) */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {[
            {
              title: "Posture",
              desc: "Keep your spine upright but relaxed, like a mountain.",
              icon: <ArrowRight className="w-5 h-5" />,
              bg: "bg-[#f5ecde]",
            },
            {
              title: "Breath",
              desc: "Follow the natural rhythm of your breath without trying to control it.",
              icon: <Wind className="w-5 h-5" />,
              bg: "bg-[#edf3ee]",
            },
            {
              title: "Attention",
              desc: "Gently return to the sound whenever your mind wanders away.",
              icon: <Sparkles className="w-5 h-5" />,
              bg: "bg-[#fff7ef]",
            },
          ].map((tip, idx) => (
            <motion.div
              key={tip.title}
              variants={fadeUp}
              className={cn(
                "p-6 rounded-[2rem] border border-border/70 shadow-sm transition-all hover:-translate-y-1",
                tip.bg
              )}
            >
              <div className="mb-4 inline-flex rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                {tip.icon}
              </div>
              <h3 className="text-xl font-semibold text-foreground">{tip.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tip.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Meditation;
