import { motion } from "motion/react";
import { Analytics } from "@vercel/analytics/react";
import {
  ArrowRight,
  BookOpenText,
  BrainCircuit,
  Compass,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Waves,
} from "lucide-react";
import { Link } from "react-router-dom";

import { BrandMark } from "@/components/BrandMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const revealViewport = { once: true, amount: 0.25 };
const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const fadeLeft = {
  hidden: { opacity: 0, x: -26 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const fadeRight = {
  hidden: { opacity: 0, x: 26 },
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

export function Home() {
  const stats = [
    { value: "18", label: "chapters of wisdom" },
    { value: "700", label: "verses to explore" },
    { value: "24/7", label: "guided reflection access" },
  ];

  const featureCards = [
    {
      icon: BrainCircuit,
      title: "Reasoning you can actually see",
      description: "The chat surfaces understanding, retrieval, and composing before the final answer lands.",
      className: "sm:col-span-2 bg-white/78",
    },
    {
      icon: BookOpenText,
      title: "A clearer route into the Gita",
      description: "Chapters and verses feel like a guided library, not a disconnected content dump.",
      className: "bg-[#f5ecde]",
    },
    {
      icon: HeartHandshake,
      title: "Practice after insight",
      description: "Meditation and yoga live one click away from the moment you need them.",
      className: "bg-[#edf3ee]",
    },
    {
      icon: ShieldCheck,
      title: "Safer responses for difficult prompts",
      description: "The system can shift into support mode instead of treating every message like a casual question.",
      className: "sm:col-span-2 bg-[#fff7ef]",
    },
  ];

  const pathways = [
    {
      step: "01",
      title: "Read the emotional signal",
      description: "Backend analysis estimates tone, urgency, and the kind of help that fits the moment.",
    },
    {
      step: "02",
      title: "Pull the right context",
      description: "Relevant verses, prior chat context, and practical rituals are retrieved before answering.",
    },
    {
      step: "03",
      title: "Return one grounded next step",
      description: "Instead of noise, the reply lands as calm guidance with a concrete action you can take now.",
    },
  ];

  const promptCards = [
    "I feel overwhelmed and can’t slow my thoughts down.",
    "How do I keep going when results feel out of reach?",
    "Help me turn today’s stress into one calm next step.",
  ];

  return (
    <div className="relative px-4 pb-24 pt-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,174,88,0.18),rgba(214,174,88,0)_70%)] blur-3xl" />
        <div className="absolute left-[-10rem] top-[26rem] h-[22rem] w-[22rem] rounded-full border border-primary/8" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2.4rem] border border-border/70 bg-[linear-gradient(140deg,#fffaf3_0%,#f4e6d0_58%,#ead7ba_100%)] p-8 shadow-[0_32px_78px_-54px_rgba(55,39,18,0.6)] sm:p-10 lg:min-h-[39rem] lg:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.9),transparent_36%),radial-gradient(circle_at_82%_16%,rgba(214,174,88,0.18),transparent_28%)]" />

            <div className="relative flex h-full flex-col justify-between gap-10">
              <div>
                <div className="section-label border-primary/12 bg-white/55">
                  <span className="eyebrow-dot" />
                  Built for slow, clear decisions
                </div>

                <div className="mt-8 max-w-4xl">
                  <h1 className="display-font text-balance text-5xl font-semibold leading-[0.94] text-foreground sm:text-6xl lg:text-[5.35rem]">
                    A calmer interface for the day you are actually having.
                  </h1>
                  <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                    GitaGyan combines streamed reasoning, verse discovery, and practical rituals so you can move from mental noise to one grounded next step.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button asChild size="lg" className="rounded-full px-7 shadow-sm">
                    <Link to="/chat">
                      Open the reflection chat
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="secondary" size="lg" className="rounded-full px-7 shadow-[0_0_20px_rgba(214,174,88,0.2)] border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
                    <Link to="/check-in">
                      Daily Check-in
                      <Sparkles className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button asChild variant="outline" size="lg" className="rounded-full border-border/70 bg-white/72 px-7">
                    <Link to="/chapters">
                      Explore the chapters
                      <Compass className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4 sm:grid-cols-3"
                >
                  {stats.map((stat) => (
                    <motion.div
                      key={stat.label}
                      variants={fadeUp}
                      className="rounded-[1.7rem] border border-border/70 bg-white/58 p-5 backdrop-blur-sm"
                    >
                      <p className="display-font text-4xl font-semibold text-foreground">{stat.value}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.08 }}
            className="grid gap-4"
          >
            <div className="relative overflow-hidden rounded-[2.2rem] border border-secondary/18 bg-[linear-gradient(160deg,#263a33_0%,#1d2d28_54%,#263f37_100%)] p-6 text-secondary-foreground shadow-[0_32px_78px_-52px_rgba(26,31,28,0.8)] sm:p-7">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-28 w-40 bg-[radial-gradient(circle_at_bottom_left,rgba(214,174,88,0.2),transparent_60%)]" />

              <div className="relative">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <BrandMark className="h-14 w-14 shrink-0 border-white/10 shadow-none" iconClassName="h-8 w-8" />
                    <div>
                      <Badge variant="outline" className="border-white/15 bg-white/8 text-white/80">
                        Live reasoning preview
                      </Badge>
                      <p className="mt-3 text-xl font-semibold text-white">Watch the system think before it answers.</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-7 space-y-4"
                >
                  <motion.div variants={fadeUp} className="rounded-[1.6rem] border border-white/12 bg-white/8 px-4 py-3 text-sm leading-7 text-white/88">
                    I feel restless and I need something concrete before tomorrow.
                  </motion.div>

                  {["Reading your emotional signal", "Retrieving relevant wisdom", "Composing a grounded response"].map((step, index) => (
                    <motion.div
                      key={step}
                      variants={index % 2 === 0 ? fadeRight : fadeLeft}
                      className="flex items-center gap-3 rounded-[1.4rem] border border-white/10 bg-white/7 px-4 py-3 text-sm text-white/76"
                    >
                      <span
                        className="animate-pulse-dot inline-flex h-2.5 w-2.5 rounded-full bg-accent"
                        style={{ animationDelay: `${index * 0.15}s` }}
                      />
                      {step}
                    </motion.div>
                  ))}

                  <motion.div variants={fadeUp} className="rounded-[1.8rem] bg-white/92 p-5 text-foreground">
                    <div className="mb-3 flex items-center justify-between">
                      <Badge variant="accent">Insight ready</Badge>
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Breathing</span>
                    </div>
                    <p className="text-sm leading-7 text-foreground">
                      Restlessness grows when tomorrow feels larger than your body can hold. Slow the pace tonight: one even breath, one practical task, then stop.
                    </p>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.18 }}
                className="rounded-[1.9rem] border border-border/70 bg-white/70 p-5"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                  <BookOpenText className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-foreground">Chapter-led library</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Browse scripture with a layout that guides you instead of flattening everything into one list.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.26 }}
                className="rounded-[1.9rem] border border-border/70 bg-white/70 p-5"
              >
                <div className="mb-4 inline-flex rounded-2xl border border-secondary/15 bg-secondary/8 p-3 text-secondary">
                  <Waves className="h-5 w-5" />
                </div>
                <p className="text-lg font-semibold text-foreground">Rituals without friction</p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Meditation and yoga sit inside the same flow, so guidance can turn into practice immediately.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="space-y-6 lg:sticky lg:top-28"
          >
            <div className="section-label mb-5">
              <span className="eyebrow-dot" />
              Better structure
            </div>
            <h2 className="display-font text-4xl font-semibold text-foreground sm:text-5xl">
              Cleaner hierarchy, fewer competing decisions.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              The page now stays still while you read. The content reveals on entry, but it no longer drifts around once it is on screen.
            </p>

            <div className="rounded-[2rem] border border-border/70 bg-white/62 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">At a glance</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-[1.5rem] border border-border/70 bg-background/72 p-4">
                  <p className="text-sm font-semibold text-foreground">Scroll-in reveals</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Bento items enter as you reach them.</p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/72 p-4">
                  <p className="text-sm font-semibold text-foreground">No drifting panels</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">Sections stop moving once they are visible.</p>
                </div>
                <div className="rounded-[1.5rem] border border-border/70 bg-background/72 p-4">
                  <p className="text-sm font-semibold text-foreground">Cleaner rhythm</p>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">The page feels lighter without the marquee and parallax layer.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.18 }}
            className="grid gap-4 sm:grid-cols-2"
          >
            {featureCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  variants={fadeUp}
                  transition={{ duration: 0.42, ease: "easeOut", delay: index * 0.02 }}
                  className={cn("rounded-[2rem] border border-border/70 p-6 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.55)]", card.className)}
                >
                  <div className="mb-5 inline-flex rounded-2xl border border-primary/15 bg-primary/8 p-3 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-2xl font-semibold text-foreground">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">{card.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="rounded-[2.4rem] border border-secondary/18 bg-[linear-gradient(145deg,#29413a_0%,#20332d_55%,#2e4a41_100%)] p-8 text-secondary-foreground shadow-[0_34px_80px_-54px_rgba(26,31,28,0.85)] sm:p-10"
          >
            <Badge variant="outline" className="border-white/15 bg-white/8 text-white/80">
              How the assistant responds
            </Badge>
            <h2 className="mt-5 display-font text-4xl font-semibold text-white sm:text-5xl">
              See the chain from emotion to next action.
            </h2>
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.22 }}
              className="mt-8 space-y-4"
            >
              {pathways.map((pathway) => (
                <motion.div key={pathway.step} variants={fadeUp} className="rounded-[1.9rem] border border-white/10 bg-white/8 p-5">
                  <div className="flex items-start gap-4">
                    <span className="display-font text-3xl text-white/82">{pathway.step}</span>
                    <div>
                      <p className="text-lg font-semibold text-white">{pathway.title}</p>
                      <p className="mt-2 text-sm leading-7 text-white/72">{pathway.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={revealViewport}
            className="rounded-[2.4rem] border border-border/70 bg-white/65 p-8 shadow-[0_28px_70px_-50px_rgba(55,39,18,0.52)] sm:p-10"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">Try asking</p>
                <h3 className="mt-2 text-2xl font-semibold text-foreground">Real prompts for real days</h3>
              </div>
              <Badge variant="outline">Starter prompts</Badge>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="mt-6 grid gap-4"
            >
              {promptCards.map((prompt) => (
                <motion.div key={prompt} variants={fadeRight}>
                  <Link
                    to="/chat"
                    className="group block rounded-[1.8rem] border border-border/70 bg-background/70 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <p className="max-w-xl text-sm leading-7 text-foreground">{prompt}</p>
                      <ArrowRight className="mt-1 h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={revealViewport}
              className="mt-8 rounded-[1.9rem] border border-border/70 bg-white/72 p-6"
            >
              <div className="mb-3 flex items-center gap-3 text-foreground">
                <MessageCircle className="h-5 w-5 text-primary" />
                <p className="font-semibold">Built around emotional tone</p>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                The backend now reads emotional context, surfaces its thinking stages, and then delivers one response shaped around what matters most in the moment.
              </p>
            </motion.div>
          </motion.div>
        </section>

        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="rounded-[2.4rem] border border-secondary/18 bg-[linear-gradient(135deg,#243931_0%,#31453d_44%,#77512f_100%)] p-8 text-secondary-foreground shadow-[0_34px_84px_-58px_rgba(31,24,18,0.85)] sm:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div className="flex items-start gap-4">
              <BrandMark className="mt-1 h-16 w-16 shrink-0 border-white/10 shadow-none" iconClassName="h-9 w-9" />
              <div>
                <Badge variant="outline" className="border-white/15 bg-white/8 text-white/80">
                  Ready when you are
                </Badge>
                <h2 className="mt-5 display-font text-4xl font-semibold text-white sm:text-5xl">
                  Open the chat, browse the Gita, or start with one quiet minute.
                </h2>
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Button asChild size="lg" className="rounded-full bg-white px-7 text-foreground hover:bg-white/92">
                <Link to="/chat">
                  Start reflecting
                  <Sparkles className="h-4 w-4" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-white/20 bg-white/8 px-7 text-white hover:bg-white/12 hover:text-white"
              >
                <Link to="/signup">Create an account</Link>
              </Button>
            </div>
          </div>
        </motion.section>
      </div>

      <Analytics />
    </div>
  );
}
