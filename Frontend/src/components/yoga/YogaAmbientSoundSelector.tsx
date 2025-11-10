import React from "react";
import { Volume2, X } from "lucide-react";
import { Button } from "../ui/button";

export interface AmbientSound {
  id: string;
  name: string;
  description: string;
  type: "chanting" | "instrumental" | "nature" | "bells";
  file: string;
}

interface YogaAmbientSoundSelectorProps {
  selectedSound: AmbientSound | null;
  onSelectSound: (sound: AmbientSound | null) => void;
  ambientSounds: AmbientSound[];
  compact?: boolean;
}

export const YogaAmbientSoundSelector: React.FC<YogaAmbientSoundSelectorProps> = ({
  selectedSound,
  onSelectSound,
  ambientSounds,
  compact = false,
}) => {
  if (compact) {
    return (
      <div className="mb-6 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6">
        <div className="flex items-center mb-4">
          <Volume2 className="w-5 h-5 text-[var(--color-primary)] mr-2" />
          <h5 className="font-semibold text-[var(--color-primary)]">
            Ambient Sound
          </h5>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {ambientSounds.map((sound) => (
            <button
              key={sound.id}
              onClick={() => onSelectSound(sound)}
              className={`p-3 rounded-xl text-left transition-all duration-200 ${
                selectedSound?.id === sound.id
                  ? "text-white shadow-lg"
                  : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
              }`}
              style={
                selectedSound?.id === sound.id
                  ? { background: "var(--gradient-serenity)" }
                  : {}
              }
            >
              <div className="font-semibold text-sm">{sound.name}</div>
              <div className="text-xs opacity-80">{sound.description}</div>
            </button>
          ))}
        </div>
        {selectedSound && (
          <div className="mt-4 pt-4 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Volume2 className="w-4 h-4 text-[var(--color-primary)] mr-2" />
                <div>
                  <div className="text-sm font-semibold text-[var(--color-primary)]">
                    Currently Playing: {selectedSound.name}
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">
                    {selectedSound.description}
                  </div>
                </div>
              </div>
              <Button
                onClick={() => onSelectSound(null)}
                variant="ghost"
                size="sm"
                className="text-[var(--color-muted-foreground)]"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xl glass-effect mb-8">
      <div className="flex items-center mb-6">
        <Volume2 className="w-6 h-6 text-[var(--color-primary)] mr-3" />
        <h2 className="text-2xl font-bold text-[var(--color-primary)]">
          Ambient Sound
        </h2>
      </div>
      <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
        Select an ambient sound to play during your yoga session
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {ambientSounds.map((sound) => (
          <button
            key={sound.id}
            onClick={() => onSelectSound(sound)}
            className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
              selectedSound?.id === sound.id
                ? "text-white shadow-lg"
                : "bg-[var(--color-input)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]"
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
  );
};

