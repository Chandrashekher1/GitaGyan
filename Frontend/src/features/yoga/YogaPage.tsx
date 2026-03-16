import React, { useState, useEffect } from 'react';
import YogaCamera from './YogaCamera';
import type { YogaPose } from './types';
import { getYogaHistory, getYogaPoses } from './api';

const YogaPage: React.FC = () => {
  const [streak, setStreak] = useState(0);
  const [, setPoses] = useState<YogaPose[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem('uid') ?? 'anonymous';
    getYogaHistory(userId)
      .then((data) => setStreak(data.streak))
      .catch(() => {});
    getYogaPoses()
      .then((data) => setPoses(data))
      .catch(() => {});
  }, []);

// Handlers for result pages removed, since the camera now provides continuous live feedback!

  return (
    <div className="min-h-screen bg-background bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
              Yoga & Posture AI
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground mt-2 font-medium">
              Perfect your form with real-time AI guidance
            </p>
          </div>
          {streak > 0 && (
            <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 px-4 py-2 shadow-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
              <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                {streak} Day Streak!
              </span>
            </div>
          )}
        </div>

        {/* Content Area */}
        <div className="relative w-full transition-all duration-500">
           <YogaCamera />
        </div>
      </div>
    </div>
  );
};

export default YogaPage;
