import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Camera as CameraIcon,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { PoseAnalysisResult, YogaPose } from '../types';
import type {
  AnalysisStatus,
  YogaAttemptMeta,
  YogaFeedbackFormState,
} from '../hooks/useAnalysis';
import {
  formatWellnessTag,
  getPoseMentalHealthTags,
  moodAfterOptions,
} from '../hooks/useAnalysis';

/* ── animation variants (matching landing page) ──────────────── */

const easeOutCurve = [0.22, 1, 0.36, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.42, ease: easeOutCurve },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.08,
    },
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 260, damping: 22 },
  },
};

/* ── types ───────────────────────────────────────────────────── */

interface ResultViewProps {
  selectedPose: YogaPose;
  analysisResult: PoseAnalysisResult;
  analysisStatus: AnalysisStatus;
  snapshotDataUrl: string | null;
  feedbackForm: YogaFeedbackFormState;
  setFeedbackForm: React.Dispatch<React.SetStateAction<YogaFeedbackFormState>>;
  attemptMeta: YogaAttemptMeta;
  isSavingFeedback: boolean;
  isFeedbackSaved: boolean;
  onRetry: () => void;
  onChangePose: () => void;
  onSubmitFeedback: () => void;
}

/* ── animated score ring ─────────────────────────────────────── */

