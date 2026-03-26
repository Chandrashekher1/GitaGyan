import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("Signing you in...");

  useEffect(() => {
    const token = searchParams.get("token");
    const uid = searchParams.get("uid");
    const error = searchParams.get("error");

    if (error) {
      setStatus("Login failed");
      toast.error("Google login failed. Please try again.");
      setTimeout(() => navigate("/login"), 1500);
      return;
    }

    if (token && uid) {
      localStorage.setItem("token", token);
      localStorage.setItem("uid", uid);
      toast.success("Logged in with Google!");

      const redirectPath = localStorage.getItem("redirectPath");
      if (redirectPath) {
        localStorage.removeItem("redirectPath");
        navigate(redirectPath);
      } else {
        navigate("/chat");
      }
    } else {
      setStatus("Invalid callback");
      toast.error("Something went wrong.");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-full border border-border/70 bg-background/90 px-6 py-4 shadow-sm backdrop-blur">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
        <p className="text-sm text-muted-foreground">{status}</p>
      </div>
    </div>
  );
}
