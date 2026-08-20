import { ReviewResponse, UserWordProgress, VocabularyWord, WordStatus } from '../types';

/**
 * Calculates updated SM-2 spaced repetition state based on user response
 */
export function calculateSM2Update(
  current: UserWordProgress,
  rating: ReviewResponse
): UserWordProgress {
  const now = new Date();
  let newRepetition = current.repetitionCount;
  let newEase = current.easeFactor;
  let newInterval = current.intervalDays;
  let newStatus: WordStatus = current.status;
  let newConsecutive = current.consecutiveCorrect;
  let newForgot = current.forgotCount;

  switch (rating) {
    case 'forgot':
      newRepetition = 0;
      newConsecutive = 0;
      newForgot += 1;
      newInterval = 0.25; // 6 hours (due today/tomorrow)
      newEase = Math.max(1.3, newEase - 0.25);
      newStatus = 'struggling';
      break;

    case 'hard':
      newConsecutive = 0;
      newRepetition = Math.max(1, newRepetition);
      newInterval = Math.max(1, Math.round(newInterval * 1.2));
      newEase = Math.max(1.3, newEase - 0.15);
      newStatus = 'learning';
      break;

    case 'good':
      newConsecutive += 1;
      newRepetition += 1;
      if (newRepetition === 1) {
        newInterval = 1;
      } else if (newRepetition === 2) {
        newInterval = 3;
      } else {
        newInterval = Math.round(newInterval * newEase);
      }
      newStatus = newRepetition >= 4 ? 'mastered' : 'reviewing';
      break;

    case 'easy':
      newConsecutive += 1;
      newRepetition += 1;
      newEase = Math.min(3.0, newEase + 0.15);
      if (newRepetition === 1) {
        newInterval = 3;
      } else if (newRepetition === 2) {
        newInterval = 7;
      } else {
        newInterval = Math.round(newInterval * newEase * 1.3);
      }
      newStatus = newRepetition >= 3 ? 'mastered' : 'reviewing';
      break;
  }

  // Calculate next review timestamp
  const nextDateMs = now.getTime() + newInterval * 24 * 60 * 60 * 1000;
  const nextReviewDate = new Date(nextDateMs).toISOString();

  // Calculate new retention risk score
  const updatedProgress: UserWordProgress = {
    ...current,
    repetitionCount: newRepetition,
    easeFactor: Number(newEase.toFixed(2)),
    intervalDays: newInterval,
    status: newStatus,
    consecutiveCorrect: newConsecutive,
    totalAttempts: current.totalAttempts + 1,
    forgotCount: newForgot,
    lastReviewed: now.toISOString(),
    nextReviewDate,
    retentionRiskScore: calculateRetentionRiskScore(
      now.toISOString(),
      nextReviewDate,
      newForgot,
      newEase
    )
  };

  return updatedProgress;
}

/**
 * Retention risk calculation for Weak Word Radar (0-100 score)
 */
export function calculateRetentionRiskScore(
  lastReviewed: string | null,
  nextReviewDate: string,
  forgotCount: number,
  easeFactor: number
): number {
  if (!lastReviewed) return 50;

  const now = Date.now();
  const nextReviewTime = new Date(nextReviewDate).getTime();
  const lastReviewTime = new Date(lastReviewed).getTime();

  // Overdue multiplier: If now > nextReviewTime, risk increases rapidly
  let overdueRatio = 0;
  const totalWindow = Math.max(1, nextReviewTime - lastReviewTime);
  const elapsed = now - lastReviewTime;

  overdueRatio = elapsed / totalWindow; // 1.0 means exactly due, > 1.0 means overdue

  let baseRisk = Math.min(60, overdueRatio * 45);

  // Penalty for past forgot counts
  const forgotPenalty = Math.min(35, forgotCount * 9);

  // Penalty for low ease factor (low ease = difficult word)
  const difficultyPenalty = Math.max(0, (2.5 - easeFactor) * 15);

  const totalScore = Math.min(100, Math.round(baseRisk + forgotPenalty + difficultyPenalty));
  return Math.max(5, totalScore);
}

export function getWordsDue(
  words: VocabularyWord[],
  progressMap: Record<string, UserWordProgress>
): VocabularyWord[] {
  const now = Date.now();
  return words.filter((w) => {
    const prog = progressMap[w.id];
    if (!prog) return false;
    const dueTime = new Date(prog.nextReviewDate).getTime();
    return dueTime <= now;
  });
}

export function getWeakWords(
  words: VocabularyWord[],
  progressMap: Record<string, UserWordProgress>
): { word: VocabularyWord; progress: UserWordProgress; riskCategory: 'high' | 'medium' | 'low' }[] {
  const list: {
    word: VocabularyWord;
    progress: UserWordProgress;
    riskCategory: 'high' | 'medium' | 'low';
  }[] = [];

  for (const w of words) {
    const prog = progressMap[w.id];
    if (!prog) continue;

    // Recalculate dynamic risk based on current time
    const currentRisk = calculateRetentionRiskScore(
      prog.lastReviewed,
      prog.nextReviewDate,
      prog.forgotCount,
      prog.easeFactor
    );

    let riskCategory: 'high' | 'medium' | 'low' = 'low';
    if (currentRisk >= 65 || prog.status === 'struggling') {
      riskCategory = 'high';
    } else if (currentRisk >= 40) {
      riskCategory = 'medium';
    }

    list.push({
      word: w,
      progress: { ...prog, retentionRiskScore: currentRisk },
      riskCategory
    });
  }

  return list.sort((a, b) => b.progress.retentionRiskScore - a.progress.retentionRiskScore);
}

export const LEVEL_TIERS = [
  { level: 1, title: 'Novice Linguist', minXp: 0 },
  { level: 2, title: 'Word Seeker', minXp: 150 },
  { level: 3, title: 'Lexicon Apprentice', minXp: 350 },
  { level: 4, title: 'Vocabulary Explorer', minXp: 600 },
  { level: 5, title: 'Memory Artisan', minXp: 900 },
  { level: 6, title: 'Retention Virtuoso', minXp: 1250 },
  { level: 7, title: 'Polyglot Scholar', minXp: 1700 },
  { level: 8, title: 'Vocabulary Master', minXp: 2200 },
  { level: 9, title: 'Grand Lexicographer', minXp: 2800 },
  { level: 10, title: 'Master Orator', minXp: 3500 }
];

export function getLevelInfo(xp: number): { level: number; title: string; nextLevelXp: number; progressPercent: number } {
  let currentTier = LEVEL_TIERS[0];
  let nextTier = LEVEL_TIERS[1];

  for (let i = 0; i < LEVEL_TIERS.length; i++) {
    if (xp >= LEVEL_TIERS[i].minXp) {
      currentTier = LEVEL_TIERS[i];
      nextTier = LEVEL_TIERS[i + 1] || { level: currentTier.level + 1, title: 'Legendary Orator', minXp: currentTier.minXp + 1000 };
    }
  }

  const range = nextTier.minXp - currentTier.minXp;
  const earned = xp - currentTier.minXp;
  const progressPercent = Math.min(100, Math.max(0, Math.round((earned / range) * 100)));

  return {
    level: currentTier.level,
    title: currentTier.title,
    nextLevelXp: nextTier.minXp,
    progressPercent
  };
}
