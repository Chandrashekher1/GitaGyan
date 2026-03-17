import { Suspense, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Experience } from "./Sage-Avatar/Experience";
import { AvatarChatContext } from "./Sage-Avatar/useAvatarChat";
import type { AvatarMessage } from "./Sage-Avatar/useAvatarChat";
import { ZoomIn, ZoomOut } from "lucide-react";

interface AvatarCanvasProps {
  /** The current avatar message to play (audio, lipsync, expression, animation). */
  avatarMessage: AvatarMessage | null;
  /** Whether the chat backend is currently streaming / loading. */
  isStreaming?: boolean;
  /** Called when the avatar finishes playing the current message audio. */
  onMessagePlayed?: () => void;
}

export function AvatarCanvas({
  avatarMessage,
  isStreaming = false,
  onMessagePlayed,
}: AvatarCanvasProps) {
  const [cameraZoomed, setCameraZoomed] = useState(true);

  const handleMessagePlayed = useCallback(() => {
    onMessagePlayed?.();
  }, [onMessagePlayed]);

  return (
    <AvatarChatContext.Provider
      value={{
        message: avatarMessage,
        onMessagePlayed: handleMessagePlayed,
        loading: isStreaming,
        cameraZoomed,
        setCameraZoomed,
      }}
    >
      <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 lg:h-80">
        {/* Leva debug panel — hidden in prod */}
        <Leva hidden />
        <Loader />

        <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }}>
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>

        {/* Zoom toggle button */}
        <button
          type="button"
          onClick={() => setCameraZoomed((prev) => !prev)}
          className="absolute right-2.5 top-2.5 z-10 rounded-full border border-white/15 bg-black/40 p-2 text-white/80 backdrop-blur-sm transition-colors hover:bg-black/60 hover:text-white"
          aria-label={cameraZoomed ? "Zoom out" : "Zoom in"}
        >
          {cameraZoomed ? (
            <ZoomOut className="h-3.5 w-3.5" />
          ) : (
            <ZoomIn className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
    </AvatarChatContext.Provider>
  );
}
