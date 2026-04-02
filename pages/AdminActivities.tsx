import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader, CalendarDays } from 'lucide-react';
import { dbService, ActivityRow } from '../services/dbService';
import { useToast } from '../context/ToastContext';

const TYPES = ['General', 'Workshop', 'Outreach', 'Prayer'] as const;

const emptyForm = {
  id: '',
  title: '',
  description: '',
  long_description: '',
  date: '',
  end_date: '',
  time: '',
  location: '',
  type: 'General' as ActivityRow['type'],
  featured: false,
  image_url: '',
  expectations: [''],
};

const TYPE_COLORS: Record<string, string> = {
  Workshop: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600',
  Prayer: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600',
  Outreach: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600',
  General: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
};

const AdminActivities: React.FC = () => {
  const { showToast } = useToast();
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchActivities = async () => {
    setLoading(true);
    const { data } = await dbService.getActivities();
    if (data) setActivities(data as ActivityRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchActivities(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (a: ActivityRow) => {
    setEditingId(a.id);
    setForm({
      id: a.id,
      title: a.title,
      description: a.description,
      long_description: a.long_description ?? '',
      date: a.date,
      end_date: a.end_date ?? '',
      time: a.time,
      location: a.location,
      type: a.type,
      featured: a.featured,
      image_url: a.image_url ?? '',
      expectations: a.expectations.length ? a.expectations : [''],
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.title || !form.date || !form.time || !form.location) {
      showToast('ID, title, date, time and location are required.', 'error');
      return;
    }
    setSaving(true);
    const payload: Omit<ActivityRow, 'created_at'> = {
      ...form,
      image_url: form.image_url || null,
      long_description: form.long_description || null,
      end_date: form.end_date || null,
      expectations: form.expectations.filter(e => e.trim() !== ''),
    };

    if (editingId) {
      const { error } = await dbService.updateActivity(editingId, payload);
      if (error) showToast('Failed to update activity.', 'error');
      else { showToast('Activity updated!', 'success'); setShowForm(false); fetchActivities(); }
    } else {
      const { error } = await dbService.createActivity(payload);
      if (error) showToast(error.message ?? 'Failed to create activity.', 'error');
      else { showToast('Activity created!', 'success'); setShowForm(false); fetchActivities(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteActivity(id);
    if (error) showToast('Failed to delete activity.', 'error');
    else { showToast('Activity deleted.', 'info'); setActivities(a => a.filter(x => x.id !== id)); }
    setDeleteConfirm(null);
  };

  const updateExpectation = (idx: number, val: string) =>
    setForm(f => { const e = [...f.expectations]; e[idx] = val; return { ...f, expectations: e }; });
  const addExpectation = () => setForm(f => ({ ...f, expectations: [...f.expectations, ''] }));
  const removeExpectation = (idx: number) =>
    setForm(f => ({ ...f, expectations: f.expectations.filter((_, i) => i !== idx) }));

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-poppins font-bold">Activities Management</h1>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
            <Plus size={18} /> New Activity
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader size={32} className="animate-spin text-primary" />
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <CalendarDays size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No activities yet.</p>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
              Create First Activity
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map(a => (
              <div key={a.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-5 shadow-sm">
                {a.image_url
                  ? <img src={a.image_url} alt={a.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  : <div className="w-16 h-16 rounded-xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0"><CalendarDays size={24} className="text-gray-400" /></div>
                }
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TYPE_COLORS[a.type]}`}>{a.type}</span>
                    {a.featured && <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-600">Featured</span>}
                  </div>
                  <h3 className="font-bold text-indigo-900 dark:text-white truncate">{a.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{a.date} · {a.time} · {a.location}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(a)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(a.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl my-8 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{editingId ? 'Edit Activity' : 'New Activity'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">ID * <span className="normal-case font-normal text-gray-400">(slug)</span></label>
                  <input
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    disabled={!!editingId}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50"
                    placeholder="freshmen-welcome"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Type *</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value as ActivityRow['type'] }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  >
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="Freshmen Welcome Banquet"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Start Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                    End Date <span className="normal-case font-normal text-gray-400">(optional — for multi-day events)</span>
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    min={form.date || undefined}
                    onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Time *</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Location *</label>
                  <input
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="Fellowship Hall"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Short Description *</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Brief description shown on the activities listing..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Description</label>
                <textarea
                  value={form.long_description}
                  onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))}
                  rows={4}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Detailed description shown on the activity detail page..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
                {form.image_url && (
                  <div className="mt-2 rounded-xl overflow-hidden h-28 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
                    <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 accent-primary"
                />
                <label htmlFor="featured" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Mark as Featured Event</label>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">What to Expect</label>
                <div className="space-y-2">
                  {form.expectations.map((exp, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={exp}
                        onChange={e => updateExpectation(idx, e.target.value)}
                        className="flex-grow bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder={`Expectation ${idx + 1}`}
                      />
                      {form.expectations.length > 1 && (
                        <button onClick={() => removeExpectation(idx)} className="p-2 text-gray-400 hover:text-red-500 transition">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addExpectation} className="text-primary text-sm font-bold hover:underline flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Expectation
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-slate-800">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'Save Changes' : 'Create Activity'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 dark:border-slate-700 text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-2">Delete this activity?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminActivities;
