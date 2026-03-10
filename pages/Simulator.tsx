
import React, { useState, useEffect, useCallback } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  BrainCircuit, 
  Timer, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  RotateCcw,
  BookOpen,
  Trophy,
  Loader2,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Lightbulb,
  GraduationCap,
  ArrowLeft
} from 'lucide-react';
import { Question } from '../types';
import { generatePracticeQuestions } from '../services/geminiService';

const { Link } = ReactRouterDOM;

interface LevelData {
  id: string;
  label: string;
  subjects: Array<{ id: string; name: string; icon: string; desc: string }>;
}

const LEVELS: LevelData[] = [
  {
    id: '100L',
    label: '100 Level (Freshmen)',
    subjects: [
      { id: 'mth101', name: 'MTH 101: General Math', icon: '➗', desc: 'Algebra, Trigonometry, and Calculus foundation.' },
      { id: 'gst101', name: 'GST 101: Use of English', icon: '📝', desc: 'Communication skills and grammar mastery.' },
      { id: 'chm101', name: 'CHM 101: General Chemistry', icon: '🧪', desc: 'Atomic structure and basic organic chemistry.' },
      { id: 'phy101', name: 'PHY 101: General Physics', icon: '⚛️', desc: 'Mechanics and thermal physics.' }
    ]
  },
  {
    id: '200L',
    label: '200 Level (Sophomore)',
    subjects: [
      { id: 'mth201', name: 'MTH 201: Mathematical Methods', icon: '📉', desc: 'Differential equations and vector analysis.' },
      { id: 'gns201', name: 'GNS 201: General Studies II', icon: '🌍', desc: 'History, culture, and social science.' },
      { id: 'sta201', name: 'STA 201: Statistics', icon: '📊', desc: 'Probability and data distribution.' }
    ]
  },
  {
    id: '300L',
    label: '300 Level (Junior)',
    subjects: [
      { id: 'esc301', name: 'Engineering Economics', icon: '💰', desc: 'Cost analysis and project evaluation.' },
      { id: 'csc301', name: 'Data Structures', icon: '💾', desc: 'Algorithms and efficient data handling.' },
      { id: 'mec301', name: 'Thermodynamics', icon: '🔥', desc: 'Energy conversion and heat transfer.' }
    ]
  },
  {
    id: '400L',
    label: '400 Level (Senior I)',
    subjects: [
      { id: 'mgt401', name: 'Project Management', icon: '📅', desc: 'Scheduling, budgeting, and team leads.' },
      { id: 'eet401', name: 'Entrepreneurship', icon: '🚀', desc: 'Business planning and innovation strategies.' }
    ]
  },
  {
    id: '500L',
    label: '500 Level (Senior II)',
    subjects: [
      { id: 'pro501', name: 'Professional Ethics', icon: '⚖️', desc: 'Engineering law and ethical standards.' },
      { id: 'sem501', name: 'Seminar Presentation', icon: '🎤', desc: 'Public speaking and research defense.' }
    ]
  }
];

