import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { BookOpenText, ChevronRight, LoaderCircle, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Chapter {
  chapter_number: number;
  name: string;
  meaning: { en: string; hi?: string };
  summary: { en: string; hi?: string };
  translation: string;
  transliteration: string;
  verses_count: number;
}

function Chapters() {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const easeOutCurve = [0.22, 1, 0.36, 1] as const;
  const fadeUpItem = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.38, ease: easeOutCurve },
    },
  };
  const stagger = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.05, delayChildren: 0.04 },
    },
  };

  useEffect(() => {
    const fetchChapters = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch("https://vedicscriptures.github.io/chapters/");
        if (!response.ok) {
          throw new Error("Unable to load chapter data.");
        }

        const data = (await response.json()) as Chapter[];
        setChapters(data);
        setSelectedChapter((current) => current ?? data[0]?.chapter_number ?? null);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setErrorMessage("The chapter library could not be loaded right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void fetchChapters();
  }, []);

  const selectedChapterData =
    chapters.find((chapter) => chapter.chapter_number === selectedChapter) ?? chapters[0] ?? null;
  const totalVerses = chapters.reduce((sum, chapter) => sum + chapter.verses_count, 0);

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="app-surface p-8 sm:p-10">
            <div className="section-label mb-5">
              <span className="eyebrow-dot" />
              Explore the scripture
            </div>
            <h1 className="display-font text-5xl font-semibold leading-[0.95] text-foreground sm:text-6xl">
              Walk through all 18 chapters with structure instead of noise.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              Each chapter carries a distinct movement of thought, from despair and duty to devotion,
              wisdom, and surrender. Start with any chapter and move into its verses when you want to go deeper.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { value: "18", label: "chapters" },
                { value: totalVerses ? `${totalVerses}` : "700", label: "verses indexed" },
                { value: selectedChapterData ? `#${selectedChapterData.chapter_number}` : "Live", label: "active chapter" },
              ].map((item) => (
                <div key={item.label} className="rounded-[24px] border border-border/70 bg-white/55 p-5">
                  <p className="display-font text-4xl font-semibold text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="app-surface border-none bg-card/82">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="rounded-[20px] border border-primary/15 bg-primary/8 p-3 text-primary">
                  <BookOpenText className="h-4 w-4" />
                </div>
                <div>
                  <CardTitle className="text-lg">Chapter preview</CardTitle>
                  <p className="text-sm text-muted-foreground">A focused summary of the chapter you select.</p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {selectedChapterData ? (
                <>
                  <div className="flex items-center gap-3">
                    <Badge variant="accent">Chapter {selectedChapterData.chapter_number}</Badge>
                    <Badge variant="outline">{selectedChapterData.verses_count} verses</Badge>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-foreground">{selectedChapterData.translation}</h2>
                    <p className="mt-2 text-sm italic text-muted-foreground">{selectedChapterData.transliteration}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{selectedChapterData.meaning?.en}</p>
                  </div>

                  <div className="rounded-[24px] border border-border/70 bg-white/60 p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Summary</p>
                    <p className="mt-3 text-sm leading-8 text-foreground">{selectedChapterData.summary?.en}</p>
                  </div>

                  <Button className="w-full rounded-full" onClick={() => navigate(`/verses/${selectedChapterData.chapter_number}`)}>
                    Read verse highlights
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <div className="rounded-[24px] border border-border/70 bg-white/55 p-5 text-sm leading-7 text-muted-foreground">
                  Pick a chapter to see its summary and jump into the verse view.
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <section className="app-surface p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Chapter list</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">Choose where you want to begin</h2>
            </div>
            <Badge variant="outline">Tap a chapter to expand</Badge>
          </div>

          {isLoading ? (
            <div className="flex min-h-48 items-center justify-center rounded-[28px] border border-border/70 bg-white/55">
              <LoaderCircle className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : errorMessage ? (
            <div className="rounded-[28px] border border-destructive/25 bg-destructive/8 p-6 text-sm text-foreground">
              {errorMessage}
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.08 }}
              className="grid gap-4"
            >
              {chapters.map((chapter) => {
                const isSelected = selectedChapter === chapter.chapter_number;
                return (
                  <motion.div
                    key={chapter.chapter_number}
                    variants={fadeUpItem}
                    whileHover={{ y: -2, transition: { duration: 0.2 } }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelectedChapter(isSelected ? null : chapter.chapter_number)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedChapter(isSelected ? null : chapter.chapter_number);
                      }
                    }}
                    className={`rounded-[28px] border p-5 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-primary/30 bg-primary/8 shadow-sm"
                        : "border-border/70 bg-white/60 hover:border-primary/25 hover:bg-white/82"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-lg font-semibold text-primary-foreground">
                          {chapter.chapter_number}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-semibold text-foreground">{chapter.translation}</h3>
                            <Badge variant="outline">{chapter.verses_count} verses</Badge>
                          </div>
                          <p className="mt-1 text-sm italic text-muted-foreground">{chapter.transliteration}</p>
                          <p className="mt-2 text-sm leading-7 text-muted-foreground">{chapter.meaning?.en}</p>
                        </div>
                      </div>

                      <ChevronRight className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isSelected ? "rotate-90 text-primary" : ""}`} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <span>{chapter.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{chapter.transliteration}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-5 grid gap-4 border-t border-border/60 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
                        <div className="rounded-[24px] border border-border/70 bg-white/65 p-4">
                          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Chapter summary</p>
                          <p className="mt-3 text-sm leading-8 text-foreground">{chapter.summary?.en}</p>
                        </div>
                        <Button
                          type="button"
                          className="rounded-full"
                          onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/verses/${chapter.chapter_number}`);
                          }}
                        >
                          Open verse page
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Chapters;
