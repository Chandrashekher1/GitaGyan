import React from "react";
import { Sparkles } from "lucide-react";

interface YogaLevelSelectorProps {
  selectedLevel: "beginner" | "intermediate" | "advanced" | null;
  onLevelSelect: (level: "beginner" | "intermediate" | "advanced") => void;
}

export const YogaLevelSelector: React.FC<YogaLevelSelectorProps> = ({
  selectedLevel,
  onLevelSelect,
}) => {
  return (
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
            onClick={() => onLevelSelect(level)}
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
  );
};

