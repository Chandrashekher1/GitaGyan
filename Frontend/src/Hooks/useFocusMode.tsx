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

    // Restrict tab switching - detect when window loses focus
    const handleBlur = () => {
      // Try to refocus the window
      window.focus();
      toast.warning("Focus mode active! Please stay on this page.");
    };
    window.addEventListener("blur", handleBlur);

    // Detect tab switch or minimize
    const handleVisibility = () => {
      if (document.hidden) {
        // Try to bring window back to focus
        window.focus();
        toast.warning("Focus mode active! Please stay on this page.");
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // Prevent window from losing focus
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Focus mode is active. Are you sure you want to leave?";
      return e.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Re-enter fullscreen if user exits it
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && active) {
        toast.warning("You exited fullscreen. Re-entering Focus Mode.");
        enterFullscreen();
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    // Block common shortcuts including Alt+Tab
    const blockKeys = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Block Alt+Tab, Ctrl+Tab, Ctrl+W, Ctrl+R, F11, etc.
      if (
        key === "f11" ||
        (e.ctrlKey && (key === "w" || key === "r" || key === "t" || key === "n")) ||
        (e.altKey && (key === "tab" || key === "f4")) ||
        (e.metaKey && key === "tab") // Cmd+Tab on Mac
      ) {
        e.preventDefault();
        e.stopPropagation();
        toast.warning("Shortcuts are disabled in Focus Mode.");
        return false;
      }
    };
    document.addEventListener("keydown", blockKeys, true); // Use capture phase

    // Try to keep window focused
    const keepFocus = () => {
      if (document.hidden) {
        window.focus();
      }
    };
    const focusInterval = setInterval(keepFocus, 1000);

    // Cleanup
    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      window.removeEventListener("blur", handleBlur);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("keydown", blockKeys, true);
      clearInterval(focusInterval);

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
  }, [active]);
}
