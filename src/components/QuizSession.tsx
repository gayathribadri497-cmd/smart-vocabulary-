import React, { useState, useEffect } from 'react';
import { useVocabulary } from '../context/VocabularyContext';
import { QuizQuestion, QuizResult } from '../types';
import {
  GraduationCap,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  ArrowRight,
  Flame,
  Zap,
  Lightbulb
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const QuizSession: React.FC = () => {
  const {
    words,
    profile,
    saveQuizResult,
    setActiveTab,
    progressMap
  } = useVocabulary();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answersLog, setAnswersLog] = useState<{
    questionId: string;
    word: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[]>([]);

  // Generate fallback local questions or call Gemini AI
  const generateQuiz = async (questionCount: number = 5) => {
    setIsLoading(true);
    setQuizCompleted(false);
    setCurrentIndex(0);
    setAnswersLog([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowHint(false);

    try {
      // Pick words with preference for learning / struggling words
      const candidateWords = [...words].sort(() => 0.5 - Math.random()).slice(0, questionCount);

      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          words: candidateWords,
          count: questionCount,
          studentLevel: profile.learningLevel
        })
      });

      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        setQuestions(json.data);
      } else {
        // Fallback local dynamic questions
        generateFallbackQuestions(candidateWords);
      }
    } catch (e) {
      console.error('Quiz API error, using intelligent client generation fallback', e);
      generateFallbackQuestions(words.slice(0, questionCount));
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = (wordList: typeof words) => {
    const list: QuizQuestion[] = wordList.map((w, index) => {
      const type = index % 3 === 0 ? 'fill-in-blank' : index % 3 === 1 ? 'meaning-to-word' : 'multiple-choice';

      if (type === 'fill-in-blank') {
        const sentenceWithBlank = w.example.replace(new RegExp(w.word, 'gi'), '__________');
        const distractors = words.filter(ow => ow.id !== w.id).slice(0, 3).map(ow => ow.word);
        const options = [w.word, ...distractors].sort(() => 0.5 - Math.random());

        return {
          id: `q-${index}`,
          wordId: w.id,
          word: w.word,
          type: 'fill-in-blank',
          prompt: `Complete the sentence: "${sentenceWithBlank}"`,
          options,
          correctAnswer: w.word,
          explanation: `"${w.word}" fits because it means ${w.meaning.toLowerCase()}`,
          hint: `Mnemonic: ${w.defaultMnemonic}`
        };
      } else if (type === 'meaning-to-word') {
        const distractors = words.filter(ow => ow.id !== w.id).slice(0, 3).map(ow => ow.word);
        const options = [w.word, ...distractors].sort(() => 0.5 - Math.random());

        return {
          id: `q-${index}`,
          wordId: w.id,
          word: w.word,
          type: 'meaning-to-word',
          prompt: `Which word means "${w.meaning}"?`,
          options,
          correctAnswer: w.word,
          explanation: `${w.word} (${w.partOfSpeech}) means ${w.meaning}.`,
          hint: `Phonetic: ${w.pronunciation}`
        };
      } else {
        const distractors = words.filter(ow => ow.id !== w.id).slice(0, 3).map(ow => ow.meaning);
        const options = [w.meaning, ...distractors].sort(() => 0.5 - Math.random());

        return {
          id: `q-${index}`,
          wordId: w.id,
          word: w.word,
          type: 'multiple-choice',
          prompt: `What is the precise meaning of "${w.word}"?`,
          options,
          correctAnswer: w.meaning,
          explanation: `${w.word} means "${w.meaning}". Example: ${w.example}`,
          hint: `Part of speech: ${w.partOfSpeech}`
        };
      }
    });

    setQuestions(list);
  };

  useEffect(() => {
    generateQuiz(5);
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectAnswer = (option: string) => {
    if (isAnswered || !currentQ) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const isCorrect = option === currentQ.correctAnswer;
    setAnswersLog(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        word: currentQ.word,
        userAnswer: option,
        correctAnswer: currentQ.correctAnswer,
        isCorrect
      }
    ]);
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      // Finish Quiz
      const correctCount = answersLog.filter(a => a.isCorrect).length + (selectedAnswer === currentQ.correctAnswer ? 1 : 0);
      const totalScore = correctCount;
      const xp = totalScore * 30 + (totalScore === questions.length ? 50 : 0);

      const result: QuizResult = {
        id: `quiz-${Date.now()}`,
        date: new Date().toISOString(),
        score: totalScore,
        totalQuestions: questions.length,
        xpEarned: xp,
        questionResults: answersLog
      };

      saveQuizResult(result);
      setQuizCompleted(true);

      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  if (isLoading) {
    return (
      <div id="quiz-loading-view" className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 animate-spin">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white">Generating Adaptive AI Quiz...</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto font-medium">
          Gemini is synthesizing multiple choice, fill-in-blank, and contextual questions based on your learning curriculum.
        </p>
      </div>
    );
  }

  if (quizCompleted) {
    const score = answersLog.filter(a => a.isCorrect).length;
    const scorePercent = Math.round((score / questions.length) * 100);

    return (
      <div id="quiz-results-view" className="max-w-3xl mx-auto py-8 space-y-6">
        <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 text-center shadow-xl space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-teal-500 to-indigo-500 p-[2px]">
            <div className="w-full h-full bg-[#020617] rounded-[22px] flex items-center justify-center">
              <Award className="w-10 h-10 text-teal-400" />
            </div>
          </div>

          <h2 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">Quiz Evaluation Complete!</h2>
          <p className="text-slate-300 text-sm max-w-md mx-auto font-medium">
            {scorePercent >= 80
              ? 'Outstanding performance! You have strong lexical recall.'
              : scorePercent >= 50
              ? 'Good effort! Review the missed questions below to reinforce weak memory links.'
              : 'Keep practicing! Use the Weak Word Radar to clear up confusing definitions.'}
          </p>

          {/* Results Summary Row */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto pt-2">
            <div className="bg-[#020617] p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Score</p>
              <p className="font-display text-2xl font-black text-white mt-1">{score} / {questions.length}</p>
            </div>
            <div className="bg-[#020617] p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Accuracy</p>
              <p className="font-display text-2xl font-black text-teal-400 mt-1">{scorePercent}%</p>
            </div>
            <div className="bg-[#020617] p-4 rounded-xl border border-slate-800">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">XP Gained</p>
              <p className="font-display text-2xl font-black text-indigo-400 mt-1">+{score * 30 + 50}</p>
            </div>
          </div>

          {/* Detailed Question Review List */}
          <div className="text-left space-y-3 pt-4 border-t border-slate-800">
            <h3 className="font-display text-xs font-black uppercase tracking-wider text-slate-400">
              Question Breakdown
            </h3>
            <div className="space-y-2">
              {answersLog.map((ans, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
                    ans.isCorrect
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-200'
                      : 'bg-rose-950/20 border-rose-800/40 text-rose-200'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">Q{idx + 1}: {ans.word}</span>
                      {ans.isCorrect ? (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Correct
                        </span>
                      ) : (
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          Missed
                        </span>
                      )}
                    </div>
                    {!ans.isCorrect && (
                      <div className="text-xs text-slate-300 mt-1 space-y-0.5 font-medium">
                        <p>Your answer: <span className="line-through text-rose-300">{ans.userAnswer}</span></p>
                        <p>Correct answer: <strong className="text-emerald-300 font-bold">{ans.correctAnswer}</strong></p>
                      </div>
                    )}
                  </div>

                  <span className="text-xl">{ans.isCorrect ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => generateQuiz(5)}
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase tracking-wider text-xs transition-all shadow-md flex items-center gap-1.5 active:scale-98"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Generate New AI Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-3 rounded-xl bg-[#020617] hover:bg-slate-800 border border-slate-800 text-slate-200 font-black uppercase tracking-wider text-xs transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQ) return null;

  const isSelectedCorrect = selectedAnswer === currentQ.correctAnswer;

  return (
    <div id="quiz-session-container" className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex items-center justify-between text-slate-300">
        <div className="flex items-center gap-2.5">
          <span className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-xs">
            <GraduationCap className="w-4 h-4" />
          </span>
          <div>
            <h2 className="font-display text-sm font-black uppercase tracking-tight text-white">AI Vocabulary Quiz</h2>
            <p className="text-xs text-slate-400 font-medium">
              Question {currentIndex + 1} of {questions.length} · Type: {currentQ.type}
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0f172a] border border-slate-800 hover:bg-slate-800 text-xs text-amber-300 font-black uppercase tracking-wider transition-colors"
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>{showHint ? 'Hide Hint' : 'Hint'}</span>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700/50">
        <div
          className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 h-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Hint Banner */}
      {showHint && currentQ.hint && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>💡 <strong className="font-black text-white">Hint:</strong> {currentQ.hint}</span>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 text-slate-100">
        {/* Prompt */}
        <div className="pb-4 border-b border-slate-800 space-y-2">
          <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-teal-500/20 text-teal-300 border border-teal-500/30 inline-block">
            {currentQ.type.replace(/-/g, ' ')}
          </span>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-relaxed pt-1">
            {currentQ.prompt}
          </h3>
        </div>

        {/* 4 Choices */}
        <div className="space-y-3">
          {currentQ.options?.map((option, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrectOption = option === currentQ.correctAnswer;
            const isUserChoice = selectedAnswer === option;

            let style = 'bg-[#020617] border-slate-800 hover:border-slate-700 hover:bg-slate-900';

            if (isAnswered) {
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
                disabled={isAnswered}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all duration-200 ${style}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-slate-800 text-xs font-black flex items-center justify-center text-slate-300 flex-shrink-0">
                    {letter}
                  </span>
                  <span className="text-sm font-medium leading-relaxed">{option}</span>
                </div>
                {isAnswered && isCorrectOption && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                )}
                {isAnswered && isUserChoice && !isCorrectOption && (
                  <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Revealed Answer & Explanation */}
        {isAnswered && (
          <div className="pt-4 border-t border-slate-800 space-y-4 animate-fade-in">
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
                  {isSelectedCorrect ? 'Excellent! That is correct.' : 'Not quite!'}
                </p>
                <p className="text-xs mt-1 text-slate-300 leading-relaxed font-medium">
                  {currentQ.explanation}
                </p>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black uppercase tracking-wider text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              <span>{currentIndex + 1 === questions.length ? 'See Final Score' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
