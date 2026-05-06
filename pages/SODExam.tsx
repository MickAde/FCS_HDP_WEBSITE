import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader, Send, BookOpen, ArrowLeft, Shield, EyeOff, Camera, Monitor } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
const MAX_VIOLATIONS = 3;

const SODExam: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
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
  const [violations, setViolations] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMsg, setWarningMsg] = useState('');
  const [cameraReady, setCameraReady] = useState(false);
  const [screenReady, setScreenReady] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const submittingRef = useRef(false);
  const violationsRef = useRef(0);
  const answersRef = useRef<Record<string, string>>({});
  const submissionRef = useRef<any>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const cameraVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => { answersRef.current = answers; }, [answers]);
  useEffect(() => { submissionRef.current = submission; }, [submission]);

  useEffect(() => {
    if (!user || !examId) return;
    const init = async () => {
      setLoading(true);
      const { data: reg } = await supabase.from('sod_registrations').select('*, sod_departments(*)').eq('user_id', user.id).maybeSingle();
      if (!reg) { setAccessDenied(true); setLoading(false); return; }
      setStudentReg(reg);
      const { data: examData } = await dbService.getSodExam(examId);
      if (!examData || !examData.is_published) { setAccessDenied(true); setLoading(false); return; }
      if (examData.department_id !== reg.department_id) { setAccessDenied(true); setLoading(false); return; }
      setExam(examData);
      const { data: existingSub } = await dbService.getMySubmission(examId, user.id);
      if (existingSub) {
        setSubmission(existingSub);
        if (existingSub.submitted_at) { setSubmitted(true); setLoading(false); return; }
        const { data: qs } = await dbService.getSodQuestions(examId);
        setQuestions(qs ?? []);
        const elapsed = Math.floor((Date.now() - new Date(existingSub.started_at).getTime()) / 1000);
        const remaining = examData.duration_minutes * 60 - elapsed;
        if (remaining <= 0) { await submitExam(existingSub.id, {}); return; }
        setTimeLeft(remaining);
      }
      setLoading(false);
    };
    init();
  }, [user, examId]);

  useEffect(() => {
    if (!submission || submitted || timeLeft <= 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); if (!submittingRef.current) submitExam(submission.id, answers); return 0; }
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
      headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` },
      body: JSON.stringify({ submission_id: submissionId, answers: answerPayload }),
    });
    const result = await res.json();
    if (!res.ok || !result.success) { showToast(result.error ?? 'Submission failed. Please try again.', 'error'); submittingRef.current = false; setSubmitting(false); }
    else { setSubmitted(true); setSubmitting(false); }
  }, []);

  const triggerViolation = useCallback((msg: string) => {
    violationsRef.current += 1;
    setViolations(violationsRef.current);
    setWarningMsg(msg);
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 4000);
    if (violationsRef.current >= MAX_VIOLATIONS) {
      const sub = submissionRef.current;
      if (sub && !submittingRef.current) submitExam(sub.id, answersRef.current);
    }
  }, [submitExam]);

  // Start camera + screen when exam begins
  useEffect(() => {
    if (!submission || submitted) return;

    const startMedia = async () => {
      try {
        // Camera
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        cameraStreamRef.current = camStream;
        if (cameraVideoRef.current) cameraVideoRef.current.srcObject = camStream;
        setCameraReady(true);
        camStream.getVideoTracks()[0].onended = () => triggerViolation('Camera was stopped! This is a violation.');
      } catch {
        setMediaError('Camera access denied. Camera is required to take this exam.');
        triggerViolation('Camera access denied!');
      }

      try {
        // Screen recording (no save — just active as deterrent)
        const screenStream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true, audio: false });
        screenStreamRef.current = screenStream;
        setScreenReady(true);
        screenStream.getVideoTracks()[0].onended = () => triggerViolation('Screen sharing was stopped! This is a violation.');
      } catch {
        triggerViolation('Screen sharing denied or stopped!');
      }
    };

    startMedia();

    return () => {
      cameraStreamRef.current?.getTracks().forEach(t => t.stop());
      screenStreamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, [submission, submitted]);

  // Stop all media on submit
  const stopMedia = useCallback(() => {
    cameraStreamRef.current?.getTracks().forEach(t => t.stop());
    screenStreamRef.current?.getTracks().forEach(t => t.stop());
    setCameraReady(false);
    setScreenReady(false);
  }, []);

  // Anti-cheat guards — only active during exam
  useEffect(() => {
    if (!submission || submitted) return;

    const onVisibility = () => { if (document.hidden) triggerViolation('Tab switching detected!'); };
    const onBlur = () => triggerViolation('Leaving the exam window is not allowed!');
    const onContextMenu = (e: MouseEvent) => e.preventDefault();
    const onSelectStart = (e: Event) => e.preventDefault();
    const onKeyDown = (e: KeyboardEvent) => {
      const blocked =
        (e.ctrlKey && ['c', 'v', 'a', 'u', 's', 'p'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' || e.key === 'PrintScreen' ||
        (e.altKey && e.key === 'Tab') ||
        e.metaKey;
      if (blocked) { e.preventDefault(); triggerViolation('Keyboard shortcut blocked!'); }
    };

    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('blur', onBlur);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('selectstart', onSelectStart);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('selectstart', onSelectStart);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [submission, submitted, triggerViolation]);

  const handleStart = async () => {
    if (!user || !exam || !studentReg) return;
    setStarting(true);
    const { data: sub, error } = await dbService.startExam(exam.id, user.id, studentReg.student_id);
    if (error) { showToast('Failed to start exam.', 'error'); setStarting(false); return; }
    const { data: qs } = await dbService.getSodQuestions(exam.id);
    setQuestions(qs ?? []);
    setSubmission(sub);
    setTimeLeft(exam.duration_minutes * 60);
    setStarting(false);
  };

  const handleSubmitExam = () => {
    const unanswered = questions.length - answeredCount;
    if (unanswered === questions.length) { showToast('Please answer at least one question before submitting.', 'error'); return; }
    if (unanswered > 0 && !confirm(`You have ${unanswered} unanswered question(s). Submit anyway?`)) return;
    stopMedia();
    submitExam(submission.id, answers);
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
  const currentQ = questions[currentIdx];
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const violationsLeft = MAX_VIOLATIONS - violations;

  if (!user) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
        <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Login Required</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">You must be logged in to take this exam.</p>
        <Link to="/login" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">Sign In</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center"><Loader size={40} className="animate-spin text-primary mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400 text-sm">Loading exam...</p></div>
    </div>
  );

  if (accessDenied) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6"><Shield size={40} /></div>
        <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Access Denied</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">This exam is not available for your department or you are not registered for SOD.</p>
        <Link to="/sod" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">Back to SOD</Link>
      </div>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={40} /></div>
        <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Exam Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Your answers have been recorded and submitted for grading.</p>
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 mb-8 text-left space-y-2">
          <p className="text-sm font-bold text-indigo-900 dark:text-white">What happens next?</p>
          {['MCQ answers are auto-graded immediately.', 'Short and long answers will be reviewed by your coordinator.', 'Your results will be communicated to you directly.'].map((t, i) => (
            <p key={i} className="text-sm text-indigo-700 dark:text-indigo-300 flex items-start gap-2"><span className="text-primary mt-0.5">•</span>{t}</p>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Link to="/sod/results" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">View My Results</Link>
          <Link to="/sod" className="block w-full border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 font-bold py-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition">Back to SOD</Link>
        </div>
      </div>
    </div>
  );

  // Pre-start screen
  if (!submission) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-20 transition-colors">
      <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/sod" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to SOD
          </Link>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <BookOpen size={14} /> School of Destiny Exam
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">{exam?.title}</h1>
          {exam?.description && <p className="text-indigo-200 max-w-xl mx-auto">{exam.description}</p>}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
      </section>

      <div className="max-w-lg mx-auto px-4 -mt-10 relative z-20">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="p-8 space-y-3">
            {[
              { label: 'Department', value: studentReg?.sod_departments?.name },
              { label: 'Duration', value: `${exam?.duration_minutes} minutes` },
              { label: 'Attempts Allowed', value: 'One attempt only' },
              { label: 'Results', value: 'Released by coordinator' },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50 dark:border-slate-700 last:border-0">
                <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-sm font-bold text-indigo-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
          <div className="px-8 pb-4 space-y-3">
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-4 text-sm text-amber-700 dark:text-amber-400 flex items-start gap-3">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span>Once you start, the timer begins and cannot be paused. Ensure you have a stable internet connection.</span>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl p-4 text-sm text-red-700 dark:text-red-400">
              <p className="font-bold mb-2 flex items-center gap-2"><Shield size={15} /> Exam Integrity Rules</p>
              {[
                'Do NOT switch tabs or leave this window.',
                'Do NOT right-click or use keyboard shortcuts (Ctrl+C, Ctrl+V, F12, etc.).',
                'Do NOT copy or paste any content.',
                'Your camera and screen will be active throughout the exam.',
                `${MAX_VIOLATIONS} violations will auto-submit your exam immediately.`,
              ].map((r, i) => <p key={i} className="flex items-start gap-1.5 mt-1"><span>•</span>{r}</p>)}
            </div>
          </div>
          <div className="p-8 pt-4">
            <button onClick={handleStart} disabled={starting}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-2xl font-bold hover:opacity-90 transition disabled:opacity-60 shadow-xl shadow-emerald-900/20">
              {starting ? <><Loader size={18} className="animate-spin" /> Starting...</> : <><BookOpen size={18} /> I Understand — Start Exam</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Exam in progress
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-32 transition-colors select-none">
      {/* Floating camera preview */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        <div className={`relative w-36 h-28 rounded-2xl overflow-hidden border-2 shadow-2xl transition-all ${cameraReady ? 'border-emerald-500' : 'border-red-500 bg-slate-900'}`}>
          <video ref={cameraVideoRef} autoPlay muted playsInline className="w-full h-full object-cover scale-x-[-1]" />
          {!cameraReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
              <Camera size={20} className="text-red-400" />
            </div>
          )}
          <div className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${cameraReady ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${cameraReady ? 'bg-white animate-pulse' : 'bg-white'}`} />
            {cameraReady ? 'LIVE' : 'OFF'}
          </div>
        </div>
        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${screenReady ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
          <Monitor size={12} />{screenReady ? 'Screen Active' : 'Screen Off'}
        </div>
      </div>
      {/* Violation warning toast */}
      {showWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 max-w-sm w-[calc(100%-2rem)]">
          <EyeOff size={20} className="flex-shrink-0" />
          <div>
            <p className="font-bold text-sm">{warningMsg}</p>
            <p className="text-xs text-red-200 mt-0.5">
              {violationsLeft > 0 ? `${violationsLeft} warning(s) left before auto-submit.` : 'Submitting your exam now...'}
            </p>
          </div>
        </div>
      )}

      {/* Sticky header */}
      <div className={`sticky top-0 z-30 text-white px-4 py-3 shadow-lg transition-colors ${timeLeft < 300 ? 'bg-red-900 dark:bg-red-950' : 'bg-indigo-900 dark:bg-slate-950'}`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">SOD Exam</p>
            <p className="text-sm font-bold truncate">{exam?.title}</p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            {violations > 0 && (
              <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-400/30 px-3 py-1 rounded-full">
                <Shield size={12} className="text-red-300" />
                <span className="text-xs font-bold text-red-300">{violations}/{MAX_VIOLATIONS}</span>
              </div>
            )}
            <div className="text-right hidden sm:block">
              <p className="text-xs text-indigo-300">{answeredCount}/{questions.length} answered</p>
              <div className="w-20 bg-white/20 rounded-full h-1.5 mt-1">
                <div className="bg-emerald-400 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>
            <div className={`flex items-center gap-1.5 font-mono font-black text-xl ${timeLeft < 300 ? 'text-red-300 animate-pulse' : 'text-emerald-400'}`}>
              <Clock size={18} />{formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Question navigator */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4 mb-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Questions</p>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, i) => (
              <button key={q.id} onClick={() => setCurrentIdx(i)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${i === currentIdx ? 'bg-primary text-white shadow-lg shadow-emerald-900/20 scale-110' : answers[q.id]?.trim() ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Question card */}
        {currentQ && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 dark:from-slate-950 dark:to-slate-900 px-8 py-5 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Question {currentIdx + 1} of {questions.length}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${currentQ.type === 'mcq' ? 'bg-blue-500/20 text-blue-300' : currentQ.type === 'short' ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'}`}>
                  {currentQ.type === 'mcq' ? 'Multiple Choice' : currentQ.type === 'short' ? 'Short Answer' : 'Long Answer'}
                </span>
                <span className="text-xs text-indigo-300 font-bold">{currentQ.marks} mark{currentQ.marks !== 1 ? 's' : ''}</span>
              </div>
            </div>
            <div className="p-8">
              <p className="text-indigo-900 dark:text-white font-semibold text-lg leading-relaxed mb-8">{currentQ.question}</p>

              {currentQ.type === 'mcq' && (
                <div className="space-y-3">
                  {currentQ.options?.map((opt: string, i: number) => (
                    <label key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${answers[currentQ.id] === opt ? 'border-primary bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-100 dark:border-slate-700 hover:border-primary/40 hover:bg-gray-50 dark:hover:bg-slate-700/50'}`}>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${answers[currentQ.id] === opt ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <input type="radio" name={currentQ.id} value={opt} checked={answers[currentQ.id] === opt} onChange={() => setAnswers(a => ({ ...a, [currentQ.id]: opt }))} className="hidden" />
                      <span className="text-sm font-medium text-indigo-900 dark:text-white">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {currentQ.type === 'short' && (
                <input type="text"
                  value={answers[currentQ.id] ?? ''}
                  onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                  onCopy={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                  onCut={e => e.preventDefault()}
                  placeholder="Type your answer here..."
                  className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary dark:text-white transition-colors" />
              )}

              {currentQ.type === 'long' && (
                <textarea
                  value={answers[currentQ.id] ?? ''}
                  onChange={e => setAnswers(a => ({ ...a, [currentQ.id]: e.target.value }))}
                  onCopy={e => e.preventDefault()}
                  onPaste={e => e.preventDefault()}
                  onCut={e => e.preventDefault()}
                  placeholder="Write your detailed answer here..." rows={8}
                  className="w-full bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-primary dark:text-white resize-none transition-colors" />
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
            className="flex items-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary transition disabled:opacity-40">
            <ChevronLeft size={16} /> Previous
          </button>
          {currentIdx < questions.length - 1 ? (
            <button onClick={() => setCurrentIdx(i => i + 1)}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-white text-sm font-bold hover:opacity-90 transition shadow-lg shadow-emerald-900/20">
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button onClick={handleSubmitExam} disabled={submitting}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60 shadow-lg">
              {submitting ? <><Loader size={16} className="animate-spin" /> Submitting...</> : <><Send size={16} /> Submit Exam</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SODExam;
