import { useEffect } from "react";
import { toast } from "sonner";

export default function useFocusMode(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const enterFullscreen = async () => {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        }
      } catch (err) {
        console.error("Fullscreen request failed:", err);
      }
    };

    
    enterFullscreen();

    // Disable right-click
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();
    document.addEventListener("contextmenu", blockContextMenu);

    // Detect tab switch or minimize
    const handleVisibility = () => {
      if (document.hidden) {
        toast.warning("Focus mode active! Please stay on this page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Re-enter fullscreen if user exits it (optional)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && active) {
        toast.warning("You exited fullscreen. Re-entering Focus Mode.");
        enterFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Block common shortcuts
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        key === "f11" ||
        (e.ctrlKey && key === "w") ||
        (e.ctrlKey && key === "r") ||
        (e.altKey && key === "tab")
      ) {
        e.preventDefault();
        toast.warning("Shortcuts are disabled in Focus Mode.");
      }
    };
    document.addEventListener("keydown", blockKeys);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", blockKeys);

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [active]);
}
