import React from 'react';
import { motion } from 'motion/react';
import {
  AlertCircle,
  ArrowLeft,
  Camera as CameraIcon,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { PoseAnalysisResult, YogaPose } from '../types';
import type { AnalysisStatus, YogaAttemptMeta, YogaFeedbackFormState } from '../hooks/useAnalysis';
import { formatWellnessTag, getPoseMentalHealthTags } from '../hooks/useAnalysis';
import FeedbackForm from './FeedbackForm';

interface AnalysisResultProps {
  selectedPose: YogaPose;
  analysisResult: PoseAnalysisResult;
  analysisStatus: AnalysisStatus;
  snapshotDataUrl: string | null;
  attemptMeta: YogaAttemptMeta;
  feedbackForm: YogaFeedbackFormState;
  setFeedbackForm: React.Dispatch<React.SetStateAction<YogaFeedbackFormState>>;
  isSavingFeedback: boolean;
  isFeedbackSaved: boolean;
  onRetry: () => void;
  onChangePose: () => void;
  onSubmitFeedback: () => void;
}

// Animated SVG score ring
function ScoreRing({ score }: { score: number }) {
  const size = 160;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const color =
    score > 85 ? '#22c55e' : score > 70 ? '#f59e0b' : '#f97316';
  const colorLight =
    score > 85 ? 'text-emerald-400' : score > 70 ? 'text-amber-400' : 'text-orange-400';

  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
      {/* Background ring */}
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-border/30"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.3 }}
        />
      </svg>

      {/* Inner glow */}
      <div
        className="absolute inset-3 rounded-full border border-border/30 backdrop-blur-sm"
        style={{ background: `radial-gradient(circle, ${color}08, transparent)` }}
      />

      {/* Score text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, type: 'spring' as const, stiffness: 200, damping: 15 }}
        className={`relative z-10 text-5xl font-extrabold tracking-tighter ${colorLight}`}
      >
        {score}
        <span className="text-2xl font-bold opacity-40 ml-0.5">%</span>
      </motion.div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  if (score > 85) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' as const, stiffness: 300, damping: 15 }}
        className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-full text-sm font-semibold mt-3"
      >
        <CheckCircle2 className="w-4 h-4" /> Excellent Form
      </motion.div>
    );
  }
  if (score > 70) {
    return (
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring' as const, stiffness: 300, damping: 15 }}
        className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/20 px-4 py-1.5 rounded-full text-sm font-semibold mt-3"
      >
        <RotateCcw className="w-4 h-4" /> Almost there
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8, type: 'spring', stiffness: 300, damping: 15 }}
      className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20 px-4 py-1.5 rounded-full text-sm font-semibold mt-3"
    >
      <AlertCircle className="w-4 h-4" /> Needs adjustment
    </motion.div>
  );
}

const correctionVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.9 + i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const AnalysisResultView: React.FC<AnalysisResultProps> = ({
  selectedPose,
  analysisResult,
  analysisStatus,
  snapshotDataUrl,
  attemptMeta,
  feedbackForm,
  setFeedbackForm,
  isSavingFeedback,
  isFeedbackSaved,
  onRetry,
  onChangePose,
  onSubmitFeedback,
}) => {
  const poseTags = getPoseMentalHealthTags(selectedPose);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className="w-full max-w-5xl mx-auto relative z-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-4 mb-6"
      >
        <Button
          variant="ghost"
          className="h-10 px-5 rounded-full hover:bg-muted font-semibold gap-2 border border-border/40 backdrop-blur-sm transition-all text-sm"
          onClick={onRetry}
        >
          <ArrowLeft className="w-4 h-4" /> Retry Pose
        </Button>
        <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight flex-1 text-center sm:text-left">
          Analysis Results
        </h2>
      </motion.div>

      {/* Status banner */}
      {analysisStatus && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className={`mb-5 rounded-2xl border px-5 py-4 shadow-sm ${
            analysisStatus.tone === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/5'
              : 'border-amber-500/20 bg-amber-500/5'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                analysisStatus.tone === 'success'
                  ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400'
                  : 'bg-amber-500/10 text-amber-500 dark:text-amber-400'
              }`}
            >
              {analysisStatus.tone === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{analysisStatus.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{analysisStatus.description}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
        {/* Left column: snapshot + summary */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card text-card-foreground rounded-3xl border border-border/40 p-5 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.06)] relative overflow-hidden isolate"
          >
            {/* Pose info header */}
            <div className="flex items-center gap-3 mb-5 relative z-10">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/15">
                <CameraIcon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">{selectedPose.name}</h3>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">
                  {selectedPose.nameHindi}
                </p>
              </div>
            </div>

            {/* Snapshot */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-muted/30 border border-border/30 overflow-hidden flex items-center justify-center z-10">
              {snapshotDataUrl ? (
                <img src={snapshotDataUrl} alt="Your pose snapshot" className="w-full h-full object-contain" />
              ) : (
                <span className="text-muted-foreground text-sm">Snapshot unavailable</span>
              )}
              <div className="absolute inset-0 ring-1 ring-inset ring-foreground/5 rounded-2xl pointer-events-none" />
            </div>

            {/* Summary */}
            <div className="mt-5 rounded-2xl border border-border/30 bg-muted/20 p-4">
              <p className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em]">
                Summary
              </p>
              <p className="mt-2.5 text-sm leading-relaxed text-foreground/85">
                {analysisResult.feedback}
              </p>
              {poseTags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {poseTags.map((tag) => (
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
              <p className="mt-2.5 text-sm text-muted-foreground">
                Next pose: {analysisResult.nextPose}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="rounded-full border border-border/40 bg-background/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {attemptMeta.sessionId ? 'Backend score' : 'Local score'}
                </span>
                <span className="rounded-full border border-border/40 bg-background/60 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {analysisResult.analysisSource}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right column: score + coaching + feedback */}
        <div className="flex flex-col gap-5">
          {/* Score card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-card text-card-foreground rounded-3xl border border-border/40 p-6 shadow-[0_4px_24px_rgb(0,0,0,0.06)] relative overflow-hidden text-center isolate"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mb-6 relative z-10">
              Form Match
            </h3>
            <ScoreRing score={analysisResult.score} />
            <ScoreBadge score={analysisResult.score} />
          </motion.div>

          {/* Coaching notes */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-card text-card-foreground rounded-3xl border border-border/40 p-5 sm:p-6 shadow-[0_4px_24px_rgb(0,0,0,0.06)] flex-1 justify-center flex flex-col min-h-[180px]"
          >
            <h3 className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary/50 rounded-full" /> Coaching Notes
            </h3>
            <ul className="space-y-3 text-sm font-medium leading-relaxed">
              {analysisResult.corrections.length > 0 ? (
                analysisResult.corrections.map((correction, index) => (
                  <motion.li
                    key={correction}
                    custom={index}
                    variants={correctionVariants}
                    initial="hidden"
                    animate="visible"
                    className="flex gap-2.5 items-start p-3 bg-muted/30 rounded-xl border border-border/30"
                  >
                    <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-background flex items-center justify-center text-[9px] text-muted-foreground font-bold border border-border/50">
                      {index + 1}
                    </span>
                    <span className="pt-0.5 text-foreground/85">{correction}</span>
                  </motion.li>
                ))
              ) : (
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="flex gap-2.5 items-center text-emerald-600 dark:text-emerald-400 p-3 bg-emerald-500/5 border border-emerald-500/15 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" /> Focus on your breath. Your alignment looks strong.
                </motion.li>
              )}
            </ul>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="mt-4 rounded-xl border border-primary/15 bg-primary/3 px-4 py-3 text-sm text-foreground/70"
            >
              {analysisResult.encouragement}
            </motion.div>
          </motion.div>

          {/* Feedback form */}
          <FeedbackForm
            selectedPose={selectedPose}
            feedbackForm={feedbackForm}
            setFeedbackForm={setFeedbackForm}
            attemptMeta={attemptMeta}
            isSavingFeedback={isSavingFeedback}
            isFeedbackSaved={isFeedbackSaved}
            onSubmit={onSubmitFeedback}
          />

          {/* Choose another pose */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button
              className="w-full h-12 text-base font-bold rounded-2xl bg-gradient-to-r from-primary to-orange-500 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/15 gap-2"
              onClick={onChangePose}
            >
              Choose Another Pose <ChevronRight className="w-5 h-5 opacity-60" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResultView;
