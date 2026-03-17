import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  BookOpenText,
  Bot,
  LoaderCircle,
  MicIcon,
  Plus,
  Send,
  Sparkles,
  User,
  Volume2Icon,
  VolumeOffIcon,
  Waves,
} from "lucide-react";
import { toast } from "sonner";

import { useSpeechToText } from "@/Hooks/useSpeechToText";
import { BrandMark } from "@/components/BrandMark";
import { TextShimmerWave } from "@/components/magicui/text-shimmer-wave";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/context/Language";
import { cn } from "@/lib/utils";
import { Backend_Url } from "@/utils/constant";

/* ── animation variants (matching Home.tsx) ── */
const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: easeOutCurve },
  },
};

const fadeIn = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: easeOutCurve },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.18 },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.02,
    },
  },
};

const messageBubble = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.32, ease: easeOutCurve },
  },
};

/* ── types ── */
type ChatRole = "user" | "assistant";

interface AssistantResponse {
  ui_component: string;
  component_params?: Record<string, unknown>;
  insight_text: string;
  follow_up_suggestion: string | null;
  gita_reference: string | null;
  recommended_practices?: string[];
  helplines?: string[];
}

interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  language: string;
  timestamp: string;
  response?: AssistantResponse;
}

interface ThinkingStep {
  id: string;
  label: string;
  timestamp: string;
}

interface SessionMeta {
  messageCount: number;
  createdAt: string;
  lastActive: string;
  moodTimeline?: Array<{
    date: string;
    emotion?: string;
    severity?: number;
  }>;
}

/* ── constants ── */
const ACTIVE_SESSION_STORAGE_KEY = "gitagyan-ai-session-id";
const LOCAL_CHAT_ARCHIVE_KEY = "gitagyan-chat-sessions";

/* ── helpers ── */
function createSessionId() {
  return globalThis.crypto?.randomUUID?.() ?? `session-${Date.now()}`;
}

function formatClock(value?: string) {
  if (!value) return "Just now";
  return new Date(value).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(value?: string) {
  if (!value) return "Today";
  return new Date(value).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function parseSseBlock(block: string) {
  const lines = block.split("\n");
  let event = "message";
  const dataLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      dataLines.push(line.slice(5).trim());
    }
  }

  if (!dataLines.length) return null;

  try {
    return {
      event,
      data: JSON.parse(dataLines.join("\n")),
    };
  } catch {
    return null;
  }
}

function parseFinalAssistantPayload(raw: string) {
  if (!raw.trim()) return null;

  try {
    return JSON.parse(raw) as AssistantResponse;
  } catch {
    const cleaned = raw.replace(/```json\n?|\n?```/g, "").trim();
    try {
      return JSON.parse(cleaned) as AssistantResponse;
    } catch {
      return null;
    }
  }
}

