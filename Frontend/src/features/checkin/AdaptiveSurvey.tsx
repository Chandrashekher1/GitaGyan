import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Backend_Url } from "@/utils/constant";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowLeft, Loader2 } from "lucide-react";

type MoodType = "HEU" | "LEU" | "HEP" | "LEP";

interface Question {
  id: string;
  text: string;
  type: "scale" | "choice" | "text";
  options?: string[];
  field: string;
}

const QUESTIONS: Record<MoodType, Question[]> = {
  HEU: [
    { id: "q1", text: "What seems to be the main cause of your stress?", type: "choice", options: ["Work", "Personal Matters", "Health", "Other"], field: "category" },
    { id: "q2", text: "On a scale of 1-10, how intense is this feeling?", type: "scale", field: "intensity" },
    { id: "q3", text: "How long have you been feeling this way?", type: "choice", options: ["Just now", "A few hours", "All day", "A few days"], field: "duration" },
    { id: "q4", text: "How often do you experience this?", type: "choice", options: ["Rarely", "Often", "Almost constantly"], field: "frequency" },
  ],
  LEU: [
    { id: "q1", text: "How long has this feeling of low energy persisted?", type: "choice", options: ["A few hours", "A few days", "Over a week"], field: "duration" },
    { id: "q2", text: "How would you rate your remaining energy?", type: "scale", field: "intensity" },
    { id: "q3", text: "Have you had much social interaction today?", type: "choice", options: ["A lot", "Some", "None at all"], field: "social" },
    { id: "q4", text: "Is this a frequent occurrence for you?", type: "choice", options: ["Rarely", "Often", "Almost constantly"], field: "frequency" },
  ],
  HEP: [
    { id: "q1", text: "What caused this surge of excitement?", type: "text", field: "cause" },
    { id: "q2", text: "How intense is this excitement? (1-10)", type: "scale", field: "intensity" },
    { id: "q3", text: "Do you feel like taking action on this energy right now?", type: "choice", options: ["Yes, immediately", "Maybe later", "Just enjoying it"], field: "action" },
  ],
  LEP: [
    { id: "q1", text: "What contributed most to your sense of calm?", type: "text", field: "cause" },
    { id: "q2", text: "How deep is this tranquility? (1-10)", type: "scale", field: "intensity" },
    { id: "q3", text: "Would you like to maintain this state through a ritual?", type: "choice", options: ["Yes, show me", "I'm good for now"], field: "maintain" },
  ],
};

const mapChoiceToScore = (choice: string): number => {
  if (["Just now", "A few hours", "Rarely", "A lot"].includes(choice)) return 1;
  if (["All day", "A few days", "Often", "Some"].includes(choice)) return 2;
  if (["Over a week", "Almost constantly", "None at all"].includes(choice)) return 3;
  return 1;
};

