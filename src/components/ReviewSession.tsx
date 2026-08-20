import React, { useState, useEffect } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { VocabularyWord, ReviewResponse } from '../types';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  Brain,
  Volume2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Award,
  Layers,
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewSession: React.FC = () => {
  const {
    words,
    progressMap,
    dueWords,
    recordReview,
    speakWord,
    setActiveTab,
    activeInterest
  } = useVocabulary();

  // Words queue: Prefer due words; if none due, allow all words
  const [reviewQueue, setReviewQueue] = useState<VocabularyWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<string[]>([]);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0, xpEarned: 0 });

  // Initialize review queue on load
  useEffect(() => {
    const list = dueWords.length > 0 ? dueWords : words.slice(0, 5);
    setReviewQueue(list);
    setCurrentIndex(0);
    setIsAnswerRevealed(false);
    setSelectedOption(null);
    setIsFlipped(false);
    setSessionCompleted(false);
  }, [dueWords, words]);

  const currentWord = reviewQueue[currentIndex];

  // Generate 4 plausible options (1 correct + 3 distractor meanings)
  useEffect(() => {
    if (!currentWord) return;

    const correct = currentWord.meaning;
    const otherWords = words.filter((w) => w.id !== currentWord.id);
    const shuffledOthers = [...otherWords].sort(() => 0.5 - Math.random());
    const distractors = shuffledOthers.slice(0, 3).map((w) => w.meaning);

    const allOptions = [correct, ...distractors].sort(() => 0.5 - Math.random());
    setOptions(allOptions);
    setIsAnswerRevealed(false);
    setSelectedOption(null);
    setIsFlipped(false);
  }, [currentWord, words]);

  const handleSelectOption = (option: string) => {
    if (isAnswerRevealed) return;
    setSelectedOption(option);
    setIsAnswerRevealed(true);

    const isCorrect = option === currentWord.meaning;
    if (isCorrect) {
      setSessionStats((prev) => ({
        ...prev,
        correct: prev.correct + 1,
        total: prev.total + 1,
        xpEarned: prev.xpEarned + 20
      }));
    } else {
      setSessionStats((prev) => ({
        ...prev,
        total: prev.total + 1
      }));
    }
  };

  const handleRatingAndNext = (rating: ReviewResponse) => {
    if (!currentWord) return;

    recordReview(currentWord.id, rating);

    // Advance queue
    if (currentIndex + 1 < reviewQueue.length) {
      setCurrentIndex((prev) => prev + 1);
      setIsAnswerRevealed(false);
      setSelectedOption(null);
      setIsFlipped(false);
    } else {
      // Session finished!
      setSessionCompleted(true);
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (!currentWord || sessionCompleted) {
    return (
      <div id="review-complete-view" className="max-w-2xl mx-auto py-12 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[2px] shadow-2xl">
          <div className="w-full h-full bg-[#020617] rounded-[22px] flex items-center justify-center">
            <Award className="w-10 h-10 text-emerald-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">Review Session Complete! 🎉</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-medium">
            You've strengthened your neural pathways and scheduled your next review intervals using the SM-2 algorithm.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 max-w-md mx-auto py-4">
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reviewed</p>
            <p className="font-display text-2xl font-black text-white mt-1">{reviewQueue.length}</p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy</p>
            <p className="font-display text-2xl font-black text-emerald-400 mt-1">
              {sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 100}%
            </p>
          </div>
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">XP Earned</p>
            <p className="font-display text-2xl font-black text-indigo-400 mt-1">+{sessionStats.xpEarned + 50}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider text-xs transition-all shadow-md active:scale-98"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => {
              setReviewQueue(words.slice(0, 6));
              setCurrentIndex(0);
              setSessionCompleted(false);
              setIsAnswerRevealed(false);
              setSelectedOption(null);
            }}
            className="px-6 py-3 rounded-xl bg-[#0f172a] hover:bg-slate-800 border border-slate-800 text-slate-200 font-black uppercase tracking-wider text-xs transition-colors"
          >
            Review 6 More Words
          </button>
        </div>
      </div>
    );
  }

  const isSelectedCorrect = selectedOption === currentWord.meaning;
  const activeMnemonic =
    currentWord.personalizedMnemonics?.[activeInterest]?.trick || currentWord.defaultMnemonic;

  return (
    <div id="review-session-container" className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
            <RotateCcw className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display text-sm font-black uppercase tracking-tight text-white">Spaced Repetition Review</h2>
            <p className="text-xs text-slate-400 font-medium">
              Word {currentIndex + 1} of {reviewQueue.length}
            </p>
          </div>
        </div>

        {/* Mode Toggle: Quiz mode vs Flashcard mode */}
        <div className="flex items-center gap-1 bg-[#0f172a] p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setIsFlashcardMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
              !isFlashcardMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Multiple Choice
          </button>
          <button
            onClick={() => setIsFlashcardMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
              isFlashcardMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Flashcard Flip
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-amber-500 via-indigo-500 to-teal-400 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / reviewQueue.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      {!isFlashcardMode ? (
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-100">
          {/* Question Prompt */}
          <div className="text-center space-y-2 pb-4 border-b border-slate-800">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              What does this word mean?
            </span>
            <div className="flex items-center justify-center gap-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white">
                {currentWord.word}
              </h1>
              <button
                onClick={() => speakWord(currentWord.word)}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 transition-colors"
                title="Pronounce"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs font-mono font-bold text-indigo-300">{currentWord.pronunciation}</p>
          </div>

          {/* Multiple Choice Options */}
          <div className="space-y-3">
            {options.map((option, idx) => {
              const letter = String.fromCharCode(65 + idx);
              const isCorrectOption = option === currentWord.meaning;
              const isUserChoice = selectedOption === option;

              let style = 'bg-[#020617] border-slate-800 hover:border-slate-700 hover:bg-slate-900';

              if (isAnswerRevealed) {
                if (isCorrectOption) {
                  style = 'bg-emerald-950/60 border-emerald-500 text-emerald-200';
                } else if (isUserChoice) {
                  style = 'bg-rose-950/60 border-rose-500 text-rose-200';
                } else {
                  style = 'bg-[#020617]/50 border-slate-800/50 text-slate-500';
                }
              }

              return (
                <button
                  key={option}
                  disabled={isAnswerRevealed}
                  onClick={() => handleSelectOption(option)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-slate-800 text-xs font-black flex items-center justify-center text-slate-300 flex-shrink-0">
                      {letter}
                    </span>
                    <span className="text-sm font-medium leading-relaxed">{option}</span>
                  </div>
                  {isAnswerRevealed && isCorrectOption && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  )}
                  {isAnswerRevealed && isUserChoice && !isCorrectOption && (
                    <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Revealed Answer & Memory Trick Section */}
          {isAnswerRevealed && (
            <div className="pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
              {/* Feedback Pill */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  isSelectedCorrect
                    ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/50 text-rose-200'
                }`}
              >
                <span className="text-2xl">{isSelectedCorrect ? '✅' : '❌'}</span>
                <div>
                  <p className="font-black text-sm uppercase tracking-wide">
                    {isSelectedCorrect ? 'Correct!' : 'Incorrect!'}
                  </p>
                  <p className="text-xs mt-0.5 font-medium">
                    <strong className="font-black text-white">{currentWord.word}</strong> = {currentWord.meaning}
                  </p>
                </div>
              </div>

              {/* Memory Trick Box */}
              <div className="p-4 rounded-2xl bg-[#0b1329] border border-indigo-800/40 space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-300 text-xs font-black uppercase tracking-wider">
                  <Brain className="w-3.5 h-3.5" />
                  <span>🧠 Memory Trick</span>
                </div>
                <p className="text-xs text-indigo-100 font-bold">"{activeMnemonic}"</p>
                <p className="text-[11px] text-slate-400 italic font-medium">
                  Example: "{currentWord.example}"
                </p>
              </div>

              {/* SM-2 Rating Buttons */}
              <div className="space-y-2 pt-2">
                <p className="font-display text-xs font-black uppercase tracking-wider text-slate-300">How difficult was this word?</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    onClick={() => handleRatingAndNext('forgot')}
                    className="p-3 rounded-xl bg-[#020617] hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700 text-center transition-all group"
                  >
                    <div className="text-lg">❌</div>
                    <div className="font-display text-xs font-black text-rose-400 group-hover:text-rose-300 uppercase tracking-wider mt-0.5">
                      Forgot
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Today / Tomorrow</div>
                  </button>

                  <button
                    onClick={() => handleRatingAndNext('hard')}
                    className="p-3 rounded-xl bg-[#020617] hover:bg-amber-950/60 border border-slate-800 hover:border-amber-700 text-center transition-all group"
                  >
                    <div className="text-lg">😐</div>
                    <div className="font-display text-xs font-black text-amber-400 group-hover:text-amber-300 uppercase tracking-wider mt-0.5">
                      Hard
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 Day</div>
                  </button>

                  <button
                    onClick={() => handleRatingAndNext('good')}
                    className="p-3 rounded-xl bg-[#020617] hover:bg-blue-950/60 border border-slate-800 hover:border-blue-700 text-center transition-all group"
                  >
                    <div className="text-lg">🙂</div>
                    <div className="font-display text-xs font-black text-blue-400 group-hover:text-blue-300 uppercase tracking-wider mt-0.5">
                      Good
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3 Days</div>
                  </button>

                  <button
                    onClick={() => handleRatingAndNext('easy')}
                    className="p-3 rounded-xl bg-[#020617] hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700 text-center transition-all group"
                  >
                    <div className="text-lg">😎</div>
                    <div className="font-display text-xs font-black text-emerald-400 group-hover:text-emerald-300 uppercase tracking-wider mt-0.5">
                      Easy
                    </div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">7+ Days</div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Flashcard Flip Mode */
        <div className="space-y-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="bg-[#0f172a] border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-8 sm:p-12 min-h-[300px] flex flex-col items-center justify-center text-center cursor-pointer select-none transition-all shadow-xl relative"
          >
            <span className="absolute top-4 right-4 text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Click to Flip
            </span>

            {!isFlipped ? (
              <div className="space-y-4">
                <span className="text-xs uppercase font-black text-indigo-400 tracking-widest">
                  Target Word
                </span>
                <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white">
                  {currentWord.word}
                </h1>
                <p className="text-sm font-mono text-slate-400">{currentWord.pronunciation}</p>
                <p className="text-xs text-slate-500 font-medium">Tap to check definition & mnemonic</p>
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                <span className="text-xs uppercase font-black text-emerald-400 tracking-widest">
                  Meaning & Mnemonic
                </span>
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white max-w-lg">
                  "{currentWord.meaning}"
                </h2>
                <div className="p-3 bg-[#020617] rounded-xl border border-indigo-900/40 text-xs text-indigo-200 font-medium">
                  💡 <strong className="font-black text-white">Memory Hook:</strong> {activeMnemonic}
                </div>
                <p className="text-xs text-slate-400 italic">"{currentWord.example}"</p>
              </div>
            )}
          </div>

          {/* SM-2 Rating after flip */}
          {isFlipped && (
            <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-5 space-y-3 animate-fade-in">
              <p className="font-display text-xs font-black uppercase tracking-wider text-slate-300">How easily did you recall this word?</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <button
                  onClick={() => handleRatingAndNext('forgot')}
                  className="p-3 rounded-xl bg-[#020617] hover:bg-rose-950/60 border border-slate-800 text-center transition-all"
                >
                  <div className="font-display text-sm font-black text-rose-400">❌ Forgot</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reset interval</div>
                </button>
                <button
                  onClick={() => handleRatingAndNext('hard')}
                  className="p-3 rounded-xl bg-[#020617] hover:bg-amber-950/60 border border-slate-800 text-center transition-all"
                >
                  <div className="font-display text-sm font-black text-amber-400">😐 Hard</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 Day</div>
                </button>
                <button
                  onClick={() => handleRatingAndNext('good')}
                  className="p-3 rounded-xl bg-[#020617] hover:bg-blue-950/60 border border-slate-800 text-center transition-all"
                >
                  <div className="font-display text-sm font-black text-blue-400">🙂 Good</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3 Days</div>
                </button>
                <button
                  onClick={() => handleRatingAndNext('easy')}
                  className="p-3 rounded-xl bg-[#020617] hover:bg-emerald-950/60 border border-slate-800 text-center transition-all"
                >
                  <div className="font-display text-sm font-black text-emerald-400">😎 Easy</div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">7+ Days</div>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
