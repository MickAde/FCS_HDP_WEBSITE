import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Loader, CheckCircle, XCircle, Clock, AlertCircle, FileQuestion } from 'lucide-react';
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
      const { data, error } = await supabase
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
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="text-center">
        <AlertCircle size={40} className="mx-auto text-amber-500 mb-4" />
        <h2 className="text-xl font-bold text-indigo-900 dark:text-white mb-2">Login Required</h2>
        <p className="text-gray-500 text-sm mb-6">You must be logged in to view your results.</p>
        <Link to="/login" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">Login</Link>
      </div>
    </div>
  );

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-4xl font-poppins font-bold mb-3">My Exam Results</h1>
          <p className="text-indigo-200 text-sm">Results are only visible once your coordinator has finished grading.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
        {results.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <FileQuestion size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No submitted exams yet.</p>
            <Link to="/sod" className="inline-block mt-4 text-primary font-bold text-sm hover:underline">Go to SOD</Link>
          </div>
        ) : results.map(r => {
          const passMark = r.sod_exams?.pass_mark ?? 50;
          const totalMarks = r.total_marks ?? 0;
          const percentage = totalMarks > 0 ? Math.round((r.score / totalMarks) * 100) : null;
          const passed = percentage !== null && percentage >= passMark;
          const resultsVisible = r.sod_exams?.results_visible && r.graded;

          return (
            <div key={r.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-grow">
                  <h3 className="font-bold text-indigo-900 dark:text-white text-lg">{r.sod_exams?.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                    <Clock size={11} /> Submitted {new Date(r.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {resultsVisible ? (
                  <div className="text-right flex-shrink-0">
                    <div className={`flex items-center gap-1.5 justify-end mb-1 ${passed ? 'text-emerald-600' : 'text-red-500'}`}>
                      {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      <span className="font-bold text-sm">{passed ? 'PASSED' : 'FAILED'}</span>
                    </div>
                    <p className="text-2xl font-black text-indigo-900 dark:text-white">{r.score}<span className="text-sm font-normal text-gray-400"> / {totalMarks}</span></p>
                    <p className="text-xs text-gray-400">{percentage}% · Pass mark {passMark}%</p>
                  </div>
                ) : (
                  <div className="flex-shrink-0 text-right">
                    <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600">
                      {r.graded ? 'Result Pending Release' : 'Awaiting Grading'}
                    </span>
                  </div>
                )}
              </div>

              {resultsVisible && (
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-slate-700">
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${passed ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${Math.min(percentage ?? 0, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SODResults;
