import React, { useState } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { VocabularyWord, UserWordProgress } from '../types';
import {
  Radar,
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Brain,
  Volume2,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Info,
  Layers,
  HelpCircle
} from 'lucide-react';

export const WeakWordRadar: React.FC = () => {
  const {
    weakWordsList,
    remediateStrugglingWord,
    setSelectedWord,
    setActiveTab,
    speakWord,
    activeInterest
  } = useVocabulary();

  const [activeRescueWord, setActiveRescueWord] = useState<VocabularyWord | null>(null);
  const [rescueLoading, setRescueLoading] = useState(false);
  const [rescueData, setRescueData] = useState<any | null>(null);
  const [customConfusionReason, setCustomConfusionReason] = useState('');

  const handleStartRescue = async (word: VocabularyWord) => {
    setActiveRescueWord(word);
    setRescueData(null);
    setRescueLoading(true);

    const result = await remediateStrugglingWord(word.id, customConfusionReason);
    setRescueData(result);
    setRescueLoading(false);
  };

  const highRiskWords = weakWordsList.filter((w) => w.riskCategory === 'high');
  const mediumRiskWords = weakWordsList.filter((w) => w.riskCategory === 'medium');
  const lowRiskWords = weakWordsList.filter((w) => w.riskCategory === 'low');

  return (
    <div id="weak-word-radar-view" className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest">
              <Radar className="w-4 h-4 text-rose-400 animate-spin" />
              <span>Cognitive Retention Radar</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Weak Vocabulary Radar
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl leading-relaxed font-medium">
              Our spaced repetition engine calculates forgetting curve decay in real-time. Words flagged here are at imminent risk of memory extinction unless reinforced.
            </p>
          </div>

          {/* Metric Summary */}
          <div className="grid grid-cols-3 gap-2.5 bg-[#020617] p-3.5 rounded-2xl border border-slate-800 text-center">
            <div className="p-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">🔴 High</p>
              <p className="font-display text-2xl font-black text-rose-400 mt-0.5">{highRiskWords.length}</p>
            </div>
            <div className="p-2 border-x border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">🟠 Medium</p>
              <p className="font-display text-2xl font-black text-amber-400 mt-0.5">{mediumRiskWords.length}</p>
            </div>
            <div className="p-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">🟡 Safe</p>
              <p className="font-display text-2xl font-black text-emerald-400 mt-0.5">{lowRiskWords.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Radar Table */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h2 className="font-display text-base font-black uppercase tracking-tight text-white">Prioritized At-Risk Lexicon</h2>
            <p className="text-xs text-slate-400 font-medium">Ranked by decay probability & historical struggle frequency</p>
          </div>

          <button
            onClick={() => setActiveTab('review')}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-98"
          >
            <span>Start Priority Review</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {weakWordsList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm font-medium">
              ✨ No weak words found. All vocabulary is currently healthy in spaced intervals!
            </div>
          ) : (
            weakWordsList.map(({ word, progress, riskCategory }, index) => {
              const decayPercent = progress.retentionRiskScore;

              return (
                <div
                  key={word.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    riskCategory === 'high'
                      ? 'bg-rose-950/20 border-rose-900/40 hover:border-rose-700'
                      : riskCategory === 'medium'
                      ? 'bg-amber-950/15 border-amber-900/30 hover:border-amber-700'
                      : 'bg-[#020617] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Word details & meaning */}
                    <div className="flex items-start gap-3.5 flex-1 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 text-xs font-black flex items-center justify-center text-slate-400 flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-white">{word.word}</h3>
                          <span className="text-xs font-mono font-bold text-indigo-300">
                            {word.pronunciation}
                          </span>
                          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                            {word.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed font-medium">{word.meaning}</p>
                        
                        {/* Current Mnemonic Peek */}
                        <p className="text-[11px] text-amber-300/90 mt-1 flex items-center gap-1 truncate font-medium">
                          <span className="font-bold text-amber-400">💡 Mnemonic:</span>
                          <span className="italic">{word.defaultMnemonic}</span>
                        </p>
                      </div>
                    </div>

                    {/* Right: Retention Decay Meter & Action Buttons */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800">
                      {/* Decay Meter */}
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-xs font-black uppercase tracking-wider text-slate-200">
                            {decayPercent}% Risk
                          </span>
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${
                              riskCategory === 'high'
                                ? 'bg-rose-500 animate-pulse'
                                : riskCategory === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          ></span>
                        </div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                          {progress.forgotCount > 0 ? `${progress.forgotCount}x Forgotten` : 'Interval Overdue'}
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => speakWord(word.word)}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                          title="Pronounce"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleStartRescue(word)}
                          className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-sm active:scale-98"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>AI Rescue</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedWord(word);
                            setActiveTab('learn');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-black uppercase tracking-wider transition-colors"
                        >
                          Open Card
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* AI Cognitive Rescue Modal ("Why Did I Forget This?") */}
      {activeRescueWord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 text-xl font-bold">
                  🧠
                </div>
                <div>
                  <h2 className="font-display text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>AI "Why Did I Forget This?" Analysis</span>
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    Cognitive diagnosis & memory re-anchoring for <strong className="text-white font-bold">{activeRescueWord.word}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveRescueWord(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            {rescueLoading ? (
              <div className="py-12 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-rose-400 animate-spin mx-auto" />
                <p className="font-display text-sm font-black uppercase tracking-wider text-white">Synthesizing Cognitive Rescue...</p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
                  Gemini is analyzing cognitive failure points and creating an ultra-sticky new mnemonic for {activeInterest}.
                </p>
              </div>
            ) : rescueData ? (
              <div className="space-y-4">
                {/* Diagnosis Box */}
                <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-rose-300">
                    🔬 Cognitive Diagnosis
                  </span>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {rescueData.whyYouForgot}
                  </p>
                </div>

                {/* Fresh Mnemonic */}
                <div className="p-5 rounded-2xl bg-[#020617] border border-indigo-500/30 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rescueData.emoji || '💡'}</span>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">
                        Brand New Mnemonic Anchor
                      </span>
                      <p className="font-display text-sm sm:text-base font-black text-indigo-100">
                        "{rescueData.newMnemonic}"
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 italic pt-1 font-medium">
                    "{rescueData.newExample}"
                  </p>
                </div>

                {/* Sensory Visual Metaphor & Memory Rule */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-[#020617] border border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">🎨 Visual Metaphor</p>
                    <p className="text-xs text-slate-300 mt-1 font-medium">{rescueData.visualMetaphor}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#020617] border border-slate-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-400">📌 Memory Anchor Rule</p>
                    <p className="text-xs text-slate-300 mt-1 font-bold">"{rescueData.memoryAnchor}"</p>
                  </div>
                </div>

                {/* Close & Review Button */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setSelectedWord(activeRescueWord);
                      setActiveRescueWord(null);
                      setActiveTab('learn');
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider text-xs shadow-md transition-all active:scale-98"
                  >
                    Open Card & Re-test
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
