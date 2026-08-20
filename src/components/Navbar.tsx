import React, { useState } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import {
  Brain,
  Flame,
  Sparkles,
  Bell,
  BookOpen,
  RotateCcw,
  GraduationCap,
  Radar,
  BarChart3,
  Search,
  Settings,
  User,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSettings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenSettings }) => {
  const {
    profile,
    activeTab,
    setActiveTab,
    dueWords,
    weakWordsList,
    switchDemoProfile
  } = useVocabulary();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const strugglingCount = weakWordsList.filter(w => w.riskCategory === 'high').length;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-500 to-teal-400 p-[2px] shadow-md group-hover:scale-105 transition-transform duration-200">
              <div className="w-full h-full bg-[#020617] rounded-[10px] flex items-center justify-center">
                <Brain className="w-5 h-5 text-indigo-400 group-hover:text-teal-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl tracking-tight text-white uppercase">
                  Smart Vocab
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  SM-2 AI
                </span>
              </div>
              <p className="text-[11px] font-semibold text-slate-400 tracking-wide -mt-0.5">Spaced Repetition & Mnemonics</p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
            <button
              id="nav-dashboard"
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </button>
            <button
              id="nav-learn"
              onClick={() => setActiveTab('learn')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'learn'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Learn
            </button>
            <button
              id="nav-review"
              onClick={() => setActiveTab('review')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all relative ${
                activeTab === 'review'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Review
              {dueWords.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-amber-500 text-slate-950">
                  {dueWords.length}
                </span>
              )}
            </button>
            <button
              id="nav-quiz"
              onClick={() => setActiveTab('quiz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'quiz'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              AI Quiz
            </button>
            <button
              id="nav-radar"
              onClick={() => setActiveTab('radar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'radar'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Radar className="w-3.5 h-3.5 text-rose-400" />
              Weak Radar
              {strugglingCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              )}
            </button>
            <button
              id="nav-explore"
              onClick={() => setActiveTab('explore')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'explore'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              Explore
            </button>
            <button
              id="nav-analytics"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analytics
            </button>
          </nav>

          {/* Right Metrics & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Streak */}
            <div
              id="streak-badge"
              title={`${profile.currentStreak} Day Active Streak`}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider"
            >
              <Flame className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>{profile.currentStreak}d</span>
            </div>

            {/* XP & Level */}
            <div
              id="xp-badge"
              title={`Level ${profile.level}: ${profile.levelTitle}`}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold tracking-wide"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>{profile.xp.toLocaleString()} XP</span>
              <span className="text-[10px] text-slate-400 font-bold">· Lvl {profile.level}</span>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                id="notifications-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg bg-slate-800/70 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {dueWords.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-400 ring-2 ring-slate-900"></span>
                )}
              </button>

              {/* Notification Popover */}
              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-xl shadow-xl p-3 z-50 text-slate-200"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Spaced Repetition Alerts
                    </span>
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-slate-500 hover:text-slate-300"
                    >
                      Close
                    </button>
                  </div>
                  <div className="space-y-2 pt-2 text-xs">
                    {dueWords.length > 0 ? (
                      <div
                        onClick={() => {
                          setActiveTab('review');
                          setShowNotifications(false);
                        }}
                        className="p-2 rounded-lg bg-indigo-950/40 border border-indigo-800/40 hover:bg-indigo-900/40 cursor-pointer transition-colors"
                      >
                        <p className="font-semibold text-indigo-300">
                          🔔 {dueWords.length} words due for spaced review!
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Review now to preserve memory intervals and prevent retention decay.
                        </p>
                      </div>
                    ) : (
                      <div className="p-2 text-slate-400 text-center">
                        ✅ You are all caught up on due reviews!
                      </div>
                    )}

                    {strugglingCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveTab('radar');
                          setShowNotifications(false);
                        }}
                        className="p-2 rounded-lg bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/40 cursor-pointer transition-colors"
                      >
                        <p className="font-semibold text-rose-300">
                          🚨 {strugglingCount} words on Weak Word Radar
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          AI cognitive rescue is available with fresh mnemonics.
                        </p>
                      </div>
                    )}

                    <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400">
                      🔥 Streak is active! Complete today's 10-word target to maintain momentum.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                id="profile-menu-btn"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 transition-all text-xs font-medium"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-teal-400 flex items-center justify-center font-bold text-slate-950 text-xs">
                  {profile.name[0]}
                </div>
                <span className="hidden sm:inline-block text-slate-200 font-medium">
                  {profile.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Profile Menu */}
              {showProfileMenu && (
                <div
                  id="profile-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-3 z-50 text-slate-200"
                >
                  <div className="pb-3 border-b border-slate-800">
                    <p className="font-bold text-sm text-white">{profile.name}</p>
                    <p className="text-xs text-slate-400 truncate">{profile.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {profile.learningLevel}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                        {profile.targetCategory}
                      </span>
                    </div>
                  </div>

                  <div className="py-2 border-b border-slate-800 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                      Switch Demo Student
                    </p>
                    <button
                      onClick={() => {
                        switchDemoProfile('prathibha');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
                        profile.id === 'student-prathibha' ? 'text-indigo-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>Prathibha (Competitive Exams / Cricket)</span>
                      {profile.id === 'student-prathibha' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                    <button
                      onClick={() => {
                        switchDemoProfile('alex');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
                        profile.id === 'student-alex' ? 'text-indigo-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>Alex Vance (Tech & Gaming)</span>
                      {profile.id === 'student-alex' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                    <button
                      onClick={() => {
                        switchDemoProfile('marcus');
                        setShowProfileMenu(false);
                      }}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
                        profile.id === 'student-marcus' ? 'text-indigo-300 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      <span>Marcus (Business & Cinema)</span>
                      {profile.id === 'student-marcus' && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />}
                    </button>
                  </div>

                  <div className="pt-2 space-y-1">
                    <button
                      id="menu-settings-btn"
                      onClick={() => {
                        onOpenSettings();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-400" />
                      Learning Preferences
                    </button>
                    <button
                      id="menu-auth-btn"
                      onClick={() => {
                        onOpenAuth();
                        setShowProfileMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      Account & Security
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sub Navigation Bar */}
        <div className="flex md:hidden items-center justify-between py-2.5 overflow-x-auto border-t border-slate-800/80 gap-1 text-xs scrollbar-none">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('learn')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'learn' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Learn
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'review' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Review ({dueWords.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'quiz' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Quiz
          </button>
          <button
            onClick={() => setActiveTab('radar')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium text-rose-300 ${
              activeTab === 'radar' ? 'bg-rose-600 text-white' : 'text-rose-400'
            }`}
          >
            Weak Radar
          </button>
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'explore' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium ${
              activeTab === 'analytics' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Analytics
          </button>
        </div>
      </div>
    </header>
  );
};
