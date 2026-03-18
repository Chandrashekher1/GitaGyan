import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Calendar,
  ChevronRight,
  Clock,
  Download,
  Flower2,
  LogOut,
  MessageCircle,
  Search,
  Star,
  Trash2,
  TrendingUp,
  Activity,
  ShieldAlert,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  motion,
  useInView,
  useReducedMotion,
  AnimatePresence,
  LayoutGroup,
} from "motion/react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Backend_Url } from "@/utils/constant";
import { asanasData } from "@/components/yoga/data/asanasData";

interface Verse {
  sanskrit: string;
  english: string;
  meaning: string;
  chapter: number;
  verseNumber: number;
}

interface ChatMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  category?: string;
  timestamp: Date;
  verse?: Verse;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastUpdated: Date;
  messages: ChatMessage[];
}

interface YogaSession {
  id: string;
  asanaId: string;
  asanaName: string;
  sanskritName: string;
  level: "beginner" | "intermediate" | "advanced";
  completedAt: string;
  duration: number;
  steps: number;
}

interface MoodEntry {
  _id: string;
  moodType: "HEU" | "LEU" | "HEP" | "LEP";
  severityLevel: "Mild" | "Moderate" | "Severe";
  severityScore: number;
  createdAt: string;
}

interface UserData {
  name: string;
  email: string;
  joinDate: Date | null;
  isGuest: boolean;
}

/* ------------------------------------------------------------------ */
/*  Animation helpers                                                  */
/* ------------------------------------------------------------------ */

