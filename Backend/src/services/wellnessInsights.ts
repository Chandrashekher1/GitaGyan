import MeditationSession from "../models/MeditationSession.model.js";
import YogaSession from "../models/yogaSession.js";
import type { EmotionResult } from "./emotionDetect.js";
import {
  MEDITATION_SOUNDS,
  YOGA_POSES,
  formatWellnessTag,
} from "../utils/wellnessCatalog.js";

interface WellnessSnapshot {
  recentActions: string[];
  helpfulPatterns: string[];
  recommendedPractices: string[];
}

interface FeedbackLike {
  rating?: number;
  helpful?: boolean;
  targetedConcern?: string;
  moodAfter?: string;
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function buildConcernSet(emotion: EmotionResult["emotion"], themes: string[]) {
  const concerns = new Set<string>([emotion]);

  if (emotion === "anxiety") {
    ["stress", "sleep", "grounding", "balance"].forEach((tag) =>
      concerns.add(tag)
    );
  }

  if (emotion === "overwhelmed") {
    ["stress", "focus", "balance", "grounding"].forEach((tag) =>
      concerns.add(tag)
    );
  }

  if (emotion === "sadness") {
    ["energy", "confidence", "stress"].forEach((tag) => concerns.add(tag));
  }

  if (emotion === "anger") {
    ["stress", "grounding", "balance"].forEach((tag) => concerns.add(tag));
  }

  if (emotion === "positive") {
    ["focus", "balance", "energy"].forEach((tag) => concerns.add(tag));
  }

  if (themes.includes("sleep")) {
    concerns.add("sleep");
  }

  if (themes.includes("self-worth")) {
    concerns.add("confidence");
  }

  if (themes.includes("exams") || themes.includes("career")) {
    concerns.add("focus");
    concerns.add("overwhelmed");
  }

  if (themes.includes("loneliness")) {
    concerns.add("sadness");
  }

  return concerns;
}

function isHelpful(feedback?: FeedbackLike) {
  if (!feedback) {
    return false;
  }

  return feedback.helpful === true || (feedback.rating ?? 0) >= 4;
}

function matchesConcern(
  tags: string[] | undefined,
  concernSet: Set<string>,
  targetedConcern?: string
) {
  if (targetedConcern && concernSet.has(targetedConcern)) {
    return true;
  }

  return (tags ?? []).some((tag) => concernSet.has(tag));
}

function buildFeedbackSuffix(feedback?: FeedbackLike) {
  if (!feedback) {
    return "";
  }

  const parts: string[] = [];
  if (feedback.targetedConcern) {
    parts.push(`for ${formatWellnessTag(feedback.targetedConcern)}`);
  }

  if (feedback.moodAfter) {
    parts.push(`and left you ${feedback.moodAfter.toLowerCase()}`);
  }

  if (feedback.rating) {
    parts.push(`rated ${feedback.rating}/5`);
  }

  return parts.length ? ` ${parts.join(" ")}` : "";
}

export async function getUserWellnessSnapshot(
  userId: string,
  emotionData: EmotionResult
): Promise<WellnessSnapshot> {
  if (!userId || userId === "anonymous" || YogaSession.db.readyState !== 1) {
    return {
      recentActions: [],
      helpfulPatterns: [],
      recommendedPractices: [],
    };
  }

  const concernSet = buildConcernSet(emotionData.emotion, emotionData.themes);

  try {
    const [yogaSessions, meditationSessions] = await Promise.all([
      YogaSession.find({ userId }).sort({ sessionDate: -1 }).limit(12).lean(),
      MeditationSession.find({ userId })
        .sort({ completedAt: -1 })
        .limit(12)
        .lean(),
    ]);

    const yogaAttempts = yogaSessions
      .flatMap((session: any) =>
        (session.posesAttempted ?? []).map((attempt: any) => ({
          ...attempt,
          timestamp: attempt.timestamp ?? session.sessionDate,
        }))
      )
      .sort(
        (first: any, second: any) =>
          new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime()
      );

    const recentActions = [
      ...yogaAttempts.slice(0, 6).map((attempt: any) => ({
        timestamp: attempt.timestamp,
        description: `Yoga: ${attempt.poseName} for ${attempt.mentalHealthTags
          ?.slice(0, 2)
          .map((tag: string) => formatWellnessTag(tag))
          .join(", ")}`,
      })),
      ...meditationSessions.slice(0, 6).map((session: any) => ({
        timestamp: session.completedAt,
        description: `Meditation: ${session.soundName} for ${session.mentalHealthTags
          ?.slice(0, 2)
          .map((tag: string) => formatWellnessTag(tag))
          .join(", ")}`,
      })),
    ]
      .sort(
        (first, second) =>
          new Date(second.timestamp).getTime() - new Date(first.timestamp).getTime()
      )
      .slice(0, 5)
      .map((item) => item.description);

    const helpfulYoga = yogaAttempts
      .filter((attempt: any) => isHelpful(attempt.feedback))
      .sort((first: any, second: any) => {
        const firstMatch = matchesConcern(
          first.mentalHealthTags,
          concernSet,
          first.feedback?.targetedConcern
        )
          ? 1
          : 0;
        const secondMatch = matchesConcern(
          second.mentalHealthTags,
          concernSet,
          second.feedback?.targetedConcern
        )
          ? 1
          : 0;

        if (firstMatch !== secondMatch) {
          return secondMatch - firstMatch;
        }

        return (second.feedback?.rating ?? 0) - (first.feedback?.rating ?? 0);
      })
      .slice(0, 3)
      .map(
        (attempt: any) =>
          `${attempt.poseName} was helpful${buildFeedbackSuffix(attempt.feedback)}.`
      );

    const helpfulMeditation = meditationSessions
      .filter((session: any) => isHelpful(session.feedback))
      .sort((first: any, second: any) => {
        const firstMatch = matchesConcern(
          first.mentalHealthTags,
          concernSet,
          first.feedback?.targetedConcern
        )
          ? 1
          : 0;
        const secondMatch = matchesConcern(
          second.mentalHealthTags,
          concernSet,
          second.feedback?.targetedConcern
        )
          ? 1
          : 0;

        if (firstMatch !== secondMatch) {
          return secondMatch - firstMatch;
        }

        return (second.feedback?.rating ?? 0) - (first.feedback?.rating ?? 0);
      })
      .slice(0, 3)
      .map(
        (session: any) =>
          `${session.soundName} meditation was helpful${buildFeedbackSuffix(
            session.feedback
          )}.`
      );

    const historyRecommendations = [
      ...yogaAttempts
        .filter((attempt: any) =>
          isHelpful(attempt.feedback)
            ? matchesConcern(
                attempt.mentalHealthTags,
                concernSet,
                attempt.feedback?.targetedConcern
              )
            : false
        )
        .map(
          (attempt: any) =>
            `${attempt.poseName} has worked before${
              attempt.feedback?.moodAfter
                ? ` when you wanted to feel ${attempt.feedback.moodAfter.toLowerCase()}`
                : ""
            }.`
        ),
      ...meditationSessions
        .filter((session: any) =>
          isHelpful(session.feedback)
            ? matchesConcern(
                session.mentalHealthTags,
                concernSet,
                session.feedback?.targetedConcern
              )
            : false
        )
        .map(
          (session: any) =>
            `${session.soundName} meditation has worked before${
              session.feedback?.moodAfter
                ? ` and usually leaves you ${session.feedback.moodAfter.toLowerCase()}`
                : ""
            }.`
        ),
    ];

    const catalogRecommendations = [
      ...YOGA_POSES.filter((pose) =>
        pose.mentalHealthTags.some((tag) => concernSet.has(tag))
      ).map(
        (pose) =>
          `Try ${pose.name} for ${pose.mentalHealthTags
            .slice(0, 2)
            .map((tag) => formatWellnessTag(tag))
            .join(" and ")}.`
      ),
      ...MEDITATION_SOUNDS.filter((sound) =>
        sound.mentalHealthTags.some((tag) => concernSet.has(tag))
      ).map(
        (sound) =>
          `Try ${sound.name} meditation for ${sound.mentalHealthTags
            .slice(0, 2)
            .map((tag) => formatWellnessTag(tag))
            .join(" and ")}.`
      ),
    ];

    return {
      recentActions,
      helpfulPatterns: unique([...helpfulYoga, ...helpfulMeditation]).slice(0, 4),
      recommendedPractices: unique([
        ...historyRecommendations,
        ...catalogRecommendations,
      ]).slice(0, 3),
    };
  } catch (error) {
    console.error("wellness insight build error:", error);
    return {
      recentActions: [],
      helpfulPatterns: [],
      recommendedPractices: [],
    };
  }
}
