import React, { useState, useEffect } from 'react';
import { Ticket, Plus, Trash2, Loader, Copy, CheckCircle } from 'lucide-react';
import { dbService, SodDepartmentRow } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const RegistrarSOD: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [departments, setDepartments] = useState<SodDepartmentRow[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDept, setSelectedDept] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    const [{ data: depts }, { data: cpns }] = await Promise.all([
      dbService.getSodDepartments(),
      dbService.getSodCoupons(),
    ]);
    if (depts) setDepartments(depts);
    if (cpns) setCoupons(cpns);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleGenerate = async () => {
    if (!selectedDept) { showToast('Select a department first.', 'error'); return; }
    setGenerating(true);
    const { data, error } = await dbService.createSodCoupon(selectedDept, user!.id);
    if (error) showToast('Failed to generate coupon.', 'error');
    else { showToast(`Coupon ${data.code} generated!`, 'success'); fetchAll(); }
    setGenerating(false);
  };

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteSodCoupon(id);
    if (error) showToast('Failed to delete coupon.', 'error');
    else { showToast('Coupon deleted.', 'info'); fetchAll(); }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Registrar Panel</p>
          <h1 className="text-3xl font-poppins font-bold">SOD Coupon Generator</h1>
          <p className="text-indigo-200 mt-2 text-sm">Generate single-use coupon codes for physical SOD registrations.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Generator Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-8 shadow-sm">
          <h2 className="text-lg font-bold text-indigo-900 dark:text-white mb-6 flex items-center gap-2">
            <Ticket size={20} className="text-primary" /> Generate New Coupon
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedDept}
              onChange={e => setSelectedDept(e.target.value)}
              className="flex-grow bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
            >
              <option value="">Select Department</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name} {d.fee > 0 ? `— ₦${d.fee.toLocaleString()}` : '— Free'}</option>
              ))}
            </select>
            <button
              onClick={handleGenerate}
              disabled={generating || !selectedDept}
              className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap"
            >
              {generating ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />}
              Generate Coupon
            </button>
          </div>
        </div>

        {/* Coupons List */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            <h2 className="font-bold text-indigo-900 dark:text-white">Generated Coupons</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader size={28} className="animate-spin text-primary" /></div>
          ) : coupons.length === 0 ? (
            <div className="text-center py-20">
              <Ticket size={40} className="mx-auto text-gray-300 dark:text-slate-600 mb-3" />
              <p className="text-gray-500 dark:text-gray-400">No coupons generated yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50 dark:divide-slate-700">
              {coupons.map((c: any) => (
                <div key={c.id} className="flex items-center justify-between px-6 py-4 gap-4">
                  <div className="flex items-center gap-4">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.used ? 'bg-red-400' : 'bg-emerald-400'}`} />
                    <div>
                      <p className="font-mono font-bold text-indigo-900 dark:text-white tracking-widest">{c.code}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {c.sod_departments?.name ?? '—'} • {c.used ? <span className="text-red-500 font-bold">Used by {c.used_by}</span> : <span className="text-emerald-600 font-bold">Available</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!c.used && (
                      <button onClick={() => handleCopy(c.code, c.id)} className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition">
                        {copiedId === c.id ? <CheckCircle size={16} className="text-primary" /> : <Copy size={16} />}
                      </button>
                    )}
                    {!c.used && (
                      <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrarSOD;
