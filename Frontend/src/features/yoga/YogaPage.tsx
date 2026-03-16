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
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Yoga & Posture AI
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-1.5 font-medium">
              Perfect your form with real-time AI guidance
            </p>
          </div>
          {streak > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.3 }}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-2 shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
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
