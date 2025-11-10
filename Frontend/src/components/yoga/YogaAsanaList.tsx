import React from "react";
import { Clock, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
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
  if (asanas.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 bg-[var(--color-input)]">
          <Sparkles className="w-10 h-10 text-[var(--color-primary)]" />
        </div>
        <p className="text-xl text-[var(--color-muted-foreground)]">
          Select your level to view guided yoga sessions.
        </p>
      </div>
    );
  }

  return (
    <>
      <h2 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        {asanas[0]?.level.charAt(0).toUpperCase() + asanas[0]?.level.slice(1)} Asanas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {asanas.map((asana) => (
          <Card
            key={asana.id}
            className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] shadow-xl glass-effect hover:shadow-2xl transition-all duration-300"
          >
            <CardHeader>
              <div className="w-full h-48 rounded-lg mb-4 overflow-hidden relative">
                <img 
                  src={asana.image} 
                  alt={asana.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://source.unsplash.com/800x600/?yoga";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
                onClick={() => onStartSession(asana)}
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
  );
};