function extractInsightPreview(raw: string) {
  const match = raw.match(/"insight_text"\s*:\s*"([\s\S]*)$/);
  if (!match) return "";

  let value = match[1];
  const closingQuoteIndex = value.search(/(?<!\\)"/);
  if (closingQuoteIndex !== -1) {
    value = value.slice(0, closingQuoteIndex);
  }

  return value
    .replace(/\\"/g, "\"")
    .replace(/\\n/g, "\n")
    .replace(/\\\\/g, "\\");
}

function parseVerseReference(reference: string | null | undefined) {
  if (!reference) return null;
  const [chapter, verse] = reference.split(".").map((value) => Number(value));
  if (!Number.isFinite(chapter) || !Number.isFinite(verse)) return null;
  return { chapter, verse };
}

function persistLocalSessionArchive(sessionId: string, messages: ChatMessage[]) {
  if (!messages.length) return;

  const firstUserMessage = messages.find((message) => message.role === "user");
  if (!firstUserMessage) return;

  const title =
    firstUserMessage.content.length > 56
      ? `${firstUserMessage.content.slice(0, 56)}...`
      : firstUserMessage.content;

  let archive: any[] = [];
  try {
    archive = JSON.parse(localStorage.getItem(LOCAL_CHAT_ARCHIVE_KEY) ?? "[]");
  } catch {
    archive = [];
  }

  const existingIndex = archive.findIndex((session) => session.id === sessionId);
  const existing = existingIndex >= 0 ? archive[existingIndex] : null;

  const nextSession = {
    id: sessionId,
    title,
    createdAt: existing?.createdAt ?? firstUserMessage.timestamp,
    lastUpdated: messages[messages.length - 1]?.timestamp ?? new Date().toISOString(),
    messages: messages.map((message) => {
      const verse = parseVerseReference(message.response?.gita_reference);

      return {
        id: message.id,
        type: message.role === "user" ? "user" : "bot",
        content: message.content,
        category: message.response?.ui_component,
        timestamp: message.timestamp,
        verse: verse
          ? {
              sanskrit: "",
              english: message.response?.gita_reference ?? "",
              meaning: message.response?.insight_text ?? message.content,
              chapter: verse.chapter,
              verseNumber: verse.verse,
            }
          : undefined,
      };
    }),
  };

  if (existingIndex >= 0) {
    archive[existingIndex] = nextSession;
  } else {
    archive.unshift(nextSession);
  }

  localStorage.setItem(LOCAL_CHAT_ARCHIVE_KEY, JSON.stringify(archive.slice(0, 15)));
}

/* ── shimmer skeleton rows ── */
function ShimmerSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {[
        { w: "w-3/5", h: "h-10" },
        { w: "w-4/5", h: "h-14" },
        { w: "w-2/5", h: "h-10" },
      ].map((row, i) => (
        <div
          key={i}
          className={cn(
            "chat-shimmer rounded-[16px]",
            row.w,
            row.h,
            i % 2 === 0 ? "" : "ml-auto"
          )}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </motion.div>
  );
}

/* ── main component ── */
export function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [thinkingSteps, setThinkingSteps] = useState<ThinkingStep[]>([]);
  const [draftInsight, setDraftInsight] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [sessionMeta, setSessionMeta] = useState<SessionMeta | null>(null);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [moodContext, setMoodContext] = useState<any>(null);
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const streamAbortRef = useRef<AbortController | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const { language } = useLanguage();
  const { listening, transcript, startListening } = useSpeechToText();

  useEffect(() => {
    if (location.state?.moodContext) {
      setMoodContext(location.state.moodContext);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const suggestions =
    language === "hi"
      ? [
          "मैं बहुत बेचैन महसूस कर रहा हूँ और शांत नहीं हो पा रहा।",
          "असफलता के डर के साथ मैं कैसे आगे बढ़ूँ?",
          "आज के तनाव को एक शांत अगले कदम में बदलने में मदद करो।",
        ]
      : [
          "I feel overwhelmed and need one calming next step.",
          "How do I stay steady when I'm scared of failing?",
          "Help me respond to stress without spiraling.",
        ];

  const latestThinkingStep = thinkingSteps[thinkingSteps.length - 1]?.label;

  /* ── effects ── */
  useEffect(() => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;

    const frame = window.requestAnimationFrame(() => {
      viewport.scrollTo({
        top: viewport.scrollHeight,
        behavior: "smooth",
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [messages, draftInsight, thinkingSteps, isHistoryLoading]);

  useEffect(() => {
    if (transcript?.trim()) {
      setInputValue(transcript.trim());
    }
  }, [transcript]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const storedToken = localStorage.getItem("token");
    const resolvedToken = urlToken ?? storedToken;

    if (urlToken) {
      localStorage.setItem("token", urlToken);
      window.history.replaceState({}, document.title, window.location.pathname);
      toast.success("Welcome back.");
    }

    if (!resolvedToken) {
      navigate("/login");
      return;
    }

    if (!localStorage.getItem("uid") && localStorage.getItem("role") !== "guest") {
      void fetch(`${Backend_Url}/user/me`, {
        headers: {
          Authorization: resolvedToken,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Could not resolve user profile.");
          }
          return response.json();
        })
        .then((payload) => {
          const userId = payload?.data?._id;
          if (typeof userId === "string" && userId) {
            localStorage.setItem("uid", userId);
          }
        })
        .catch((error) => {
          console.error("profile bootstrap error:", error);
        });
    }

    const storedSessionId = localStorage.getItem(ACTIVE_SESSION_STORAGE_KEY) ?? createSessionId();
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, storedSessionId);
    setSessionId(storedSessionId);

    return () => {
      streamAbortRef.current?.abort();
    };
  }, [navigate]);

  useEffect(() => {
    if (!sessionId) return;

    const loadHistory = async () => {
      setIsHistoryLoading(true);
      try {
        const authToken = localStorage.getItem("token");
        if (!authToken) return;

        const response = await fetch(`${Backend_Url}/ai/history/${sessionId}?limit=20`, {
          headers: {
            Authorization: authToken,
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load session history.");
        }

        const json = await response.json();
        const history = Array.isArray(json?.history) ? json.history : [];

        setMessages(
          history.map((message: any, index: number) => ({
            id: `${sessionId}-${index}-${message.timestamp ?? Date.now()}`,
            role: message.role === "assistant" ? "assistant" : "user",
            content: message.content,
            language,
            timestamp: message.timestamp ?? new Date().toISOString(),
          }))
        );
        setSessionMeta(json?.session ?? null);
      } catch (error) {
        console.error("History load error:", error);
      } finally {
        setIsHistoryLoading(false);
      }
    };

    void loadHistory();
  }, [language, sessionId]);

  useEffect(() => {
    if (sessionId && messages.length) {
      persistLocalSessionArchive(sessionId, messages);
    }
  }, [messages, sessionId]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        if (audio.src.startsWith("blob:")) {
          URL.revokeObjectURL(audio.src);
        }
      }
    };
  }, [audio]);

  /* ── handlers ── */
  const stopAudio = () => {
    if (audio) {
      audio.pause();
      if (audio.src.startsWith("blob:")) {
        URL.revokeObjectURL(audio.src);
      }
      setAudio(null);
    }
    setSpeakingMessageId(null);
  };

  const handleSpeak = async (messageId: string, text: string) => {
    if (speakingMessageId === messageId) {
      stopAudio();
      return;
    }

    const authToken = localStorage.getItem("token");
    if (!authToken) return;

    try {
      stopAudio();

      const response = await fetch(`${Backend_Url}/google-tts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ text, language }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const nextAudio = new Audio(url);
      nextAudio.onended = () => {
        URL.revokeObjectURL(url);
        setSpeakingMessageId(null);
        setAudio(null);
      };

      await nextAudio.play();
      setAudio(nextAudio);
      setSpeakingMessageId(messageId);
    } catch (error) {
      console.error("Text to speech error:", error);
      toast.error("Unable to play audio right now.");
    }
  };

  const handleNewSession = () => {
    streamAbortRef.current?.abort();
    stopAudio();

    const nextSessionId = createSessionId();
    localStorage.setItem(ACTIVE_SESSION_STORAGE_KEY, nextSessionId);

    setSessionId(nextSessionId);
    setMessages([]);
    setThinkingSteps([]);
    setDraftInsight("");
    setSessionMeta(null);
    setIsStreaming(false);
    toast.success("Started a new chat session.");
  };

  const handleSendMessage = async () => {
    const content = inputValue.trim();
    if (!content || !sessionId || isStreaming) return;

    const authToken = localStorage.getItem("token");
    if (!authToken) {
      navigate("/login");
      return;
    }

    stopAudio();
    streamAbortRef.current?.abort();

    const controller = new AbortController();
    streamAbortRef.current = controller;

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content,
      language,
      timestamp: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, userMessage]);
    setInputValue("");
    setThinkingSteps([]);
    setDraftInsight("");
    setIsStreaming(true);

    let rawResponse = "";
    let finalResponse: AssistantResponse | null = null;

    try {
      const response = await fetch(`${Backend_Url}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
        body: JSON.stringify({ message: content, sessionId, moodContext }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let errorMessage = "Unable to start the chat stream.";
        try {
          const json = await response.json();
          errorMessage = json?.error ?? json?.message ?? errorMessage;
        } catch {
          // Ignore JSON parse failures for non-JSON responses.
        }
        throw new Error(errorMessage);
      }

      if (!response.body) {
        throw new Error("Streaming is not available in this browser.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split("\n\n");
        buffer = blocks.pop() ?? "";

        for (const block of blocks) {
          const parsed = parseSseBlock(block);
          if (!parsed) continue;

          if (parsed.event === "thinking") {
            setThinkingSteps((previous) => [
              ...previous,
              {
                id: `${Date.now()}-${previous.length}`,
                label: parsed.data.message,
                timestamp: new Date().toISOString(),
              },
            ]);
            continue;
          }

          if (parsed.event === "token") {
            rawResponse += parsed.data.chunk ?? "";
            const preview = extractInsightPreview(rawResponse);
            if (preview) {
              setDraftInsight(preview);
            }
            continue;
          }

          if (parsed.event === "done") {
            finalResponse = parsed.data as AssistantResponse;
            continue;
          }

          if (parsed.event === "error") {
            throw new Error(parsed.data.message ?? "Something went wrong. Please try again.");
          }
        }
      }

      if (!finalResponse && rawResponse) {
        finalResponse = parseFinalAssistantPayload(rawResponse);
      }

      if (!finalResponse) {
        throw new Error("The assistant returned an empty response.");
      }

      const assistantMessage: ChatMessage = {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: finalResponse.insight_text || "I need a moment. Please try again.",
        language,
        timestamp: new Date().toISOString(),
        response: finalResponse,
      };

      setMessages((previous) => [...previous, assistantMessage]);
      setSessionMeta((previous) => ({
        messageCount: (previous?.messageCount ?? 0) + 2,
        createdAt: previous?.createdAt ?? new Date().toISOString(),
        lastActive: new Date().toISOString(),
        moodTimeline: previous?.moodTimeline ?? [],
      }));
      setThinkingSteps((previous) => [
        ...previous,
        {
          id: `${Date.now()}-done`,
          label: "Response ready.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error: any) {
      if (error?.name === "AbortError") {
        return;
      }

      console.error("Chat stream error:", error);
      toast.error(error?.message ?? "Unable to send message.");

      const fallbackResponse: AssistantResponse = {
        ui_component: "insight",
        component_params: {},
        insight_text: "Take a breath. Something went wrong on our end, but you can try again.",
        follow_up_suggestion: "breathing",
        gita_reference: null,
        recommended_practices: [],
      };

      setMessages((previous) => [
        ...previous,
        {
          id: `${Date.now()}-fallback`,
          role: "assistant",
          content: fallbackResponse.insight_text,
          language,
          timestamp: new Date().toISOString(),
          response: fallbackResponse,
        },
      ]);
    } finally {
      streamAbortRef.current = null;
      setIsStreaming(false);
      setDraftInsight("");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSendMessage();
    }
  };

  /* ── render ── */
  return (
    <div className="px-4 pb-6 pt-6 sm:px-6 lg:h-[calc(100vh-4rem)] lg:overflow-hidden lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:h-full lg:grid-cols-[17rem_minmax(0,1fr)_20rem]">
        {/* ── left sidebar ── */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: easeOutCurve }}
          className="chat-scroll order-2 flex flex-col gap-6 overflow-y-auto lg:order-1 lg:pr-2"
        >
          <Card className="app-surface shrink-0 border-none bg-card/82">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Current Session</p>
                  <p className="text-xs text-muted-foreground">ID ending in {sessionId.slice(-8) || "pending"}</p>
                </div>
                <Badge variant="accent">Live</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[20px] border border-border/70 bg-white/55 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Last active</p>
                <p className="mt-1 text-base font-semibold text-foreground">{formatDate(sessionMeta?.lastActive)}</p>
                <p className="text-xs text-muted-foreground">{formatClock(sessionMeta?.lastActive)}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-[18px] border border-border/70 bg-white/55 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Messages</p>
                  <p className="mt-1 text-xl font-semibold text-foreground">{sessionMeta?.messageCount ?? messages.length}</p>
                </div>
                <div className="rounded-[18px] border border-border/70 bg-white/55 p-3">
                  <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Mood</p>
                  <p className="mt-1 text-xs font-semibold capitalize text-foreground">{sessionMeta?.moodTimeline?.[sessionMeta.moodTimeline.length - 1]?.emotion ?? "Not set"}</p>
                </div>
              </div>

              <Button className="w-full rounded-full" onClick={handleNewSession}>
                <Plus className="h-4 w-4" />
                Start New Session
              </Button>
            </CardContent>
          </Card>

          <Card className="app-surface shrink-0 border-none bg-card/82">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prompt ideas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setInputValue(suggestion)}
                  className="w-full rounded-[18px] border border-border/70 bg-white/60 px-3 py-3 text-left text-sm leading-6 text-foreground transition-colors duration-200 hover:border-primary/30 hover:bg-white/80"
                >
                  {suggestion}
                </motion.button>
              ))}
            </CardContent>
          </Card>
        </motion.aside>

        {/* ── main chat area ── */}
        <motion.main
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: easeOutCurve }}
          className="order-1 flex min-h-0 flex-col lg:order-2"
        >
          <Card className="app-surface flex min-h-[75vh] flex-1 flex-col border-none bg-card/85 lg:min-h-0">
            <CardHeader className="shrink-0 border-b border-border/60 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <BrandMark className="h-12 w-12 rounded-[1.2rem]" iconClassName="h-7 w-7" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="display-font text-3xl font-semibold leading-none text-foreground">Sacred Dialogue</h1>
                      <Badge variant="outline" className="text-[10px]">Streaming</Badge>
                    </div>
                    <p className="mt-1 max-w-xl text-xs leading-5 text-muted-foreground">
                      See the assistant think, retrieve, and compose before the final answer arrives.
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-border/70 bg-white/60 px-3 py-1.5 text-xs text-muted-foreground">
                  {listening ? "Listening..." : "Enter to send · Shift+Enter for a new line"}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex min-h-0 flex-1 flex-col px-0 pb-0">
              <div ref={messagesViewportRef} className="chat-scroll flex-1 overflow-y-auto px-4 py-4 sm:px-5">
                <AnimatePresence mode="wait">
                  {isHistoryLoading ? (
                    <ShimmerSkeleton key="shimmer" />
                  ) : messages.length === 0 ? (
                    /* ── empty state ── */
                    <motion.div
                      key="empty"
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                      className="flex h-full flex-col justify-center gap-5 px-1 py-8"
                    >
                      <motion.div variants={fadeUp} className="max-w-2xl">
                        <Badge variant="accent">Begin here</Badge>
                        <h2 className="mt-3 display-font text-3xl font-semibold text-foreground sm:text-4xl">
                          Ask what hurts, what matters, or what comes next.
                        </h2>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                          The assistant will stream its reasoning stages and then return a structured response with a practical next step.
                        </p>
                      </motion.div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {suggestions.map((suggestion, i) => (
                          <motion.button
                            key={suggestion}
                            variants={fadeUp}
                            custom={i}
                            type="button"
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setInputValue(suggestion)}
                            className="rounded-[20px] border border-border/70 bg-white/60 p-4 text-left transition-colors duration-200 hover:border-primary/30 hover:bg-white/80"
                          >
                            <div className="mb-2 inline-flex rounded-full border border-primary/15 bg-primary/8 p-1.5 text-primary">
                              <Sparkles className="h-3.5 w-3.5" />
                            </div>
                            <p className="text-sm leading-6 text-foreground">{suggestion}</p>
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    /* ── messages list ── */
                    <motion.div
                      key="messages"
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      {messages.map((message) => {
                        const isUser = message.role === "user";
                        return (
                          <motion.div
                            key={message.id}
                            variants={messageBubble}
                            initial="hidden"
                            animate="visible"
                            layout
                            className={cn("flex gap-2.5", isUser ? "justify-end" : "justify-start")}
                          >
                            {!isUser && (
                              <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary sm:flex">
                                <Bot className="h-3.5 w-3.5" />
                              </div>
                            )}

                            <div
                              className={cn(
                                "max-w-2xl rounded-[20px] border px-4 py-3 shadow-sm",
                                isUser
                                  ? "border-primary/25 bg-primary text-primary-foreground"
                                  : "border-border/70 bg-white/72 text-foreground"
                              )}
                            >
                              <div className="mb-1.5 flex items-center gap-2">
                                <span className={cn("text-[10px] font-semibold uppercase tracking-[0.16em]", isUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                                  {isUser ? "You" : "Guide"}
                                </span>
                                <span className={cn("text-[10px]", isUser ? "text-primary-foreground/55" : "text-muted-foreground/70")}>
                                  {formatClock(message.timestamp)}
                                </span>
                                {!isUser && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="ml-auto h-6 w-6 rounded-full text-muted-foreground/70 hover:bg-background/80"
                                    onClick={() => void handleSpeak(message.id, message.content)}
                                    aria-label={speakingMessageId === message.id ? "Stop audio playback" : "Play response audio"}
                                  >
                                    {speakingMessageId === message.id ? <VolumeOffIcon className="h-3 w-3" /> : <Volume2Icon className="h-3 w-3" />}
                                  </Button>
                                )}
                              </div>

                              <div 
                                className="whitespace-pre-wrap text-sm leading-6 [&>ul]:list-disc [&>ul]:pl-5 [&>h1]:mt-4 [&>h1:first-child]:mt-0"
                                dangerouslySetInnerHTML={{ __html: message.content }} 
                              />

                              {!isUser && message.response && (
                                <motion.div
                                  initial={{ opacity: 0, y: 4 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.15, duration: 0.25 }}
                                  className="mt-2.5 flex flex-wrap gap-1.5"
                                >
                                  <Badge variant="outline" className="text-[10px]">{message.response.ui_component}</Badge>
                                  {message.response.follow_up_suggestion && (
                                    <Badge variant="accent" className="text-[10px]">{message.response.follow_up_suggestion}</Badge>
                                  )}
                                  {message.response.gita_reference && (
                                    <Badge variant="outline" className="text-[10px]">Gita {message.response.gita_reference}</Badge>
                                  )}
                                </motion.div>
                              )}

                              {!isUser && message.response?.recommended_practices?.length ? (
                                <div className="mt-3 rounded-[14px] border border-primary/18 bg-primary/6 p-3">
                                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                                    Recommended next steps
                                  </p>
                                  <ul className="mt-2 space-y-1 text-sm leading-6 text-foreground">
                                    {message.response.recommended_practices.map((practice) => (
                                      <li key={practice}>{practice}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}

                              {!isUser && message.response?.helplines?.length ? (
                                <div className="mt-3 rounded-[14px] border border-destructive/25 bg-destructive/8 p-3">
                                  <p className="text-xs font-semibold text-foreground">Immediate support</p>
                                  <ul className="mt-1.5 space-y-1 text-sm leading-6 text-muted-foreground">
                                    {message.response.helplines.map((helpline) => (
                                      <li key={helpline}>{helpline}</li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>

                            {isUser && (
                              <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-white/75 text-primary sm:flex">
                                <User className="h-3.5 w-3.5" />
                              </div>
                            )}
                          </motion.div>
                        );
                      })}

                      {/* ── thinking pill ── */}
                      <AnimatePresence>
                        {(isStreaming || draftInsight) && (
                          <motion.div
                            key="thinking-pill"
                            initial={{ opacity: 0, y: 8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.95 }}
                            transition={{ duration: 0.25, ease: easeOutCurve }}
                            className="flex gap-2.5"
                          >
                            <div className="hidden h-7 w-7 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-primary/8 text-primary sm:flex">
                              <Bot className="h-3.5 w-3.5" />
                            </div>

                            <div className="max-w-md rounded-[16px] border border-primary/15 bg-primary/5 px-3 py-2">
                              <div className="flex items-center gap-2">
                                <span className="animate-pulse-dot inline-flex h-2 w-2 rounded-full bg-primary" />
                                <TextShimmerWave
                                  className="text-xs font-medium [--base-color:var(--muted-foreground)] [--base-gradient-color:var(--primary)]"
                                  duration={1.2}
                                  spread={1.5}
                                  zDistance={4}
                                  yDistance={-1}
                                  scaleDistance={1.02}
                                  rotateYDistance={4}
                                >
                                  {latestThinkingStep || "Preparing a response..."}
                                </TextShimmerWave>
                              </div>
                              {draftInsight && (
                                <motion.p
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 0.7, height: "auto" }}
                                  className="mt-1.5 text-xs leading-5 text-foreground/60"
                                >
                                  {draftInsight.length > 120 ? `${draftInsight.slice(0, 120)}...` : draftInsight}
                                </motion.p>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── input area ── */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1, ease: easeOutCurve }}
                className="border-t border-border/60 p-3 sm:p-4"
              >
                <div className="chat-input-wrap rounded-[22px] border border-border/70 bg-white/60 p-2.5">
                  <Textarea
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      language === "hi"
                        ? "अपना प्रश्न, भावना या वर्तमान उलझन लिखें..."
                        : "Share what you're carrying, questioning, or trying to understand..."
                    }
                    className="min-h-20 resize-none border-none bg-transparent shadow-none focus-visible:ring-0"
                  />

                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Waves className="h-3.5 w-3.5 text-primary" />
                      {listening ? "Voice capture active" : "Voice & audio available"}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full border-border/70 bg-white/70"
                          onClick={() => startListening()}
                          aria-label="Start speech to text"
                        >
                          {listening ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <MicIcon className="h-3.5 w-3.5" />}
                        </Button>
                      </motion.div>

                      <motion.div whileTap={{ scale: 0.9 }}>
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          disabled={!inputValue.trim() || isStreaming}
                          onClick={() => void handleSendMessage()}
                          aria-label="Send message"
                        >
                          {isStreaming ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.main>

        {/* ── right sidebar ── */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.06, ease: easeOutCurve }}
          className="chat-scroll order-3 flex flex-col gap-6 overflow-y-auto lg:pr-2"
        >
          <Card className="app-surface shrink-0 border-none bg-card/82">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-[16px] border border-primary/15 bg-primary/8 p-2.5 text-primary">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-base">Thinking Trace</CardTitle>
                  <p className="text-[11px] text-muted-foreground">Streamed reasoning stages</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <AnimatePresence mode="popLayout">
                {thinkingSteps.length ? (
                  thinkingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.22, ease: easeOutCurve }}
                      className="rounded-[16px] border border-border/70 bg-white/60 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "inline-flex h-2 w-2 rounded-full",
                            index === thinkingSteps.length - 1 && isStreaming ? "animate-pulse-dot bg-primary" : "bg-primary/40"
                          )}
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground">{step.label}</p>
                          <p className="text-[10px] text-muted-foreground">{formatClock(step.timestamp)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    key="empty-trace"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible"
                    className="rounded-[18px] border border-border/70 bg-white/55 p-3 text-xs leading-5 text-muted-foreground"
                  >
                    Send a message to see reasoning stages here.
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>

          <Card className="app-surface shrink-0 border-none bg-card/82">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2.5">
                <div className="rounded-[16px] border border-primary/15 bg-primary/8 p-2.5 text-primary">
                  <BookOpenText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <CardTitle className="text-base">Session Notes</CardTitle>
                  <p className="text-[11px] text-muted-foreground">Session metadata</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-[18px] border border-border/70 bg-white/55 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Created</p>
                <p className="mt-1 text-xs font-semibold text-foreground">{formatDate(sessionMeta?.createdAt)}</p>
              </div>

              <div className="rounded-[18px] border border-border/70 bg-white/55 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Latest mood signal</p>
                <p className="mt-1 text-xs font-semibold capitalize text-foreground">{sessionMeta?.moodTimeline?.[sessionMeta.moodTimeline.length - 1]?.emotion ?? "Not available yet"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {typeof sessionMeta?.moodTimeline?.[sessionMeta.moodTimeline.length - 1]?.severity === "number"
                    ? `Severity ${sessionMeta.moodTimeline[sessionMeta.moodTimeline.length - 1]?.severity}/5`
                    : "Severity will appear after enough turns."}
                </p>
              </div>

              <div className="rounded-[18px] border border-border/70 bg-white/55 p-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">What you should notice</p>
                <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
                  <li>Streamed thinking events display in real-time.</li>
                  <li>Responses preserve component type & verse badges.</li>
                  <li>Voice playback available on each response.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.aside>
      </div>
    </div>
  );
}
