import React, { useState } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { VocabularyWord, VocabularyCategory, LearningLevel, WordStatus } from '../types';
import {
  Search,
  Sparkles,
  Filter,
  Plus,
  Volume2,
  Brain,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Layers
} from 'lucide-react';

export const SearchExplore: React.FC = () => {
  const {
    words,
    progressMap,
    setSelectedWord,
    setActiveTab,
    addNewWord,
    speakWord,
    activeInterest
  } = useVocabulary();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // AI Word Lookup state
  const [lookupWordInput, setLookupWordInput] = useState('');
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [showLookupModal, setShowLookupModal] = useState(false);

  const categories: string[] = [
    'All',
    'Academic',
    'Competitive Exams',
    'Business',
    'Technology',
    'Daily English',
    'Interview Vocabulary',
    'Literature & Arts'
  ];

  const difficulties: string[] = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Mastery'];
  const statuses: string[] = ['All', 'Mastered', 'Reviewing', 'Learning', 'Struggling', 'New'];

  // Filter words
  const filteredWords = words.filter((w) => {
    const matchesQuery =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      w.defaultMnemonic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || w.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'All' || w.difficulty === selectedDifficulty;

    const prog = progressMap[w.id];
    const status = prog ? prog.status : 'new';
    const matchesStatus =
      selectedStatus === 'All' || status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesQuery && matchesCategory && matchesDifficulty && matchesStatus;
  });

  const handleLookupAndAdd = async () => {
    if (!lookupWordInput.trim()) return;

    setIsLookingUp(true);
    setLookupError(null);

    try {
      const res = await fetch('/api/ai/word-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: lookupWordInput.trim(),
          category: selectedCategory === 'All' ? 'Academic' : selectedCategory,
          interest: activeInterest
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        addNewWord(json.data);
        setSelectedWord(json.data);
        setShowLookupModal(false);
        setLookupWordInput('');
        setActiveTab('learn');
      } else {
        setLookupError(json.error || 'Failed to generate word profile.');
      }
    } catch (e: any) {
      console.error(e);
      setLookupError('Network error or API issue.');
    } finally {
      setIsLookingUp(false);
    }
  };

  return (
    <div id="search-explore-view" className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header with Search & AI Generator Button */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">Search & Explore Vocabulary</h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Browse your curated library or synthesize any custom word with Gemini AI
            </p>
          </div>

          <button
            id="ai-custom-word-btn"
            onClick={() => setShowLookupModal(true)}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all self-start md:self-auto active:scale-98"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Generate Any Word</span>
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="vocab-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by word, meaning, synonym, or mnemonic trick (e.g. 'resilient', 'careful')..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-[#020617] border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 shadow-inner font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Pills Row */}
        <div className="space-y-3 pt-2 border-t border-slate-800 text-xs">
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-slate-400 font-black uppercase tracking-widest text-[10px] whitespace-nowrap">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap text-xs font-black uppercase tracking-wider transition-colors ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Difficulty & Status Row */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Level:</span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                    selectedDifficulty === diff
                      ? 'bg-teal-500 text-slate-950 shadow-sm'
                      : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Status:</span>
              {statuses.map((stat) => (
                <button
                  key={stat}
                  onClick={() => setSelectedStatus(stat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider transition-colors ${
                    selectedStatus === stat
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-[#020617] text-slate-400 hover:text-slate-200 border border-slate-800'
                  }`}
                >
                  {stat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWords.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#0f172a] border border-slate-800 rounded-3xl p-6 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="font-display text-base font-black uppercase tracking-wider text-slate-300">No matching vocabulary found</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
              Try adjusting your search query, or use our AI Generator to lookup and add "{searchQuery || 'your word'}" immediately!
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setLookupWordInput(searchQuery);
                  setShowLookupModal(true);
                }}
                className="mt-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 active:scale-98"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Generate "{searchQuery}"</span>
              </button>
            )}
          </div>
        ) : (
          filteredWords.map((w) => {
            const prog = progressMap[w.id];
            const status: WordStatus = prog ? prog.status : 'new';
            const nextDate = prog?.nextReviewDate
              ? new Date(prog.nextReviewDate).toLocaleDateString()
              : 'Not scheduled';

            return (
              <div
                key={w.id}
                className="bg-[#0f172a] border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-lg group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-black uppercase tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                          {w.word}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakWord(w.word);
                          }}
                          className="p-1 rounded-md bg-slate-800 text-slate-400 hover:text-white"
                          title="Pronounce"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs font-mono font-bold text-indigo-300">{w.pronunciation}</p>
                    </div>

                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full capitalize ${
                        status === 'mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : status === 'struggling'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : status === 'reviewing'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : status === 'learning'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                    {w.meaning}
                  </p>

                  <div className="p-2.5 rounded-xl bg-[#020617] border border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-2 font-medium">
                    <span className="text-sm">{w.defaultVisualEmoji || '💡'}</span>
                    <span className="line-clamp-2 italic">{w.defaultMnemonic}</span>
                  </div>

                  {/* Synonyms Preview */}
                  <div className="flex flex-wrap gap-1">
                    {w.synonyms.slice(0, 3).map((syn) => (
                      <span
                        key={syn}
                        className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#020617] text-slate-400 border border-slate-800"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Metrics & Action */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Next: <strong className="text-slate-200 font-bold">{nextDate}</strong>
                  </span>

                  <button
                    onClick={() => {
                      setSelectedWord(w);
                      setActiveTab('learn');
                    }}
                    className="text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Open Card</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* AI Lookup & Generation Modal */}
      {showLookupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-display text-base font-black uppercase tracking-tight text-white">AI Custom Word Synthesizer</h2>
                  <p className="text-xs text-slate-400 font-medium">Add any English word to your active deck</p>
                </div>
              </div>
              <button
                onClick={() => setShowLookupModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
                  Vocabulary Word
                </label>
                <input
                  type="text"
                  value={lookupWordInput}
                  onChange={(e) => setLookupWordInput(e.target.value)}
                  placeholder="e.g. Obfuscate, Mellifluous, Sycophant, Paradigm..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#020617] border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
                />
              </div>

              <div className="p-3.5 bg-[#020617] rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 font-medium">
                <p className="font-black uppercase tracking-wider text-indigo-300">✨ Gemini AI will instantly compile:</p>
                <p>• Precise definition & Phonetic IPA pronunciation</p>
                <p>• Personalized memory mnemonic tailored to <strong className="text-white">{activeInterest}</strong></p>
                <p>• Real-world context examples, synonyms & etymology roots</p>
              </div>

              {lookupError && (
                <p className="text-xs text-rose-400 font-bold">{lookupError}</p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowLookupModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-black uppercase tracking-wider text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleLookupAndAdd}
                disabled={isLookingUp || !lookupWordInput.trim()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md active:scale-98 transition-all"
              >
                {isLookingUp ? (
                  <>
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>Synthesize & Add</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
