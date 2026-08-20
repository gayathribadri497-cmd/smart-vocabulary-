import React from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import {
  BookOpen,
  RotateCcw,
  GraduationCap,
  Radar,
  Flame,
  Volume2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    profile,
    words,
    progressMap,
    dueWords,
    weakWordsList,
    todayLearnedCount,
    setActiveTab,
    setSelectedWord,
    speakWord
  } = useVocabulary();

  // Greeting based on current time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const goalPercent = Math.min(100, Math.round((todayLearnedCount / profile.dailyGoalWords) * 100));

  const masteredWords = words.filter(w => progressMap[w.id]?.status === 'mastered');
  const reviewingWords = words.filter(w => progressMap[w.id]?.status === 'reviewing');
  const strugglingWords = words.filter(w => progressMap[w.id]?.status === 'struggling' || (progressMap[w.id]?.retentionRiskScore || 0) >= 65);
  const learningWords = words.filter(w => progressMap[w.id]?.status === 'learning');

  const topStruggling = weakWordsList.slice(0, 4);

  // Recently learned words (sorted by lastReviewed or initial)
  const recentlyLearned = [...words]
    .filter(w => progressMap[w.id]?.lastReviewed)
    .sort((a, b) => {
      const timeA = new Date(progressMap[a.id]?.lastReviewed || 0).getTime();
      const timeB = new Date(progressMap[b.id]?.lastReviewed || 0).getTime();
      return timeB - timeA;
    })
    .slice(0, 4);

  return (
    <div id="dashboard-container" className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0b1329] border border-slate-800 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest mb-1.5">
              <span>Today's Learning</span>
              <span>•</span>
              <span className="text-teal-400">{profile.targetCategory}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white uppercase">
              {getGreeting()}, {profile.name} 👋
            </h1>
            <p className="text-sm font-medium text-slate-300 mt-1 max-w-xl">
              Your spaced repetition memory schedule is active. Keep your momentum going to prevent retention decay!
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-5">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>{profile.currentStreak} Day Streak</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider">
                <Award className="w-4 h-4 text-indigo-400" />
                <span>Level {profile.level} · {profile.levelTitle}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-teal-400" />
                <span>{profile.xp.toLocaleString()} XP Earned</span>
              </div>
            </div>
          </div>

          {/* Today's Goal Ring & Progress Bar */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-5 w-full md:w-80 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-slate-300">Daily Target</span>
              <span className="text-xs font-black text-indigo-400">{goalPercent}%</span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-800/80 rounded-full h-3.5 p-0.5 overflow-hidden border border-slate-700">
              <div
                className="bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${goalPercent}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-slate-400 font-medium">
              <span>
                <strong className="text-white font-black">{todayLearnedCount}</strong> / {profile.dailyGoalWords} words completed
              </span>
              {goalPercent >= 100 ? (
                <span className="text-emerald-400 font-black flex items-center gap-1 uppercase tracking-wider">
                  🎉 Goal Met!
                </span>
              ) : (
                <span className="text-slate-400 font-bold">
                  {profile.dailyGoalWords - todayLearnedCount} left
                </span>
              )}
            </div>

            <button
              id="dash-quick-learn-btn"
              onClick={() => setActiveTab('learn')}
              className="mt-3.5 w-full py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <span>Continue Daily Goal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main 4 Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Learn New Words */}
        <div
          id="action-learn-card"
          onClick={() => setActiveTab('learn')}
          className="bg-[#0f172a] border border-slate-800 hover:border-indigo-500/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
              +25 XP/word
            </span>
          </div>
          <h3 className="font-display text-base font-black text-white mt-3 group-hover:text-indigo-300 transition-colors uppercase tracking-tight">
            📚 Learn New Words
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-medium">
            Explore curated cards with AI mnemonics, phonetic guides & interest hooks.
          </p>
          <div className="mt-4 flex items-center text-xs font-black uppercase tracking-wider text-indigo-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Start Learning</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 2. Review Words */}
        <div
          id="action-review-card"
          onClick={() => setActiveTab('review')}
          className="bg-[#0f172a] border border-slate-800 hover:border-amber-500/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group relative"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <RotateCcw className="w-5 h-5" />
            </div>
            {dueWords.length > 0 ? (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 animate-pulse">
                {dueWords.length} Due Now
              </span>
            ) : (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Up to date
              </span>
            )}
          </div>
          <h3 className="font-display text-base font-black text-white mt-3 group-hover:text-amber-300 transition-colors uppercase tracking-tight">
            🔄 Review Words
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-medium">
            Adaptive SM-2 flashcard sessions tailored to your retention interval.
          </p>
          <div className="mt-4 flex items-center text-xs font-black uppercase tracking-wider text-amber-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>{dueWords.length > 0 ? `Review ${dueWords.length} Words` : 'Review Session'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 3. Quick Quiz */}
        <div
          id="action-quiz-card"
          onClick={() => setActiveTab('quiz')}
          className="bg-[#0f172a] border border-slate-800 hover:border-teal-500/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30">
              AI Powered
            </span>
          </div>
          <h3 className="font-display text-base font-black text-white mt-3 group-hover:text-teal-300 transition-colors uppercase tracking-tight">
            🧠 Quick Quiz
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-medium">
            Generate multiple choice, fill-in-blanks & context questions on the fly.
          </p>
          <div className="mt-4 flex items-center text-xs font-black uppercase tracking-wider text-teal-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Take AI Quiz</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* 4. Weak Word Radar */}
        <div
          id="action-radar-card"
          onClick={() => setActiveTab('radar')}
          className="bg-[#0f172a] border border-slate-800 hover:border-rose-500/60 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 group"
        >
          <div className="flex items-start justify-between">
            <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all">
              <Radar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">
              {strugglingWords.length} At Risk
            </span>
          </div>
          <h3 className="font-display text-base font-black text-white mt-3 group-hover:text-rose-300 transition-colors uppercase tracking-tight">
            🚨 Weak Word Radar
          </h3>
          <p className="text-xs text-slate-300 mt-1 line-clamp-2 font-medium">
            Identify high-decay words with "Why Did I Forget This?" AI assistance.
          </p>
          <div className="mt-4 flex items-center text-xs font-black uppercase tracking-wider text-rose-400 gap-1 group-hover:translate-x-1 transition-transform">
            <span>Inspect Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Numerical Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Words Learned</p>
          <p className="font-display text-2xl font-black text-white mt-1 tracking-tight">{profile.wordsLearnedCount}</p>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">+1 today</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Words Mastered</p>
          <p className="font-display text-2xl font-black text-emerald-400 mt-1 tracking-tight">{masteredWords.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">14d+ Interval</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Reviewing</p>
          <p className="font-display text-2xl font-black text-amber-400 mt-1 tracking-tight">{reviewingWords.length}</p>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">In Active SM-2</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Struggling</p>
          <p className="font-display text-2xl font-black text-rose-400 mt-1 tracking-tight">{strugglingWords.length}</p>
          <span className="text-[10px] text-rose-400/90 font-bold uppercase tracking-wider">Radar Priority</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Streak</p>
          <p className="font-display text-2xl font-black text-amber-300 mt-1 tracking-tight">{profile.currentStreak}d</p>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Best: {profile.longestStreak}d</span>
        </div>

        <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-3.5 text-center">
          <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">Total XP</p>
          <p className="font-display text-2xl font-black text-indigo-300 mt-1 tracking-tight">{profile.xp.toLocaleString()}</p>
          <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Rank #{profile.level}</span>
        </div>
      </div>

      {/* Dual Section: Weak Vocabulary Radar Preview & Recently Learned */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Weak Word Radar Preview (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Radar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-base font-black text-white uppercase tracking-tight">🚨 Words You Are Most Likely to Forget</h2>
                <p className="text-xs text-slate-400 font-medium">Spaced repetition retention decay & cognitive roadblock meter</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('radar')}
              className="text-xs font-black uppercase tracking-wider text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              <span>View Full Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {topStruggling.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs font-medium">
                ✨ Excellent! No struggling words on your radar right now.
              </div>
            ) : (
              topStruggling.map(({ word, progress, riskCategory }, index) => (
                <div
                  key={word.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#020617] border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-500 w-4">
                      {index + 1}.
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-black text-white">{word.word}</span>
                        <span className="text-xs text-slate-400 font-mono">{word.pronunciation}</span>
                      </div>
                      <p className="text-xs text-slate-300 truncate max-w-xs sm:max-w-md font-medium">
                        {word.meaning}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">
                        {progress.forgotCount > 0 ? `${progress.forgotCount}x Forgotten` : 'Low Ease'}
                      </span>
                      <p className="text-[10px] text-slate-500 font-bold">
                        Ease: {progress.easeFactor}x
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider ${
                          riskCategory === 'high'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                            : riskCategory === 'medium'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}
                      >
                        {riskCategory === 'high' ? '🔴 High Risk' : riskCategory === 'medium' ? '🟠 Medium' : '🟡 Low'}
                      </span>

                      <button
                        onClick={() => {
                          setSelectedWord(word);
                          setActiveTab('learn');
                        }}
                        className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider transition-colors"
                      >
                        Revise
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Recently Learned & AI Memory Trick Peek (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black text-white uppercase tracking-tight">Recently Learned Words</h2>
                  <p className="text-xs text-slate-400 font-medium">Quick audio & mnemonic refresher</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('explore')}
                className="text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300"
              >
                All Words
              </button>
            </div>

            <div className="space-y-2.5">
              {recentlyLearned.map((w) => {
                const prog = progressMap[w.id];
                return (
                  <div
                    key={w.id}
                    className="p-3 rounded-xl bg-[#020617] border border-slate-800 hover:border-slate-700 transition-all flex items-start justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-sm font-black text-indigo-300">{w.word}</span>
                        <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {w.partOfSpeech}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 truncate mt-0.5 font-medium">{w.meaning}</p>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] text-amber-300 font-semibold">
                        <span>💡</span>
                        <span className="truncate">{w.defaultMnemonic}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => speakWord(w.word)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Listen Pronunciation"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWord(w);
                          setActiveTab('learn');
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors text-xs font-bold"
                        title="Open Card"
                      >
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-teal-400" />
              <span>Retention rate: <strong className="text-white font-black">92.4%</strong></span>
            </span>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-indigo-400 hover:text-indigo-300 font-bold uppercase tracking-wider text-xs"
            >
              View Analytics →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
