import React from 'react';
import { VocabularyProvider, useVocabulary } from './context/VocabularyContext';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { WordCard } from './components/WordCard';
import { ReviewSession } from './components/ReviewSession';
import { QuizSession } from './components/QuizSession';
import { WeakWordRadar } from './components/WeakWordRadar';
import { SearchExplore } from './components/SearchExplore';
import { AnalyticsProgress } from './components/AnalyticsProgress';
import {
  BookOpen,
  Sparkles,
  RotateCcw,
  GraduationCap,
  Radar,
  BarChart3,
  Search
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, setActiveTab, selectedWord } = useVocabulary();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'learn' && <WordCard initialWord={selectedWord} />}
        {activeTab === 'review' && <ReviewSession />}
        {activeTab === 'quiz' && <QuizSession />}
        {activeTab === 'radar' && <WeakWordRadar />}
        {activeTab === 'explore' && <SearchExplore />}
        {activeTab === 'analytics' && <AnalyticsProgress />}
      </main>

      {/* Floating Bottom Quick Nav for Mobile */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Home</span>
        </button>

        <button
          onClick={() => setActiveTab('learn')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'learn' ? 'text-indigo-400' : 'text-slate-400'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Learn</span>
        </button>

        <button
          onClick={() => setActiveTab('review')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'review' ? 'text-amber-400' : 'text-slate-400'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>Review</span>
        </button>

        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'quiz' ? 'text-teal-400' : 'text-slate-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Quiz</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'radar' ? 'text-rose-400' : 'text-slate-400'
          }`}
        >
          <Radar className="w-4 h-4" />
          <span>Radar</span>
        </button>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-semibold tracking-wide">SM-2 Memory Engine active · Spaced Repetition Scheduling</span>
          </div>
          <p className="text-slate-400 font-medium">
            Powered by Gemini AI · Personalized Mnemonics & Cognitive Rescue
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <VocabularyProvider>
      <MainContent />
    </VocabularyProvider>
  );
}
