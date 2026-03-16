import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { YogaPose } from '../types';
import { formatWellnessTag, getPoseMentalHealthTags } from '../hooks/useAnalysis';

interface PoseSelectorProps {
  poses: YogaPose[];
  loading: boolean;
  error: string | null;
  onSelectPose: (pose: YogaPose) => void;
  onRetry?: () => void;
}

const difficultyConfig: Record<string, { bg: string; text: string; glow: string }> = {
  beginner: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-700 dark:text-emerald-400',
    glow: 'shadow-emerald-500/20',
  },
  intermediate: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-700 dark:text-amber-400',
    glow: 'shadow-amber-500/20',
  },
  advanced: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-700 dark:text-rose-400',
    glow: 'shadow-rose-500/20',
  },
};

function ShimmerCard() {
  return (
    <div className="rounded-[2rem] border border-border/30 bg-card/60 p-5 backdrop-blur-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2.5 flex-1">
          <div className="h-5 w-3/4 rounded-lg bg-muted/50 animate-pulse" />
          <div className="h-4 w-1/2 rounded-lg bg-muted/35 animate-pulse" />
        </div>
        <div className="h-6 w-20 rounded-full bg-muted/35 animate-pulse" />
      </div>
      <div className="h-12 w-full rounded-xl bg-muted/25 animate-pulse mb-4" />
      <div className="flex gap-2">
        <div className="h-6 w-16 rounded-full bg-muted/25 animate-pulse" />
        <div className="h-6 w-20 rounded-full bg-muted/25 animate-pulse" />
        <div className="h-6 w-14 rounded-full bg-muted/25 animate-pulse" />
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 260,
      damping: 24,
    },
  },
};

const PoseSelector: React.FC<PoseSelectorProps> = ({ poses, loading, error, onSelectPose, onRetry }) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg mx-auto"
      >
        <Card className="border-destructive/20 bg-destructive/5 shadow-[0_24px_60px_-44px_rgba(200,92,71,0.3)] backdrop-blur-md rounded-[2rem]">
          <CardContent className="py-10 flex flex-col items-center text-center gap-4">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-destructive/10 border border-destructive/15"
            >
              <AlertCircle className="w-7 h-7 text-destructive" />
            </motion.div>
            <div>
              <p className="text-base font-semibold text-foreground mb-1">Something went wrong</p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">{error}</p>
            </div>
            {onRetry && (
              <Button
                variant="outline"
                className="rounded-full gap-2 mt-1 border-destructive/20 hover:bg-destructive/5"
                onClick={onRetry}
              >
                <RefreshCw className="w-4 h-4" /> Try again
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
            <ShimmerCard />
          </motion.div>
        ))}
      </div>
    );
  }

  if (poses.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 border border-primary/15">
          <Sparkles className="w-8 h-8 text-primary animate-wisdom" />
        </div>
        <p className="text-lg text-muted-foreground font-medium">No poses available yet</p>
        <p className="text-sm text-muted-foreground/60 mt-1">Check back soon or refresh the page.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
    >
      {poses.map((pose) => {
        const difficulty = difficultyConfig[pose.difficulty] || difficultyConfig.beginner;
        const tags = getPoseMentalHealthTags(pose);

        return (
          <motion.div
            key={pose.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className="group relative cursor-pointer overflow-hidden border-border/40 bg-card/80 backdrop-blur-sm rounded-[2rem] shadow-[0_12px_40px_-20px_rgba(55,39,18,0.15)] hover:shadow-[0_20px_50px_-20px_rgba(143,75,44,0.25)] transition-shadow duration-500"
              onClick={() => onSelectPose(pose)}
            >
              {/* Gradient hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Top accent line */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="text-[17px] font-semibold text-foreground group-hover:text-primary transition-colors duration-300 leading-snug">
                      {pose.name}
                    </CardTitle>
                    <p className="text-[14px] text-muted-foreground mt-1 font-medium font-comic truncate">
                      {pose.nameHindi}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full capitalize tracking-wide shrink-0 shadow-sm ${difficulty.bg} ${difficulty.text}`}
                  >
                    {pose.difficulty}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="pt-0 relative z-10">
                <p className="text-sm text-foreground/70 mb-4 line-clamp-2 leading-relaxed">
                  {pose.description}
                </p>

                {tags.length > 0 && (
                  <div className="mb-3.5">
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                      Best for
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map((tag) => (
                        <Badge
                          key={`${pose.id}-${tag}`}
                          variant="outline"
                          className="border-primary/15 bg-primary/5 text-[0.6rem] text-primary/80 font-medium"
                        >
                          {formatWellnessTag(tag)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {pose.benefits.slice(0, 3).map((benefit) => (
                    <span
                      key={benefit}
                      className="text-[11px] bg-muted/30 border border-border/25 text-muted-foreground px-2.5 py-0.5 rounded-full"
                    >
                      {benefit}
                    </span>
                  ))}
                  {pose.benefits.length > 3 && (
                    <span className="text-[11px] text-muted-foreground/50 px-1 py-0.5">
                      +{pose.benefits.length - 3}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default PoseSelector;
