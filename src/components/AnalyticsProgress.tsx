import React, { useState } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { UserWordProgress } from '../types';
import {
  Award,
  Flame,
  TrendingUp,
  Brain,
  Layers,
  Target,
  CheckCircle2,
  Calendar,
  Sparkles,
  BarChart3,
  Clock,
  User,
  Plus,
  Trash2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const AnalyticsProgress: React.FC = () => {
  const {
    profile,
    updateProfile,
    words,
    progressMap,
    quizHistory,
    weakWordsList
  } = useVocabulary();

  const [newInterestInput, setNewInterestInput] = useState('');
  const [dailyGoalInput, setDailyGoalInput] = useState(profile.dailyGoalWords);
  const [isSavedToast, setIsSavedToast] = useState(false);

  // Status Breakdown calculation
  const mastered = words.filter((w) => progressMap[w.id]?.status === 'mastered').length;
  const reviewing = words.filter((w) => progressMap[w.id]?.status === 'reviewing').length;
  const learning = words.filter((w) => progressMap[w.id]?.status === 'learning').length;
  const struggling = words.filter((w) => progressMap[w.id]?.status === 'struggling').length;
  const unstarted = words.length - (mastered + reviewing + learning + struggling);

  const pieData = [
    { name: 'Mastered', value: mastered, color: '#10b981' },
    { name: 'Reviewing', value: reviewing, color: '#f59e0b' },
    { name: 'Learning', value: learning, color: '#6366f1' },
    { name: 'Struggling', value: struggling, color: '#f43f5e' },
    { name: 'Unstarted', value: Math.max(0, unstarted), color: '#334155' }
  ].filter(d => d.value > 0);

  // Interval Distribution data for SM-2
  const intervalBuckets = [
    { range: '1 Day', count: 0 },
    { range: '2-3 Days', count: 0 },
    { range: '4-7 Days', count: 0 },
    { range: '8-14 Days', count: 0 },
    { range: '15+ Days', count: 0 }
  ];

  (Object.values(progressMap) as UserWordProgress[]).forEach((p) => {
    if (p.intervalDays <= 1) intervalBuckets[0].count++;
    else if (p.intervalDays <= 3) intervalBuckets[1].count++;
    else if (p.intervalDays <= 7) intervalBuckets[2].count++;
    else if (p.intervalDays <= 14) intervalBuckets[3].count++;
    else intervalBuckets[4].count++;
  });

  // Recent 7 Days Learning History (Simulated + Live)
  const activityData = [
    { day: 'Mon', wordsLearned: 4, reviewCount: 8 },
    { day: 'Tue', wordsLearned: 6, reviewCount: 12 },
    { day: 'Wed', wordsLearned: 3, reviewCount: 7 },
    { day: 'Thu', wordsLearned: 8, reviewCount: 15 },
    { day: 'Fri', wordsLearned: 5, reviewCount: 10 },
    { day: 'Sat', wordsLearned: 7, reviewCount: 14 },
    { day: 'Sun (Today)', wordsLearned: profile.wordsLearnedCount % 5 + 3, reviewCount: 9 }
  ];

  const handleAddInterest = () => {
    if (newInterestInput.trim() && !profile.interests.includes(newInterestInput.trim())) {
      const updated = [...profile.interests, newInterestInput.trim()];
      updateProfile({ interests: updated });
      setNewInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    const updated = profile.interests.filter((i) => i !== interest);
    updateProfile({ interests: updated });
  };

  const handleSaveGoal = () => {
    updateProfile({ dailyGoalWords: Number(dailyGoalInput) });
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 3000);
  };

  return (
    <div id="analytics-progress-view" className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-black uppercase tracking-widest mb-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>Learning Analytics & Cognitive Retention</span>
            </div>
            <h1 className="font-display text-2xl sm:text-4xl font-black uppercase tracking-tight text-white">
              Progress & Mastery Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1">
              Tracking your spaced repetition schedule, memory stability, and personal interests.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3.5 bg-[#020617] rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">Streak Record</p>
                <p className="font-display text-base font-black text-amber-300">
                  {profile.currentStreak}d (Best: {profile.longestStreak}d)
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-[#020617] rounded-2xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-black tracking-widest text-slate-400">XP Mastery</p>
                <p className="font-display text-base font-black text-indigo-300">
                  {profile.xp.toLocaleString()} XP
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Vocabulary Status Pie Chart (5 cols) */}
        <div className="lg:col-span-5 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-black uppercase tracking-tight text-white">Lexicon Retention Health</h2>
              <p className="text-xs text-slate-400 font-medium">Distribution across mastery stages</p>
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-300 bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-1 rounded-lg">
              {words.length} Total Words
            </span>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-300 font-medium">Mastered: <strong className="font-bold text-white">{mastered}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-300 font-medium">Reviewing: <strong className="font-bold text-white">{reviewing}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
              <span className="text-slate-300 font-medium">Learning: <strong className="font-bold text-white">{learning}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-300 font-medium">Struggling: <strong className="font-bold text-white">{struggling}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span>
              <span className="text-slate-300 font-medium">Unstarted: <strong className="font-bold text-white">{Math.max(0, unstarted)}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: SM-2 Spaced Repetition Interval Distribution (7 cols) */}
        <div className="lg:col-span-7 bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-black uppercase tracking-tight text-white">SM-2 Spaced Intervals</h2>
              <p className="text-xs text-slate-400 font-medium">Words scheduled by next revision horizon</p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Algorithm: SuperMemo-2</span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={intervalBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#020617',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} name="Words in Bucket" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-400 italic pt-2 border-t border-slate-800 font-medium">
            💡 Words in the 15+ Days bucket have graduated to long-term memory consolidation.
          </p>
        </div>
      </div>

      {/* Weekly Activity Line Chart */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-black uppercase tracking-tight text-white">7-Day Study Cadence</h2>
            <p className="text-xs text-slate-400 font-medium">New words learned vs revision reviews completed</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px'
                }}
              />
              <Line
                type="monotone"
                dataKey="wordsLearned"
                stroke="#2dd4bf"
                strokeWidth={2}
                name="New Words Learned"
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="reviewCount"
                stroke="#818cf8"
                strokeWidth={2}
                name="Reviews Completed"
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Student Personalization Settings (Interests & Daily Goal) */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-base font-black uppercase tracking-tight text-white">AI Personalization & Learning Profile</h2>
            <p className="text-xs text-slate-400 font-medium">
              Customize interests so Gemini AI crafts mnemonics connected to things you love
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Interests Selector */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300">
              🎯 Your Mnemonic Anchors (Interests)
            </label>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-black uppercase tracking-wider"
                >
                  <span>{interest}</span>
                  {profile.interests.length > 1 && (
                    <button
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-slate-400 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {/* Add interest input */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newInterestInput}
                onChange={(e) => setNewInterestInput(e.target.value)}
                placeholder="Add interest (e.g. Cricket, Anime, Aviation, Formula 1)..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#020617] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-medium"
              />
              <button
                onClick={handleAddInterest}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1 active:scale-98 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Daily Goal & Level Setting */}
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
                📅 Daily Word Target
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={dailyGoalInput}
                  onChange={(e) => setDailyGoalInput(Number(e.target.value))}
                  className="w-24 px-3.5 py-2.5 rounded-xl bg-[#020617] border border-slate-800 text-sm text-white font-black text-center focus:outline-none focus:border-indigo-500 font-display"
                />
                <span className="text-xs text-slate-400 font-medium">words per day</span>
                <button
                  onClick={handleSaveGoal}
                  className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-black uppercase tracking-wider transition-all active:scale-98"
                >
                  Save Goal
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-300 mb-1.5">
                🎓 Target Exam / Focus
              </label>
              <select
                value={profile.targetCategory}
                onChange={(e) => updateProfile({ targetCategory: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#020617] border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="Academic">Academic (GRE, SAT, TOEFL, IELTS)</option>
                <option value="Competitive Exams">Competitive Exams (UPSC, GMAT, CAT)</option>
                <option value="Business">Business & Corporate English</option>
                <option value="Technology">Technology & Engineering</option>
                <option value="Daily English">Daily Fluent English</option>
                <option value="Literature & Arts">Literature & Arts</option>
              </select>
            </div>

            {isSavedToast && (
              <p className="text-xs text-emerald-400 font-black uppercase tracking-wider animate-fade-in">
                ✅ Settings successfully updated!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
