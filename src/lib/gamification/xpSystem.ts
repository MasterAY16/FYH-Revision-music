import type { Achievement, UserStats } from '@/types';

// XP thresholds for each level (1-20)
export const LEVEL_THRESHOLDS: number[] = Array.from({ length: 20 }, (_, i) =>
  Math.round(100 * Math.pow(1.3, i))
);

/**
 * Calculate level based on total XP
 */
export function calculateLevel(totalXP: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    if (totalXP >= LEVEL_THRESHOLDS[i]) {
      level = i + 2;
    } else {
      break;
    }
  }
  return Math.min(level, 21);
}

/**
 * Get XP needed for next level
 */
export function getXpForNextLevel(totalXP: number): number {
  const currentLevel = calculateLevel(totalXP);
  if (currentLevel >= 21) return 0;
  return LEVEL_THRESHOLDS[currentLevel - 1] - totalXP;
}

/**
 * Calculate XP earned from a quiz
 */
export function calculateQuizXp(accuracy: number, totalQuestions: number): number {
  const baseXp = Math.round(accuracy * 100);
  const bonus = totalQuestions > 30 ? 20 : totalQuestions > 20 ? 10 : 0;
  return baseXp + bonus;
}

// Achievement definitions
export const achievements: Achievement[] = [
  {
    id: 'perfect-pitch',
    title: 'Perfect Pitch Scholar',
    description: 'Score 100% on a melody',
    icon: '🎯',
    condition: (stats) => stats.perfectScores >= 1,
  },
  {
    id: 'quiz-virtuoso',
    title: 'Quiz Virtuoso',
    description: 'Complete 5 quizzes',
    icon: '🎵',
    condition: (stats) => stats.totalQuizzes >= 5,
  },
  {
    id: 'memory-maestro',
    title: 'Memory Maestro',
    description: 'Get 3 perfect scores',
    icon: '🧠',
    condition: (stats) => stats.perfectScores >= 3,
  },
  {
    id: 'song-builder',
    title: 'Song Builder',
    description: 'Complete 10 quizzes',
    icon: '🎶',
    condition: (stats) => stats.totalQuizzes >= 10,
  },
  {
    id: 'exam-composer',
    title: 'Exam Composer',
    description: 'Complete 50 quizzes',
    icon: '🎼',
    condition: (stats) => stats.totalQuizzes >= 50,
  },
];

/**
 * Check which achievements are unlocked
 */
export function checkAchievements(stats: UserStats): string[] {
  return achievements
    .filter((a) => a.condition(stats))
    .map((a) => a.id);
}

/**
 * Load user stats from localStorage
 */
export function loadUserStats(): UserStats {
  try {
    const saved = localStorage.getItem('melodymind-stats');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore corrupted data
  }

  return {
    totalQuizzes: 0,
    perfectScores: 0,
    totalXP: 0,
    level: 1,
    achievementsUnlocked: [],
  };
}

/**
 * Save user stats to localStorage
 */
export function saveUserStats(stats: UserStats) {
  localStorage.setItem('melodymind-stats', JSON.stringify(stats));
}

/**
 * Update stats after quiz completion
 */
export function updateStatsAfterQuiz(accuracy: number, totalQuestions: number): UserStats {
  const stats = loadUserStats();
  const xpEarned = calculateQuizXp(accuracy, totalQuestions);

  stats.totalQuizzes += 1;
  if (accuracy === 1) {
    stats.perfectScores += 1;
  }
  stats.totalXP += xpEarned;
  stats.level = calculateLevel(stats.totalXP);
  stats.achievementsUnlocked = checkAchievements(stats);

  saveUserStats(stats);
  return stats;
}
