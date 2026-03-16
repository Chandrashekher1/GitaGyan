import express from 'express';
import { analyzeYogaPose, PoseLandmark } from '../services/poseAnalysis.js';
import YogaSession from '../models/yogaSession.js';

const router = express.Router();

const YOGA_POSES = [
  {
    id: 1,
    name: 'Tadasana (Mountain Pose)',
    nameHindi: 'ताड़ासन',
    difficulty: 'beginner',
    description: 'A foundational standing pose. It promotes balance, improves posture, and strengthens the thighs, knees, and ankles.',
    benefits: ['Improves posture', 'Strengthens lower body', 'Increases awareness'],
    imageUrl: '/poses/tadasana.png',
  },
  {
    id: 2,
    name: 'Vrikshasana (Tree Pose)',
    nameHindi: 'वृक्षासन',
    difficulty: 'beginner',
    description: 'Improves balance and focus while strengthening the legs, ankles, and core.',
    benefits: ['Improves balance', 'Strengthens legs', 'Enhances focus'],
    imageUrl: '/poses/vrikshasana.png',
  },
  {
    id: 3,
    name: 'Adho Mukha Svanasana (Downward-Facing Dog)',
    nameHindi: 'अधोमुखश्वानासन',
    difficulty: 'beginner',
    description: 'Stretches the back, hamstrings, and calves while strengthening the arms and shoulders.',
    benefits: ['Stretches full body', 'Energizes', 'Relieves tension'],
    imageUrl: '/poses/adho_mukha_svanasana.png',
  },
  {
    id: 4,
    name: 'Virabhadrasana II (Warrior II)',
    nameHindi: 'वीरभद्रासन II',
    difficulty: 'intermediate',
    description: 'Builds stamina, stretches hips and groins, and strengthens legs and arms.',
    benefits: ['Builds stamina', 'Stretches hips', 'Strengthens legs'],
    imageUrl: '/poses/virabhadrasana_ii.png',
  },
  {
    id: 5,
    name: 'Bhujangasana (Cobra Pose)',
    nameHindi: 'भुजंगासन',
    difficulty: 'beginner',
    description: 'Opens the chest, strengthens the spine, and soothes sciatica.',
    benefits: ['Strengthens spine', 'Opens chest', 'Improves posture'],
    imageUrl: '/poses/bhujangasana.png',
  },
  {
    id: 6,
    name: 'Balasana (Child\'s Pose)',
    nameHindi: 'बालासन',
    difficulty: 'beginner',
    description: 'A resting pose that stretches the hips, thighs, and ankles while calming the brain and relieving stress.',
    benefits: ['Calms the brain', 'Stretches hips', 'Relieves back pain'],
    imageUrl: '/poses/balasana.png',
  },
  {
    id: 7,
    name: 'Trikonasana (Triangle Pose)',
    nameHindi: 'त्रिकोणासन',
    difficulty: 'intermediate',
    description: 'Stretches the legs, muscles around the knee, ankle joints, hips, groin muscles, hamstrings, calves, shoulders, chest, and spine.',
    benefits: ['Improves digestion', 'Reduces back pain', 'Stretches legs'],
    imageUrl: '/poses/trikonasana.png',
  },
  {
    id: 8,
    name: 'Setu Bandhasana (Bridge Pose)',
    nameHindi: 'सेतु बन्धासन',
    difficulty: 'beginner',
    description: 'Calms the brain and helps alleviate stress and mild depression, stretches the chest, neck, and spine.',
    benefits: ['Calms the brain', 'Stretches chest', 'Stimulates abdominal organs'],
    imageUrl: '/poses/setu_bandhasana.png',
  },
  {
    id: 9,
    name: 'Shavasana (Corpse Pose)',
    nameHindi: 'शवासन',
    difficulty: 'beginner',
    description: 'A pose of total relaxation, making it one of the most challenging but most rewarding yoga poses.',
    benefits: ['Deep relaxation', 'Reduces headache', 'Lowers blood pressure'],
    imageUrl: '/poses/shavasana.png',
  },
  {
    id: 10,
    name: 'Sukhasana (Easy Seated Pose)',
    nameHindi: 'सुखासन',
    difficulty: 'beginner',
    description: 'A comfortable seated posture for meditation that strengthens the back and stretches the knees and ankles.',
    benefits: ['Improves posture', 'Strengthens back', 'Promotes inner calm'],
    imageUrl: '/poses/sukhasana.png',
  },
];

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
    const poseData = YOGA_POSES.find((p) => p.name === poseName);
    let sessionId: string | null = null;
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
      overallScore = session.overallScore;
      historySaved = true;
    } catch (saveError: any) {
      persistenceError = saveError?.message || 'Unable to save yoga history';
      console.error('yoga history save error:', saveError);
    }

    res.json({
      analysisResult,
      sessionId,
      overallScore,
      historySaved,
      persistenceError,
    });
  } catch (err) {
    console.error('yoga analyze error:', err);
    res.status(500).json({ error: 'Analysis failed. Please try again.' });
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
