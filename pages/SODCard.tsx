import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Download, Loader, AlertCircle, IdCard, ShieldAlert, LogIn } from 'lucide-react';
import html2canvas from 'html2canvas';
import { supabase } from '../lib/supabase';
import { SodRegistrationRow } from '../services/dbService';
import { useAuth } from '../context/AuthContext';

const IDCard: React.FC<{ reg: SodRegistrationRow & { sod_departments: { name: string } }; }> = ({ reg }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [logoSrc, setLogoSrc] = useState<string>('/assets/icon.png');
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const deptName = reg.sod_departments?.name ?? '—';
  const initials = reg.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const issueDate = new Date(reg.created_at ?? Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const toBase64 = async (url: string): Promise<string> => {
    // Extract the storage path from the public URL
    const match = url.match(/sod-photos\/(.+)$/);
    console.log('toBase64 called with:', url, 'match:', match);
    if (match) {
      const { data, error } = await supabase.storage.from('sod-photos').download(match[1]);
      console.log('storage download result:', { data, error });
      if (data && !error) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(data);
        });
      }
    }
    // Fallback: try Image + canvas
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (e) => { console.log('Image fallback failed:', e); reject(e); };
      img.src = url;
    });
  };

  useEffect(() => {
    // Logo is a local asset, use canvas approach
    new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = '/assets/icon.png';
    }).then(setLogoSrc).catch(() => {});

    if (reg.photo_url) toBase64(reg.photo_url).then(setPhotoSrc).catch(() => {});
  }, [reg.photo_url]);

  const handleDownload = async () => {
    const el = cardRef.current;
    if (!el) return;
    const canvas = await html2canvas(el, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#0f172a',
      logging: false,
      imageTimeout: 0,
      onclone: (doc) => {
        doc.querySelectorAll('link[rel="stylesheet"], style').forEach(s => s.remove());
      },
    });
    const link = document.createElement('a');
    link.download = `SOD-ID-${reg.student_id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', width: '100%' }}>
      {/* Card with fully inline styles so html2canvas captures it correctly */}
      <div
        id="sod-id-card-retrieve"
        ref={cardRef}
        style={{
          width: '680px',
          height: '420px',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          display: 'flex',
          flexShrink: 0,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '256px', height: '256px', borderRadius: '50%', background: 'rgba(16,185,129,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '288px', height: '288px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)' }} />

        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'linear-gradient(to bottom, #34d399, #10b981, #059669)' }} />

        {/* LEFT PANEL */}
        <div style={{
          width: '208px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          borderRight: '1px solid rgba(255,255,255,0.1)',
          padding: '0 24px',
          boxSizing: 'border-box',
        }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(52,211,153,0.6)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {photoSrc
              ? <img src={photoSrc} alt={reg.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>{initials}</span>
            }
          </div>

          {/* Student ID */}
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '9px', color: 'rgba(52,211,153,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, margin: 0 }}>Student ID</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, color: '#34d399', fontSize: '13px', letterSpacing: '0.1em', margin: '2px 0 0' }}>{reg.student_id}</p>
          </div>

          {/* Verified badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', padding: '5px 14px', borderRadius: '999px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', verticalAlign: 'middle', lineHeight: '10px' }}>Verified</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 32px', boxSizing: 'border-box' }}>
          {/* Header */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
              <img src={logoSrc} alt="FCS" style={{ width: '44px', height: '44px', objectFit: 'contain', flexShrink: 0 }} />
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.3em', color: '#34d399', margin: '0 0 2px' }}>Fellowship of Christian Students</p>
                <p style={{ fontSize: '9px', color: 'rgba(52,211,153,0.6)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 2px', fontStyle: 'italic', fontWeight: 600 }}>His Dwelling Place [HDP]</p>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0 }}>Federal University of Technology, Minna</p>
              </div>
            </div>
            <div style={{ marginTop: '10px', height: '1px', background: 'linear-gradient(to right, rgba(16,185,129,0.5), transparent)' }} />
          </div>

          {/* Program */}
          <div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Program</p>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.1 }}>
              School of{' '}
              <span style={{ color: '#34d399' }}>Destiny</span>
            </h2>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{deptName}</p>
          </div>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {[{ label: 'Full Name', value: reg.full_name }, { label: 'Level', value: reg.level }, { label: 'Faculty / Dept', value: reg.faculty_dept }, { label: 'Issue Date', value: issueDate }].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 2px', lineHeight: 1.2 }}>{label}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', margin: 0, maxWidth: '300px' }}>This card is the property of FCS Futminna. If found, please return.</p>
            <div style={{ display: 'flex', gap: '3px', alignItems: 'flex-end' }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ width: '4px', borderRadius: '2px', background: i % 2 === 0 ? '#10b981' : 'rgba(255,255,255,0.15)', height: `${8 + (i % 3) * 4}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-emerald-900/20"
      >
        <Download size={18} /> Download ID Card
      </button>
    </div>
  );
};

