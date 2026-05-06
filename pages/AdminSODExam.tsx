import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Pencil, Trash2, X, Save, Loader,
  BookOpen, Eye, EyeOff, FileQuestion, CheckSquare, AlignLeft, AlignJustify, BarChart2, Users
} from 'lucide-react';
import { dbService, SodDepartmentRow } from '../services/dbService';
import { useToast } from '../context/ToastContext';

const QUESTION_TYPES = [
  { value: 'mcq', label: 'Multiple Choice', icon: CheckSquare },
  { value: 'short', label: 'Short Answer', icon: AlignLeft },
  { value: 'long', label: 'Long Answer', icon: AlignJustify },
];

const emptyExamForm = { department_id: '', title: '', description: '', duration_minutes: 60, pass_mark: 50 };
const emptyQForm = { question: '', type: 'mcq', options: ['', '', '', ''], correct_answer: '', marks: 1 };

const AdminSODExam: React.FC = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<SodDepartmentRow[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Exam form
  const [showExamForm, setShowExamForm] = useState(false);
  const [editingExamId, setEditingExamId] = useState<string | null>(null);
  const [examForm, setExamForm] = useState(emptyExamForm);

  // Question management
  const [activeExam, setActiveExam] = useState<any | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [editingQId, setEditingQId] = useState<string | null>(null);
  const [qForm, setQForm] = useState(emptyQForm);
  const [savingQ, setSavingQ] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: depts }, { data: exs }] = await Promise.all([
      dbService.getSodDepartments(),
      dbService.getSodExams(),
    ]);
    if (depts) setDepartments(depts);
    if (exs) setExams(exs);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const fetchQuestions = async (exam: any) => {
    setActiveExam(exam);
    setLoadingQ(true);
    const { data } = await dbService.getSodQuestionsAdmin(exam.id);
    setQuestions(data ?? []);
    setLoadingQ(false);
  };

  // Exam CRUD
  const openCreateExam = () => { setEditingExamId(null); setExamForm(emptyExamForm); setShowExamForm(true); };
  const openEditExam = (e: any) => {
    setEditingExamId(e.id);
    setExamForm({ department_id: e.department_id, title: e.title, description: e.description ?? '', duration_minutes: e.duration_minutes, pass_mark: e.pass_mark });
    setShowExamForm(true);
  };

  const handleSaveExam = async () => {
    if (!examForm.department_id || !examForm.title) { showToast('Department and title are required.', 'error'); return; }
    setSaving(true);
    if (editingExamId) {
      const { error } = await dbService.updateSodExam(editingExamId, examForm);
      if (error) showToast('Failed to update exam.', 'error');
      else { showToast('Exam updated!', 'success'); setShowExamForm(false); fetchAll(); }
    } else {
      const { error } = await dbService.createSodExam(examForm);
      if (error) showToast(error.message ?? 'Failed to create exam.', 'error');
      else { showToast('Exam created!', 'success'); setShowExamForm(false); fetchAll(); }
    }
    setSaving(false);
  };

  const handleDeleteExam = async (id: string) => {
    if (!confirm('Delete this exam and all its questions?')) return;
    const { error } = await dbService.deleteSodExam(id);
    if (error) showToast('Failed to delete exam.', 'error');
    else { showToast('Exam deleted.', 'info'); if (activeExam?.id === id) setActiveExam(null); fetchAll(); }
  };

  const handleTogglePublish = async (exam: any) => {
    const { error } = await dbService.updateSodExam(exam.id, { is_published: !exam.is_published });
    if (error) showToast('Failed to update.', 'error');
    else { showToast(exam.is_published ? 'Exam unpublished.' : 'Exam published!', 'success'); fetchAll(); if (activeExam?.id === exam.id) setActiveExam({ ...activeExam, is_published: !exam.is_published }); }
  };

  // Question CRUD
  const openCreateQ = () => { setEditingQId(null); setQForm(emptyQForm); setShowQForm(true); };
  const openEditQ = (q: any) => {
    setEditingQId(q.id);
    setQForm({ question: q.question, type: q.type, options: q.options?.length ? q.options : ['', '', '', ''], correct_answer: q.correct_answer ?? '', marks: q.marks });
    setShowQForm(true);
  };

  const handleSaveQ = async () => {
    if (!qForm.question) { showToast('Question text is required.', 'error'); return; }
    if (qForm.type === 'mcq' && !qForm.correct_answer) { showToast('Correct answer is required for MCQ.', 'error'); return; }
    setSavingQ(true);
    const payload = {
      exam_id: activeExam.id,
      question: qForm.question,
      type: qForm.type,
      options: qForm.type === 'mcq' ? qForm.options.filter(o => o.trim()) : [],
      correct_answer: qForm.type === 'mcq' ? qForm.correct_answer : '',
      marks: qForm.marks,
      order: editingQId ? (questions.find(q => q.id === editingQId)?.order ?? questions.length) : questions.length,
    };
    if (editingQId) {
      const { error } = await dbService.updateSodQuestion(editingQId, payload);
      if (error) showToast('Failed to update question.', 'error');
      else { showToast('Question updated!', 'success'); setShowQForm(false); fetchQuestions(activeExam); }
    } else {
      const { error } = await dbService.createSodQuestion(payload);
      if (error) showToast('Failed to create question.', 'error');
      else { showToast('Question added!', 'success'); setShowQForm(false); fetchQuestions(activeExam); }
    }
    setSavingQ(false);
  };

  const handleDeleteQ = async (id: string) => {
    if (!confirm('Delete this question?')) return;
    const { error } = await dbService.deleteSodQuestion(id);
    if (error) showToast('Failed to delete question.', 'error');
    else { showToast('Question deleted.', 'info'); fetchQuestions(activeExam); }
  };

  const updateOption = (idx: number, val: string) =>
    setQForm(f => { const o = [...f.options]; o[idx] = val; return { ...f, options: o }; });

  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-poppins font-bold">SOD Exam Portal</h1>
          </div>
          <button onClick={openCreateExam} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
            <Plus size={18} /> New Exam
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32"><Loader size={32} className="animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Exams List */}
            <div className="space-y-4">
              <h2 className="font-bold text-indigo-900 dark:text-white text-lg">Exams</h2>
              {exams.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  <FileQuestion size={40} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No exams yet.</p>
                  <button onClick={openCreateExam} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition">Create First Exam</button>
                </div>
              ) : exams.map(exam => (
                <div key={exam.id}
                  onClick={() => fetchQuestions(exam)}
                  className={`bg-white dark:bg-slate-800 rounded-2xl border-2 p-5 cursor-pointer transition-all ${activeExam?.id === exam.id ? 'border-primary' : 'border-gray-100 dark:border-slate-700 hover:border-primary/40'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${exam.is_published ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-gray-100 dark:bg-slate-700 text-gray-500'}`}>
                          {exam.is_published ? 'Published' : 'Draft'}
                        </span>
                        {exam.results_visible && (
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/20 text-blue-600">Results Visible</span>
                        )}
                        <span className="text-[10px] text-gray-400">{exam.sod_departments?.name}</span>
                      </div>
                      <h3 className="font-bold text-indigo-900 dark:text-white">{exam.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{exam.duration_minutes} min • Pass mark: {exam.pass_mark}%</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleTogglePublish(exam)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition" title={exam.is_published ? 'Unpublish' : 'Publish'}>
                        {exam.is_published ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => dbService.updateSodExam(exam.id, { results_visible: !exam.results_visible }).then(fetchAll)} className={`p-2 rounded-lg transition flex items-center gap-1.5 text-xs font-bold ${exam.results_visible ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20'}`} title={exam.results_visible ? 'Hide results from students' : 'Show results to students'}>
                        <Users size={15} />{exam.results_visible ? 'Visible' : 'Hidden'}
                      </button>
                      <Link to={`/admin/sod/exams/${exam.id}/results`} title="View Results" className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition">
                        <BarChart2 size={15} />
                      </Link>
                      <button title="Edit Exam" onClick={() => openEditExam(exam)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition"><Pencil size={15} /></button>
                      <button title="Delete Exam" onClick={() => handleDeleteExam(exam.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"><Trash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Questions Panel */}
            <div>
              {!activeExam ? (
                <div className="flex items-center justify-center h-64 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                  <p className="text-gray-400 text-sm">Select an exam to manage questions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-bold text-indigo-900 dark:text-white text-lg">{activeExam.title}</h2>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{questions.length} questions • {totalMarks} total marks</p>
                    </div>
                    <button onClick={openCreateQ} className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition">
                      <Plus size={15} /> Add Question
                    </button>
                  </div>

                  {loadingQ ? (
                    <div className="flex items-center justify-center py-20"><Loader size={24} className="animate-spin text-primary" /></div>
                  ) : questions.length === 0 ? (
                    <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
                      <p className="text-gray-400 text-sm">No questions yet. Add your first question.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {questions.map((q, idx) => (
                        <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-4">
                          <div className="flex items-start gap-3">
                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{idx + 1}</span>
                            <div className="flex-grow min-w-0">
                              <p className="text-sm font-semibold text-indigo-900 dark:text-white">{q.question}</p>
                              <div className="flex items-center gap-3 mt-1.5">
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500">{q.type}</span>
                                <span className="text-[10px] text-gray-400">{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                                {q.type === 'mcq' && <span className="text-[10px] text-emerald-600 font-bold">✓ {q.correct_answer}</span>}
                              </div>
                              {q.type === 'mcq' && q.options?.length > 0 && (
                                <div className="mt-2 grid grid-cols-2 gap-1">
                                  {q.options.map((o: string, i: number) => (
                                    <span key={i} className={`text-xs px-2 py-1 rounded-lg ${o === q.correct_answer ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 font-bold' : 'bg-gray-50 dark:bg-slate-700 text-gray-500'}`}>
                                      {String.fromCharCode(65 + i)}. {o}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <button title="Edit Question" onClick={() => openEditQ(q)} className="p-1.5 rounded-lg text-gray-400 hover:text-primary transition"><Pencil size={14} /></button>
                              <button title="Delete Question" onClick={() => handleDeleteQ(q.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 transition"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exam Form Modal */}
      {showExamForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg my-8 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{editingExamId ? 'Edit Exam' : 'New Exam'}</h2>
              <button onClick={() => setShowExamForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Department *</label>
                <select value={examForm.department_id} onChange={e => setExamForm(f => ({ ...f, department_id: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                  <option value="">Select Department</option>
                  {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Exam Title *</label>
                <input value={examForm.title} onChange={e => setExamForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="e.g. Mid-Term Assessment" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description</label>
                <textarea value={examForm.description} onChange={e => setExamForm(f => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Duration (minutes)</label>
                  <input type="number" min={5} value={examForm.duration_minutes} onChange={e => setExamForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Pass Mark (%)</label>
                  <input type="number" min={0} max={100} value={examForm.pass_mark} onChange={e => setExamForm(f => ({ ...f, pass_mark: Number(e.target.value) }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-slate-800">
              <button onClick={() => setShowExamForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={handleSaveExam} disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60">
                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {editingExamId ? 'Save Changes' : 'Create Exam'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Question Form Modal */}
      {showQForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg my-8 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{editingQId ? 'Edit Question' : 'Add Question'}</h2>
              <button onClick={() => setShowQForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Type selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Question Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {QUESTION_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => setQForm(f => ({ ...f, type: t.value }))}
                      className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-xs font-bold transition ${qForm.type === t.value ? 'border-primary bg-emerald-50 dark:bg-emerald-950/20 text-primary' : 'border-gray-200 dark:border-slate-700 text-gray-500 hover:border-primary/40'}`}>
                      <t.icon size={16} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Question *</label>
                <textarea value={qForm.question} onChange={e => setQForm(f => ({ ...f, question: e.target.value }))} rows={3}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Enter your question..." />
              </div>
              {qForm.type === 'mcq' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Options</label>
                    <div className="space-y-2">
                      {qForm.options.map((o, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-slate-700 text-xs font-bold flex items-center justify-center text-gray-500 flex-shrink-0">{String.fromCharCode(65 + i)}</span>
                          <input value={o} onChange={e => updateOption(i, e.target.value)}
                            className="flex-grow bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                            placeholder={`Option ${String.fromCharCode(65 + i)}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Correct Answer *</label>
                    <select value={qForm.correct_answer} onChange={e => setQForm(f => ({ ...f, correct_answer: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white">
                      <option value="">Select correct option</option>
                      {qForm.options.filter(o => o.trim()).map((o, i) => (
                        <option key={i} value={o}>{String.fromCharCode(65 + i)}. {o}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Marks</label>
                <input type="number" min={1} value={qForm.marks} onChange={e => setQForm(f => ({ ...f, marks: Number(e.target.value) }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-slate-800">
              <button onClick={() => setShowQForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={handleSaveQ} disabled={savingQ}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60">
                {savingQ ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {editingQId ? 'Save Changes' : 'Add Question'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSODExam;
