import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  Focus,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import useFocusMode from "../Hooks/useFocusMode";

// Interfaces
interface AsanaStep {
  id: number;
  title: string;
  instruction: string;
  duration: number; // in seconds
}

interface Asana {
  id: string;
  name: string;
  sanskritName: string;
  level: "beginner" | "intermediate" | "advanced";
  description: string;
  benefits: string;
  precautions: string;
  image: string;
  steps: AsanaStep[];
  totalDuration: number; // in minutes
}

// Mock data with 3-4 asanas per level, each with 3-5 steps
const mockAsanas: Asana[] = [
  // Beginner Asanas
  {
    id: "mountain-pose",
    name: "Mountain Pose",
    sanskritName: "Tadasana",
    level: "beginner",
    description: "A foundational standing pose that teaches proper alignment and grounding.",
    benefits: "Improves posture, strengthens legs, enhances focus and concentration.",
    precautions: "Avoid if you have severe balance issues. Keep knees soft, not locked.",
    image: "/assets/yoga/tadasana.jpg",
    totalDuration: 5,
    steps: [
      {
        id: 1,
        title: "Foundation",
        instruction: "Stand with feet hip-width apart, toes pointing forward. Distribute weight evenly across both feet.",
        duration: 30,
      },
      {
        id: 2,
        title: "Alignment",
        instruction: "Engage your leg muscles and lift your kneecaps. Lengthen your spine, keeping shoulders relaxed.",
        duration: 60,
      },
      {
        id: 3,
        title: "Breath & Hold",
        instruction: "Breathe deeply and hold the pose. Feel your connection to the earth through your feet.",
        duration: 90,
      },
    ],
  },
  {
    id: "child-pose",
    name: "Child's Pose",
    sanskritName: "Balasana",
    level: "beginner",
    description: "A restorative pose that provides deep relaxation and introspection.",
    benefits: "Relieves stress, stretches hips and thighs, calms nervous system.",
    precautions: "Avoid if you have knee injuries. Use a cushion under knees if needed.",
    image: "/assets/yoga/balasana.jpg",
    totalDuration: 10,
    steps: [
      {
        id: 1,
        title: "Starting Position",
        instruction: "Kneel on the floor with big toes touching. Sit back on your heels.",
        duration: 20,
      },
      {
        id: 2,
        title: "Forward Fold",
        instruction: "Fold forward and rest your forehead on the ground. Extend arms forward or alongside your body.",
        duration: 60,
      },
      {
        id: 3,
        title: "Relaxation",
        instruction: "Breathe deeply and allow your body to relax completely. Hold this position.",
        duration: 120,
      },
    ],
  },
  {
    id: "cat-cow",
    name: "Cat-Cow Pose",
    sanskritName: "Marjaryasana-Bitilasana",
    level: "beginner",
    description: "A gentle flowing movement that warms up the spine and improves flexibility.",
    benefits: "Improves spinal flexibility, massages internal organs, relieves back tension.",
    precautions: "Move slowly and avoid if you have severe neck or back injuries.",
    image: "/assets/yoga/cat-cow.jpg",
    totalDuration: 8,
    steps: [
      {
        id: 1,
        title: "Table Position",
        instruction: "Start on hands and knees, wrists under shoulders, knees under hips.",
        duration: 15,
      },
      {
        id: 2,
        title: "Cow Pose",
        instruction: "Inhale, drop belly down, lift head and tailbone up. Arch your back gently.",
        duration: 30,
      },
      {
        id: 3,
        title: "Cat Pose",
        instruction: "Exhale, round your spine up, tuck chin to chest. Draw navel toward spine.",
        duration: 30,
      },
      {
        id: 4,
        title: "Flow",
        instruction: "Continue flowing between cow and cat poses with your breath for several rounds.",
        duration: 60,
      },
    ],
  },
  {
    id: "corpse-pose",
    name: "Corpse Pose",
    sanskritName: "Savasana",
    level: "beginner",
    description: "The ultimate relaxation pose, perfect for ending any practice.",
    benefits: "Reduces stress, lowers blood pressure, promotes deep relaxation.",
    precautions: "Use a blanket or pillow for comfort. Cover yourself if you feel cold.",
    image: "/assets/yoga/savasana.jpg",
    totalDuration: 10,
    steps: [
      {
        id: 1,
        title: "Lie Down",
        instruction: "Lie flat on your back with legs extended and arms at your sides, palms facing up.",
        duration: 20,
      },
      {
        id: 2,
        title: "Relax",
        instruction: "Close your eyes and allow your body to completely relax. Release all tension.",
        duration: 120,
      },
      {
        id: 3,
        title: "Return",
        instruction: "Slowly bring awareness back. Gently move fingers and toes before opening eyes.",
        duration: 30,
      },
    ],
  },
  // Intermediate Asanas
  {
    id: "downward-dog",
    name: "Downward Facing Dog",
    sanskritName: "Adho Mukha Svanasana",
    level: "intermediate",
    description: "An energizing pose that strengthens and stretches the entire body.",
    benefits: "Strengthens arms and legs, stretches spine and hamstrings, calms mind.",
    precautions: "Avoid if you have wrist or shoulder injuries. Keep knees bent if hamstrings are tight.",
    image: "/assets/yoga/downward-dog.jpg",
    totalDuration: 8,
    steps: [
      {
        id: 1,
        title: "Starting Position",
        instruction: "Start on hands and knees. Tuck toes under and prepare to lift.",
        duration: 15,
      },
      {
        id: 2,
        title: "Lift Hips",
        instruction: "Press into hands and lift hips up and back. Create an inverted V shape.",
        duration: 30,
      },
      {
        id: 3,
        title: "Alignment",
        instruction: "Straighten legs as much as comfortable. Press hands firmly into the ground.",
        duration: 60,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Breathe deeply and hold the pose. Feel the stretch through your entire body.",
        duration: 90,
      },
    ],
  },
  {
    id: "warrior-one",
    name: "Warrior I",
    sanskritName: "Virabhadrasana I",
    level: "intermediate",
    description: "A powerful standing pose that builds confidence and strength.",
    benefits: "Builds strength, improves balance, opens hips and chest, strengthens legs.",
    precautions: "Avoid if you have knee injuries. Keep front knee aligned over ankle.",
    image: "/assets/yoga/warrior-one.jpg",
    totalDuration: 6,
    steps: [
      {
        id: 1,
        title: "Step Back",
        instruction: "Step left foot back 3-4 feet. Turn left foot out 45 degrees.",
        duration: 20,
      },
      {
        id: 2,
        title: "Bend Front Knee",
        instruction: "Bend right knee over ankle. Keep back leg straight and strong.",
        duration: 30,
      },
      {
        id: 3,
        title: "Raise Arms",
        instruction: "Raise arms overhead, palms facing each other. Square hips forward.",
        duration: 60,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Hold the pose with strength and grace. Breathe deeply.",
        duration: 90,
      },
    ],
  },
  {
    id: "tree-pose",
    name: "Tree Pose",
    sanskritName: "Vrikshasana",
    level: "intermediate",
    description: "A balancing pose that cultivates focus and stability.",
    benefits: "Improves balance, strengthens legs, enhances concentration and focus.",
    precautions: "Use a wall for support if needed. Avoid if you have severe balance issues.",
    image: "/assets/yoga/tree-pose.jpg",
    totalDuration: 4,
    steps: [
      {
        id: 1,
        title: "Stand on One Leg",
        instruction: "Stand on left leg, bend right knee. Find your balance point.",
        duration: 20,
      },
      {
        id: 2,
        title: "Place Foot",
        instruction: "Place right foot on inner left thigh (avoid the knee). Press foot into leg.",
        duration: 30,
      },
      {
        id: 3,
        title: "Hands to Heart",
        instruction: "Bring hands to prayer position at heart center. Focus on a fixed point.",
        duration: 60,
      },
      {
        id: 4,
        title: "Extend Arms",
        instruction: "Optionally extend arms overhead. Hold with steady breath.",
        duration: 90,
      },
    ],
  },
  {
    id: "cobra-pose",
    name: "Cobra Pose",
    sanskritName: "Bhujangasana",
    level: "intermediate",
    description: "A gentle backbend that energizes and strengthens the spine.",
    benefits: "Strengthens back, opens chest, improves spinal flexibility, relieves fatigue.",
    precautions: "Avoid if you have severe back injuries. Keep shoulders away from ears.",
    image: "/assets/yoga/cobra.jpg",
    totalDuration: 7,
    steps: [
      {
        id: 1,
        title: "Starting Position",
        instruction: "Lie face down with palms under shoulders, elbows close to body.",
        duration: 15,
      },
      {
        id: 2,
        title: "Lift Chest",
        instruction: "Press palms down and lift chest. Keep hips grounded.",
        duration: 30,
      },
      {
        id: 3,
        title: "Alignment",
        instruction: "Keep shoulders away from ears. Lengthen through the crown of head.",
        duration: 60,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Breathe deeply and hold the pose. Feel the opening in your chest.",
        duration: 90,
      },
    ],
  },
  // Advanced Asanas
  {
    id: "headstand",
    name: "Headstand",
    sanskritName: "Sirsasana",
    level: "advanced",
    description: "The king of all yoga poses, requiring strength, balance, and focus.",
    benefits: "Improves circulation, strengthens core and arms, enhances focus and balance.",
    precautions: "Avoid if you have neck injuries, high blood pressure, or glaucoma. Practice against a wall first.",
    image: "/assets/yoga/headstand.jpg",
    totalDuration: 5,
    steps: [
      {
        id: 1,
        title: "Prepare",
        instruction: "Kneel and interlace fingers. Place forearms on ground, creating a triangle with hands.",
        duration: 20,
      },
      {
        id: 2,
        title: "Place Head",
        instruction: "Place crown of head on ground, cradled by hands. Walk feet closer.",
        duration: 30,
      },
      {
        id: 3,
        title: "Lift Hips",
        instruction: "Lift hips up, straightening legs. Keep core engaged.",
        duration: 30,
      },
      {
        id: 4,
        title: "Lift Legs",
        instruction: "Slowly lift one leg, then the other. Keep body straight and aligned.",
        duration: 60,
      },
      {
        id: 5,
        title: "Hold",
        instruction: "Hold the pose with steady breath. Focus on balance and alignment.",
        duration: 90,
      },
    ],
  },
  {
    id: "crow-pose",
    name: "Crow Pose",
    sanskritName: "Bakasana",
    level: "advanced",
    description: "An arm balance that builds arm strength and core stability.",
    benefits: "Strengthens arms and wrists, improves balance, builds core strength.",
    precautions: "Practice with a cushion in front. Avoid if you have wrist or shoulder injuries.",
    image: "/assets/yoga/crow.jpg",
    totalDuration: 6,
    steps: [
      {
        id: 1,
        title: "Squat Position",
        instruction: "Squat down with feet together. Place hands on ground, shoulder-width apart.",
        duration: 20,
      },
      {
        id: 2,
        title: "Knee Placement",
        instruction: "Place knees on upper arms, close to armpits. Lean forward slightly.",
        duration: 30,
      },
      {
        id: 3,
        title: "Lift Feet",
        instruction: "Shift weight forward and lift one foot, then the other. Balance on hands.",
        duration: 40,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Hold the pose with engaged core. Keep gaze forward, not down.",
        duration: 90,
      },
    ],
  },
  {
    id: "wheel-pose",
    name: "Wheel Pose",
    sanskritName: "Urdhva Dhanurasana",
    level: "advanced",
    description: "A deep backbend that opens the heart and strengthens the entire body.",
    benefits: "Opens chest and shoulders, strengthens back and legs, energizes the body.",
    precautions: "Avoid if you have back, wrist, or shoulder injuries. Warm up thoroughly first.",
    image: "/assets/yoga/wheel.jpg",
    totalDuration: 5,
    steps: [
      {
        id: 1,
        title: "Starting Position",
        instruction: "Lie on back, bend knees, place feet hip-width apart. Place hands by ears, fingers toward shoulders.",
        duration: 20,
      },
      {
        id: 2,
        title: "Press Up",
        instruction: "Press into hands and feet, lifting hips and chest off ground.",
        duration: 30,
      },
      {
        id: 3,
        title: "Full Extension",
        instruction: "Straighten arms and legs as much as comfortable. Open through chest.",
        duration: 60,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Breathe deeply and hold. Feel the opening in your heart center.",
        duration: 90,
      },
    ],
  },
  {
    id: "handstand",
    name: "Handstand",
    sanskritName: "Adho Mukha Vrksasana",
    level: "advanced",
    description: "An inversion that builds strength, balance, and courage.",
    benefits: "Strengthens arms and core, improves balance, builds confidence, reverses blood flow.",
    precautions: "Practice against a wall first. Avoid if you have shoulder, neck, or eye issues.",
    image: "/assets/yoga/handstand.jpg",
    totalDuration: 5,
    steps: [
      {
        id: 1,
        title: "Prepare",
        instruction: "Start in downward dog. Walk feet closer to hands, lifting hips high.",
        duration: 20,
      },
      {
        id: 2,
        title: "Kick Up",
        instruction: "Shift weight to hands. Kick one leg up, then the other, finding balance.",
        duration: 30,
      },
      {
        id: 3,
        title: "Alignment",
        instruction: "Stack hips over shoulders. Engage core and keep body straight.",
        duration: 40,
      },
      {
        id: 4,
        title: "Hold",
        instruction: "Hold with steady breath. Focus on balance and strength.",
        duration: 90,
      },
    ],
  },
];

