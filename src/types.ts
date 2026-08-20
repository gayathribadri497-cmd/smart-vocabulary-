export type LearningLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Mastery';

export type VocabularyCategory =
  | 'Academic'
  | 'Competitive Exams'
  | 'Business'
  | 'Technology'
  | 'Daily English'
  | 'Interview Vocabulary'
  | 'Literature & Arts';

export type ReviewResponse = 'easy' | 'good' | 'hard' | 'forgot';

export type WordStatus = 'new' | 'learning' | 'reviewing' | 'mastered' | 'struggling';

export interface MnemonicAssociation {
  interest: string;
  trick: string;
  visualEmoji: string;
  hookStory: string;
}

export interface VocabularyWord {
  id: string;
  word: string;
  meaning: string;
  pronunciation: string; // e.g. /meh-TIK-yuh-lus/
  ipa?: string; // e.g. /məˈtɪkjələs/
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'adverb' | 'idiom';
  example: string;
  example2?: string;
  synonyms: string[];
  antonyms: string[];
  difficulty: LearningLevel;
  category: VocabularyCategory;
  origin?: string; // Etymology
  relatedWords?: string[];
  defaultMnemonic: string;
  defaultVisualEmoji: string;
  personalizedMnemonics?: Record<string, MnemonicAssociation>; // Keyed by interest e.g. 'cricket', 'gaming'
}

export interface UserWordProgress {
  wordId: string;
  status: WordStatus;
  easeFactor: number; // SM-2 ease factor (default 2.5)
  intervalDays: number; // Current interval in days
  repetitionCount: number;
  lastReviewed: string | null; // ISO timestamp
  nextReviewDate: string; // ISO timestamp
  consecutiveCorrect: number;
  totalAttempts: number;
  forgotCount: number;
  retentionRiskScore: number; // 0-100 (computed decay score for Weak Word Radar)
  notes?: string;
  customMnemonic?: string;
  remediationHistory?: {
    date: string;
    reason: string;
    newMnemonic: string;
    newExample: string;
  }[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  learningLevel: LearningLevel;
  targetCategory: VocabularyCategory;
  dailyGoalWords: number;
  interests: string[]; // e.g. ['Cricket', 'Tech', 'Gaming', 'Cinema', 'Science', 'Music', 'Cooking', 'Anime']
  xp: number;
  level: number;
  levelTitle: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  wordsLearnedCount: number;
  wordsMasteredCount: number;
  achievements: Achievement[];
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null; // null if locked
  progress: number; // 0 to 100
}

export interface QuizQuestion {
  id: string;
  wordId: string;
  word: string;
  type: 'multiple-choice' | 'fill-in-blank' | 'meaning-to-word' | 'context-usage';
  prompt: string;
  options?: string[]; // 4 choices for MCQ
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

export interface QuizResult {
  id: string;
  date: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  questionResults: {
    questionId: string;
    word: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
}

export interface DailyActivityLog {
  date: string; // YYYY-MM-DD
  wordsLearned: number;
  wordsReviewed: number;
  quizzesTaken: number;
  xpGained: number;
}