const Simulator: React.FC = () => {
  const [step, setStep] = useState<'level' | 'setup' | 'loading' | 'testing' | 'results'>('level');
  const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerRunning) {
      interval = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const startTest = async (selectedSubject: string) => {
    setSubject(selectedSubject);
    setStep('loading');
    
    try {
      const generated = await generatePracticeQuestions(selectedSubject, selectedLevel?.id || 'freshman');
      setQuestions(generated);
      setStep('testing');
      setTimer(0);
      setIsTimerRunning(true);
      setCurrentIndex(0);
      setUserAnswers({});
    } catch (error) {
      console.error(error);
      setStep('setup');
      alert("Failed to load questions. Please check your network or API configuration.");
    }
  };

  const handleAnswer = (optionIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentIndex].id || currentIndex]: optionIndex
    }));
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      finishTest();
    }
  };

  const finishTest = () => {
    setIsTimerRunning(false);
    setStep('results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[q.id || idx] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  if (step === 'level') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 transition-colors">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-[1.5rem] flex items-center justify-center mb-6 mx-auto">
            <GraduationCap size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-black text-indigo-950 dark:text-white mb-4">Select Your Level</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Choose your current academic year to view relevant courses for practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {LEVELS.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => { setSelectedLevel(lvl); setStep('setup'); }}
              className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all text-center group"
            >
              <div className="text-3xl font-black text-indigo-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
                {lvl.id}
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {lvl.subjects.length} Subjects
              </p>
              <div className="mt-6 flex justify-center">
                <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'setup' && selectedLevel) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 transition-colors">
        <button 
          onClick={() => setStep('level')}
          className="flex items-center text-gray-400 hover:text-primary mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Level Selection
        </button>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-2/5">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-[1.5rem] flex items-center justify-center mb-8">
              <BrainCircuit size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-poppins font-black text-indigo-950 dark:text-white mb-4">{selectedLevel.id} Subjects</h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-8">
              Choose a course to start your AI-powered practice session. We use real Futminna curriculum standards.
            </p>
            <div className="bg-indigo-900 text-white p-8 rounded-[2.5rem] relative overflow-hidden">
               <Sparkles className="absolute top-4 right-4 text-primary opacity-50" size={24} />
               <p className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">Academic Tip</p>
               <p className="text-sm font-medium">Regular practice of at least 15 minutes a day increases retention by 40%.</p>
            </div>
          </div>

          <div className="lg:w-3/5 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {selectedLevel.subjects.map((sub) => (
              <button
                key={sub.id}
                onClick={() => startTest(sub.name)}
                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 hover:border-primary dark:hover:border-primary hover:shadow-2xl hover:-translate-y-1 transition-all text-left flex flex-col group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-slate-900 flex items-center justify-center text-3xl group-hover:bg-emerald-50 dark:group-hover:bg-emerald-950/30 transition-colors mb-6">
                  {sub.icon}
                </div>
                <h3 className="font-bold text-indigo-950 dark:text-white text-xl mb-2">{sub.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-6 flex-grow">{sub.desc}</p>
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-[10px] font-bold uppercase tracking-widest text-primary">5 AI Questions</span>
                   <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      <ChevronRight size={16} />
                   </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 transition-colors">
        <div className="relative mb-12">
          <Loader2 className="animate-spin text-primary" size={64} />
          <Sparkles className="absolute top-0 right-0 text-emerald-300 animate-pulse" size={24} />
        </div>
        <h2 className="text-3xl font-poppins font-bold text-indigo-950 dark:text-white mb-4">Generating {selectedLevel?.id} Test...</h2>
        <div className="max-w-md bg-white dark:bg-slate-800 p-6 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-xl">
           <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
             Our AI is analyzing the curriculum for <span className="text-primary font-bold">"{subject}"</span>. This takes a few seconds.
           </p>
        </div>
      </div>
    );
  }

  if (step === 'testing') {
    const q = questions[currentIndex];
    const isAnswered = userAnswers[q.id || currentIndex] !== undefined;

    return (
      <div className="max-w-4xl mx-auto px-4 py-12 transition-colors">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary px-5 py-2 rounded-2xl font-bold text-sm">
              Q{currentIndex + 1} / {questions.length}
            </div>
            <div>
              <h2 className="text-lg font-bold text-indigo-950 dark:text-white leading-tight">{subject}</h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{selectedLevel?.id} Practice Session</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center text-gray-500 dark:text-gray-300 bg-white dark:bg-slate-800 px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
               <Timer size={20} className="mr-2 text-primary" />
               <span className="font-mono text-xl font-bold">{formatTime(timer)}</span>
             </div>
             <button onClick={() => {if(confirm('Quit test?')) setStep('level')}} className="p-3 text-gray-400 hover:text-red-500 transition-colors">
                <RotateCcw size={20} />
             </button>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex gap-2 mb-12">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 flex-grow rounded-full transition-all duration-500 ${
                idx === currentIndex ? 'bg-primary shadow-lg shadow-emerald-500/20' : 
                idx < currentIndex ? 'bg-emerald-200 dark:bg-emerald-900/50' : 'bg-gray-100 dark:bg-slate-800'
              }`}
            ></div>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-10 md:p-16 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 mb-10 relative overflow-hidden transition-colors">
          <div className="absolute top-0 right-0 p-8 opacity-5">
             <HelpCircle size={120} />
          </div>
          
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-950 dark:text-white mb-12 leading-relaxed relative z-10">
            {q.text}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
            {q.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`group p-6 rounded-2xl text-left border-2 transition-all flex items-start gap-4 ${
                  userAnswers[q.id || currentIndex] === idx
                  ? 'border-primary bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-gray-50 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-primary/50 bg-gray-50 dark:bg-slate-900/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold flex-shrink-0 transition-colors ${
                  userAnswers[q.id || currentIndex] === idx
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 text-gray-400 dark:text-slate-500 group-hover:text-primary'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className={`text-lg transition-colors ${userAnswers[q.id || currentIndex] === idx ? 'text-indigo-900 dark:text-white font-bold' : 'text-gray-600 dark:text-gray-400'}`}>
                  {opt}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400 font-medium">
             {!isAnswered && <span className="flex items-center gap-1"><AlertCircle size={14} /> Select an answer to continue</span>}
          </div>
          <button
            onClick={nextQuestion}
            disabled={!isAnswered}
            className={`flex items-center px-12 py-5 rounded-2xl font-bold transition-all ${
              isAnswered 
              ? 'bg-primary text-white hover:opacity-90 shadow-2xl shadow-emerald-500/20 active:scale-95' 
              : 'bg-gray-200 dark:bg-slate-800 text-gray-400 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            {currentIndex === questions.length - 1 ? 'Finish Simulation' : 'Next Question'}
            <ArrowRight size={20} className="ml-2" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'results') {
    const score = calculateScore();
    const isPassing = score.percentage >= 60;

    return (
      <div className="max-w-4xl mx-auto px-4 py-20 transition-colors">
        <div className="bg-white dark:bg-slate-800 p-12 md:p-20 rounded-[4rem] shadow-2xl text-center relative overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
          <div className={`absolute top-0 inset-x-0 h-3 ${isPassing ? 'bg-primary' : 'bg-red-500'}`}></div>
          
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-10 animate-bounce shadow-xl ${isPassing ? 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-500 border border-yellow-100 dark:border-yellow-900/50' : 'bg-red-50 dark:bg-red-950/20 text-red-500 border border-red-100'}`}>
            <Trophy size={48} />
          </div>
          
          <h2 className="text-4xl font-poppins font-black text-indigo-950 dark:text-white mb-4">
            {isPassing ? 'Excellent Work!' : 'Keep Pushing!'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 text-lg">Your results for <span className="font-bold text-primary">{subject}</span> ({selectedLevel?.id})</p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700">
              <div className="text-4xl font-black text-primary mb-2">{score.percentage}%</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Score</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700">
              <div className="text-4xl font-black text-green-500">{score.correct}/{score.total}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Correct</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700">
              <div className="text-4xl font-black text-indigo-900 dark:text-white">{formatTime(timer)}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total Time</div>
            </div>
            <div className="bg-gray-50 dark:bg-slate-900/50 p-8 rounded-[2rem] border border-gray-100 dark:border-slate-700">
              <div className="text-4xl font-black text-purple-500">{Math.round(timer/questions.length)}s</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Per Question</div>
            </div>
          </div>

          <div className="text-left space-y-8 mb-16">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-slate-700 pb-4">
              <div className="p-2 bg-primary/10 text-primary rounded-lg"><Lightbulb size={20} /></div>
              <h3 className="text-xl font-bold text-indigo-950 dark:text-white">Detailed Explanations</h3>
            </div>
            
            <div className="space-y-6">
              {questions.map((q, idx) => {
                const isCorrect = userAnswers[q.id || idx] === q.correctAnswer;
                return (
                  <div key={idx} className={`p-8 rounded-3xl border-2 transition-colors ${isCorrect ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/20' : 'border-red-100 dark:border-red-900/30 bg-red-50/20'}`}>
                     <div className="flex items-start gap-4 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                          {idx + 1}
                        </div>
                        <p className="font-bold text-indigo-950 dark:text-white text-lg leading-relaxed">{q.text}</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ml-14">
                        <div className={`p-4 rounded-xl border ${isCorrect ? 'bg-white dark:bg-slate-800 border-emerald-200 dark:border-emerald-900' : 'bg-white dark:bg-slate-800 border-red-200 dark:border-red-900'}`}>
                           <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Your Choice</p>
                           <p className={`font-bold ${isCorrect ? 'text-emerald-600' : 'text-red-600'}`}>{q.options[userAnswers[q.id || idx]]}</p>
                        </div>
                        {!isCorrect && (
                          <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900">
                             <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Correct Answer</p>
                             <p className="font-bold text-emerald-600">{q.options[q.correctAnswer]}</p>
                          </div>
                        )}
                     </div>

                     <div className="ml-14 p-6 bg-white dark:bg-slate-900/80 rounded-2xl border border-gray-100 dark:border-slate-700">
                       <p className="text-xs font-black text-indigo-900 dark:text-white uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                         <Sparkles size={14} className="text-primary" /> AI Perspective
                       </p>
                       <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed italic">
                         {q.explanation}
                       </p>
                     </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => setStep('level')}
              className="group bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" /> Start New Test
            </button>
            <button
              onClick={() => startTest(subject)}
              className="border-2 border-primary/20 text-primary dark:text-white px-12 py-5 rounded-2xl font-bold hover:bg-emerald-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
            >
              Retake This Test
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Simulator;
