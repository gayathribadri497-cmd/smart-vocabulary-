import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  VocabularyWord,
  UserWordProgress,
  UserProfile,
  ReviewResponse,
  QuizResult,
  VocabularyCategory,
  LearningLevel
} from '../types';
import {
  INITIAL_VOCABULARY_WORDS,
  DEFAULT_STUDENT_PROFILE,
  INITIAL_USER_PROGRESS
} from '../data/vocabulary';
import {
  calculateSM2Update,
  getWordsDue,
  getWeakWords,
  getLevelInfo
} from '../lib/spacedRepetition';

interface VocabularyContextType {
  profile: UserProfile;
  words: VocabularyWord[];
  progressMap: Record<string, UserWordProgress>;
  quizHistory: QuizResult[];
  activeTab: 'dashboard' | 'learn' | 'review' | 'quiz' | 'radar' | 'explore' | 'analytics' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'learn' | 'review' | 'quiz' | 'radar' | 'explore' | 'analytics' | 'settings') => void;
  selectedWord: VocabularyWord | null;
  setSelectedWord: (word: VocabularyWord | null) => void;
  activeInterest: string;
  setActiveInterest: (interest: string) => void;
  
  // Actions
  recordReview: (wordId: string, rating: ReviewResponse) => UserWordProgress;
  startLearningWord: (wordId: string) => void;
  addNewWord: (word: VocabularyWord) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  saveQuizResult: (result: QuizResult) => void;
  addXP: (amount: number, reason?: string) => void;
  generateInterestMnemonic: (wordId: string, interest: string) => Promise<boolean>;
  remediateStrugglingWord: (wordId: string, customReason?: string) => Promise<any>;
  speakWord: (text: string, rate?: number) => void;
  isSpeaking: boolean;
  dueWords: VocabularyWord[];
  weakWordsList: ReturnType<typeof getWeakWords>;
  todayLearnedCount: number;
  resetAllData: () => void;
  switchDemoProfile: (profileName: 'prathibha' | 'alex' | 'marcus') => void;
}

const VocabularyContext = createContext<VocabularyContextType | null>(null);

const STORAGE_KEYS = {
  PROFILE: 'svt_student_profile_v2',
  WORDS: 'svt_vocab_words_v2',
  PROGRESS: 'svt_user_progress_v2',
  QUIZ: 'svt_quiz_history_v2',
  TODAY_COUNT: 'svt_today_count_v2',
  TODAY_DATE: 'svt_today_date_v2'
};

