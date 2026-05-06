import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader, Send } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const SODExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [exam, setExam] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [submission, setSubmission] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [starting, setStarting] = useState(false);
  const [studentReg, setStudentReg] = useState<any>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittingRef = useRef(false);

  // Load exam + check access
  useEffect(() => {
    if (!user || !examId) return;
    const init = async () => {
      setLoading(true);

      // Get student registration
      const { data: reg } = await supabase
        .from('sod_registrations')
        .select('*, sod_departments(*)')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!reg) { setAccessDenied(true); setLoading(false); return; }
      setStudentReg(reg);

      // Get exam
      const { data: examData } = await dbService.getSodExam(examId);
      if (!examData || !examData.is_published) { setAccessDenied(true); setLoading(false); return; }

      // Verify exam belongs to student's department
      if (examData.department_id !== reg.department_id) { setAccessDenied(true); setLoading(false); return; }
      setExam(examData);

      // Check existing submission
      const { data: existingSub } = await dbService.getMySubmission(examId, user.id);
      if (existingSub) {
        setSubmission(existingSub);
        if (existingSub.submitted_at) { setSubmitted(true); setLoading(false); return; }

        // Resume in-progress exam
        const { data: qs } = await dbService.getSodQuestions(examId);
        setQuestions(qs ?? []);

        // Calculate remaining time
        const elapsed = Math.floor((Date.now() - new Date(existingSub.started_at).getTime()) / 1000);
        const remaining = examData.duration_minutes * 60 - elapsed;
        if (remaining <= 0) {
          await submitExam(existingSub.id, {});
          return;
        }
        setTimeLeft(remaining);
      }

      setLoading(false);
    };
    init();
  }, [user, examId]);

  // Timer
  useEffect(() => {
    if (!submission || submitted || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          if (!submittingRef.current) submitExam(submission.id, answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current!);
  }, [submission, submitted]);

  const submitExam = useCallback(async (submissionId: string, currentAnswers: Record<string, string>) => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    clearInterval(timerRef.current!);

    const answerPayload = Object.entries(currentAnswers).map(([question_id, answer]) => ({ question_id, answer }));

    const res = await fetch(`${SUPABASE_URL}/functions/v1/grade-exam`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ submission_id: submissionId, answers: answerPayload }),
    });

    const result = await res.json();
    if (!res.ok || !result.success) {
      showToast(result.error ?? 'Submission failed. Please try again.', 'error');
      submittingRef.current = false;
      setSubmitting(false);
    } else {
      setSubmitted(true);
      setSubmitting(false);
    }
  }, []);

  const handleStart = async () => {
    if (!user || !exam || !studentReg) return;
    setStarting(true);
    const { data: sub, error } = await dbService.startExam(exam.id, user.id, studentReg.student_id);
    if (error) {
      showToast('Failed to start exam.', 'error');
      setStarting(false);
      return;
    }
    const { data: qs } = await dbService.getSodQuestions(exam.id);
    setQuestions(qs ?? []);
    setSubmission(sub);
    setTimeLeft(exam.duration_minutes * 60);
    setStarting(false);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const currentQ = questions[currentIdx];

  if (!user) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle size={40} className="mx-auto text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-indigo-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">You must be logged in to take this exam.</p>
        <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">Login</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  if (accessDenied) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle size={40} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-indigo-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-gray-500 text-sm mb-6">This exam is not available for your department or you are not registered for SOD.</p>
        <Link to="/sod" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">Back to SOD</Link>
      </div>
    </div>
  );

  // Submitted state
  if (submitted) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Exam Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Your answers have been recorded and submitted for grading.</p>
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-4 mb-8 text-sm text-indigo-700 dark:text-indigo-300 text-left space-y-1">
          <p className="font-bold">What happens next?</p>
          <p>• MCQ answers are auto-graded immediately.</p>
          <p>• Short and long answers will be reviewed by your department coordinator.</p>
          <p>• Your results will be communicated to you directly.</p>
        </div>
        <Link to="/sod" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">Back to SOD</Link>
      </div>
    </div>
  );

  // Pre-start screen
  if (!submission) return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-lg w-full bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <h1 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-2">{exam?.title}</h1>
        {exam?.description && <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">{exam.description}</p>}
        <div className="space-y-3 mb-8">
          {[
            { label: 'Duration', value: `${exam?.duration_minutes} minutes` },
            { label: 'Department', value: studentReg?.sod_departments?.name },
            { label: 'Attempts', value: 'One attempt only' },
            { label: 'Results', value: 'Communicated by coordinator' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm border-b border-gray-50 dark:border-slate-700 pb-2">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-bold text-indigo-900 dark:text-white">{value}</span>
            </div>
          ))}
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 mb-6 text-sm text-amber-700 dark:text-amber-400">
          ⚠️ Once you start, the timer begins and cannot be paused. Ensure you have a stable internet connection.
        </div>
        <button onClick={handleStart} disabled={starting}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-60">
          {starting ? <><Loader size={18} className="animate-spin" /> Starting...</> : 'Start Exam'}
        </button>
      </div>
    </div>
  );

  // Exam in progress
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 transition-colors">
      {/* Header */}
      <div className={`sticky top-0 z-30 bg-indigo-900 dark:bg-slate-950 text-white px-4 py-3 flex items-center justify-between shadow-lg ${timeLeft < 300 ? 'bg-red-900' : ''}`}>
        <div className="text-sm font-bold truncate max-w-[50%]">{exam?.title}</div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-indigo-200">{answeredCount}/{questions.length} answered</span>
          <div className={`flex items-center gap-1.5 font-mono font-bold text-lg ${timeLeft < 300 ? 'text-red-300 animate-pulse' : 'text-emerald-400'}`}>
            <Clock size={16} />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Question navigator */}
        <div className="flex flex-wrap gap-2 mb-6">
          {questions.map((q, i) => (
            <button key={q.id} onClick={() => setCurrentIdx(i)}
              className={`w-8 h-8 rounded-lg text-xs font-bold transition ${i === currentIdx ? 'bg-primary text-white' : answers[q.id]?.trim() ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700' : 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-500'}`}>
              {i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        {currentQ && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 p-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-bold uppercase text-primary tracking-wider">Question {currentIdx + 1} of {questions.length}</span>
              <span className="text-xs text-gray-400">{currentQ.marks} mark{currentQ.marks !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-indigo-900 dark:text-white font-semibold text-lg leading-relaxed mb-8">{currentQ.question}</p>

            {currentQ.type === 'mcq' && (
              <div className="space-y-3">
                {currentQ.options?.map((opt: string, i: number) => (
                  <label key={i}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'border-primary bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-100 dark:border-slate-700 hover:border-primary/40'}`}>
                    <input type="radio" name={currentQ.id} value={opt} checked={answers[currentQ.id] === opt}
                      onChange={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))}
                      className="accent-primary w-4 h-4" />
                    <span className="text-sm font-medium text-indigo-900 dark:text-white">
                      <span className="font-bold mr-2">{String.fromCharCode(65 + i)}.</span>{opt}
                    </span>
                  </label>
                ))}
              </div>
            )}

            {currentQ.type === 'short' && (
              <input
                type="text"
                value={answers[currentQ.id] ?? ''}
                onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                placeholder="Type your answer here..."
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
            )}

            {currentQ.type === 'long' && (
              <textarea
                value={answers[currentQ.id] ?? ''}
                onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                placeholder="Write your detailed answer here..."
                rows={8}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
              />
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition disabled:opacity-40">
            <ChevronLeft size={16} /> Previous
          </button>

          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 transition">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={() => {
                const unanswered = questions.length - answeredCount;
                if (unanswered === questions.length) {
                  showToast('Please answer at least one question before submitting.', 'error');
                  return;
                }
                if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
                submitExam(submission.id, answers);
              }}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60">
              {submitting ? <><Loader size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Exam</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SODExam;
