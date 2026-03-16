import React from 'react';
import { motion } from 'motion/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { YogaPose } from '../types';
import type { YogaFeedbackFormState, YogaAttemptMeta } from '../hooks/useAnalysis';
import { formatWellnessTag, getPoseMentalHealthTags, moodAfterOptions } from '../hooks/useAnalysis';

interface FeedbackFormProps {
  selectedPose: YogaPose;
  feedbackForm: YogaFeedbackFormState;
  setFeedbackForm: React.Dispatch<React.SetStateAction<YogaFeedbackFormState>>;
  attemptMeta: YogaAttemptMeta;
  isSavingFeedback: boolean;
  isFeedbackSaved: boolean;
  onSubmit: () => void;
}

const pillVariants = {
  tap: { scale: 0.92 },
  selected: { scale: 1 },
};

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  selectedPose,
  feedbackForm,
  setFeedbackForm,
  attemptMeta,
  isSavingFeedback,
  isFeedbackSaved,
  onSubmit,
}) => {
  const poseTags = getPoseMentalHealthTags(selectedPose);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-card text-card-foreground rounded-3xl border border-border/40 p-6 sm:p-7 shadow-[0_4px_24px_rgb(0,0,0,0.06)]"
    >
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
            Reflection
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Save what this pose was best for so the chatbot can recommend what helped you before.
          </p>
        </div>
        {isFeedbackSaved && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          >
            <Badge variant="accent">Saved</Badge>
          </motion.div>
        )}
      </div>

      {!attemptMeta.sessionId || !attemptMeta.poseAttemptId ? (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Feedback unlocks when the backend sync succeeds. Local-only analyses still work,
          but they are not added to your long-term wellness history.
        </div>
      ) : null}

      <div className="mt-5 space-y-5">
        {/* Rating */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2.5">How helpful was this?</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                type="button"
                variants={pillVariants}
                whileTap="tap"
                onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: value }))}
                className={`min-w-10 rounded-full border px-3 py-1.5 text-sm font-semibold transition-colors ${
                  feedbackForm.rating === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Helpful */}
        <div>
          <p className="text-sm font-semibold text-foreground mb-2.5">Did it feel helpful?</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Yes', value: true },
              { label: 'Not really', value: false },
            ].map((option) => (
              <motion.button
                key={option.label}
                type="button"
                variants={pillVariants}
                whileTap="tap"
                onClick={() => setFeedbackForm((prev) => ({ ...prev, helpful: option.value }))}
                className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                  feedbackForm.helpful === option.value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                }`}
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Targeted concern */}
        {poseTags.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-foreground mb-2.5">What were you trying to support?</p>
            <div className="flex flex-wrap gap-2">
              {poseTags.map((tag) => (
                <motion.button
                  key={`concern-${tag}`}
                  type="button"
                  variants={pillVariants}
                  whileTap="tap"
                  onClick={() => setFeedbackForm((prev) => ({ ...prev, targetedConcern: tag }))}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    feedbackForm.targetedConcern === tag
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border/50 bg-background/50 text-muted-foreground hover:border-primary/30 hover:text-foreground'
                  }`}
                >
                  {formatWellnessTag(tag)}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Mood */}
        <div className="grid gap-1.5">
          <label className="text-sm font-semibold text-foreground" htmlFor="yoga-mood-after">
            How do you feel now?
          </label>
          <Select
            value={feedbackForm.moodAfter}
            onValueChange={(value) => setFeedbackForm((prev) => ({ ...prev, moodAfter: value }))}
          >
            <SelectTrigger
              id="yoga-mood-after"
              className="h-10 w-full rounded-xl border-border/50 bg-background/60"
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
              setFeedbackForm((prev) => ({ ...prev, notes: event.target.value }))
            }
            className="min-h-20 rounded-xl border-border/50 bg-background/60"
            placeholder="What worked or what still felt off?"
          />
        </div>

        <Button
          className="h-11 w-full rounded-xl"
          disabled={
            isSavingFeedback ||
            isFeedbackSaved ||
            !attemptMeta.sessionId ||
            !attemptMeta.poseAttemptId
          }
          onClick={onSubmit}
        >
          {isSavingFeedback
            ? 'Saving feedback...'
            : isFeedbackSaved
              ? 'Feedback saved ✓'
              : 'Save feedback to your history'}
        </Button>
      </div>
    </motion.div>
  );
};

export default FeedbackForm;