function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  const offsets: Record<string, { x?: number; y?: number }> = {
    up: { y: 40 },
    down: { y: -40 },
    left: { x: -50 },
    right: { x: 50 },
  };

  return (
    <motion.div
      ref={ref}
      initial={
        shouldReduce
          ? { opacity: 0 }
          : { opacity: 0, ...offsets[direction] }
      }
      animate={
        isInView
          ? { opacity: 1, x: 0, y: 0 }
          : shouldReduce
            ? { opacity: 0 }
            : { opacity: 0, ...offsets[direction] }
      }
      transition={{
        duration: shouldReduce ? 0 : 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* Animated number counter */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1200;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {display}
      {suffix}
    </span>
  );
}

/* Relative time from date */
function relativeTime(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(months / 12);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

/* ------------------------------------------------------------------ */
/*  Level badge colors                                                 */
/* ------------------------------------------------------------------ */

const levelColors: Record<string, string> = {
  beginner: "bg-secondary/12 text-secondary",
  intermediate: "bg-primary/12 text-primary",
  advanced: "bg-accent/18 text-accent-foreground",
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

function Profile() {
  const navigate = useNavigate();
  const shouldReduce = useReducedMotion();

  /* ---- User data from API ---- */
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  /* ---- Local data ---- */
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [yogaSessions, setYogaSessions] = useState<YogaSession[]>([]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [activeTab, setActiveTab] = useState<"chat" | "yoga" | "mood">("chat");

  /* ---- Fetch real user ---- */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const role = localStorage.getItem("role");
    if (role === "guest") {
      setUserData({
        name: "Guest User",
        email: "guest@gitagyan.com",
        joinDate: null,
        isGuest: true,
      });
      setUserLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${Backend_Url}/user/me`, {
          headers: { Authorization: token },
        });
        const json = await res.json();
        if (json?.success && json?.data) {
          setUserData({
            name: json.data.name,
            email: json.data.email,
            joinDate: json.data.createdAt ? new Date(json.data.createdAt) : null,
            isGuest: false,
          });
        } else {
          // Token invalid — redirect
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch {
        // Network error or server down — show what we can
        setUserData({
          name: "User",
          email: "",
          joinDate: null,
          isGuest: false,
        });
      } finally {
        setUserLoading(false);
      }
    })();
  }, [navigate]);

  /* ---- Fetch yoga sessions from API ---- */
  useEffect(() => {
    const fetchYogaHistory = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) return;

      try {
        const res = await fetch(`${Backend_Url}/yoga/history/${uid}`);
        const data = await res.json();

        if (data.historyAvailable && data.sessions) {
          const flatYogaSessions: YogaSession[] = [];

          // Map the backend sessions (which are grouped by day) into a flat list of individual pose attempts
          for (const session of data.sessions) {
            if (session.posesAttempted && Array.isArray(session.posesAttempted)) {
              for (const attempt of session.posesAttempted) {
                // Look up static data from the catalog using the pose name
                const catalogPose = asanasData.find(
                  (a) => a.name === attempt.poseName
                );

                flatYogaSessions.push({
                  id: attempt._id || Date.now().toString(),
                  asanaId: catalogPose?.id || attempt.poseName,
                  asanaName: attempt.poseName,
                  sanskritName: catalogPose?.sanskritName || attempt.poseNameHindi || "",
                  level: catalogPose?.level || "beginner",
                  completedAt: attempt.timestamp || session.sessionDate,
                  duration: catalogPose?.totalDuration || 5, // Default 5 mins if not found
                  steps: catalogPose?.steps?.length || 0,
                });
              }
            }
          }

          flatYogaSessions.sort(
            (a, b) =>
              new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
          setYogaSessions(flatYogaSessions);
        }
      } catch (err) {
        console.error("Failed to fetch yoga history:", err);
      }
    };

    fetchYogaHistory();
  }, []);

  /* ---- Fetch mood history ---- */
  useEffect(() => {
    async function fetchMoodHistory() {
      const uid = localStorage.getItem("uid");
      if (!uid) return;
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${Backend_Url}/mood-check/result/${uid}`, {
          headers: { Authorization: token || "" }
        });
        const data = await response.json();
        if (data.success) {
          setMoodHistory(data.history);
        }
      } catch (error) {
        console.error("Error fetching mood history:", error);
      }
    }
    fetchMoodHistory();
  }, []);

  /* ---- Load chat sessions ---- */
  useEffect(() => {
    const savedSessions = localStorage.getItem("gitagyan-chat-sessions");
    if (savedSessions) {
      const sessions = (JSON.parse(savedSessions) as any[]).map((s) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        lastUpdated: new Date(s.lastUpdated),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      })) as ChatSession[];
      setChatSessions(sessions);
      setSelectedSessionId((cur) => cur ?? sessions[0]?.id ?? null);
    }
  }, []);

  /* ---- Computed values ---- */
  const totalQuestions = chatSessions.reduce(
    (sum, s) => sum + s.messages.filter((m) => m.type === "user").length,
    0
  );

  const filteredSessions = chatSessions.filter(
    (s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.messages.some((m) =>
        m.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const selectedSession =
    chatSessions.find((s) => s.id === selectedSessionId) ??
    filteredSessions[0] ??
    null;

  const totalYogaMinutes = yogaSessions.reduce((s, y) => s + y.duration, 0);
  const yogaLevelCount = new Set(yogaSessions.map((y) => y.level)).size;

  /* ---- Helpers ---- */
  const deleteSession = (id: string) => {
    const updated = chatSessions.filter((s) => s.id !== id);
    setChatSessions(updated);
    localStorage.setItem("gitagyan-chat-sessions", JSON.stringify(updated));
    if (selectedSessionId === id) setSelectedSessionId(updated[0]?.id ?? null);
  };

  const exportSession = (session: ChatSession) => {
    const content = `Chat Session: ${session.title}\nDate: ${session.createdAt.toLocaleDateString()}\n\n${session.messages
      .map(
        (m) =>
          `${m.type === "user" ? "You" : "GitaGyan"}: ${m.content}${m.verse
            ? `\n\nVerse: ${m.verse.sanskrit}\nTranslation: ${m.verse.meaning}`
            : ""
          }`
      )
      .join("\n\n")}`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, "_")}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("uid");
    localStorage.removeItem("role");
    navigate("/login");
  };

  /* ---- Avatar initials ---- */
  const initials = userData?.name
    ? userData.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  /* ---- Stagger variants ---- */
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 24 },
    },
  };

  /* ---------------------------------------------------------------- */
  /*  Skeleton loading state                                          */
  /* ---------------------------------------------------------------- */
  if (userLoading) {
    return (
      <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            {/* Hero skeleton */}
            <div className="app-surface animate-pulse p-8 sm:p-10">
              <div className="mb-4 h-5 w-28 rounded-full bg-muted/40" />
              <div className="space-y-3">
                <div className="h-10 w-4/5 rounded-xl bg-muted/30" />
                <div className="h-10 w-3/5 rounded-xl bg-muted/30" />
              </div>
              <div className="mt-6 h-5 w-full rounded-lg bg-muted/20" />
            </div>
            {/* Stat skeletons */}
            <div className="grid gap-4 sm:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="app-surface flex animate-pulse flex-col justify-between p-6"
                >
                  <div className="h-10 w-14 rounded-lg bg-muted/30" />
                  <div className="mt-3 h-4 w-24 rounded bg-muted/20" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
            {/* Sidebar skeleton */}
            <div className="app-surface animate-pulse p-8">
              <div className="mx-auto mb-4 h-24 w-24 rounded-[28px] bg-muted/30" />
              <div className="mx-auto h-6 w-36 rounded-lg bg-muted/25" />
              <div className="mx-auto mt-2 h-4 w-44 rounded bg-muted/15" />
              <div className="mt-6 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 rounded-[20px] bg-muted/20" />
                ))}
              </div>
            </div>
            {/* Content skeleton */}
            <div className="app-surface animate-pulse p-6">
              <div className="h-10 w-56 rounded-full bg-muted/25" />
              <div className="mt-6 space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-20 rounded-[24px] bg-muted/15" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Main render                                                      */
  /* ---------------------------------------------------------------- */
  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        {/* =========================================================
            HERO + STATS
        ========================================================= */}
        <section className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <ScrollReveal>
            <div
              className="relative overflow-hidden rounded-[30px] p-8 sm:p-10"
              style={{
                background: "linear-gradient(145deg, #2d4e43 0%, #1a3a30 45%, #8f4b2c 100%)",
                boxShadow: "0 24px 64px -20px rgba(44, 33, 18, 0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* Decorative circles */}
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-56 w-56 rounded-full opacity-[0.08]"
                style={{ background: "radial-gradient(circle, #d6ae58 0%, transparent 70%)" }}
              />
              <div
                className="pointer-events-none absolute -bottom-8 -left-8 h-40 w-40 rounded-full opacity-[0.06]"
                style={{ background: "radial-gradient(circle, #d6ae58 0%, transparent 70%)" }}
              />
              {/* Dot grid decoration */}
              <div className="pointer-events-none absolute right-6 top-6 grid grid-cols-4 gap-2 opacity-[0.12]">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div key={i} className="h-1.5 w-1.5 rounded-full bg-white" />
                ))}
              </div>

              <div className="relative z-10 flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="section-label mb-1" style={{ borderColor: "rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.1)", color: "#f5efe3" }}>
                    <span className="eyebrow-dot" style={{ background: "#d6ae58" }} />
                    Your profile
                  </div>

                  {/* Avatar in hero */}
                  <motion.div
                    className="hidden sm:block"
                    animate={shouldReduce ? {} : { y: [0, -6, 0] }}
                  >
                    <div
                      className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #d6ae58 0%, #c37f50 100%)",
                        boxShadow: "0 8px 24px -8px rgba(214,174,88,0.4)",
                      }}
                    >
                      <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-serif)" }}>
                        {initials}
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div>
                  <h1
                    className="display-font text-4xl font-semibold leading-[1.05] sm:text-5xl"
                    style={{ color: "#f5efe3" }}
                  >
                    Namaste, <span style={{ color: "#d6ae58" }}>{userData?.name?.split(" ")[0] ?? "Seeker"}</span>.
                  </h1>
                  <p className="mt-4 max-w-lg text-[0.95rem] leading-7" style={{ color: "rgba(245,239,227,0.7)" }}>
                    Your reflections, sessions, and progress — all in one peaceful space.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  {[
                    { label: "Chats", val: chatSessions.length },
                    { label: "Questions", val: totalQuestions },
                  ].map((m) => (
                    <div
                      key={m.label}
                      className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold"
                      style={{ background: "rgba(255,255,255,0.1)", color: "#f5efe3", backdropFilter: "blur(8px)" }}
                    >
                      <span style={{ color: "#d6ae58" }}>{m.val}</span>
                      {m.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ScrollReveal>

          <motion.div
            className="grid gap-4 sm:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {[
              {
                value: chatSessions.length,
                label: "Saved chats",
                desc: "Conversations preserved",
                icon: MessageCircle,
                gradient: "linear-gradient(135deg, #2d4e43, #3d6b5a)",
                glow: "rgba(45,78,67,0.25)",
              },
              {
                value: totalQuestions,
                label: "Questions",
                desc: "Reflections explored",
                icon: Star,
                gradient: "linear-gradient(135deg, #8f4b2c, #b5623a)",
                glow: "rgba(143,75,44,0.25)",
              },
              {
                value: yogaSessions.length,
                label: "Yoga sessions",
                desc: "Asanas practiced",
                icon: Flower2,
                gradient: "linear-gradient(135deg, #c37f50, #d6ae58)",
                glow: "rgba(214,174,88,0.25)",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  variants={staggerItem}
                  whileHover={
                    shouldReduce
                      ? {}
                      : {
                        y: -6,
                        scale: 1.02,
                        boxShadow: `0 32px 64px -20px ${item.glow}`,
                      }
                  }
                  className="app-surface group relative flex cursor-default flex-col overflow-hidden p-7 transition-all duration-300"
                >
                  {/* Gradient accent strip at top */}
                  <div
                    className="absolute left-0 right-0 top-0 h-1"
                    style={{ background: item.gradient }}
                  />

                  {/* Icon badge */}
                  <motion.div
                    className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md"
                    style={{
                      background: item.gradient,
                      boxShadow: `0 6px 16px -4px ${item.glow}`,
                    }}
                    whileHover={shouldReduce ? {} : { rotate: 8, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Icon className="h-5 w-5" />
                  </motion.div>

                  <p className="display-font text-4xl font-semibold text-foreground">
                    <AnimatedCounter value={item.value} />
                  </p>
                  <p className="mt-1 text-sm font-semibold text-foreground">
                    {item.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* =========================================================
            SIDEBAR + CONTENT
        ========================================================= */}
        <section className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          {/* ---------- Profile sidebar ---------- */}
          <ScrollReveal direction="left" delay={0.1}>
            <aside className="space-y-6 pb-4">
              <Card className="app-surface border-none bg-card/82">
                <CardContent className="p-8">
                  {/* Avatar with gradient ring */}
                  <div className="mb-6 text-center">
                    <motion.div
                      className="relative mx-auto h-24 w-24"
                      whileHover={shouldReduce ? {} : { scale: 1.06 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      {/* Gradient ring */}
                      <div
                        className="absolute inset-0 rounded-[28px]"
                        style={{
                          background: "var(--gradient-wisdom)",
                          padding: "3px",
                          borderRadius: "28px",
                        }}
                      >
                        <div className="flex h-full w-full items-center justify-center rounded-[25px] bg-background">
                          <span className="display-font text-2xl font-bold text-primary">
                            {initials}
                          </span>
                        </div>
                      </div>
                    </motion.div>

                    <h2 className="mt-4 text-2xl font-semibold capitalize text-foreground">
                      {userData?.name ?? "User"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {userData?.email ?? ""}
                    </p>
                    {userData?.isGuest && (
                      <Badge variant="outline" className="mt-2">
                        Guest session
                      </Badge>
                    )}
                  </div>

                  {/* Info rows */}
                  <motion.div
                    className="space-y-3"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    {[
                      ...(userData?.joinDate
                        ? [
                          {
                            icon: Calendar,
                            label: "Joined",
                            value: relativeTime(userData.joinDate),
                          },
                        ]
                        : []),
                      {
                        icon: MessageCircle,
                        label: "Questions asked",
                        value: `${totalQuestions}`,
                      },
                      {
                        icon: Flower2,
                        label: "Yoga sessions",
                        value: `${yogaSessions.length}`,
                      },
                      {
                        icon: Clock,
                        label: "Yoga time",
                        value: `${totalYogaMinutes} min`,
                      },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          variants={staggerItem}
                          whileHover={
                            shouldReduce
                              ? {}
                              : { x: 3, backgroundColor: "rgba(255,255,255,0.75)" }
                          }
                          className="flex items-center justify-between rounded-[20px] border border-border/70 bg-white/55 px-4 py-3 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="h-4 w-4 text-primary" />
                            <span className="text-sm text-muted-foreground">
                              {item.label}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {item.value}
                          </span>
                        </motion.div>
                      );
                    })}
                  </motion.div>

                  {/* Logout */}
                  <motion.div className="mt-6" whileTap={shouldReduce ? {} : { scale: 0.97 }}>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-destructive/20 text-destructive hover:bg-destructive/8"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </aside>
          </ScrollReveal>

          {/* ---------- Content panel ---------- */}
          <ScrollReveal direction="right" delay={0.15}>
            <Card className="app-surface border-none bg-card/82">
              <CardHeader className="pb-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {/* Tabs with animated indicator */}
                  <LayoutGroup>
                    <div className="relative flex flex-wrap gap-2">
                      {(["chat", "yoga", "mood"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => setActiveTab(tab)}
                          className="relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-colors"
                          style={{
                            color:
                              activeTab === tab
                                ? "var(--primary-foreground)"
                                : "var(--foreground)",
                          }}
                        >
                          {activeTab === tab && (
                            <motion.div
                              layoutId="profile-tab-pill"
                              className="absolute inset-0 rounded-full bg-primary"
                              style={{ zIndex: -1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                            />
                          )}
                          {tab === "chat" ? (
                            <MessageCircle className="h-4 w-4" />
                          ) : tab === "yoga" ? (
                            <Flower2 className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                          {tab === "chat" ? "Chat history" : tab === "yoga" ? "Yoga activity" : "Daily Check-ins"}
                        </button>
                      ))}
                    </div>
                  </LayoutGroup>

                  {/* Search (chat tab only) */}
                  <AnimatePresence>
                    {activeTab === "chat" && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.25 }}
                        className="relative w-full max-w-sm overflow-hidden"
                      >
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search conversations..."
                          className="h-11 rounded-full border-border/70 bg-white/65 pl-10"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <AnimatePresence mode="wait">
                  {activeTab === "chat" ? (
                    <motion.div
                      key="chat-content"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {filteredSessions.length === 0 ? (
                        <div className="rounded-[28px] border border-border/70 bg-white/55 p-10 text-center">
                          <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground" />
                          <h3 className="mt-4 text-xl font-semibold text-foreground">
                            No conversations found
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Start a new chat session or change the search term.
                          </p>
                        </div>
                      ) : (
                        <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
                          {/* Session list */}
                          <motion.div
                            className="space-y-3 lg:max-h-[800px] lg:overflow-y-auto chat-scroll pr-2"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {filteredSessions.map((session) => {
                              const isSelected =
                                selectedSessionId === session.id;
                              return (
                                <motion.button
                                  key={session.id}
                                  type="button"
                                  variants={staggerItem}
                                  whileHover={
                                    shouldReduce
                                      ? {}
                                      : {
                                        scale: 1.015,
                                        boxShadow:
                                          "0 8px 24px -12px rgba(44,33,18,0.25)",
                                      }
                                  }
                                  whileTap={shouldReduce ? {} : { scale: 0.98 }}
                                  onClick={() =>
                                    setSelectedSessionId(session.id)
                                  }
                                  className={cn(
                                    "w-full rounded-[24px] border p-4 text-left transition-all duration-200",
                                    isSelected
                                      ? "border-primary/30 bg-primary/8"
                                      : "border-border/70 bg-white/60 hover:border-primary/25 hover:bg-white/82"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <p className="font-semibold text-foreground">
                                        {session.title}
                                      </p>
                                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                        <span>
                                          {session.createdAt.toLocaleDateString()}
                                        </span>
                                        <span>
                                          {session.messages.length} messages
                                        </span>
                                      </div>
                                    </div>
                                    <motion.div
                                      animate={
                                        isSelected
                                          ? { x: 2, color: "var(--primary)" }
                                          : { x: 0 }
                                      }
                                      transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 20,
                                      }}
                                    >
                                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    </motion.div>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </motion.div>

                          {/* Selected session messages */}
                          <div className="rounded-[28px] border border-border/70 bg-white/60 p-5 flex flex-col">
                            {selectedSession ? (
                              <>
                                <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border/60 pb-4">
                                  <div>
                                    <h3 className="text-2xl font-semibold text-foreground">
                                      {selectedSession.title}
                                    </h3>
                                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                      <span>
                                        Started{" "}
                                        {selectedSession.createdAt.toLocaleDateString()}
                                      </span>
                                      <span>
                                        Updated{" "}
                                        {selectedSession.lastUpdated.toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <motion.div
                                      whileTap={shouldReduce ? {} : { scale: 0.9 }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() =>
                                          exportSession(selectedSession)
                                        }
                                        aria-label="Export chat session"
                                      >
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                    <motion.div
                                      whileTap={shouldReduce ? {} : { scale: 0.9 }}
                                    >
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        className="rounded-full"
                                        onClick={() =>
                                          deleteSession(selectedSession.id)
                                        }
                                        aria-label="Delete chat session"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </motion.div>
                                  </div>
                                </div>

                                <div className="mt-5 space-y-4 max-h-[600px] overflow-y-auto chat-scroll pr-4">
                                  {selectedSession.messages.map(
                                    (message, idx) => (
                                      <motion.div
                                        key={message.id}
                                        initial={
                                          shouldReduce
                                            ? {}
                                            : { opacity: 0, y: 10 }
                                        }
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                          delay: idx * 0.04,
                                          duration: 0.3,
                                        }}
                                        className={`flex ${message.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                          }`}
                                      >
                                        <div
                                          className={`max-w-3xl ${message.type === "user"
                                              ? "ml-12"
                                              : "mr-12"
                                            }`}
                                        >
                                          <div
                                            className={cn(
                                              "rounded-[24px] border px-4 py-3",
                                              message.type === "user"
                                                ? "border-primary/25 bg-primary text-primary-foreground"
                                                : "border-border/70 bg-background/80 text-foreground"
                                            )}
                                          >
                                            <div className="mb-2 flex items-center justify-between gap-3">
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={cn(
                                                    "text-xs font-semibold uppercase tracking-[0.18em]",
                                                    message.type === "user"
                                                      ? "text-primary-foreground/75"
                                                      : "text-muted-foreground"
                                                  )}
                                                >
                                                  {message.type === "user"
                                                    ? "You"
                                                    : "Guide"}
                                                </span>
                                                <span
                                                  className={cn(
                                                    "text-xs",
                                                    message.type === "user"
                                                      ? "text-primary-foreground/65"
                                                      : "text-muted-foreground"
                                                  )}
                                                >
                                                  {message.timestamp.toLocaleTimeString()}
                                                </span>
                                              </div>
                                              {message.category && (
                                                <Badge variant="outline">
                                                  {message.category}
                                                </Badge>
                                              )}
                                            </div>
                                            <div
                                              className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm leading-7 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>h1]:mt-4 [&>h1:first-child]:mt-0 [&>h2]:mt-3 [&>h3]:mt-2 [&>p]:mb-2 [&>p:last-child]:mb-0"
                                              dangerouslySetInnerHTML={{ __html: message.content }}
                                            />
                                          </div>

                                          {message.verse && (
                                            <motion.div
                                              initial={
                                                shouldReduce
                                                  ? {}
                                                  : { opacity: 0, scale: 0.96 }
                                              }
                                              animate={{
                                                opacity: 1,
                                                scale: 1,
                                              }}
                                              transition={{
                                                delay: idx * 0.04 + 0.15,
                                                duration: 0.35,
                                              }}
                                              className="mt-3 rounded-[22px] border border-border/70 bg-white/70 p-4"
                                            >
                                              <Badge variant="accent">
                                                Chapter{" "}
                                                {message.verse.chapter}, Verse{" "}
                                                {message.verse.verseNumber}
                                              </Badge>
                                              {message.verse.sanskrit ? (
                                                <p className="mt-3 text-sm leading-8 text-foreground">
                                                  {message.verse.sanskrit}
                                                </p>
                                              ) : null}
                                              <p className="mt-2 text-sm italic leading-7 text-muted-foreground">
                                                {message.verse.meaning}
                                              </p>
                                            </motion.div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )
                                  )}
                                </div>
                              </>
                            ) : (
                              <div className="rounded-[24px] border border-border/70 bg-white/55 p-6 text-sm leading-7 text-muted-foreground">
                                Pick a saved conversation to inspect the messages
                                and any linked verse references.
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : activeTab === "yoga" ? (
                    /* ---- Yoga tab ---- */
                    <motion.div
                      key="yoga-content"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {yogaSessions.length === 0 ? (
                        <div className="rounded-[28px] border border-border/70 bg-white/55 p-10 text-center">
                          <Flower2 className="mx-auto h-10 w-10 text-muted-foreground" />
                          <h3 className="mt-4 text-xl font-semibold text-foreground">
                            No yoga sessions yet
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Complete yoga flows to see them summarized here.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Yoga stats */}
                          <motion.div
                            className="grid gap-4 md:grid-cols-3"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {[
                              {
                                icon: Flower2,
                                label: "Total sessions",
                                value: yogaSessions.length,
                                suffix: "",
                              },
                              {
                                icon: Clock,
                                label: "Total time",
                                value: totalYogaMinutes,
                                suffix: " min",
                              },
                              {
                                icon: TrendingUp,
                                label: "Levels completed",
                                value: yogaLevelCount,
                                suffix: "",
                              },
                            ].map((item) => {
                              const Icon = item.icon;
                              return (
                                <motion.div
                                  key={item.label}
                                  variants={staggerItem}
                                  whileHover={
                                    shouldReduce
                                      ? {}
                                      : {
                                        y: -3,
                                        boxShadow:
                                          "0 14px 36px -16px rgba(44,33,18,0.3)",
                                      }
                                  }
                                  className="rounded-[24px] border border-border/70 bg-white/55 p-5 transition-shadow"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <div>
                                      <p className="text-sm text-muted-foreground">
                                        {item.label}
                                      </p>
                                      <p className="mt-2 text-2xl font-semibold text-foreground">
                                        <AnimatedCounter
                                          value={item.value}
                                          suffix={item.suffix}
                                        />
                                      </p>
                                    </div>
                                    <motion.div
                                      animate={
                                        shouldReduce
                                          ? {}
                                          : {
                                            scale: [1, 1.08, 1],
                                          }
                                      }
                                      transition={{
                                        repeat: Infinity,
                                        duration: 3,
                                        ease: "easeInOut",
                                      }}
                                    >
                                      <Icon className="h-7 w-7 text-primary" />
                                    </motion.div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </motion.div>

                          {/* Yoga session cards */}
                          <motion.div
                            className="mt-6 grid gap-4 max-h-[500px] overflow-y-auto chat-scroll pr-2"
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                          >
                            {yogaSessions.map((session) => (
                              <motion.div
                                key={session.id}
                                variants={staggerItem}
                                whileHover={
                                  shouldReduce
                                    ? {}
                                    : {
                                      scale: 1.01,
                                      boxShadow:
                                        "0 14px 40px -18px rgba(44,33,18,0.3)",
                                    }
                                }
                                className="rounded-[26px] border border-border/70 bg-white/60 p-5 transition-shadow"
                              >
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                  <div>
                                    <div className="flex flex-wrap items-center gap-3">
                                      <h3 className="text-lg font-semibold text-foreground">
                                        {session.asanaName}
                                      </h3>
                                      <motion.span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${levelColors[session.level]}`}
                                        whileHover={
                                          shouldReduce
                                            ? {}
                                            : { scale: 1.08 }
                                        }
                                      >
                                        {session.level}
                                      </motion.span>
                                    </div>
                                    <p className="mt-1 text-sm italic text-muted-foreground">
                                      {session.sanskritName}
                                    </p>
                                    <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                      <span>
                                        {new Date(
                                          session.completedAt
                                        ).toLocaleDateString()}
                                      </span>
                                      <span>{session.duration} minutes</span>
                                      <span>{session.steps} steps</span>
                                    </div>
                                  </div>

                                  <motion.div
                                    className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
                                    whileHover={
                                      shouldReduce
                                        ? {}
                                        : { rotate: 15, scale: 1.1 }
                                    }
                                    transition={{
                                      type: "spring",
                                      stiffness: 300,
                                      damping: 15,
                                    }}
                                  >
                                    <Flower2 className="h-5 w-5" />
                                  </motion.div>
                                </div>
                              </motion.div>
                            ))}
                          </motion.div>
                        </>
                      )}
                    </motion.div>
                  ) : (
                    /* ---- Mood tab ---- */
                    <motion.div
                      key="mood-content"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.25 }}
                    >
                      {moodHistory.length === 0 ? (
                        <div className="rounded-[28px] border border-border/70 bg-white/55 p-10 text-center">
                          <Activity className="mx-auto h-10 w-10 text-muted-foreground" />
                          <h3 className="mt-4 text-xl font-semibold text-foreground">
                            No check-ins yet
                          </h3>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">
                            Complete your first daily reflection to see your progress here.
                          </p>
                          <Button asChild className="mt-6 rounded-full px-8">
                            <Link to="/check-in">Start Check-in</Link>
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto chat-scroll pr-2">
                          {moodHistory.map((entry) => {
                            const isSevere = entry.severityLevel === "Severe";
                            const isModerate = entry.severityLevel === "Moderate";
                            return (
                              <motion.div
                                key={entry._id}
                                variants={staggerItem}
                                whileHover={
                                  shouldReduce
                                    ? {}
                                    : { scale: 1.01, boxShadow: "0 14px 40px -18px rgba(44,33,18,0.3)" }
                                }
                                className="flex items-center justify-between rounded-[26px] border border-border/70 bg-white/60 p-5"
                              >
                                <div className="flex items-center gap-4">
                                  <div className={cn(
                                    "p-3 rounded-2xl",
                                    isSevere ? "bg-destructive/10 text-destructive" :
                                      isModerate ? "bg-amber-500/10 text-amber-600" :
                                        "bg-emerald-500/10 text-emerald-600"
                                  )}>
                                    {isSevere ? <ShieldAlert className="w-6 h-6" /> :
                                      isModerate ? <AlertCircle className="w-6 h-6" /> :
                                        <CheckCircle2 className="w-6 h-6" />}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="font-bold text-foreground">
                                        {entry.moodType === "HEU" ? "High Energy Unpleasant" :
                                          entry.moodType === "LEU" ? "Low Energy Unpleasant" :
                                            entry.moodType === "HEP" ? "High Energy Pleasant" :
                                              "Low Energy Pleasant"}
                                      </h4>
                                      <Badge className={cn(
                                        "text-[10px]",
                                        isSevere ? "bg-destructive/10 text-destructive border-destructive/20" :
                                          isModerate ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                            "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                      )}>
                                        {entry.severityLevel}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(entry.createdAt).toLocaleDateString()} at {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                                <div className="hidden sm:block text-right">
                                  <p className="text-sm font-black text-foreground/80">Score: {entry.severityScore}</p>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </ScrollReveal>
        </section>
      </div>
    </div>
  );
}

export default Profile;
