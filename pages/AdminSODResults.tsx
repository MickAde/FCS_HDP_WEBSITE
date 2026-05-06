import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader, Clock, Save, ChevronDown, ChevronUp, Search, Trash2, RefreshCw } from 'lucide-react';
import { dbService } from '../services/dbService';
import { useToast } from '../context/ToastContext';
import { supabase } from '../lib/supabase';

const AdminSODResults: React.FC = () => {
  const { examId } = useParams<{ examId: string }>();
  const { showToast } = useToast();
  const [exam, setExam] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [markInputs, setMarkInputs] = useState<Record<string, number>>({});
  const [saving, setSaving] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchAll = async () => {
    const [{ data: examData }, { data: subs }] = await Promise.all([
      dbService.getSodExam(examId!),
      dbService.getSodSubmissions(examId!),
    ]);
    if (examData) setExam(examData);
    if (subs) setSubmissions(subs);
    setLoading(false);
  };

  useEffect(() => { if (!examId) return; fetchAll(); }, [examId]);

  const handleSaveAllMarks = async (submissionId: string) => {
    setSaving(submissionId);
    const sub = submissions.find(s => s.id === submissionId);
    if (!sub) { setSaving(null); return; }

    // Save all changed mark inputs for this submission
    const answers = sub.sod_answers ?? [];
    const updates = answers.filter((a: any) => markInputs[a.id] !== undefined);

    for (const ans of updates) {
      const { error } = await dbService.updateAnswerMarks(ans.id, markInputs[ans.id]);
      if (error) { showToast(`Failed to save mark for Q${ans.id}.`, 'error'); setSaving(null); return; }
    }

    // Recalculate total from all answers (updated + existing)
    const { error } = await dbService.finalizeGrading(submissionId);
    if (error) showToast('Failed to recalculate score.', 'error');
    else { showToast('Marks saved & score recalculated!', 'success'); fetchAll(); }
    setSaving(null);
  };

  const handleResetGrading = async (submissionId: string) => {
    if (!confirm('Reset grading? This will allow you to re-enter marks.')) return;
    setSaving(submissionId);
    const { error } = await supabase.from('sod_submissions').update({ graded: false, score: null }).eq('id', submissionId);
    if (error) showToast('Failed to reset grading.', 'error');
    else { showToast('Grading reset.', 'info'); fetchAll(); }
    setSaving(null);
  };

  const handleDelete = async (submissionId: string) => {
    if (!confirm('Delete this submission and all its answers? This cannot be undone.')) return;
    setDeleting(submissionId);
    const { error } = await supabase.from('sod_submissions').delete().eq('id', submissionId);
    if (error) showToast('Failed to delete submission.', 'error');
    else { showToast('Submission deleted.', 'info'); fetchAll(); }
    setDeleting(null);
  };

  const getStatusBadge = (sub: any) => {
    if (!sub.submitted_at) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/20 text-amber-600">In Progress</span>;
    if (sub.graded) return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600">Graded</span>;
    return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600">Pending Review</span>;
  };

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase();
    if (!q) return true;
    return (
      s.student_id?.toLowerCase().includes(q) ||
      (s.graded ? 'graded' : s.submitted_at ? 'pending review' : 'in progress').includes(q) ||
      String(s.score ?? '').includes(q)
    );
  });

  if (loading) return <div className="min-h-[80vh] flex items-center justify-center"><Loader size={32} className="animate-spin text-primary" /></div>;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/admin/sod/exams" className="inline-flex items-center text-indigo-200 hover:text-white mb-4 text-sm transition">
            <ArrowLeft size={16} className="mr-1" /> Back to Exams
          </Link>
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Results</p>
          <h1 className="text-3xl font-poppins font-bold">{exam?.title}</h1>
          <p className="text-indigo-200 mt-1 text-sm">{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by student ID, status, or score..."
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <p className="text-gray-500 dark:text-gray-400">{submissions.length === 0 ? 'No submissions yet.' : 'No results match your search.'}</p>
          </div>
        ) : filtered.map(sub => {
          const isExpanded = expandedSub === sub.id;
          const manualAnswers = (sub.sod_answers ?? []).filter((a: any) => a.sod_questions?.type !== 'mcq');
          const needsGrading = manualAnswers.some((a: any) => a.marks_awarded === null);

          return (
            <div key={sub.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div
                className="flex items-center justify-between p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                onClick={() => setExpandedSub(isExpanded ? null : sub.id)}
              >
                <div>
                  <p className="font-bold text-indigo-900 dark:text-white">{sub.student_id}</p>
                  <div className="flex items-center gap-3 mt-1">
                    {getStatusBadge(sub)}
                    {sub.submitted_at && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={11} /> {new Date(sub.submitted_at).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {sub.submitted_at && (
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-900 dark:text-white">{sub.score ?? '—'} / {sub.total_marks ?? '—'}</p>
                      <p className="text-xs text-gray-400">marks</p>
                    </div>
                  )}
                  {/* Reset grading */}
                  {sub.graded && (
                    <button title="Reset grading to re-enter marks" onClick={e => { e.stopPropagation(); handleResetGrading(sub.id); }}
                      disabled={saving === sub.id}
                      className="p-2 rounded-lg text-gray-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/20 transition">
                      <RefreshCw size={15} />
                    </button>
                  )}
                  {/* Delete */}
                  <button title="Delete submission" onClick={e => { e.stopPropagation(); handleDelete(sub.id); }}
                    disabled={deleting === sub.id}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                    {deleting === sub.id ? <Loader size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                  {isExpanded ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-slate-700 p-5 space-y-4">
                  {(sub.sod_answers ?? [])
                    .sort((a: any, b: any) => (a.sod_questions?.order ?? 0) - (b.sod_questions?.order ?? 0))
                    .map((ans: any, idx: number) => {
                      const isManual = ans.sod_questions?.type !== 'mcq';
                      return (
                        <div key={ans.id} className="bg-gray-50 dark:bg-slate-900 rounded-xl p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-grow">
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                Q{idx + 1} · {ans.sod_questions?.type?.toUpperCase()} · {ans.sod_questions?.marks} mark{ans.sod_questions?.marks !== 1 ? 's' : ''}
                              </p>
                              <p className="text-sm font-semibold text-indigo-900 dark:text-white mb-2">{ans.sod_questions?.question}</p>
                              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 border border-gray-100 dark:border-slate-700">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{ans.answer || <span className="text-gray-400 italic">No answer provided</span>}</p>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              {isManual ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="number" min={0} max={ans.sod_questions?.marks}
                                    value={markInputs[ans.id] ?? ans.marks_awarded ?? ''}
                                    onChange={e => setMarkInputs(m => ({ ...m, [ans.id]: Number(e.target.value) }))}
                                    className="w-16 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                                    placeholder="0"
                                  />
                                  <span className="text-xs text-gray-400">/ {ans.sod_questions?.marks}</span>
                                </div>
                              ) : (
                                <span className={`text-sm font-bold ${ans.marks_awarded === ans.sod_questions?.marks ? 'text-emerald-600' : 'text-red-500'}`}>
                                  {ans.marks_awarded} / {ans.sod_questions?.marks}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}

                  {sub.submitted_at && (
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
                      <p className="text-xs text-gray-400">
                        {Object.keys(markInputs).filter(k => sub.sod_answers?.some((a: any) => a.id === k)).length} mark(s) changed
                      </p>
                      <button
                        title="Save all marks and recalculate total score"
                        onClick={() => handleSaveAllMarks(sub.id)}
                        disabled={saving === sub.id}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-50">
                        {saving === sub.id ? <Loader size={15} className="animate-spin" /> : <Save size={15} />}
                        Save & Recalculate
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AdminSODResults;
