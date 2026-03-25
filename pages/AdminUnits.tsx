import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader, Users } from 'lucide-react';
import { dbService, UnitRow } from '../services/dbService';
import { useToast } from '../context/ToastContext';

const ICON_OPTIONS = ['Users', 'Music', 'Camera', 'Mic2', 'HeartHandshake', 'ShieldCheck', 'CalendarDays', 'Wrench', 'Flame', 'Utensils', 'Theater', 'Zap'];
const COLOR_OPTIONS = [
  { label: 'Emerald', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100' },
  { label: 'Rose', color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
  { label: 'Blue', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
  { label: 'Indigo', color: 'bg-indigo-50 text-indigo-600', border: 'border-indigo-100' },
  { label: 'Amber', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  { label: 'Purple', color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  { label: 'Cyan', color: 'bg-cyan-50 text-cyan-600', border: 'border-cyan-100' },
  { label: 'Orange', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  { label: 'Slate', color: 'bg-slate-50 text-slate-600', border: 'border-slate-100' },
  { label: 'Yellow', color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
];

const emptyForm = {
  id: '',
  name: '',
  description: '',
  long_description: '',
  icon: 'Users',
  color: 'bg-emerald-50 text-emerald-600',
  border: 'border-emerald-100',
  img: '',
  activities: [''],
  meetings: '',
  requirements: '',
};

const AdminUnits: React.FC = () => {
  const { showToast } = useToast();
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchUnits = async () => {
    setLoading(true);
    const { data } = await dbService.getUnits();
    if (data) setUnits(data as UnitRow[]);
    setLoading(false);
  };

  useEffect(() => { fetchUnits(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (unit: UnitRow) => {
    setEditingId(unit.id);
    setForm({
      id: unit.id,
      name: unit.name,
      description: unit.description,
      long_description: unit.long_description ?? '',
      icon: unit.icon,
      color: unit.color,
      border: unit.border,
      img: unit.img ?? '',
      activities: unit.activities.length ? unit.activities : [''],
      meetings: unit.meetings ?? '',
      requirements: unit.requirements ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.id || !form.name || !form.description) {
      showToast('ID, name and description are required.', 'error');
      return;
    }
    setSaving(true);
    const payload: Omit<UnitRow, 'created_at'> = {
      ...form,
      img: form.img || null,
      long_description: form.long_description || null,
      meetings: form.meetings || null,
      requirements: form.requirements || null,
      activities: form.activities.filter(a => a.trim() !== ''),
    };

    if (editingId) {
      const { error } = await dbService.updateUnit(editingId, payload);
      if (error) showToast('Failed to update unit.', 'error');
      else { showToast('Unit updated!', 'success'); setShowForm(false); fetchUnits(); }
    } else {
      const { error } = await dbService.createUnit(payload);
      if (error) showToast(error.message ?? 'Failed to create unit.', 'error');
      else { showToast('Unit created!', 'success'); setShowForm(false); fetchUnits(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteUnit(id);
    if (error) showToast('Failed to delete unit.', 'error');
    else { showToast('Unit deleted.', 'info'); setUnits(u => u.filter(x => x.id !== id)); }
    setDeleteConfirm(null);
  };

  const updateActivity = (idx: number, val: string) => {
    setForm(f => { const a = [...f.activities]; a[idx] = val; return { ...f, activities: a }; });
  };
  const addActivity = () => setForm(f => ({ ...f, activities: [...f.activities, ''] }));
  const removeActivity = (idx: number) => setForm(f => ({ ...f, activities: f.activities.filter((_, i) => i !== idx) }));

  const selectedColor = COLOR_OPTIONS.find(c => c.color === form.color) ?? COLOR_OPTIONS[0];

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-poppins font-bold">Units Management</h1>
          </div>
          <button onClick={openCreate} className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
            <Plus size={18} /> New Unit
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader size={32} className="animate-spin text-primary" />
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No units yet.</p>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
              Create First Unit
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {units.map(unit => (
              <div key={unit.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-4 shadow-sm">
                {unit.img
                  ? <img src={unit.img} alt={unit.name} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
                  : <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${unit.color}`}><Users size={24} /></div>
                }
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-indigo-900 dark:text-white truncate">{unit.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{unit.description}</p>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{unit.activities.length} activities · {unit.meetings ?? 'No schedule set'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(unit)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => setDeleteConfirm(unit.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
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
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">{editingId ? 'Edit Unit' : 'New Unit'}</h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Unit ID * <span className="normal-case font-normal text-gray-400">(slug, e.g. "drama")</span></label>
                  <input
                    value={form.id}
                    onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '-') }))}
                    disabled={!!editingId}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white disabled:opacity-50"
                    placeholder="drama"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Unit Name *</label>
                  <input
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="Drama Unit"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Short Description *</label>
                <input
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="One-line description shown on the units grid"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Full Description</label>
                <textarea
                  value={form.long_description}
                  onChange={e => setForm(f => ({ ...f, long_description: e.target.value }))}
                  rows={3}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Detailed description shown on the unit detail page"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Icon</label>
                  <select
                    value={form.icon}
                    onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  >
                    {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Color Theme</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {COLOR_OPTIONS.map(c => (
                      <button
                        key={c.label}
                        type="button"
                        onClick={() => setForm(f => ({ ...f, color: c.color, border: c.border }))}
                        className={`w-7 h-7 rounded-full border-2 transition ${c.color} ${form.color === c.color ? 'border-gray-800 dark:border-white scale-110' : 'border-transparent'}`}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input
                  value={form.img}
                  onChange={e => setForm(f => ({ ...f, img: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
                {form.img && (
                  <div className="mt-2 rounded-xl overflow-hidden h-28 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
                    <img src={form.img} alt="Preview" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Meeting Schedule</label>
                  <input
                    value={form.meetings}
                    onChange={e => setForm(f => ({ ...f, meetings: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="Saturdays, 4:00 PM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Requirements</label>
                  <input
                    value={form.requirements}
                    onChange={e => setForm(f => ({ ...f, requirements: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="A passion for..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Activities</label>
                <div className="space-y-2">
                  {form.activities.map((act, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        value={act}
                        onChange={e => updateActivity(idx, e.target.value)}
                        className="flex-grow bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                        placeholder={`Activity ${idx + 1}`}
                      />
                      {form.activities.length > 1 && (
                        <button onClick={() => removeActivity(idx)} className="p-2 text-gray-400 hover:text-red-500 transition">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button onClick={addActivity} className="text-primary text-sm font-bold hover:underline flex items-center gap-1 mt-1">
                    <Plus size={14} /> Add Activity
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
                {editingId ? 'Save Changes' : 'Create Unit'}
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
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-2">Delete this unit?</h3>
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

export default AdminUnits;
