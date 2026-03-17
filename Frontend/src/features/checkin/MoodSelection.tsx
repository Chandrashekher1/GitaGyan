import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const moods = [
  {
    id: "HEU",
    label: "High Energy \n Unpleasant",
    desc: "Angry / Anxious",
    color: "bg-destructive/20 select-none",
    textColor: "text-destructive",
    glow: "shadow-[0_0_40px_rgba(200,92,71,0.2)]",
    hoverGlow: "group-hover:shadow-[0_0_60px_rgba(200,92,71,0.4)]",
  },
  {
    id: "HEP",
    label: "High Energy \n Pleasant",
    desc: "Excited",
    color: "bg-accent/20 select-none",
    textColor: "text-accent",
    glow: "shadow-[0_0_40px_rgba(214,174,88,0.2)]",
    hoverGlow: "group-hover:shadow-[0_0_60px_rgba(214,174,88,0.4)]",
  },
  {
    id: "LEU",
    label: "Low Energy \n Unpleasant",
    desc: "Sad / Depressed",
    color: "bg-secondary/30 select-none",
    textColor: "text-secondary-foreground",
    glow: "shadow-[0_0_40px_rgba(45,78,67,0.2)]",
    hoverGlow: "group-hover:shadow-[0_0_60px_rgba(45,78,67,0.4)]",
  },
  {
    id: "LEP",
    label: "Low Energy \n Pleasant",
    desc: "Calm",
    color: "bg-primary/20 select-none",
    textColor: "text-primary",
    glow: "shadow-[0_0_40px_rgba(143,75,44,0.2)]",
    hoverGlow: "group-hover:shadow-[0_0_60px_rgba(143,75,44,0.4)]",
  },
];

export const MoodSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleMoodSelect = (moodId: string) => {
    navigate("/check-in/survey", { state: { moodType: moodId } });
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0c0a09] text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 mb-16"
      >
        <h1 className="display-font text-5xl sm:text-6xl font-semibold tracking-tight sacred-text">
          How do you feel right now?
        </h1>
        <p className="text-muted-foreground/80 text-lg max-w-md mx-auto">
          Take a moment to breathe and select the quadrant that resonates with you.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-8 sm:gap-12">
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMoodSelect(mood.id)}
            className="group relative flex flex-col items-center justify-center"
          >
            <div
              className={cn(
                "h-40 w-40 sm:h-48 sm:w-48 rounded-full border border-white/5 transition-all duration-500 overflow-hidden",
                mood.color,
                mood.glow,
                mood.hoverGlow
              )}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-black/10 backdrop-blur-[2px]">
                <span className={cn(
                  "whitespace-pre-line text-xs font-black uppercase tracking-[0.2em] leading-tight",
                  mood.textColor
                )}>
                  {mood.label}
                </span>
                <span className="mt-2 text-xs font-medium text-white/40 italic">
                  {mood.desc}
                </span>
              </div>
            </div>
            {/* Ambient background bloom */}
            <div className={cn(
               "absolute -z-10 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-40",
               mood.color
            )} />
          </motion.button>
        ))}
      </div>
    </div>
  );
};
