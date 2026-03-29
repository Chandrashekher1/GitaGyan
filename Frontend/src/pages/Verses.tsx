import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, BookOpen, ChevronRight, LibraryBig } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface VerseEntry {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  meaning: string;
}

const featuredVerses: VerseEntry[] = [
  {
    chapter: 2,
    verse: 47,
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    transliteration: "karmaṇy evādhikāras te mā phaleṣu kadācana, mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
    meaning: "You have the right to perform action, but never to its fruits. Do not be motivated by the results of action, nor be attached to inaction.",
  },
  {
    chapter: 4,
    verse: 7,
    sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    transliteration: "yadā yadā hi dharmasya glānir bhavati bhārata, abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
    meaning: "Whenever there is a decline in righteousness and an increase in unrighteousness, I manifest myself.",
  },
  {
    chapter: 9,
    verse: 22,
    sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
    transliteration: "ananyāś cintayanto māṁ ye janāḥ paryupāsate, teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
    meaning: "For those who hold steady devotion, I protect what they have and provide what they need.",
  },
  {
    chapter: 15,
    verse: 7,
    sanskrit: "ममैवांशो जीवलोके जीवभूतः सनातनः। मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥",
    transliteration: "mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ, manaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
    meaning: "The living being in this world is an eternal fragment of the divine, struggling through mind and senses.",
  },
  {
    chapter: 7,
    verse: 19,
    sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते। वासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥",
    transliteration: "bahūnāṁ janmanām ante jñānavān māṁ prapadyate, vāsudevaḥ sarvam iti sa mahātmā sudurlabhaḥ",
    meaning: "After many journeys, the wise recognize the divine as the source of everything.",
  },
  {
    chapter: 18,
    verse: 66,
    sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
    transliteration: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja, ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
    meaning: "Let go of your fear and return to surrender; liberation follows trust, not panic.",
  },
];

function Verses() {
  const { chapterNumber } = useParams();
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);

  const requestedChapter = chapterNumber ? Number(chapterNumber) : null;
  const visibleVerses = requestedChapter
    ? featuredVerses.filter((verse) => verse.chapter === requestedChapter)
    : featuredVerses;
  const hasChapterMatch = !requestedChapter || visibleVerses.length > 0;

  useEffect(() => {
    const firstVisible = visibleVerses[0];
    setSelectedVerse(firstVisible ? `${firstVisible.chapter}-${firstVisible.verse}` : null);
  }, [chapterNumber]);

  const versesToRender = hasChapterMatch ? visibleVerses : featuredVerses;

  return (
    <div className="px-4 pb-10 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
          <div className="app-surface p-8 sm:p-10">
            <div className="section-label mb-5">
              <span className="eyebrow-dot" />
              Verse gallery
            </div>
            <h1 className="display-font text-5xl font-semibold leading-[0.95] text-foreground sm:text-6xl">
              Verse highlights for reflection, focus, and difficult days.
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground">
              These featured verses are laid out for reading, re-reading, and grounding.
              When you arrive from a chapter page, this view narrows to that chapter automatically.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Badge variant="accent">{requestedChapter ? `Chapter ${requestedChapter}` : "All featured chapters"}</Badge>
              <Badge variant="outline">{versesToRender.length} verse cards</Badge>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button asChild className="rounded-full">
                <Link to="/chapters">
                  Browse chapters
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full border-border/70 bg-white/70">
                <Link to="/chat">Take this into chat</Link>
              </Button>
            </div>
          </div>

          <Card className="app-surface border-none bg-card/82">
            <CardContent className="p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-[20px] border border-primary/15 bg-primary/8 p-3 text-primary">
                  <LibraryBig className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Reading mode</p>
                  <p className="text-sm text-muted-foreground">Selected verse opens in full detail below.</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-border/70 bg-white/60 p-6">
                {requestedChapter && !hasChapterMatch ? (
                  <>
                    <Badge variant="outline">No featured match yet</Badge>
                    <p className="mt-4 text-sm leading-7 text-foreground">
                      Chapter {requestedChapter} isn&apos;t in the featured subset yet, so the full highlight collection is shown below.
                    </p>
                  </>
                ) : (
                  <>
                    <Badge variant="outline">{requestedChapter ? `Focused on chapter ${requestedChapter}` : "Curated across chapters"}</Badge>
                    <p className="mt-4 text-sm leading-7 text-foreground">
                      Open a verse card to view the Sanskrit, transliteration, and a clean translation block designed for slow reading.
                    </p>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="app-surface p-6 sm:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Featured verses</p>
              <h2 className="mt-2 text-2xl font-semibold text-foreground">
                {requestedChapter && hasChapterMatch ? `Chapter ${requestedChapter} highlights` : "Selected verses across the Gita"}
              </h2>
            </div>
            <Badge variant="outline">Tap a card to expand</Badge>
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.08 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
            }}
            className="grid gap-4 items-start lg:grid-cols-2"
          >
            {versesToRender.map((verse) => {
              const key = `${verse.chapter}-${verse.verse}`;
              const isSelected = selectedVerse === key;

              return (
                <motion.button
                  key={key}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] } },
                  }}
                  whileHover={{ y: -2, transition: { duration: 0.2 } }}
                  type="button"
                  onClick={() => setSelectedVerse(isSelected ? null : key)}
                  className={`rounded-[28px] border p-6 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary2/30 bg-primary/8 shadow-sm"
                      : "border-border/70 bg-white/60 hover:border-primary/25 hover:bg-white/82"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">
                          Chapter {verse.chapter}, Verse {verse.verse}
                        </h3>
                        <Badge variant="accent">Featured</Badge>
                      </div>
                      <p className="mt-2 text-sm leading-7 text-muted-foreground">{verse.meaning}</p>
                    </div>
                    <ChevronRight className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 ${isSelected ? "rotate-90 text-primary" : ""}`} />
                  </div>

                  {isSelected && (
                    <div className="mt-6 space-y-5 border-t border-border/60 pt-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Sanskrit</p>
                        <p className="mt-3 text-xl leading-9 text-foreground">{verse.sanskrit}</p>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Transliteration</p>
                        <p className="mt-3 text-sm italic leading-8 text-muted-foreground">{verse.transliteration}</p>
                      </div>

                      <div className="rounded-[24px] border border-border/70 bg-white/65 p-5">
                        <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Reflection-ready translation</p>
                        <p className="mt-3 text-sm leading-8 text-foreground">{verse.meaning}</p>
                      </div>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </section>

        <section className="app-surface p-8 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="mb-4 inline-flex rounded-full border border-primary/15 bg-primary/8 p-3 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h2 className="display-font text-4xl font-semibold text-foreground">Complete verse library is the next step.</h2>
            <p className="mt-4 text-sm leading-8 text-muted-foreground">
              This page now honors chapter routing and presents the featured verse set in a calmer layout.
              If you want, the next pass can wire a full chapter-by-chapter verse API here.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Verses;
