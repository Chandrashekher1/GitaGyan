import type { PoseAnalysisResult, PoseLandmark } from '../types';

const POSE_SEQUENCE = [
  'Tadasana (Mountain Pose)',
  'Vrikshasana (Tree Pose)',
  'Adho Mukha Svanasana (Downward-Facing Dog)',
  'Virabhadrasana II (Warrior II)',
  'Bhujangasana (Cobra Pose)',
  'Balasana (Child\'s Pose)',
  'Trikonasana (Triangle Pose)',
  'Setu Bandhasana (Bridge Pose)',
  'Shavasana (Corpse Pose)',
  'Sukhasana (Easy Seated Pose)',
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function landmark(landmarks: PoseLandmark[], index: number): PoseLandmark {
  return landmarks[index]!;
}

export function calculateAngle(
  pointA: PoseLandmark,
  pointB: PoseLandmark,
  pointC: PoseLandmark
): number {
  const radians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);

  let angle = Math.abs((radians * 180) / Math.PI);
  if (angle > 180) {
    angle = 360 - angle;
  }

  return angle;
}

function distance(pointA: PoseLandmark, pointB: PoseLandmark): number {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

function midpoint(pointA: PoseLandmark, pointB: PoseLandmark): PoseLandmark {
  return {
    x: (pointA.x + pointB.x) / 2,
    y: (pointA.y + pointB.y) / 2,
    z: ((pointA.z ?? 0) + (pointB.z ?? 0)) / 2,
    visibility: ((pointA.visibility ?? 1) + (pointB.visibility ?? 1)) / 2,
  };
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function penaltyForTarget(
  value: number,
  target: number,
  tolerance: number,
  failAt: number,
  maxPenalty: number
): number {
  const diff = Math.abs(value - target);
  if (diff <= tolerance) {
    return 0;
  }

  return clamp(
    ((diff - tolerance) / Math.max(failAt - tolerance, 0.0001)) * maxPenalty,
    0,
    maxPenalty
  );
}

function penaltyForMax(
  value: number,
  maxAllowed: number,
  failDelta: number,
  maxPenalty: number
): number {
  if (value <= maxAllowed) {
    return 0;
  }

  return clamp(
    ((value - maxAllowed) / Math.max(failDelta, 0.0001)) * maxPenalty,
    0,
    maxPenalty
  );
}

function penaltyForMin(
  value: number,
  minAllowed: number,
  failDelta: number,
  maxPenalty: number
): number {
  if (value >= minAllowed) {
    return 0;
  }

  return clamp(
    ((minAllowed - value) / Math.max(failDelta, 0.0001)) * maxPenalty,
    0,
    maxPenalty
  );
}

export function hasReliablePoseLandmarks(landmarks: PoseLandmark[]): boolean {
  if (!Array.isArray(landmarks) || landmarks.length < 29) {
    return false;
  }

  return (
    landmarks.filter(
      (item) =>
        Number.isFinite(item?.x) &&
        Number.isFinite(item?.y) &&
        (item.visibility === undefined || item.visibility > 0.15)
    ).length >= 24
  );
}

function inferNextPose(poseName: string): string {
  const index = POSE_SEQUENCE.indexOf(poseName);
  if (index === -1) {
    return poseName;
  }

  return POSE_SEQUENCE[(index + 1) % POSE_SEQUENCE.length]!;
}

export function analyzePoseLandmarks(
  poseName: string,
  landmarks: PoseLandmark[]
): PoseAnalysisResult {
  if (!hasReliablePoseLandmarks(landmarks)) {
    return {
      score: 0,
      feedback: 'Pose landmarks were not detected reliably. Move fully into frame and try again.',
      corrections: [
        'Step back so your full body is visible.',
        'Use brighter lighting and keep the camera steady.',
      ],
      alignment_issues: ['Insufficient body tracking for analysis'],
      nextPose: poseName,
      encouragement: 'Reset your stance and capture again.',
      analysisSource: 'rules',
      isDetected: false,
    };
  }

  const leftShoulder = landmark(landmarks, 11);
  const rightShoulder = landmark(landmarks, 12);
  const leftElbow = landmark(landmarks, 13);
  const rightElbow = landmark(landmarks, 14);
  const leftWrist = landmark(landmarks, 15);
  const rightWrist = landmark(landmarks, 16);
  const leftHip = landmark(landmarks, 23);
  const rightHip = landmark(landmarks, 24);
  const leftKnee = landmark(landmarks, 25);
  const rightKnee = landmark(landmarks, 26);
  const leftAnkle = landmark(landmarks, 27);
  const rightAnkle = landmark(landmarks, 28);

  const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
  const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
  const leftElbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
  const rightElbowAngle = calculateAngle(rightShoulder, rightElbow, rightWrist);
  const shoulderCenter = midpoint(leftShoulder, rightShoulder);
  const hipCenter = midpoint(leftHip, rightHip);
  const ankleCenter = midpoint(leftAnkle, rightAnkle);
  const torsoLean = Math.abs(shoulderCenter.x - hipCenter.x);
  const shouldersLevel = Math.abs(leftShoulder.y - rightShoulder.y);
  const hipsLevel = Math.abs(leftHip.y - rightHip.y);
  const armsStraight = average([leftElbowAngle, rightElbowAngle]);
  const legsStraight = average([leftKneeAngle, rightKneeAngle]);
  const visibilityAverage = average(
    [11, 12, 23, 24, 25, 26, 27, 28].map(
      (index) => landmarks[index]?.visibility ?? 0.9
    )
  );

  const findings: Array<{
    penalty: number;
    issue: string;
    correction: string;
  }> = [];

  const addFinding = (penalty: number, issue: string, correction: string) => {
    if (penalty < 2) {
      return;
    }

    findings.push({
      penalty,
      issue,
      correction,
    });
  };

  if (poseName.includes('Tadasana') || poseName.includes('Mountain')) {
    addFinding(
      penaltyForMax(shouldersLevel, 0.03, 0.08, 16),
      'Shoulders are uneven',
      'Square both shoulders and relax the neck.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.03, 0.08, 16),
      'Hips are tilted',
      'Root evenly through both feet and level the pelvis.'
    );
    addFinding(
      penaltyForMin(legsStraight, 168, 35, 18),
      'Legs are not fully engaged',
      'Press through both legs and lift the kneecaps gently.'
    );
    addFinding(
      penaltyForMax(torsoLean, 0.035, 0.08, 18),
      'Torso is leaning',
      'Stack shoulders directly over hips.'
    );
    addFinding(
      penaltyForMax(Math.abs(hipCenter.x - ankleCenter.x), 0.04, 0.12, 14),
      'Weight is not centered',
      'Bring your weight back to the middle of both feet.'
    );
  } else if (poseName.includes('Vrikshasana') || poseName.includes('Tree')) {
    const bentKnee = Math.min(leftKneeAngle, rightKneeAngle);
    const standingKnee = Math.max(leftKneeAngle, rightKneeAngle);
    addFinding(
      penaltyForMin(standingKnee, 165, 30, 18),
      'Standing leg is not stable',
      'Firm up the standing leg and avoid locking the knee.'
    );
    addFinding(
      penaltyForMax(bentKnee, 130, 35, 20),
      'Raised leg is not opened enough',
      'Open the bent knee out to the side and place the foot higher if comfortable.'
    );
    addFinding(
      penaltyForMax(torsoLean, 0.05, 0.09, 16),
      'Torso is wobbling',
      'Lift through the crown and keep the chest centered over the hips.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.07, 0.08, 14),
      'Pelvis is dropping to one side',
      'Draw the lifted knee back without collapsing the standing hip.'
    );
    addFinding(
      penaltyForMax(shouldersLevel, 0.06, 0.08, 12),
      'Upper body is uneven',
      'Relax the shoulders and keep the ribcage stacked.'
    );
  } else if (poseName.includes('Adho Mukha') || poseName.includes('Downward-Facing Dog')) {
    const hipFold = average([
      calculateAngle(leftShoulder, leftHip, leftAnkle),
      calculateAngle(rightShoulder, rightHip, rightAnkle),
    ]);
    addFinding(
      penaltyForMin(shoulderCenter.y - hipCenter.y, 0.08, 0.12, 20),
      'Hips are not lifted enough',
      'Press the hips up and back to form an inverted V shape.'
    );
    addFinding(
      penaltyForMin(armsStraight, 160, 35, 16),
      'Arms are bending',
      'Push the floor away and lengthen through both arms.'
    );
    addFinding(
      penaltyForMin(legsStraight, 150, 35, 16),
      'Legs are collapsing',
      'Straighten the legs as much as possible while keeping the spine long.'
    );
    addFinding(
      penaltyForTarget(hipFold, 80, 15, 45, 18),
      'Body shape is not close to a downward dog line',
      'Lengthen the spine and shift the chest back toward the thighs.'
    );
    addFinding(
      penaltyForMax(shouldersLevel, 0.08, 0.08, 10),
      'Shoulders are uneven',
      'Spread weight evenly through both hands.'
    );
  } else if (poseName.includes('Virabhadrasana II') || poseName.includes('Warrior II')) {
    const frontKnee = Math.min(leftKneeAngle, rightKneeAngle);
    const backKnee = Math.max(leftKneeAngle, rightKneeAngle);
    const armLineAverage = average([
      Math.abs(leftWrist.y - leftShoulder.y),
      Math.abs(rightWrist.y - rightShoulder.y),
    ]);
    addFinding(
      penaltyForTarget(frontKnee, 95, 12, 45, 22),
      'Front knee is not near a right angle',
      'Bend the front knee deeper until it stacks over the ankle.'
    );
    addFinding(
      penaltyForMin(backKnee, 160, 30, 18),
      'Back leg is not active',
      'Straighten and energize the back leg.'
    );
    addFinding(
      penaltyForMax(armLineAverage, 0.05, 0.12, 14),
      'Arms are not level',
      'Reach strongly in both directions at shoulder height.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.06, 0.08, 12),
      'Pelvis is unstable',
      'Ground through both feet and keep the pelvis steady.'
    );
    addFinding(
      penaltyForMax(torsoLean, 0.07, 0.1, 12),
      'Torso is drifting off center',
      'Keep the ribcage upright over the hips.'
    );
  } else if (poseName.includes('Bhujangasana') || poseName.includes('Cobra')) {
    addFinding(
      penaltyForMin(hipCenter.y - shoulderCenter.y, 0.08, 0.14, 20),
      'Chest is not lifted enough',
      'Lift the chest forward and up without crunching the neck.'
    );
    addFinding(
      penaltyForTarget(armsStraight, 125, 20, 70, 16),
      'Elbows are not in a healthy bend',
      'Keep a soft bend in the elbows and draw them close to the ribs.'
    );
    addFinding(
      penaltyForMin(legsStraight, 155, 30, 12),
      'Lower body is not grounded',
      'Press the tops of the feet and thighs into the mat.'
    );
    addFinding(
      penaltyForMax(shouldersLevel, 0.07, 0.08, 10),
      'Shoulders are uneven',
      'Broaden across the collarbones evenly.'
    );
  } else if (poseName.includes('Balasana') || poseName.includes('Child')) {
    const hipToHeel = average([
      distance(leftHip, leftAnkle),
      distance(rightHip, rightAnkle),
    ]);
    const foldAngle = average([
      calculateAngle(leftShoulder, leftHip, leftKnee),
      calculateAngle(rightShoulder, rightHip, rightKnee),
    ]);
    addFinding(
      penaltyForMin(hipToHeel, 0.22, 0.18, 18),
      'Hips are too far from the heels',
      'Sink the hips back toward the heels.'
    );
    addFinding(
      penaltyForMin(foldAngle, 90, 40, 18),
      'Torso is not folded enough',
      'Relax the chest closer to the thighs.'
    );
    addFinding(
      penaltyForMax(Math.max(leftKneeAngle, rightKneeAngle), 120, 45, 12),
      'Knees are not comfortably bent',
      'Allow the knees to fold and soften the front body.'
    );
  } else if (poseName.includes('Trikonasana') || poseName.includes('Triangle')) {
    const sideBend = average([
      calculateAngle(leftShoulder, leftHip, leftAnkle),
      calculateAngle(rightShoulder, rightHip, rightAnkle),
    ]);
    addFinding(
      penaltyForMin(legsStraight, 162, 35, 18),
      'Legs are not fully extended',
      'Lengthen both legs and lift through the kneecaps.'
    );
    addFinding(
      penaltyForTarget(sideBend, 145, 18, 55, 20),
      'Torso is not reaching into the side bend',
      'Reach the chest forward and lengthen both sides of the waist.'
    );
    addFinding(
      penaltyForMax(shouldersLevel, 0.08, 0.12, 14),
      'Top and bottom shoulders are collapsing',
      'Stack the shoulders vertically and open the chest.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.08, 0.12, 12),
      'Hips are shifting unevenly',
      'Press strongly through both feet and keep the pelvis broad.'
    );
  } else if (poseName.includes('Setu Bandhasana') || poseName.includes('Bridge')) {
    const bentKnees = average([leftKneeAngle, rightKneeAngle]);
    addFinding(
      penaltyForTarget(bentKnees, 105, 15, 45, 20),
      'Knees are not stacked over the ankles',
      'Bring the heels under the knees and keep the knees hip-width apart.'
    );
    addFinding(
      penaltyForMin(shoulderCenter.y - hipCenter.y, 0.06, 0.12, 22),
      'Hips are not lifted',
      'Drive through the feet and lift the pelvis higher.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.06, 0.08, 12),
      'Pelvis is uneven',
      'Press evenly through both feet to balance the lift.'
    );
  } else if (poseName.includes('Shavasana') || poseName.includes('Corpse')) {
    addFinding(
      penaltyForMax(Math.abs(shoulderCenter.y - hipCenter.y), 0.04, 0.12, 16),
      'Body is not resting flat',
      'Lie fully back and let the spine settle.'
    );
    addFinding(
      penaltyForMax(Math.abs(hipCenter.y - ankleCenter.y), 0.05, 0.12, 16),
      'Legs are not fully relaxed',
      'Extend the legs and allow the feet to fall outward.'
    );
    addFinding(
      penaltyForMin(legsStraight, 160, 25, 10),
      'Knees are still bent',
      'Let the legs lengthen naturally on the floor.'
    );
  } else if (poseName.includes('Sukhasana') || poseName.includes('Easy Seated')) {
    addFinding(
      penaltyForMin(hipCenter.y - shoulderCenter.y, 0.1, 0.12, 16),
      'Torso is collapsed',
      'Sit taller and lift through the chest.'
    );
    addFinding(
      penaltyForMin(Math.max(leftKneeAngle, rightKneeAngle), 135, 40, 14),
      'Legs are not comfortably crossed',
      'Soften the knees and find an easy cross-legged seat.'
    );
    addFinding(
      penaltyForMax(torsoLean, 0.06, 0.08, 14),
      'Spine is leaning',
      'Stack the head, shoulders, and hips in one vertical line.'
    );
    addFinding(
      penaltyForMax(shouldersLevel, 0.06, 0.08, 12),
      'Shoulders are uneven',
      'Relax both shoulders away from the ears.'
    );
  } else {
    addFinding(
      penaltyForMax(shouldersLevel, 0.06, 0.08, 14),
      'Shoulders are uneven',
      'Square the shoulders and stabilize the torso.'
    );
    addFinding(
      penaltyForMax(hipsLevel, 0.06, 0.08, 14),
      'Hips are uneven',
      'Level the pelvis and ground evenly.'
    );
    addFinding(
      penaltyForMax(torsoLean, 0.06, 0.08, 14),
      'Torso is off-center',
      'Bring the torso back into line over the hips.'
    );
  }

  const totalPenalty = findings.reduce((sum, finding) => sum + finding.penalty, 0);
  const reliabilityBonus = clamp(Math.round((visibilityAverage - 0.75) * 10), 0, 3);
  const sortedFindings = findings.sort((left, right) => right.penalty - left.penalty);
  const score = clamp(
    Math.round(100 - totalPenalty + reliabilityBonus),
    findings.length === 0 ? 92 : 28,
    findings.length === 0 ? 98 : 97
  );
  const feedback =
    sortedFindings.length === 0
      ? `${poseName} looks stable and well aligned.`
      : score >= 80
        ? `Good ${poseName}. Refine a few details for cleaner alignment.`
        : score >= 65
          ? 'You are close. Focus on the main alignment points below.'
          : 'Several alignment cues need attention before this pose feels stable.';

  return {
    score,
    feedback,
    corrections: sortedFindings.map((finding) => finding.correction).slice(0, 4),
    alignment_issues: sortedFindings.map((finding) => finding.issue).slice(0, 4),
    nextPose: inferNextPose(poseName),
    encouragement:
      score >= 80
        ? 'Strong hold. Keep breathing steadily.'
        : 'Stay patient and repeat the pose with slower setup.',
    analysisSource: 'rules',
    isDetected: true,
  };
}

export function getRealtimeCorrections(
  poseName: string,
  landmarks: PoseLandmark[]
): string[] {
  const analysis = analyzePoseLandmarks(poseName, landmarks);
  if (!analysis.isDetected || analysis.score >= 92) {
    return [];
  }

  return analysis.corrections.slice(0, 2);
}