function ScoreRing({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      setAnimatedScore(Math.round(eased * score));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  const color =
    score > 85
      ? { ring: '#10b981', bg: 'rgba(16,185,129,0.12)', text: 'text-emerald-500', label: 'Excellent Form', Icon: CheckCircle2, badgeBg: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' }
      : score > 70
        ? { ring: '#f59e0b', bg: 'rgba(245,158,11,0.12)', text: 'text-amber-500', label: 'Almost There', Icon: RotateCcw, badgeBg: 'bg-amber-500/10 text-amber-500 border-amber-500/20' }
        : { ring: '#f97316', bg: 'rgba(249,115,22,0.12)', text: 'text-orange-500', label: 'Needs Adjustment', Icon: AlertCircle, badgeBg: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };

  const circumference = 2 * Math.PI * 62;
  const offset = circumference - (animatedScore / 100) * circumference;

  return (
    <motion.div
      variants={scaleIn}
      className="flex flex-col items-center gap-5"
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* background ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="62" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/40" />
          <circle
            cx="70" cy="70" r="62" fill="none"
            stroke={color.ring}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        </svg>
        {/* inner glow disc */}
        <div
          className="absolute inset-4 rounded-full border border-border/30 backdrop-blur-xl"
          style={{ background: color.bg }}
        />
        {/* number */}
        <span className={`relative text-5xl font-extrabold tracking-tighter ${color.text}`}>
          {animatedScore}
          <span className="text-2xl font-bold opacity-40 ml-0.5">%</span>
        </span>
      </div>

      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${color.badgeBg}`}>
        <color.Icon className="w-4 h-4" />
        {color.label}
      </div>
    </motion.div>
  );
}

/* ── main component ──────────────────────────────────────────── */

const ResultView: React.FC<ResultViewProps> = ({
  selectedPose,
  analysisResult,
  analysisStatus,
  snapshotDataUrl,
  feedbackForm,
  setFeedbackForm,
  attemptMeta,
  isSavingFeedback,
  isFeedbackSaved,
  onRetry,
  onChangePose,
  onSubmitFeedback,
}) => {
  const tags = getPoseMentalHealthTags(selectedPose);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.45, ease: easeOutCurve }}
      className="w-full max-w-5xl mx-auto relative z-10"
    >
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          className="h-10 px-5 rounded-full border-border/40 bg-background/70 font-semibold gap-2 backdrop-blur-sm hover:bg-muted transition-all text-sm"
          onClick={onRetry}
        >
          <ArrowLeft className="w-4 h-4" /> Retry
        </Button>
        <h2 className="flex-1 text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500 text-center sm:text-left">
          Analysis Results
        </h2>
      </div>

      {/* ── Status banner ──────────────────────────────────── */}
      <AnimatePresence>
        {analysisStatus && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`mb-6 rounded-[2rem] border px-5 py-4 shadow-sm backdrop-blur-sm ${
              analysisStatus.tone === 'success'
                ? 'border-emerald-500/20 bg-emerald-500/8'
                : 'border-amber-500/20 bg-amber-500/8'
            }`}
          >
            <div className="flex items-start gap-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.15 }}
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl ${
                  analysisStatus.tone === 'success'
                    ? 'bg-emerald-500/15 text-emerald-600'
                    : 'bg-amber-500/15 text-amber-600'
                }`}
              >
                {analysisStatus.tone === 'success' ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <AlertCircle className="h-5 w-5" />
                )}
              </motion.div>
              <div>
                <p className="text-sm font-semibold tracking-wide text-foreground">
                  {analysisStatus.title}
                </p>
                <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                  {analysisStatus.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Content grid ───────────────────────────────────── */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6"
      >
        {/* Left column — snapshot + summary */}
        <motion.div
          variants={fadeUp}
          className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-5 sm:p-6 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.25)] flex flex-col gap-5"
        >
          {/* Pose header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <CameraIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">{selectedPose.name}</h3>
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                {selectedPose.nameHindi}
              </p>
            </div>
          </div>

          {/* Snapshot */}
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-muted/30 border border-border/30 shadow-inner overflow-hidden flex items-center justify-center group">
            {snapshotDataUrl ? (
              <img src={snapshotDataUrl} alt="Your pose snapshot" className="w-full h-full object-contain" />
            ) : (
              <span className="text-muted-foreground text-sm">Snapshot unavailable</span>
            )}
            <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5 rounded-2xl pointer-events-none" />
          </div>

          {/* Summary card */}
          <div className="rounded-2xl border border-border/40 bg-muted/20 p-5 backdrop-blur-sm">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
              Summary
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-foreground/90">
              {analysisResult.feedback}
            </p>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={`result-${tag}`}
                    variant="outline"
                    className="border-primary/15 bg-primary/5 text-primary/80 text-[0.6rem]"
                  >
                    {formatWellnessTag(tag)}
                  </Badge>
                ))}
              </div>
            )}

            {analysisResult.nextPose && (
              <p className="mt-3 text-sm text-muted-foreground">
                Next pose: <span className="font-semibold text-foreground/80">{analysisResult.nextPose}</span>
              </p>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {attemptMeta.sessionId ? 'Backend score' : 'Local score'}
              </span>
              <span className="rounded-full border border-border/40 bg-background/60 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                {analysisResult.analysisSource}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Right column — score + coaching + feedback */}
        <div className="flex flex-col gap-5">
          {/* Score ring card */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-7 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.25)] text-center relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-56 h-56 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6 relative z-10">
              Form Match
            </h3>
            <ScoreRing score={analysisResult.score} />
          </motion.div>

          {/* Coaching notes */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.25)] flex-1 flex flex-col min-h-[200px]"
          >
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full" /> Coaching Notes
            </h3>

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="space-y-3 text-[14px] font-medium leading-relaxed flex-1"
            >
              {analysisResult.corrections.length > 0 ? (
                analysisResult.corrections.map((correction, index) => (
                  <motion.li
                    key={correction}
                    variants={fadeUp}
                    className="flex gap-3 items-start p-3 bg-muted/30 rounded-xl border border-border/30"
                  >
                    <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-background flex items-center justify-center text-[10px] text-muted-foreground font-bold border border-border/50">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-foreground/85">{correction}</span>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  variants={fadeUp}
                  className="flex gap-3 items-center text-emerald-700 p-4 bg-emerald-500/8 border border-emerald-500/15 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Focus on your breath. Your alignment looks strong.</span>
                </motion.li>
              )}
            </motion.ul>

            {/* Encouragement */}
            <div className="mt-5 rounded-2xl bg-[linear-gradient(135deg,rgba(214,174,88,0.08),rgba(143,75,44,0.06))] border border-primary/15 px-5 py-4 text-sm text-foreground/80 leading-relaxed">
              <Sparkles className="w-4 h-4 text-primary/60 inline mr-1.5 -mt-0.5" />
              {analysisResult.encouragement}
            </div>
          </motion.div>

          {/* Reflection / Feedback form */}
          <motion.div
            variants={fadeUp}
            className="rounded-[2rem] border border-border/50 bg-card/80 backdrop-blur-sm p-6 shadow-[0_24px_60px_-44px_rgba(55,39,18,0.25)]"
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Reflection
                </h3>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Save what this pose was best for today so the chatbot can recommend what has actually helped you before.
                </p>
              </div>
              {isFeedbackSaved && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}>
                  <Badge variant="accent">Saved</Badge>
                </motion.div>
              )}
            </div>

            {!attemptMeta.sessionId || !attemptMeta.poseAttemptId ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-700 mb-5">
                Feedback unlocks when the backend sync succeeds. Local-only analyses still work, but they are not added to your long-term wellness history.
              </div>
            ) : null}

            <div className="space-y-5">
              {/* Rating */}
              <div>
                <p className="text-sm font-semibold text-foreground">How helpful was this?</p>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: value }))}
                      className={`min-w-10 rounded-full border px-3 py-1.5 text-sm font-semibold transition-all duration-200 ${
                        feedbackForm.rating === value
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      }`}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>

              {/* Helpful? */}
              <div>
                <p className="text-sm font-semibold text-foreground">Did it feel helpful?</p>
                <div className="mt-2.5 flex flex-wrap gap-2.5">
                  {[
                    { label: 'Yes', value: true },
                    { label: 'Not really', value: false },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setFeedbackForm((prev) => ({ ...prev, helpful: option.value }))}
                      className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-all duration-200 ${
                        feedbackForm.helpful === option.value
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                          : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Targeted concern */}
              {tags.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground">What were you trying to support?</p>
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={`concern-${tag}`}
                        type="button"
                        onClick={() => setFeedbackForm((prev) => ({ ...prev, targetedConcern: tag }))}
                        className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all duration-200 ${
                          feedbackForm.targetedConcern === tag
                            ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                            : 'border-border/50 bg-background/60 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                        }`}
                      >
                        {formatWellnessTag(tag)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Mood after */}
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="yoga-mood-after">
                  How do you feel now?
                </label>
                <Select
                  value={feedbackForm.moodAfter}
                  onValueChange={(value) =>
                    setFeedbackForm((prev) => ({ ...prev, moodAfter: value }))
                  }
                >
                  <SelectTrigger
                    id="yoga-mood-after"
                    className="h-10 w-full rounded-2xl border-border/50 bg-background/60"
                  >
                    <SelectValue placeholder="Choose how the pose left you feeling" />
                  </SelectTrigger>
                  <SelectContent>
                    {moodAfterOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="grid gap-1.5">
                <label className="text-sm font-semibold text-foreground" htmlFor="yoga-notes">
                  Optional notes
                </label>
                <Textarea
                  id="yoga-notes"
                  value={feedbackForm.notes}
                  onChange={(event) =>
                    setFeedbackForm((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  className="min-h-20 rounded-2xl border-border/50 bg-background/60"
                  placeholder="What worked or what still felt off?"
                />
              </div>

              {/* Submit */}
              <Button
                className="h-11 w-full rounded-2xl font-semibold"
                disabled={
                  isSavingFeedback ||
                  isFeedbackSaved ||
                  !attemptMeta.sessionId ||
                  !attemptMeta.poseAttemptId
                }
                onClick={onSubmitFeedback}
              >
                {isSavingFeedback
                  ? 'Saving feedback...'
                  : isFeedbackSaved
                    ? 'Feedback saved ✓'
                    : 'Save feedback to your history'}
              </Button>
            </div>
          </motion.div>

          {/* Change pose CTA */}
          <motion.div variants={fadeUp}>
            <Button
              className="w-full h-13 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:shadow-[0_8px_30px_rgba(143,75,44,0.3)] active:scale-[0.98] transition-all gap-2"
              onClick={onChangePose}
            >
              Choose Another Pose <ChevronRight className="w-5 h-5 opacity-70" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ResultView;
