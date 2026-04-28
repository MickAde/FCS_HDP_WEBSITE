import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader, BookOpen, Users, DollarSign } from 'lucide-react';
import { dbService, SodDepartmentRow, SodRegistrationRow } from '../services/dbService';
import { useToast } from '../context/ToastContext';

const emptyForm = {
  name: '',
  description: '',
  teachers: [''],
  fee: 0,
  image_url: '',
};

const AdminSOD: React.FC = () => {
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<SodDepartmentRow[]>([]);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [tab, setTab] = useState<'departments' | 'registrations' | 'countdown'>('departments');
  const [countdownTarget, setCountdownTarget] = useState('');
  const [savingCountdown, setSavingCountdown] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: depts }, { data: regs }, { data: settings }] = await Promise.all([
      dbService.getSodDepartments(),
      dbService.getSodRegistrations(),
      dbService.getSodSettings(),
    ]);
    if (depts) setDepartments(depts);
    if (regs) setRegistrations(regs);
    if (settings?.countdown_target) {
      // format for datetime-local input
      const d = new Date(settings.countdown_target);
      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdownTarget(`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`);
    }
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const openCreate = () => { setEditingId(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (d: SodDepartmentRow) => {
    setEditingId(d.id);
    setForm({ name: d.name, description: d.description, teachers: d.teachers.length ? d.teachers : [''], fee: d.fee, image_url: d.image_url ?? '' });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.description) { showToast('Name and description are required.', 'error'); return; }
    setSaving(true);
    const payload = { ...form, image_url: form.image_url || null, teachers: form.teachers.filter(t => t.trim() !== '') };
    if (editingId) {
      const { error } = await dbService.updateSodDepartment(editingId, payload);
      if (error) showToast('Failed to update department.', 'error');
      else { showToast('Department updated!', 'success'); setShowForm(false); fetchAll(); }
    } else {
      const { error } = await dbService.createSodDepartment(payload);
      if (error) showToast(error.message ?? 'Failed to create department.', 'error');
      else { showToast('Department created!', 'success'); setShowForm(false); fetchAll(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteSodDepartment(id);
    if (error) showToast('Failed to delete department.', 'error');
    else { showToast('Department deleted.', 'info'); fetchAll(); }
    setDeleteConfirm(null);
  };

  const handleSaveCountdown = async () => {
    setSavingCountdown(true);
    const { error } = await dbService.updateSodSettings(countdownTarget ? new Date(countdownTarget).toISOString() : null);
    if (error) showToast('Failed to save countdown.', 'error');
    else showToast('Countdown updated!', 'success');
    setSavingCountdown(false);
  };

  const handleClearCountdown = async () => {
    setSavingCountdown(true);
    const { error } = await dbService.updateSodSettings(null);
    if (error) showToast('Failed to clear countdown.', 'error');
    else { showToast('Countdown cleared.', 'info'); setCountdownTarget(''); }
    setSavingCountdown(false);
  };

  const updateTeacher = (idx: number, val: string) =>
    setForm(f => { const t = [...f.teachers]; t[idx] = val; return { ...f, teachers: t }; });
  const addTeacher = () => setForm(f => ({ ...f, teachers: [...f.teachers, ''] }));
  const removeTeacher = (idx: number) => setForm(f => ({ ...f, teachers: f.teachers.filter((_, i) => i !== idx) }));

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-poppins font-bold">School of Destiny</h1>
          </div>
          {tab === 'departments' && (
            <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
              <Plus size={18} /> New Department
            </button>
          )}
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 flex gap-2">
          {(['departments', 'registrations', 'countdown'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition capitalize ${tab === t ? 'bg-white text-indigo-900' : 'bg-white/10 text-white hover:bg-white/20'}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32"><Loader size={32} className="animate-spin text-primary" /></div>
        ) : tab === 'departments' ? (
          departments.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
              <BookOpen size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No departments yet.</p>
              <button onClick={openCreate} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">Create First Department</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map(d => (
                <div key={d.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-6 shadow-sm">
                  {d.image_url && <img src={d.image_url} alt={d.name} className="w-full h-36 object-cover rounded-xl mb-4" />}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-indigo-900 dark:text-white text-lg">{d.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{d.description}</p>
                      {d.teachers.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          <Users size={13} className="text-primary" />
                          {d.teachers.map((t, i) => (
                            <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-primary px-2 py-0.5 rounded-full font-medium">{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-2 text-sm font-bold text-indigo-900 dark:text-white">
                        <DollarSign size={14} className="text-primary" />
                        {d.fee === 0 ? 'Free' : `₦${d.fee.toLocaleString()}`}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openEdit(d)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition"><Pencil size={16} /></button>
                      <button onClick={() => setDeleteConfirm(d.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"><Trash2 size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : tab === 'registrations' ? (
          registrations.length === 0 ? (
            <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
              <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">No registrations yet.</p>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-100 dark:border-slate-700">
                    <tr>
                      {['Student ID', 'Name', 'Department', 'Level', 'Phone', 'Payment', 'Date'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                    {registrations.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-primary">{r.student_id}</td>
                        <td className="px-4 py-3 font-semibold text-indigo-900 dark:text-white whitespace-nowrap">{r.full_name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{r.sod_departments?.name ?? '—'}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.level}</td>
                        <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{r.phone}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${r.payment_status === 'paid' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600' : 'bg-amber-50 dark:bg-amber-950/20 text-amber-600'}`}>
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 max-w-lg">
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-2">SOD Countdown Timer</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Set the target date for the SOD countdown displayed on the public page.</p>
            <div className="space-y-4">
              <input
                type="datetime-local"
                value={countdownTarget}
                onChange={e => setCountdownTarget(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
              />
              <div className="flex gap-3">
                <button onClick={handleSaveCountdown} disabled={savingCountdown}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60">
                  {savingCountdown ? <Loader size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
                <button onClick={handleClearCountdown} disabled={savingCountdown}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-700 transition disabled:opacity-60">
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-xl my-8 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{editingId ? 'Edit Department' : 'New Department'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Department Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="e.g. School of Leadership" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Description *</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="What this department covers..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Registration Fee (₦) <span className="normal-case font-normal text-gray-400">— set 0 for free</span>
                </label>
                <input type="number" min={0} value={form.fee} onChange={e => setForm(f => ({ ...f, fee: Number(e.target.value) }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="2000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="https://..." />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Teachers / Facilitators <span className="normal-case font-normal text-gray-400">— names of those who will teach</span>
                </label>
                <div className="space-y-2">
                  {form.teachers.map((t, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input value={t} onChange={e => updateTeacher(idx, e.target.value)}
                        className="flex-grow bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder={`Teacher ${idx + 1}`} />
                      {form.teachers.length > 1 && (
                        <button onClick={() => removeTeacher(idx)} className="p-2 text-gray-400 hover:text-red-500 transition"><X size={16} /></button>
                      )}
                    </div>
                  ))}
                  <button onClick={addTeacher} className="text-primary text-sm font-bold hover:underline flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Teacher
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-slate-800">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60">
                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'Save Changes' : 'Create Department'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 dark:border-slate-700 text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-2">Delete this department?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">All registrations for this department will also be deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSOD;
