import { motion } from "motion/react";
import { BookOpen, Clock, Globe, Star, Users, Heart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const easeOutCurve = [0.22, 1, 0.36, 1] as const;
const revealViewport = { once: true, amount: 0.22 };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const highlights = [
  {
    icon: Clock,
    title: "5000+ Years Old",
    description: "Ancient wisdom that remains relevant today",
    bg: "bg-[#f5ecde]",
  },
  {
    icon: Globe,
    title: "Universal Truth",
    description: "Teachings that transcend culture and religion",
    bg: "bg-[#edf3ee]",
  },
  {
    icon: Star,
    title: "18 Chapters",
    description: "700 verses of profound spiritual guidance",
    bg: "bg-white/78",
  },
  {
    icon: Users,
    title: "Global Impact",
    description: "Studied and revered worldwide",
    bg: "bg-[#fff7ef]",
  },
];

const teachings = [
  { title: "Dharma", desc: "Living according to one's duty without attachment to results." },
  { title: "Karma Yoga", desc: "The path of selfless action, free from ego and desire." },
  { title: "Bhakti Yoga", desc: "Devotion and surrender to the Divine with love." },
  { title: "Jnana Yoga", desc: "Wisdom and realization of the Self and ultimate reality." },
];

const About: React.FC = () => {
  return (
    <div className="relative px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,174,88,0.18),rgba(214,174,88,0)_70%)] blur-3xl" />
        <div className="absolute left-[-10rem] top-[26rem] h-[22rem] w-[22rem] rounded-full border border-primary/8" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        {/* ── Hero ── */}
        <motion.section
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[2.4rem] border border-border/70 bg-[linear-gradient(140deg,#fffaf3_0%,#f4e6d0_58%,#ead7ba_100%)] p-8 shadow-[0_32px_78px_-54px_rgba(55,39,18,0.6)] sm:p-10 lg:p-12"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_36%),radial-gradient(circle_at_82%_16%,rgba(214,174,88,0.18),transparent_28%)]" />

          <div className="relative flex flex-col items-center text-center gap-6">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="flex h-20 w-20 items-center justify-center rounded-full shadow-lg"
              style={{ background: "var(--gradient-sunrise)" }}
            >
              <BookOpen className="h-10 w-10 text-primary-foreground" />
            </motion.div>

            <div className="section-label border-primary/12 bg-white/55">
              <span className="eyebrow-dot" />
              Sacred scripture
            </div>

            <h1 className="display-font text-balance text-5xl font-semibold leading-[0.94] text-foreground sm:text-6xl lg:text-[5.35rem]">
              The Bhagavad Gita
            </h1>
            <p className="mx-auto max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              <span className="sacred-text text-xl font-semibold">
                "गीता सुगीता कर्तव्या किमन्यैः शास्त्रविस्तरैः"
              </span>
              <br />
              <span className="mt-2 block text-base italic text-muted-foreground">
                "The Gita should be sung (studied) beautifully; what is the need for other elaborate scriptures?"
              </span>
            </p>
          </div>
        </motion.section>

        {/* ── Highlight Cards ── */}
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                variants={fadeUp}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className={cn(
                  "rounded-[2rem] border border-border/70 p-6 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.4)] transition-shadow hover:shadow-[0_28px_70px_-44px_rgba(55,39,18,0.55)]",
                  item.bg
                )}
              >
                <div className="mb-4 inline-flex rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">{item.description}</p>
              </motion.div>
            );
          })}
        </motion.section>

        {/* ── Origin & Core Teachings ── */}
        <section className="grid gap-6 lg:grid-cols-2">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="app-surface p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                <Globe className="h-5 w-5" />
              </div>
              <h2 className="display-font text-2xl font-semibold text-foreground">Origin & Context</h2>
            </div>
            <div className="space-y-4 text-sm leading-8 text-foreground">
              <p>
                The Bhagavad Gita, meaning "Song of God," is a 700-verse dialogue
                between Prince Arjuna and Lord Krishna on the battlefield of
                Kurukshetra. This sacred text forms part of the Mahabharata.
              </p>
              <p>
                Facing a moral dilemma, Arjuna questions the purpose of duty and
                life. Krishna imparts timeless wisdom on dharma, karma, and the
                nature of reality.
              </p>
              <p>
                The Gita addresses universal questions: What is the purpose of
                life? How should we act? How do we find peace?
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="app-surface p-8 sm:p-10"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="rounded-2xl border border-secondary/15 bg-secondary/8 p-3 text-secondary">
                <Heart className="h-5 w-5" />
              </div>
              <h2 className="display-font text-2xl font-semibold text-foreground">Core Teachings</h2>
            </div>
            <div className="space-y-5">
              {teachings.map((t) => (
                <div
                  key={t.title}
                  className="rounded-[1.5rem] border border-border/70 bg-white/55 p-5 transition-all duration-200 hover:bg-white/80"
                >
                  <h3 className="font-semibold text-foreground">{t.title}</h3>
                  <p className="mt-1 text-sm leading-7 text-muted-foreground">{t.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Global Influence ── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="rounded-[2.4rem] border border-secondary/18 bg-[linear-gradient(135deg,#243931_0%,#31453d_44%,#77512f_100%)] p-8 text-secondary-foreground shadow-[0_34px_84px_-58px_rgba(31,24,18,0.85)] sm:p-10"
        >
          <Badge variant="outline" className="border-white/15 bg-white/8 text-white/80">
            Worldwide influence
          </Badge>
          <h2 className="mt-5 display-font text-4xl font-semibold text-white sm:text-5xl">Global Influence</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Philosophy", desc: "Inspired thinkers from Schopenhauer to Gandhi." },
              { title: "Literature", desc: "Countless works of poetry, prose, and art across cultures." },
              { title: "Modern Life", desc: "Guides millions in finding meaning and peace today." },
            ].map((item) => (
              <div key={item.title} className="rounded-[1.9rem] border border-white/10 bg-white/8 p-5">
                <p className="text-lg font-semibold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-white/72">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Closing Quote ── */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="app-surface p-8 text-center sm:p-12"
        >
          <div className="mx-auto max-w-3xl">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full shadow-lg"
              style={{ background: "var(--gradient-sunrise)" }}
            >
              <Star className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <blockquote className="sacred-text text-2xl leading-10 font-semibold">
              "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।
              <br />
              अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥"
            </blockquote>
            <p className="mt-4 text-base italic text-muted-foreground">
              "Whenever there is a decline in righteousness and rise of unrighteousness, I manifest Myself."
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              — Bhagavad Gita, Chapter 4, Verse 7
            </p>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default About;
