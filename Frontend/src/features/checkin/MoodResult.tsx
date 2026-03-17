import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  ArrowRight,
  Heart,
  Wind,
  BookOpen,
  PhoneCall,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const MoodResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] text-white">
        <p>No results found. Please complete a check-in.</p>
        <Button onClick={() => navigate("/")} className="mt-4">Go Home</Button>
      </div>
    );
  }

  const { severityLevel, severityScore } = result;

  const getSeverityStyles = () => {
    switch (severityLevel) {
      case "Severe": return { color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/20", icon: <ShieldAlert className="w-8 h-8" /> };
      case "Moderate": return { color: "text-amber-600", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <AlertCircle className="w-8 h-8" /> };
      default: return { color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <CheckCircle2 className="w-8 h-8" /> };
    }
  };

  const styles = getSeverityStyles();

  const getSuggestions = () => {
    if (severityLevel === "Severe") {
      return [
        { title: "Breathe with us", desc: "Try a 5-minute guided deep breathing session now.", icon: <Wind />, link: "/meditation" },
        { title: "Talk to someone", desc: "It helps to share. Reach out to a trusted friend or professional.", icon: <PhoneCall />, isHelpline: true },
        { title: "Sacred Wisdom", desc: "Read verses on finding peace during turmoil.", icon: <BookOpen />, link: "/chapters" },
      ];
    }
    if (severityLevel === "Moderate") {
      return [
        { title: "Guided Meditation", desc: "A short session to center your thoughts.", icon: <Heart />, link: "/meditation" },
        { title: "Sage", desc: "Write down what's on your mind in our chat.", icon: <LayoutDashboard />, link: "/chat", state: { moodContext: result } },
      ];
    }
    return [
      { title: "Maintain Mindfulness", desc: "You're doing great. Keep up your daily rituals.", icon: <CheckCircle2 />, link: "/yoga" },
    ];
  };

  return (
    <div className="min-h-screen bg-[#0c0a09] text-white px-6 py-12 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <Badge variant="outline" className="border-white/10 bg-white/5 text-white/60">
            Analysis Complete
          </Badge>
          <h1 className="display-font text-5xl font-semibold tracking-tight sacred-text">Your Mood Report</h1>
        </div>

        {/* Severity Card */}
        <div className={cn("relative overflow-hidden rounded-[2.5rem] border p-8 sm:p-10 backdrop-blur-sm", styles.bg, styles.border)}>
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6">
            <div className={cn("p-4 rounded-2xl bg-black/20 backdrop-blur-md", styles.color)}>
              {styles.icon}
            </div>
            <div>
              <h2 className={cn("text-3xl font-bold", styles.color)}>{severityLevel} Intensity</h2>
              <p className="mt-3 text-lg leading-relaxed text-white/70">
                Your mood score is <span className="font-bold text-white">{severityScore}</span>.
                {severityLevel === "Severe" && " It seems like you're carrying a lot right now. Let's take a small step toward relief."}
                {severityLevel === "Moderate" && " You're navigating some challenges. A quick reset might help clear the air."}
                {severityLevel === "Mild" && " You seem to be in a grounded state. This is a great time for sustained focus."}
              </p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Recommended Path
          </h3>
          <div className="grid gap-4">
            {getSuggestions().map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {s.link ? (
                  <Link
                    to={s.link}
                    state={(s as any).state}
                    className="group flex items-center gap-5 p-6 rounded-[2rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all"
                  >
                    <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold">{s.title}</h4>
                      <p className="text-sm text-white/40">{s.desc}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-white/10 group-hover:text-primary transition-colors" />
                  </Link>
                ) : (
                  <div className="flex items-center gap-5 p-6 rounded-[2rem] border border-primary/20 bg-primary/5">
                    <div className="p-3 rounded-xl bg-primary text-secondary-foreground">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-primary">{s.title}</h4>
                      <p className="text-sm text-primary/70">{s.desc}</p>
                      {(s as any).isHelpline && (
                        <p className="mt-2 font-mono text-xs text-primary font-bold">Vatsalya: 1800-XXX-XXXX</p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="pt-8 flex justify-center">
          <Button asChild variant="ghost" className="rounded-full text-white/30 hover:text-white hover:bg-white/5">
            <Link to="/profile">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              View Mood History
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default MoodResult;