export const VocabularyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return saved ? JSON.parse(saved) : DEFAULT_STUDENT_PROFILE;
    } catch {
      return DEFAULT_STUDENT_PROFILE;
    }
  });

  const [words, setWords] = useState<VocabularyWord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORDS);
      return saved ? JSON.parse(saved) : INITIAL_VOCABULARY_WORDS;
    } catch {
      return INITIAL_VOCABULARY_WORDS;
    }
  });

  const [progressMap, setProgressMap] = useState<Record<string, UserWordProgress>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      return saved ? JSON.parse(saved) : INITIAL_USER_PROGRESS;
    } catch {
      return INITIAL_USER_PROGRESS;
    }
  });

  const [quizHistory, setQuizHistory] = useState<QuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZ);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [todayLearnedCount, setTodayLearnedCount] = useState<number>(() => {
    try {
      const savedDate = localStorage.getItem(STORAGE_KEYS.TODAY_DATE);
      const today = new Date().toISOString().split('T')[0];
      if (savedDate === today) {
        const count = localStorage.getItem(STORAGE_KEYS.TODAY_COUNT);
        return count ? parseInt(count, 10) : 8;
      }
      return 8; // Default initial mock goal progress (8 / 10)
    } catch {
      return 8;
    }
  });

  const [activeTab, setActiveTab] = useState<'dashboard' | 'learn' | 'review' | 'quiz' | 'radar' | 'explore' | 'analytics' | 'settings'>('dashboard');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);
  const [activeInterest, setActiveInterest] = useState<string>(profile.interests[0] || 'Cricket');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
      console.error(e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORDS, JSON.stringify(words));
    } catch (e) {
      console.error(e);
    }
  }, [words]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progressMap));
    } catch (e) {
      console.error(e);
    }
  }, [progressMap]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.QUIZ, JSON.stringify(quizHistory));
    } catch (e) {
      console.error(e);
    }
  }, [quizHistory]);

  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(STORAGE_KEYS.TODAY_DATE, today);
      localStorage.setItem(STORAGE_KEYS.TODAY_COUNT, todayLearnedCount.toString());
    } catch (e) {
      console.error(e);
    }
  }, [todayLearnedCount]);

  // Audio Speech Synthesis
  const speakWord = (text: string, rate: number = 0.9) => {
    if (!('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';

      // Pick high quality voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha')) && v.lang.startsWith('en'));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  const addXP = (amount: number) => {
    setProfile(prev => {
      const newXP = prev.xp + amount;
      const { level, title } = getLevelInfo(newXP);
      return {
        ...prev,
        xp: newXP,
        level,
        levelTitle: title
      };
    });
  };

  const startLearningWord = (wordId: string) => {
    const existing = progressMap[wordId];
    if (!existing) {
      const newProgress: UserWordProgress = {
        wordId,
        status: 'learning',
        easeFactor: 2.5,
        intervalDays: 1,
        repetitionCount: 1,
        lastReviewed: new Date().toISOString(),
        nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        consecutiveCorrect: 1,
        totalAttempts: 1,
        forgotCount: 0,
        retentionRiskScore: 35
      };

      setProgressMap(prev => ({
        ...prev,
        [wordId]: newProgress
      }));

      setTodayLearnedCount(prev => prev + 1);
      addXP(25);

      setProfile(prev => ({
        ...prev,
        wordsLearnedCount: prev.wordsLearnedCount + 1
      }));
    }
  };

  const recordReview = (wordId: string, rating: ReviewResponse): UserWordProgress => {
    const current: UserWordProgress = progressMap[wordId] || {
      wordId,
      status: 'learning',
      easeFactor: 2.5,
      intervalDays: 0.5,
      repetitionCount: 0,
      lastReviewed: null,
      nextReviewDate: new Date().toISOString(),
      consecutiveCorrect: 0,
      totalAttempts: 0,
      forgotCount: 0,
      retentionRiskScore: 50
    };

    const updated = calculateSM2Update(current, rating);

    setProgressMap(prev => ({
      ...prev,
      [wordId]: updated
    }));

    // XP allocation based on mastery & quality
    const xpBonus = rating === 'easy' ? 20 : rating === 'good' ? 15 : rating === 'hard' ? 10 : 5;
    addXP(xpBonus);

    // Update mastered count
    let masteredDelta = 0;
    if (current.status !== 'mastered' && updated.status === 'mastered') {
      masteredDelta = 1;
      addXP(50); // Mastery milestone bonus
    } else if (current.status === 'mastered' && updated.status !== 'mastered') {
      masteredDelta = -1;
    }

    setProfile(prev => ({
      ...prev,
      wordsMasteredCount: Math.max(0, prev.wordsMasteredCount + masteredDelta)
    }));

    return updated;
  };

  const addNewWord = (newWord: VocabularyWord) => {
    setWords(prev => {
      const exists = prev.some(w => w.word.toLowerCase() === newWord.word.toLowerCase());
      if (exists) {
        return prev.map(w => w.word.toLowerCase() === newWord.word.toLowerCase() ? newWord : w);
      }
      return [newWord, ...prev];
    });

    // Auto add to user learning list
    startLearningWord(newWord.id);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const saveQuizResult = (result: QuizResult) => {
    setQuizHistory(prev => [result, ...prev]);
    addXP(result.xpEarned);

    // Check if 100% quiz unlocks Quiz Prodigy achievement
    if (result.score === result.totalQuestions && result.totalQuestions >= 3) {
      setProfile(prev => ({
        ...prev,
        achievements: prev.achievements.map(a =>
          a.id === 'quiz-ace' ? { ...a, unlockedAt: new Date().toISOString(), progress: 100 } : a
        )
      }));
    }
  };

  const generateInterestMnemonic = async (wordId: string, interest: string): Promise<boolean> => {
    const word = words.find(w => w.id === wordId);
    if (!word) return false;

    // If already generated, nothing to fetch
    if (word.personalizedMnemonics && word.personalizedMnemonics[interest]) {
      return true;
    }

    try {
      const res = await fetch('/api/ai/mnemonic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word.word,
          meaning: word.meaning,
          interest,
          studentLevel: profile.learningLevel
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setWords(prev =>
          prev.map(w => {
            if (w.id !== wordId) return w;
            return {
              ...w,
              personalizedMnemonics: {
                ...(w.personalizedMnemonics || {}),
                [interest]: json.data
              }
            };
          })
        );
        return true;
      }
    } catch (e) {
      console.error('Failed to generate interest mnemonic:', e);
    }
    return false;
  };

  const remediateStrugglingWord = async (wordId: string, customReason?: string) => {
    const word = words.find(w => w.id === wordId);
    const prog = progressMap[wordId];
    if (!word) return null;

    try {
      const res = await fetch('/api/ai/remediate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word.word,
          meaning: word.meaning,
          forgotCount: prog?.forgotCount || 3,
          userInterest: activeInterest,
          previousConfusion: customReason || 'Keeps forgetting definition during rapid tests'
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const remediationData = json.data;

        // Store into progress remediation history
        setProgressMap(prev => {
          const cur = prev[wordId];
          if (!cur) return prev;
          const updatedHistory = [
            ...(cur.remediationHistory || []),
            {
              date: new Date().toISOString(),
              reason: customReason || remediationData.whyYouForgot,
              newMnemonic: remediationData.newMnemonic,
              newExample: remediationData.newExample
            }
          ];

          return {
            ...prev,
            [wordId]: {
              ...cur,
              customMnemonic: remediationData.newMnemonic,
              remediationHistory: updatedHistory
            }
          };
        });

        // Award XP for taking initiative to remediate!
        addXP(30);

        return remediationData;
      }
    } catch (e) {
      console.error('Failed to remediate word:', e);
    }
    return null;
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.WORDS);
    localStorage.removeItem(STORAGE_KEYS.PROGRESS);
    localStorage.removeItem(STORAGE_KEYS.QUIZ);
    localStorage.removeItem(STORAGE_KEYS.TODAY_COUNT);
    localStorage.removeItem(STORAGE_KEYS.TODAY_DATE);
    setProfile(DEFAULT_STUDENT_PROFILE);
    setWords(INITIAL_VOCABULARY_WORDS);
    setProgressMap(INITIAL_USER_PROGRESS);
    setQuizHistory([]);
    setTodayLearnedCount(8);
  };

  const switchDemoProfile = (profileName: 'prathibha' | 'alex' | 'marcus') => {
    if (profileName === 'prathibha') {
      setProfile(DEFAULT_STUDENT_PROFILE);
      setActiveInterest('Cricket');
    } else if (profileName === 'alex') {
      setProfile({
        ...DEFAULT_STUDENT_PROFILE,
        id: 'student-alex',
        name: 'Alex Vance',
        email: 'alex.v@techlearn.io',
        learningLevel: 'Advanced',
        targetCategory: 'Technology',
        interests: ['Tech', 'Gaming', 'Anime', 'Sci-Fi'],
        xp: 2450,
        level: 8,
        levelTitle: 'Vocabulary Master',
        currentStreak: 14,
        wordsLearnedCount: 22,
        wordsMasteredCount: 14
      });
      setActiveInterest('Gaming');
    } else {
      setProfile({
        ...DEFAULT_STUDENT_PROFILE,
        id: 'student-marcus',
        name: 'Marcus Sterling',
        email: 'm.sterling@mba.edu',
        learningLevel: 'Mastery',
        targetCategory: 'Business',
        interests: ['Business', 'Cinema', 'Cooking'],
        xp: 3100,
        level: 9,
        levelTitle: 'Grand Lexicographer',
        currentStreak: 21,
        wordsLearnedCount: 30,
        wordsMasteredCount: 20
      });
      setActiveInterest('Business');
    }
  };

  const dueWords = getWordsDue(words, progressMap);
  const weakWordsList = getWeakWords(words, progressMap);

  return (
    <VocabularyContext.Provider
      value={{
        profile,
        words,
        progressMap,
        quizHistory,
        activeTab,
        setActiveTab,
        selectedWord,
        setSelectedWord,
        activeInterest,
        setActiveInterest,
        recordReview,
        startLearningWord,
        addNewWord,
        updateProfile,
        saveQuizResult,
        addXP,
        generateInterestMnemonic,
        remediateStrugglingWord,
        speakWord,
        isSpeaking,
        dueWords,
        weakWordsList,
        todayLearnedCount,
        resetAllData,
        switchDemoProfile
      }}
    >
      {children}
    </VocabularyContext.Provider>
  );
};

export const useVocabulary = () => {
  const context = useContext(VocabularyContext);
  if (!context) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
};
