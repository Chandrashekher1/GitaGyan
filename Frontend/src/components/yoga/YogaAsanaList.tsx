import React from "react";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { useLanguage } from "@/context/Language";
import { Asana } from "./data/asanasData";

interface YogaAsanaListProps {
  asanas: Asana[];
  onStartSession: (asana: Asana) => void;
  completedSessions: string[];
}

export const YogaAsanaList: React.FC<YogaAsanaListProps> = ({
  asanas,
  onStartSession,
  completedSessions,
}) => {
  const { t } = useLanguage();
  
  if (asanas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-[var(--color-input)]">
          <Sparkles className="w-10 h-10 text-[var(--color-primary)]" />
        </div>
        <p className="text-xl text-[var(--color-muted-foreground)]">
          {t("selectLevelToView")}
        </p>
      </div>
    );
  }

  const levelMap: Record<string, string> = {
    beginner: t("beginner"),
    intermediate: t("intermediate"),
    advanced: t("advanced"),
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        {levelMap[asanas[0]?.level] || asanas[0]?.level} {t("asanas")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {asanas.map((asana) => (
          <Card
            key={asana.id}
            className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl glass-effect hover:shadow-2xl transition-all duration-300"
          >
            <CardHeader>
              {/*
                Note: use "aspect-*" utilities for consistent frame ratios (Tailwind aspect-ratio plugin).
                The image now fills the frame but preserves aspect ratio. On small screens we use "object-contain"
                to avoid cropping; on md+ we use "object-cover" to create a tighter visual fill.
              */}
              <div className="w-full rounded-lg mb-4 overflow-hidden relative bg-black/5">
                {/* Aspect ratio container: prefer using Tailwind's aspect-* (e.g. aspect-video or aspect-[4/3]) */}
                <div className="w-full h-80 object-center flex items-center justify-center">
                  <img
                    src={asana.image}
                    alt={asana.name}
                    loading="lazy"
                    className={
                      "w-full h-full object-contain  transition-all duration-200"
                    }
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      // fallback image
                      target.src = "https://source.unsplash.com/800x600/?yoga";
                      // ensure fallback fits the frame
                      target.className = "w-full h-full object-contain object-center";
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
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
                  {asana.totalDuration} {t("minutes")} • {asana.steps.length} {t("steps")}
                </span>
              </div>
              <Button
                onClick={() => onStartSession(asana)}
                className="w-full"
                style={
                  completedSessions.includes(asana.id)
                    ? { background: "var(--gradient-serenity)" }
                    : {}
                }
              >
                {completedSessions.includes(asana.id) ? t("completed") : t("startSession")}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

export default YogaAsanaList;
