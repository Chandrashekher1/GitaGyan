import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import YogaCamera from './YogaCamera';
import { getYogaHistory } from './api';
import { getOrCreateLocalUserId } from '@/lib/user-session';
import YogaErrorBoundary from './components/YogaErrorBoundary';

const YogaPage: React.FC = () => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const userId = getOrCreateLocalUserId();
    getYogaHistory(userId)
      .then((data) => setStreak(data.streak))
      .catch(() => {});
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background orbs */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 overflow-hidden">
        <div className="absolute right-[-8rem] top-[-2rem] h-[26rem] w-[26rem] rounded-full bg-[radial-gradient(circle,rgba(214,174,88,0.12),rgba(214,174,88,0)_70%)] blur-3xl" />
        <div className="absolute left-[-10rem] top-[18rem] h-[22rem] w-[22rem] rounded-full border border-primary/5" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <div className="section-label mb-4">
              <span className="eyebrow-dot" />
              AI-powered posture analysis
            </div>
            <h1 className="display-font text-4xl sm:text-5xl font-semibold text-foreground">
              Yoga & Posture AI
            </h1>
            <p className="text-base text-muted-foreground mt-2 max-w-lg">
              Perfect your form with real-time AI guidance and step-by-step feedback.
            </p>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/8 px-4 py-2 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
              </span>
              <span className="text-sm font-bold text-accent-foreground">
                {streak} Day Streak!
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* Content Area */}
        <YogaErrorBoundary>
          <div className="relative w-full transition-all duration-500">
            <YogaCamera />
          </div>
        </YogaErrorBoundary>
      </div>
    </div>
  );
};

export default YogaPage;
