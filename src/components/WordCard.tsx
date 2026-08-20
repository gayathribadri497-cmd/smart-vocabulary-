import React, { useState } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { VocabularyWord, ReviewResponse } from '../types';
import {
  Volume2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Brain,
  Layers,
  History,
  Check,
  Zap,
  Tag,
  BookMarked,
  Info,
  RefreshCw,
  Plus
} from 'lucide-react';

interface WordCardProps {
  initialWord?: VocabularyWord | null;
}

export const WordCard: React.FC<WordCardProps> = ({ initialWord }) => {
  const {
    words,
    selectedWord,
    setSelectedWord,
    progressMap,
    recordReview,
    activeInterest,
    setActiveInterest,
    profile,
    generateInterestMnemonic,
    remediateStrugglingWord,
    speakWord,
    isSpeaking,
    startLearningWord
  } = useVocabulary();

  // Find active word
  const currentWord = selectedWord || initialWord || words[0];
  const currentIndex = words.findIndex((w) => w.id === currentWord.id);
  const currentProgress = progressMap[currentWord.id];

  const [isGeneratingMnemonic, setIsGeneratingMnemonic] = useState(false);
  const [isRemediating, setIsRemediating] = useState(false);
  const [remediationResult, setRemediationResult] = useState<any | null>(null);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState<string | null>(null);
  const [customInterestInput, setCustomInterestInput] = useState('');
  const [showCustomInterest, setShowCustomInterest] = useState(false);
  const [tutorExplanation, setTutorExplanation] = useState<string | null>(null);
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);

  // Available Interests from student profile + general presets
  const availableInterests = Array.from(
    new Set([...profile.interests, 'Cricket', 'Gaming', 'Tech', 'Cinema', 'Cooking', 'Anime', 'Nature'])
  );

  const handlePrev = () => {
    const prevIdx = (currentIndex - 1 + words.length) % words.length;
    setSelectedWord(words[prevIdx]);
    setRemediationResult(null);
    setTutorExplanation(null);
    setReviewSuccessMsg(null);
  };

  const handleNext = () => {
    const nextIdx = (currentIndex + 1) % words.length;
    setSelectedWord(words[nextIdx]);
    setRemediationResult(null);
    setTutorExplanation(null);
    setReviewSuccessMsg(null);
  };

  const handleRating = (rating: ReviewResponse) => {
    const updated = recordReview(currentWord.id, rating);
    const label =
      rating === 'easy'
        ? `😎 Easy! Next review in ${updated.intervalDays} days.`
        : rating === 'good'
        ? `🙂 Good! Next review in ${updated.intervalDays} days.`
        : rating === 'hard'
        ? `😐 Hard. Next review in ${updated.intervalDays} days.`
        : `❌ Marked as Forgot. Added to today's priority revision.`;

    setReviewSuccessMsg(label);
    setTimeout(() => {
      setReviewSuccessMsg(null);
    }, 4000);
  };

  const handleGenerateMnemonic = async (interestToUse: string) => {
    setIsGeneratingMnemonic(true);
    await generateInterestMnemonic(currentWord.id, interestToUse);
    setIsGeneratingMnemonic(false);
  };

  const handleCognitiveRescue = async () => {
    setIsRemediating(true);
    const result = await remediateStrugglingWord(currentWord.id);
    setRemediationResult(result);
    setIsRemediating(false);
  };

  const handleAskTutor = async () => {
    setIsLoadingTutor(true);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: currentWord.word,
          meaning: currentWord.meaning,
          userQuestion: `Explain practical conversational nuances, tone, and pitfalls for ${currentWord.word}.`
        })
      });
      const json = await res.json();
      if (json.success) {
        setTutorExplanation(json.explanation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingTutor(false);
    }
  };

  // Get active mnemonic based on chosen interest
  const personalizedMnemonic =
    currentWord.personalizedMnemonics && currentWord.personalizedMnemonics[activeInterest];

  return (
    <div id="word-card-view" className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Carousel Navigation & Word Counter */}
      <div className="flex items-center justify-between text-slate-300">
        <button
          id="prev-word-btn"
          onClick={handlePrev}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:bg-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <div className="text-center">
          <span className="text-xs font-black uppercase tracking-widest text-slate-400">
            Word {currentIndex + 1} of {words.length}
          </span>
          <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mt-0.5">
            Category: {currentWord.category}
          </p>
        </div>

        <button
          id="next-word-btn"
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0f172a] border border-slate-800 hover:bg-slate-800 text-xs font-black uppercase tracking-wider transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Main Vocabulary Learning Card (Matching prompt aesthetic) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden text-slate-100">
        {/* Subtle accent backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {currentWord.partOfSpeech}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                currentWord.difficulty === 'Beginner'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : currentWord.difficulty === 'Intermediate'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : currentWord.difficulty === 'Advanced'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              }`}
            >
              {currentWord.difficulty}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
              {currentWord.category}
            </span>
          </div>

          {/* SM-2 Status indicator */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">SM-2 Status:</span>
            {currentProgress ? (
              <span
                className={`font-black uppercase tracking-wider text-[10px] px-3 py-1 rounded-full capitalize ${
                  currentProgress.status === 'mastered'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : currentProgress.status === 'struggling'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : currentProgress.status === 'reviewing'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                }`}
              >
                {currentProgress.status} (Interval: {currentProgress.intervalDays}d)
              </span>
            ) : (
              <button
                onClick={() => startLearningWord(currentWord.id)}
                className="font-black uppercase tracking-wider text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 underline"
              >
                <Plus className="w-3.5 h-3.5" /> Start Learning
              </button>
            )}
          </div>
        </div>

        {/* Hero Word, Pronunciation & Pronounce Audio Button */}
        <div className="py-8 text-center space-y-3">
          <div className="inline-flex items-center gap-4">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase text-white">
              {currentWord.word}
            </h1>
            <button
              id="pronounce-audio-btn"
              onClick={() => speakWord(currentWord.word)}
              className={`p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl transition-transform hover:scale-105 active:scale-95 ${
                isSpeaking ? 'ring-4 ring-indigo-400/50 animate-pulse' : ''
              }`}
              title="Pronounce Word (Text-to-Speech)"
            >
              <Volume2 className="w-6 h-6" />
            </button>
          </div>

          {/* Phonetic Pronunciation */}
          <div className="flex items-center justify-center gap-3 text-slate-400">
            <span className="text-lg sm:text-xl font-mono font-bold text-indigo-300">
              {currentWord.pronunciation}
            </span>
            {currentWord.ipa && (
              <span className="text-xs font-mono text-slate-400 bg-[#020617] px-2.5 py-1 rounded-md border border-slate-800">
                IPA: {currentWord.ipa}
              </span>
            )}
          </div>

          {/* Primary Definition */}
          <div className="max-w-2xl mx-auto pt-2">
            <p className="font-display text-xl sm:text-2xl text-slate-100 font-bold leading-relaxed">
              "{currentWord.meaning}"
            </p>
          </div>
        </div>

        {/* AI-Generated Mnemonic Box (Differentiating Wow Feature) */}
        <div className="my-6 bg-[#020617] border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-inner relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-indigo-900/40">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display text-sm font-black uppercase tracking-tight text-white flex items-center gap-2">
                  <span>AI Memory Mnemonic</span>
                  <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-indigo-500 text-slate-950">
                    High Retention
                  </span>
                </h2>
                <p className="text-xs text-slate-400 font-medium">Personalized mental trick tailored to your interests</p>
              </div>
            </div>

            {/* Interest Tag Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mr-1">Anchor:</span>
              {availableInterests.slice(0, 5).map((interest) => (
                <button
                  key={interest}
                  onClick={() => {
                    setActiveInterest(interest);
                    if (!currentWord.personalizedMnemonics?.[interest]) {
                      handleGenerateMnemonic(interest);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                    activeInterest === interest
                      ? 'bg-indigo-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {interest}
                </button>
              ))}

              <button
                onClick={() => setShowCustomInterest(!showCustomInterest)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                title="Custom Interest"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Custom Interest Input */}
          {showCustomInterest && (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={customInterestInput}
                onChange={(e) => setCustomInterestInput(e.target.value)}
                placeholder="Enter custom interest (e.g., Marvel, Formula 1, Photography)..."
                className="flex-1 px-3 py-2 rounded-lg bg-[#020617] border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                onClick={() => {
                  if (customInterestInput.trim()) {
                    setActiveInterest(customInterestInput.trim());
                    handleGenerateMnemonic(customInterestInput.trim());
                    setCustomInterestInput('');
                    setShowCustomInterest(false);
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-indigo-600 text-white text-xs font-black uppercase tracking-wider hover:bg-indigo-500"
              >
                Generate Mnemonic
              </button>
            </div>
          )}

          {/* Active Mnemonic Content */}
          <div className="mt-4">
            {isGeneratingMnemonic ? (
              <div className="flex items-center justify-center py-6 gap-2 text-indigo-300 text-xs font-bold animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Crafting custom {activeInterest}-tailored memory association with Gemini...</span>
              </div>
            ) : personalizedMnemonic ? (
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-[#0b1329] p-4 rounded-xl border border-indigo-900/40">
                  <span className="text-3xl select-none">{personalizedMnemonic.visualEmoji || '💡'}</span>
                  <div>
                    <p className="text-sm font-black text-indigo-200 uppercase tracking-tight">
                      {personalizedMnemonic.trick}
                    </p>
                    <p className="text-xs text-slate-300 mt-1 italic font-medium">
                      "{personalizedMnemonic.hookStory}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start gap-3 bg-[#0b1329] p-4 rounded-xl border border-indigo-900/40">
                  <span className="text-3xl select-none">{currentWord.defaultVisualEmoji || '💡'}</span>
                  <div>
                    <p className="text-sm font-black text-indigo-200 uppercase tracking-tight">
                      {currentWord.defaultMnemonic}
                    </p>
                    <p className="text-xs text-slate-400 mt-1 font-medium">
                      Anchor for {activeInterest}: Click any interest pill above to generate instant AI memory tricks!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Examples Section */}
        <div className="space-y-3 my-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5 text-indigo-400" />
            Contextual Usage
          </h3>
          <div className="space-y-2">
            <div className="p-3.5 rounded-xl bg-[#020617] border border-slate-800 text-sm text-slate-200 leading-relaxed font-medium">
              <strong className="text-indigo-300 font-black mr-1">1.</strong> {currentWord.example}
            </div>
            {currentWord.example2 && (
              <div className="p-3.5 rounded-xl bg-[#020617] border border-slate-800 text-sm text-slate-200 leading-relaxed font-medium">
                <strong className="text-indigo-300 font-black mr-1">2.</strong> {currentWord.example2}
              </div>
            )}
          </div>
        </div>

        {/* Synonyms & Antonyms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="p-4 rounded-xl bg-[#020617] border border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-400 mb-2.5">
              Synonyms (Similar Meaning)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentWord.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-800/30"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#020617] border border-slate-800">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2.5">
              Antonyms (Opposites)
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {currentWord.antonyms.map((ant) => (
                <span
                  key={ant}
                  className="text-xs font-bold px-2.5 py-1 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/30"
                >
                  {ant}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Word Origin (Etymology) & Related Words */}
        {(currentWord.origin || (currentWord.relatedWords && currentWord.relatedWords.length > 0)) && (
          <div className="p-4 rounded-xl bg-[#020617] border border-slate-800 text-xs text-slate-300 space-y-2 my-6">
            {currentWord.origin && (
              <div>
                <span className="font-black text-amber-400 uppercase tracking-wider mr-1.5">🏛️ Etymology / Origin:</span>
                <span className="font-medium">{currentWord.origin}</span>
              </div>
            )}
            {currentWord.relatedWords && currentWord.relatedWords.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                <span className="font-black uppercase tracking-wider text-slate-400">Related Forms:</span>
                <span className="text-indigo-300 font-bold">{currentWord.relatedWords.join(' · ')}</span>
              </div>
            )}
          </div>
        )}

        {/* AI Tutor Deep Dive (Conversational Nuance) */}
        {tutorExplanation && (
          <div className="my-6 p-4 rounded-xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-slate-200 space-y-2">
            <div className="flex items-center justify-between pb-1 border-b border-indigo-800/40">
              <span className="font-black text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Lexicographer Nuance & Pitfalls
              </span>
              <button
                onClick={() => setTutorExplanation(null)}
                className="text-slate-400 hover:text-white font-bold text-xs"
              >
                Dismiss
              </button>
            </div>
            <div className="whitespace-pre-line leading-relaxed text-slate-300 font-medium">
              {tutorExplanation}
            </div>
          </div>
        )}

        {/* Remediation Result ("Why Did I Forget This?") */}
        {remediationResult && (
          <div className="my-6 p-5 rounded-2xl bg-rose-950/40 border border-rose-800/60 space-y-3">
            <div className="flex items-center gap-2 text-rose-300 font-black text-sm uppercase tracking-wide">
              <span className="text-xl">{remediationResult.emoji || '💡'}</span>
              <span>AI Cognitive Rescue Analysis</span>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              <strong className="text-rose-400 font-black uppercase tracking-wider mr-1">Why this was forgotten:</strong> {remediationResult.whyYouForgot}
            </p>
            <div className="p-3.5 bg-[#020617] rounded-xl border border-rose-900/50">
              <p className="text-xs font-black text-amber-300 uppercase tracking-wider">Fresh Mnemonic: "{remediationResult.newMnemonic}"</p>
              <p className="text-xs text-slate-300 mt-1 italic font-medium">Example: {remediationResult.newExample}</p>
              <p className="text-[11px] text-teal-300 font-black mt-1.5 uppercase tracking-wider">
                📌 Memory Anchor Rule: {remediationResult.memoryAnchor}
              </p>
            </div>
          </div>
        )}

        {/* Spaced Repetition Rating Action Bar (The Core UI Requirement) */}
        <div className="pt-6 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-display text-sm font-black uppercase tracking-tight text-white">How difficult was this word?</p>
              <p className="text-xs text-slate-400 font-medium">Updates your spaced repetition SM-2 next review date</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAskTutor}
                disabled={isLoadingTutor}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingTutor ? 'Consulting AI...' : 'Ask AI Tutor'}</span>
              </button>

              <button
                onClick={handleCognitiveRescue}
                disabled={isRemediating}
                className="px-3 py-1.5 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRemediating ? 'animate-spin' : ''}`} />
                <span>Why Did I Forget?</span>
              </button>
            </div>
          </div>

          {/* Rating Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
            <button
              id="rate-forgot-btn"
              onClick={() => handleRating('forgot')}
              className="p-3.5 rounded-xl bg-[#020617] hover:bg-rose-950/60 border border-slate-800 hover:border-rose-700 text-center transition-all group"
            >
              <div className="text-xl">❌</div>
              <div className="font-display text-xs font-black text-rose-400 group-hover:text-rose-300 uppercase tracking-wider mt-1">
                Forgot
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Today / Tomorrow</div>
            </button>

            <button
              id="rate-hard-btn"
              onClick={() => handleRating('hard')}
              className="p-3.5 rounded-xl bg-[#020617] hover:bg-amber-950/60 border border-slate-800 hover:border-amber-700 text-center transition-all group"
            >
              <div className="text-xl">😐</div>
              <div className="font-display text-xs font-black text-amber-400 group-hover:text-amber-300 uppercase tracking-wider mt-1">
                Hard
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">1 Day</div>
            </button>

            <button
              id="rate-good-btn"
              onClick={() => handleRating('good')}
              className="p-3.5 rounded-xl bg-[#020617] hover:bg-blue-950/60 border border-slate-800 hover:border-blue-700 text-center transition-all group"
            >
              <div className="text-xl">🙂</div>
              <div className="font-display text-xs font-black text-blue-400 group-hover:text-blue-300 uppercase tracking-wider mt-1">
                Good
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">3 Days</div>
            </button>

            <button
              id="rate-easy-btn"
              onClick={() => handleRating('easy')}
              className="p-3.5 rounded-xl bg-[#020617] hover:bg-emerald-950/60 border border-slate-800 hover:border-emerald-700 text-center transition-all group"
            >
              <div className="text-xl">😎</div>
              <div className="font-display text-xs font-black text-emerald-400 group-hover:text-emerald-300 uppercase tracking-wider mt-1">
                Easy
              </div>
              <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">7+ Days</div>
            </button>
          </div>

          {/* Success Toast */}
          {reviewSuccessMsg && (
            <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/50 text-indigo-200 text-xs font-black uppercase tracking-wider text-center animate-fade-in flex items-center justify-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{reviewSuccessMsg}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
