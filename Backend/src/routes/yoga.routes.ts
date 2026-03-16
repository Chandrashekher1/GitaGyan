import express from 'express';
import { analyzeYogaPose, PoseLandmark } from '../services/poseAnalysis.js';
import YogaSession from '../models/yogaSession.js';
import { YOGA_POSES, findYogaPoseByName } from '../utils/wellnessCatalog.js';

const router = express.Router();

router.get('/poses', (_req: any, res: any) => {
  res.json(YOGA_POSES);
});

router.get('/health', (_req: any, res: any) => {
  res.json({
    ok: true,
    mongoReady: YogaSession.db.readyState === 1,
    poseEngine: 'rules',
  });
});

router.post('/analyze', async (req: any, res: any) => {
  try {
    const { poseName, userId, landmarks } = req.body as {
      poseName?: string;
      userId?: string;
      landmarks?: PoseLandmark[];
    };

    if (!poseName || !userId || !Array.isArray(landmarks)) {
      return res
        .status(400)
        .json({ error: 'poseName, userId, and landmarks are required' });
    }

    const analysisResult = analyzeYogaPose(landmarks, poseName);
    const poseData = findYogaPoseByName(poseName);
    let sessionId: string | null = null;
    let poseAttemptId: string | null = null;
    let overallScore = analysisResult.score;
    let historySaved = false;
    let persistenceError: string | undefined;

    try {
      if (YogaSession.db.readyState !== 1) {
        throw new Error('MongoDB connection is not ready');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const session = await YogaSession.findOneAndUpdate(
        { userId, sessionDate: { $gte: today } },
        {
          $push: {
            posesAttempted: {
              poseName,
              poseNameHindi: poseData?.nameHindi || '',
              imageBase64: '',
              mentalHealthTags: poseData?.mentalHealthTags || [],
              analysisResult,
            },
          },
          $setOnInsert: { sessionDate: new Date(), userId },
        },
        { upsert: true, new: true }
      );

      const scores = session.posesAttempted.map(
        (attempt: any) => attempt.analysisResult?.score || 0
      );
      session.overallScore = Math.round(
        scores.reduce((sum: number, value: number) => sum + value, 0) / scores.length
      );
      await session.save();

      sessionId = String(session._id);
      poseAttemptId = String(session.posesAttempted[session.posesAttempted.length - 1]?._id);
      overallScore = session.overallScore;
      historySaved = true;
    } catch (saveError: any) {
      persistenceError = saveError?.message || 'Unable to save yoga history';
      console.error('yoga history save error:', saveError);
    }

    res.json({
      analysisResult,
      sessionId,
      poseAttemptId,
      overallScore,
      historySaved,
      persistenceError,
    });
  } catch (err) {
    console.error('yoga analyze error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
  }
});

router.post('/feedback', async (req: any, res: any) => {
  try {
    const {
      sessionId,
      poseAttemptId,
      rating,
      helpful,
      targetedConcern,
      moodAfter,
      notes,
    } = req.body as {
      sessionId?: string;
      poseAttemptId?: string;
      rating?: number;
      helpful?: boolean;
      targetedConcern?: string;
      moodAfter?: string;
      notes?: string;
    };

    if (!sessionId || !poseAttemptId || !rating || typeof helpful !== 'boolean') {
      return res.status(400).json({
        error: 'sessionId, poseAttemptId, rating, and helpful are required',
      });
    }

    const session = await YogaSession.findOneAndUpdate(
      { _id: sessionId, 'posesAttempted._id': poseAttemptId },
      {
        $set: {
          'posesAttempted.$.feedback': {
            rating,
            helpful,
            targetedConcern: targetedConcern || '',
            moodAfter: moodAfter || '',
            notes: notes || '',
            submittedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ error: 'Yoga attempt not found' });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('yoga feedback error:', error);
    res
      .status(500)
      .json({ error: error?.message || 'Could not save yoga feedback' });
  }
});

router.get('/history/:userId', async (req: any, res: any) => {
  try {
    if (YogaSession.db.readyState !== 1) {
      return res.json({ sessions: [], streak: 0, historyAvailable: false });
    }

    const sessions = await YogaSession.find({ userId: req.params.userId })
      .sort({ sessionDate: -1 })
      .limit(10)
      .select('-posesAttempted.imageBase64');

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < sessions.length; i++) {
      const sessionDay = new Date(sessions[i]!.sessionDate);
      sessionDay.setHours(0, 0, 0, 0);
      const diffDays = Math.round(
        (today.getTime() - sessionDay.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === i) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ sessions, streak, historyAvailable: true });
  } catch (err) {
    console.error('yoga history error:', err);
    res.json({ sessions: [], streak: 0, historyAvailable: false });
  }
});

export default router;