export const AdaptiveSurvey: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const moodType = (location.state?.moodType as MoodType) || "LEP";
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [moodId, setMoodId] = useState<string | null>(null);

  const questions = QUESTIONS[moodType];
  const progress = ((currentStep + 1) / questions.length) * 100;

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");
    
    if (!uid || !token) {
        toast.error("Please login to continue");
        navigate("/login");
        return;
    }

    const initMood = async () => {
      try {
        const res = await fetch(`${Backend_Url}/mood-check/mood`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": token 
          },
          body: JSON.stringify({ userId: uid, moodType }),
        });

        if (!res.ok) {
            const text = await res.text();
            console.error("Server error during initMood:", res.status, text);
            toast.error(`Session initialized failed (Status ${res.status}).`);
            return;
        }

        const data = await res.json();
        if (data.success) {
          setMoodId(data.moodId);
        } else {
          toast.error("Failed to initialize session. Please try again.");
          console.error("Init mood success false:", data);
        }
      } catch (err) {
        toast.error("Network error. Please check your connection.");
        console.error("Failed to init mood", err);
      }
    };
    initMood();
  }, [moodType, navigate]);

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitSurvey();
    }
  };

  const submitSurvey = async () => {
    if (!moodId) {
      toast.error("Session not ready. Please refresh or try again.");
      return;
    }
    setIsSubmitting(true);

    try {
      const intensity = answers["intensity"] || 5;
      const duration = mapChoiceToScore(answers["duration"] || "");
      const frequency = mapChoiceToScore(answers["frequency"] || "");

      const res = await fetch(`${Backend_Url}/mood-check/survey`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token") || ""
        },
        body: JSON.stringify({
          moodId,
          answers: Object.entries(answers).map(([q, a]) => ({ question: q, response: a })),
          intensity,
          duration,
          frequency,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server error during submitSurvey:", res.status, text);
        toast.error(`Session submission failed (Status ${res.status}).`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        navigate("/check-in/result", { state: { result: data.result } });
      } else {
        toast.error("Failed to save survey. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please check your connection.");
      console.error("Failed to submit survey", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentStep];

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute left-[-6rem] top-[6rem] h-[22rem] w-[22rem] rounded-full bg-[radial-gradient(circle,rgba(143,75,44,0.1),transparent_70%)] blur-3xl" />
        <div className="absolute right-[-8rem] bottom-0 h-[18rem] w-[18rem] rounded-full border border-secondary/5" />
      </div>

      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted/30 rounded-full mx-auto max-w-xl mt-8 px-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full rounded-full shadow-sm"
          style={{ background: "var(--gradient-sunrise)" }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-10"
            >
              <div className="space-y-4 text-center">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary/60">
                  Question {currentStep + 1} of {questions.length}
                </span>
                <h2 className="display-font text-3xl sm:text-4xl font-medium leading-tight text-foreground">
                  {currentQuestion.text}
                </h2>
              </div>

              <div className="py-4">
                {currentQuestion.type === "scale" && (
                  <div className="space-y-6">
                    <div className="flex justify-between px-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      <span>Mild</span>
                      <span>Intense</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <motion.button
                          key={num}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setAnswers({ ...answers, [currentQuestion.field]: num })}
                          className={cn(
                            "h-10 flex-1 rounded-xl border transition-all duration-200 font-bold text-sm",
                            answers[currentQuestion.field] === num
                              ? "bg-primary border-primary text-primary-foreground scale-110 shadow-lg"
                              : "border-border/70 bg-white/60 text-foreground hover:border-primary/30 hover:bg-primary/5"
                          )}
                        >
                          {num}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}

                {currentQuestion.type === "choice" && (
                  <div className="grid gap-3">
                    {currentQuestion.options?.map((opt) => (
                      <motion.button
                        key={opt}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setAnswers({ ...answers, [currentQuestion.field]: opt })}
                        className={cn(
                          "w-full rounded-[1.5rem] border p-5 text-left transition-all duration-200 flex items-center justify-between group",
                          answers[currentQuestion.field] === opt
                            ? "border-primary bg-primary/8 text-foreground shadow-[0_12px_32px_-18px_rgba(143,75,44,0.3)]"
                            : "border-border/70 bg-white/55 text-foreground hover:border-primary/25 hover:bg-white/80"
                        )}
                      >
                        <span className="font-medium">{opt}</span>
                        <div className={cn(
                          "h-5 w-5 rounded-full border-2 flex items-center justify-center transition-colors",
                          answers[currentQuestion.field] === opt ? "border-primary bg-primary" : "border-border group-hover:border-primary/40"
                        )}>
                          {answers[currentQuestion.field] === opt && <div className="h-2 w-2 rounded-full bg-white" />}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {currentQuestion.type === "text" && (
                  <textarea
                    autoFocus
                    value={answers[currentQuestion.field] || ""}
                    onChange={(e) => setAnswers({ ...answers, [currentQuestion.field]: e.target.value })}
                    className="w-full min-h-[120px] rounded-[1.5rem] border border-border/70 bg-white/55 p-5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="Reflect here..."
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex justify-between gap-4">
            <Button
              variant="ghost"
              onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
              disabled={currentStep === 0 || isSubmitting}
              className="rounded-full px-6 text-muted-foreground hover:text-foreground hover:bg-muted/20"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!answers[currentQuestion.field] || isSubmitting}
              className="rounded-full px-8 shadow-[0_10px_30px_-10px_rgba(143,75,44,0.35)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                <>
                  {currentStep === questions.length - 1 ? "Finish Check-in" : "Continue"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
