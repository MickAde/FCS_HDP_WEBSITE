import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, CheckCircle, XCircle, Clock, AlertCircle, FileQuestion, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SODResults: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    const fetch = async () => {
      const { data } = await supabase
        .from('sod_submissions')
        .select('*, sod_exams(title, pass_mark, results_visible)')
        .eq('user_id', user.id)
        .not('submitted_at', 'is', null)
        .order('created_at', { ascending: false });
      setResults(data ?? []);
      setLoading(false);
    };
    fetch();
  }, [user, authLoading]);

  if (!user && !authLoading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
        <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6"><AlertCircle size={40} /></div>
        <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Login Required</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">You must be logged in to view your results.</p>
        <Link to="/login" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">Sign In</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center"><Loader size={40} className="animate-spin text-primary mx-auto mb-4" /><p className="text-gray-500 dark:text-gray-400 text-sm">Loading results...</p></div>
    </div>
  );

  const gradedCount = results.filter(r => r.graded && r.sod_exams?.results_visible).length;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Hero */}
      <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 border border-primary/30 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles size={14} /> School of Destiny
          </div>
          <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">My Exams & Results</h1>
          <p className="text-indigo-200 max-w-md mx-auto text-sm">Results are released by your coordinator after grading is complete.</p>
          {results.length > 0 && (
            <div className="flex items-center justify-center gap-6 mt-8">
              {[
                { label: 'Submitted', value: results.length },
                { label: 'Graded', value: gradedCount },
                { label: 'Pending', value: results.length - gradedCount },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl font-black text-white">{value}</p>
                  <p className="text-xs text-indigo-300 uppercase tracking-widest font-bold">{label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-800/50 blur-3xl rounded-full -ml-24 -mb-24" />
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
            <div className="w-20 h-20 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileQuestion size={36} className="text-gray-400 dark:text-slate-500" />
            </div>
            <h3 className="font-bold text-indigo-900 dark:text-white text-lg mb-2">No Exams Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">You haven't submitted any exams yet.</p>
            <Link to="/sod" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
              Go to SOD <ArrowRight size={16} />
            </Link>
          </div>
        ) : results.map(r => {
          const passMark = r.sod_exams?.pass_mark ?? 50;
          const totalMarks = r.total_marks ?? 0;
          const percentage = totalMarks > 0 ? Math.round((r.score / totalMarks) * 100) : null;
          const passed = percentage !== null && percentage >= passMark;
          const resultsVisible = r.sod_exams?.results_visible && r.graded;

          return (
            <div key={r.id} className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              {/* Card top accent */}
              <div className={`h-1.5 w-full ${resultsVisible ? (passed ? 'bg-emerald-500' : 'bg-red-500') : 'bg-indigo-300 dark:bg-slate-600'}`} />

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow min-w-0">
                    <h3 className="font-bold text-indigo-900 dark:text-white text-lg truncate">{r.sod_exams?.title}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1.5">
                      <Clock size={12} />
                      Submitted {new Date(r.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  {resultsVisible ? (
                    <div className="text-right flex-shrink-0">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mb-2 ${passed ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-red-50 dark:bg-red-950/20 text-red-500'}`}>
                        {passed ? <CheckCircle size={13} /> : <XCircle size={13} />}
                        {passed ? 'PASSED' : 'FAILED'}
                      </div>
                      <p className="text-3xl font-black text-indigo-900 dark:text-white leading-none">
                        {r.score}<span className="text-base font-normal text-gray-400"> / {totalMarks}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{percentage}% · Pass mark {passMark}%</p>
                    </div>
                  ) : (
                    <span className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${r.graded ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'}`}>
                      {r.graded ? 'Pending Release' : 'Awaiting Grading'}
                    </span>
                  )}
                </div>

                {resultsVisible && (
                  <div className="mt-5">
                    <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                      <span>Score</span><span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full transition-all duration-700 ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(percentage ?? 0, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span className="text-gray-400">0%</span>
                      <span className={`font-bold ${passed ? 'text-emerald-600' : 'text-red-500'}`}>Pass mark: {passMark}%</span>
                      <span className="text-gray-400">100%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SODResults;
