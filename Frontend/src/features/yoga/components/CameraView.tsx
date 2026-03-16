import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  AlertCircle,
  Camera as CameraIcon,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { YogaPose } from '../types';

interface CameraViewProps {
  selectedPose: YogaPose;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  realTimeFeedback: string[];
  isStable: boolean;
  isAnalyzing: boolean;
  error: string | null;
  onCapture: () => void;
  onChangePose: () => void;
}

const feedbackVariants = {
  initial: { opacity: 0, y: -12, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.95, transition: { duration: 0.15 } },
};

const CameraView: React.FC<CameraViewProps> = ({
  selectedPose,
  videoRef,
  overlayCanvasRef,
  realTimeFeedback,
  isStable,
  isAnalyzing,
  error,
  onCapture,
  onChangePose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-6xl mx-auto relative z-10"
    >
      <Card className="border-border/40 bg-card/90 backdrop-blur-xl shadow-[0_24px_60px_-44px_rgba(55,39,18,0.3)] overflow-hidden rounded-[2rem]">
        <CardHeader className="text-center pb-4 pt-5 bg-gradient-to-b from-primary/5 to-transparent relative border-b border-border/30 flex flex-col sm:flex-row justify-between items-center px-6 gap-3">
          <div className="text-left">
            <CardTitle className="flex flex-col items-start gap-0.5">
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-500">
                {selectedPose.name}
              </span>
              <span className="text-sm font-comic text-muted-foreground font-medium">
                {selectedPose.nameHindi}
              </span>
            </CardTitle>
          </div>

          <Button
            variant="outline"
            className="h-9 rounded-full border-border/40 font-semibold hover:bg-muted text-sm px-5"
            onClick={onChangePose}
            disabled={isAnalyzing}
          >
            End Practice
          </Button>
        </CardHeader>

        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row w-full h-[600px] lg:h-[620px] divide-y lg:divide-y-0 lg:divide-x divide-border/30">
            {/* Left panel — Target pose info */}
            <div className="w-full lg:w-[320px] shrink-0 bg-muted/20 p-5 sm:p-6 flex flex-col relative overflow-y-auto hidden lg:flex">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-transparent" />
              <div className="relative z-10 w-full flex flex-col h-full">
                <h3 className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                  Target Pose
                </h3>

                <div className="w-full aspect-[4/5] rounded-2xl bg-background shadow-sm border border-border/50 overflow-hidden mb-5 relative group isolate">
                  {selectedPose.imageUrl ? (
                    <img src={selectedPose.imageUrl} alt={selectedPose.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-muted/30 flex items-center justify-center text-muted-foreground text-sm font-medium">
                      Image loading...
                    </div>
                  )}
                  <div className="absolute inset-0 border-2 border-foreground/5 rounded-2xl pointer-events-none" />
                </div>

                <div className="bg-background/80 rounded-xl p-4 border border-border/40 shadow-sm mt-auto backdrop-blur-sm">
                  <h4 className="text-[13px] font-bold text-foreground mb-1.5">Instructions</h4>
                  <p className="text-[12px] text-muted-foreground leading-relaxed font-medium">
                    {selectedPose.description}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50 mt-2">
                    Match the skeleton overlay and hold the pose steady before capture.
                  </p>
                </div>
              </div>
            </div>

            {/* Right panel — Camera feed */}
            <div className="flex-grow p-3 sm:p-5 bg-stone-950 relative flex items-center justify-center overflow-hidden">
              <div className="relative w-full h-full max-h-[580px] flex justify-center items-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-700 ${
                    isAnalyzing ? 'filter contrast-110 brightness-110 scale-[1.02]' : 'scale-100'
                  }`}
                  style={{ transform: isAnalyzing ? 'scaleX(-1) scale(1.02)' : 'scaleX(-1)' }}
                />

                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
                />

                {/* Guide border */}
                <div className="absolute inset-4 md:inset-6 border border-white/10 border-dashed rounded-xl pointer-events-none transition-all duration-300 z-20" />

                {/* Real-time feedback overlays */}
                <div className="absolute top-4 left-4 right-4 z-30 flex flex-col gap-2 pointer-events-none">
                  <AnimatePresence mode="popLayout">
                    {realTimeFeedback.map((feedback: string) => (
                      <motion.div
                        key={feedback}
                        variants={feedbackVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        layout
                        className="bg-orange-500/20 backdrop-blur-md border border-orange-500/30 text-orange-200 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                        {feedback}
                      </motion.div>
                    ))}

                    {isStable && (
                      <motion.div
                        key="stable"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-200 px-3.5 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 shadow-lg self-start"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        Pose Stabilized
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Capture button */}
                {!isAnalyzing && (
                  <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <Button
                        onClick={onCapture}
                        className="h-16 w-16 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/40 text-white shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-90 group"
                      >
                        <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center group-hover:scale-95 transition-transform">
                          <CameraIcon className="w-6 h-6 text-stone-900" />
                        </div>
                      </Button>
                    </motion.div>
                    <span className="text-white/70 text-xs font-medium drop-shadow-md">Capture Pose</span>
                  </div>
                )}

                {/* Analyzing overlay */}
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-2xl"
                    >
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="flex flex-col items-center gap-4 p-8 bg-stone-900/90 rounded-3xl border border-white/10 shadow-2xl"
                      >
                        <div className="relative">
                          <div className="w-12 h-12 border-[3px] border-primary/30 rounded-full" />
                          <div className="absolute inset-0 w-12 h-12 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <p className="text-white font-medium text-lg tracking-wide">
                          Analyzing your form...
                        </p>
                        <p className="text-white/40 text-sm">This takes a moment</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Camera error */}
      <AnimatePresence>
        {error && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/8 px-5 py-3.5 text-sm font-medium text-red-700 backdrop-blur-sm"
          >
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CameraView;