const SODCard: React.FC = () => {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [notOwner, setNotOwner] = useState(false);

  // If not logged in, show login prompt
  if (!user) {
    return (
      <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors">
        <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <Link to="/sod" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition group">
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to SOD
            </Link>
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IdCard size={32} className="text-emerald-400" />
            </div>
            <h1 className="text-4xl font-poppins font-bold mb-3">Retrieve Your ID Card</h1>
          </div>
        </section>
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldAlert size={32} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3">Sign in Required</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            You must be signed in to retrieve your SOD ID card. This ensures your card is only accessible to you.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg">
            <LogIn size={18} /> Sign In to Continue
          </Link>
        </div>
      </div>
    );
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setNotFound(false);
    setNotOwner(false);
    setResults([]);

    const q = query.trim().toUpperCase();
    const { data } = await supabase
      .from('sod_registrations')
      .select('*, sod_departments(name)')
      .or(`student_id.eq.${q},email.eq.${query.trim().toLowerCase()}`)
      .eq('payment_status', 'paid');

    if (!data || data.length === 0) {
      setNotFound(true);
    } else if (data[0].email.toLowerCase() !== user.email.toLowerCase()) {
      setNotOwner(true);
    } else {
      setResults(data);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors">
      <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/sod" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to SOD
          </Link>
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <IdCard size={32} className="text-emerald-400" />
          </div>
          <h1 className="text-4xl font-poppins font-bold mb-3">Retrieve Your ID Card</h1>
          <p className="text-indigo-200 dark:text-gray-400 max-w-md mx-auto">
            Enter your Student ID (e.g. <span className="font-mono font-bold text-emerald-400">SOD25-AB3XY</span>) or the email you registered with.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
      </section>

      <div className="max-w-xl mx-auto px-4 -mt-8 relative z-20">
        <form onSubmit={handleSearch} className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700 p-6 flex gap-3">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setNotFound(false); setNotOwner(false); setResults([]); }}
              placeholder="Student ID or your registered email"
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3.5 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
            {loading ? 'Searching...' : 'Find Card'}
          </button>
        </form>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {notFound && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 bg-red-50 dark:bg-red-950/20 rounded-2xl flex items-center justify-center">
              <AlertCircle size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white">No registration found</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              We couldn't find a paid registration matching <span className="font-bold text-indigo-900 dark:text-white">"{query}"</span>. Check the ID or email and try again.
            </p>
            <Link to="/sod/register" className="mt-2 text-primary font-bold text-sm hover:underline">
              Register for SOD →
            </Link>
          </div>
        )}

        {notOwner && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/20 rounded-2xl flex items-center justify-center">
              <ShieldAlert size={32} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white">Access Denied</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              This ID card does not belong to your account. You can only retrieve your own SOD ID card. If you believe this is an error, please contact the fellowship admin.
            </p>
          </div>
        )}

        {results.length > 0 && (
          <div className="flex flex-col items-center gap-12">
            {results.length > 1 && (
              <div className="text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Found <span className="font-bold text-indigo-900 dark:text-white">{results.length} registrations</span> for your account</p>
                <p className="text-xs text-gray-400">Scroll down to see all your ID cards</p>
              </div>
            )}
            {results.map((reg, idx) => (
              <div key={reg.id} className="flex flex-col items-center gap-4 w-full overflow-x-auto">
                {results.length > 1 && (
                  <p className="text-sm font-bold text-indigo-900 dark:text-white">
                    {idx + 1}. {reg.sod_departments?.name ?? 'Department'}
                  </p>
                )}
                <IDCard reg={reg} />
              </div>
            ))}
          </div>
        )}

        {!results.length && !notFound && !notOwner && !loading && (
          <div className="flex flex-col items-center gap-4 py-16 text-center text-gray-400 dark:text-slate-600">
            <IdCard size={56} strokeWidth={1} />
            <p className="text-sm">Your ID card will appear here after searching.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SODCard;
