import { createContext, useContext } from "react";

/* ── Message shape returned by the avatar backend ── */
export interface AvatarMessage {
  id: string;
  text: string;
  facialExpression: string;
  animation: string;
}

/* ── Context value ── */
export interface AvatarChatContextValue {
  /** The currently active avatar message (audio playing / lip‑syncing). */
  message: AvatarMessage | null;
  /** Call when the avatar has finished playing the current message. */
  onMessagePlayed: () => void;
  /** True while the chat backend is streaming / loading. */
  loading: boolean;
  /** Whether the camera is zoomed in on the avatar face. */
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
}

export const AvatarChatContext = createContext<AvatarChatContextValue | undefined>(undefined);

export function useAvatarChat(): AvatarChatContextValue {
  const ctx = useContext(AvatarChatContext);
  if (!ctx) {
    throw new Error("useAvatarChat must be used inside <AvatarChatContext.Provider>");
  }
  return ctx;
}