const YogaTab: React.FC = () => {
  // State management
  const [selectedLevel, setSelectedLevel] = useState<"beginner" | "intermediate" | "advanced" | null>(null);
  const [selectedAsana, setSelectedAsana] = useState<Asana | null>(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepTimeRemaining, setStepTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [completedSessions, setCompletedSessions] = useState<string[]>([]);

  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use focus mode hook
  useFocusMode(focusMode && sessionStarted);

  // Filter asanas by level
  const filteredAsanas = selectedLevel ? mockAsanas.filter((asana) => asana.level === selectedLevel) : [];

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
              setCurrentStepIndex((prevIndex) => prevIndex + 1);
              return selectedAsana.steps[currentStepIndex + 1].duration;
            } else {
              // Session complete
              setIsPlaying(false);
              setSessionStarted(false);
              if (selectedAsana) {
                setCompletedSessions((prev) => [...prev, selectedAsana.id]);
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
  }, [isPlaying, stepTimeRemaining, sessionStarted, currentStepIndex, selectedAsana]);

  // Helper functions
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartSession = (asana: Asana) => {
    setSelectedAsana(asana);
    setCurrentStepIndex(0);
    setStepTimeRemaining(asana.steps[0].duration);
    setShowSessionModal(true);
    setSessionStarted(false);
    setIsPlaying(false);
  };

  const handleStart = () => {
    if (!selectedAsana) return;
    setSessionStarted(true);
    setIsPlaying(true);
    if (focusMode) {
      // Focus mode will be activated by the hook
    }
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
    if (selectedAsana) {
      setCurrentStepIndex(0);
      setStepTimeRemaining(selectedAsana.steps[0].duration);
    }
  };

  const handleExit = () => {
    setIsPlaying(false);
    setSessionStarted(false);
    setFocusMode(false);
    setShowSessionModal(false);
    setSelectedAsana(null);
    setCurrentStepIndex(0);
  };

  const currentStep = selectedAsana?.steps[currentStepIndex];
  const progress = selectedAsana
    ? ((currentStepIndex + 1) / selectedAsana.steps.length) * 100
    : 0;

  // Placeholder for TTS (Text-to-Speech)
  const playInstruction = (text: string) => {
    // Future implementation: Use Web Speech API or external TTS service
    console.log("Playing instruction:", text);
  };

  // Focus Mode Overlay
  if (focusMode && sessionStarted && selectedAsana) {
    return (
      <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white p-8 max-w-4xl w-full"
        >
          <Button
            onClick={() => setFocusMode(false)}
            variant="outline"
            className="absolute top-4 right-4 text-white border-white/30 hover:bg-white/10"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Focus Mode
          </Button>

          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-2">{selectedAsana.name}</h2>
            <p className="text-xl text-gray-300">{selectedAsana.sanskritName}</p>
            <p className="text-lg text-gray-400 mt-2">
              Step {currentStepIndex + 1} of {selectedAsana.steps.length}
            </p>
          </div>

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
                {isPlaying ? "Practicing..." : "Paused"}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">{currentStep?.title}</h3>
            <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
              {currentStep?.instruction}
            </p>
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
              Prev
            </Button>

            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
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
              disabled={!selectedAsana || currentStepIndex === selectedAsana.steps.length - 1}
              variant="outline"
              size="lg"
              className="text-white border-white/30 hover:bg-white/10 disabled:opacity-50"
            >
              Next
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </motion.div>
      </div>
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
        <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xl glass-effect mb-8">
          <div className="flex items-center mb-6">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)] mr-3" />
            <h2 className="text-2xl font-bold text-[var(--color-primary)]">
              Choose Your Level
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {(["beginner", "intermediate", "advanced"] as const).map((level) => (
              <button
                key={level}
                onClick={() => setSelectedLevel(level)}
                className={`py-3 px-4 rounded-xl font-semibold transition-all duration-200 capitalize ${
                  selectedLevel === level
                    ? "text-white shadow-lg"
                    : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
                }`}
                style={
                  selectedLevel === level
                    ? { background: "var(--gradient-sunrise)" }
                    : {}
                }
              >
                {level}
              </button>
            ))}
          </div>
        </div>

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
                  Dim background and focus only on current asana step
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

        {/* Asana List */}
        <div className="mb-8">
          {selectedLevel ? (
            <>
              <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
                {selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)} Asanas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredAsanas.map((asana) => (
                  <Card
                    key={asana.id}
                    className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl glass-effect hover:shadow-2xl transition-all duration-300"
                  >
                    <CardHeader>
                      <div className="w-full h-48 bg-gradient-to-br from-orange-100 to-amber-100 rounded-lg mb-4 flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-primary/60" />
                      </div>
                      <CardTitle className="text-xl font-bold text-[var(--color-primary)]">
                        {asana.name}
                      </CardTitle>
                      <CardDescription className="text-accent-foreground font-medium">
                        {asana.sanskritName}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-[var(--color-muted-foreground)] mb-4 leading-relaxed">
                        {asana.description}
                      </p>
                      <div className="flex items-center mb-4">
                        <Clock className="w-4 h-4 mr-2 text-[var(--color-muted-foreground)]" />
                        <span className="text-sm text-[var(--color-muted-foreground)]">
                          {asana.totalDuration} minutes • {asana.steps.length} steps
                        </span>
                      </div>
                      <Button
                        onClick={() => handleStartSession(asana)}
                        className="w-full"
                        style={
                          completedSessions.includes(asana.id)
                            ? { background: "var(--gradient-serenity)" }
                            : {}
                        }
                      >
                        {completedSessions.includes(asana.id) ? "✓ Completed" : "Start Session"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-[var(--color-input)]">
                <Sparkles className="w-10 h-10 text-[var(--color-primary)]" />
              </div>
              <p className="text-xl text-[var(--color-muted-foreground)]">
                Select your level to view guided yoga sessions.
              </p>
            </div>
          )}
        </div>

        {/* Session Modal */}
        <AnimatePresence>
          {showSessionModal && selectedAsana && (
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
                        {selectedAsana.name}
                      </h3>
                      <p className="text-xl text-accent-foreground">
                        {selectedAsana.sanskritName}
                      </p>
                    </div>
                    <Button
                      onClick={handleExit}
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-[var(--color-muted-foreground)] mb-2">
                      <span>Step {currentStepIndex + 1} of {selectedAsana.steps.length}</span>
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
                                ? "Practicing..."
                                : "Paused"
                              : "Ready to begin"}
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
                        Previous
                      </Button>

                      {!sessionStarted ? (
                        <Button onClick={handleStart} size="lg" className="px-8">
                          <Play className="w-5 h-5 mr-2" />
                          Start Session
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
                        disabled={!selectedAsana || currentStepIndex === selectedAsana.steps.length - 1}
                        variant="outline"
                        className="disabled:opacity-50"
                      >
                        Next
                        <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>

                  {/* Benefits & Precautions */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                      <h5 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Benefits
                      </h5>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {selectedAsana.benefits}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                      <h5 className="font-semibold text-[var(--color-primary)] mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Precautions
                      </h5>
                      <p className="text-sm text-[var(--color-muted-foreground)]">
                        {selectedAsana.precautions}
                      </p>
                    </div>
                  </div>

                  {/* Step List */}
                  <div>
                    <h5 className="font-semibold text-[var(--color-primary)] mb-3">
                      All Steps
                    </h5>
                    <div className="space-y-2">
                      {selectedAsana.steps.map((step, index) => (
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
      </div>
    </div>
  );
};

export default YogaTab;