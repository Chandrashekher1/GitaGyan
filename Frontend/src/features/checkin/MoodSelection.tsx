import React from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const moods = [
  {
    id: "HEU",
    label: "High Energy \n Unpleasant",
    desc: "Angry / Anxious",
    color: "bg-destructive/12",
    borderColor: "border-destructive/20 hover:border-destructive/35",
    textColor: "text-destructive",
    iconBg: "bg-destructive/15",
    glow: "hover:shadow-[0_24px_48px_-18px_rgba(200,92,71,0.25)]",
  },
  {
    id: "HEP",
    label: "High Energy \n Pleasant",
    desc: "Excited",
    color: "bg-accent/12",
    borderColor: "border-accent/20 hover:border-accent/35",
    textColor: "text-accent-foreground",
    iconBg: "bg-accent/15",
    glow: "hover:shadow-[0_24px_48px_-18px_rgba(214,174,88,0.25)]",
  },
  {
    id: "LEU",
    label: "Low Energy \n Unpleasant",
    desc: "Sad / Depressed",
    color: "bg-secondary/12",
    borderColor: "border-secondary/20 hover:border-secondary/35",
    textColor: "text-secondary",
    iconBg: "bg-secondary/15",
    glow: "hover:shadow-[0_24px_48px_-18px_rgba(45,78,67,0.25)]",
  },
  {
    id: "LEP",
    label: "Low Energy \n Pleasant",
    desc: "Calm",
    color: "bg-primary/12",
    borderColor: "border-primary/20 hover:border-primary/35",
    textColor: "text-primary",
    iconBg: "bg-primary/15",
    glow: "hover:shadow-[0_24px_48px_-18px_rgba(143,75,44,0.25)]",
  },
];

export const MoodSelection: React.FC = () => {
  const navigate = useNavigate();

  const handleMoodSelect = (moodId: string) => {
    navigate("/check-in/survey", { state: { moodType: moodId } });
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,174,88,0.14),rgba(214,174,88,0)_70%)] blur-3xl" />
        <div className="absolute left-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full border border-primary/5" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center space-y-4 mb-14"
      >
        <div className="section-label mx-auto w-fit mb-5">
          <span className="eyebrow-dot" />
          Mood check-in
        </div>
        <h1 className="display-font text-5xl sm:text-6xl font-semibold tracking-tight text-foreground">
          How do you feel right now?
        </h1>
        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Take a moment to breathe and select the quadrant that resonates with you.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
        }}
        className="grid grid-cols-2 gap-5 sm:gap-7 max-w-lg w-full"
      >
        {moods.map((mood) => (
          <motion.button
            key={mood.id}
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleMoodSelect(mood.id)}
            className={cn(
              "group relative flex flex-col items-center justify-center rounded-[2.2rem] border p-6 sm:p-8 transition-all duration-300 select-none",
              mood.color,
              mood.borderColor,
              mood.glow
            )}
          >
            <span
              className={cn(
                "whitespace-pre-line text-[0.65rem] sm:text-xs font-black uppercase tracking-[0.18em] leading-tight",
                mood.textColor
              )}
            >
              {mood.label}
            </span>
            <span className="mt-2 text-xs font-medium text-muted-foreground italic">
              {mood.desc}
            </span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
