import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft, User, Mail, Phone, BookOpen,
  CheckCircle, Loader, Download, CreditCard, AlertCircle
} from 'lucide-react';
import PaystackPop from '@paystack/inline-js';
import html2canvas from 'html2canvas';
import { dbService, SodDepartmentRow, SodRegistrationRow } from '../services/dbService';
import { supabase } from '../lib/supabase';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY ?? '';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

const generateStudentId = () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `SOD${year}-${rand}`;
};

const IDCard: React.FC<{ reg: SodRegistrationRow; deptName: string; localPhoto?: string }> = ({ reg, deptName, localPhoto }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [logoSrc, setLogoSrc] = useState<string>('/assets/icon.png');
  const [photoSrc, setPhotoSrc] = useState<string | null>(localPhoto ?? null);
  const initials = reg.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const issueDate = new Date(reg.created_at ?? Date.now()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  const toBase64 = (url: string): Promise<string> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext('2d')!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = url + (url.includes('?') ? '&' : '?') + 't=' + Date.now();
    });

  useEffect(() => {
    toBase64('/assets/icon.png').then(setLogoSrc).catch(() => {});
    // Only fetch from URL if no local base64 was passed
    if (!localPhoto && reg.photo_url) {
      toBase64(reg.photo_url).then(setPhotoSrc).catch(() => {});
    }
  }, [reg.photo_url, localPhoto]);

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
      <div
        ref={cardRef}
        style={{
          width: '680px', height: '420px', borderRadius: '16px',
          overflow: 'hidden', position: 'relative', display: 'flex',
          flexShrink: 0, boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}
      >
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-64px', right: '-64px', width: '256px', height: '256px', borderRadius: '50%', background: 'rgba(16,185,129,0.08)' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '288px', height: '288px', borderRadius: '50%', background: 'rgba(99,102,241,0.08)' }} />
        {/* Left accent bar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '5px', background: 'linear-gradient(to bottom, #34d399, #10b981, #059669)' }} />

        {/* LEFT PANEL */}
        <div style={{ width: '208px', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '0 24px', boxSizing: 'border-box' }}>
          <div style={{ width: '96px', height: '96px', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(52,211,153,0.6)', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {photoSrc
              ? <img src={photoSrc} alt={reg.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '32px', fontWeight: 900, color: '#fff' }}>{initials}</span>
            }
          </div>
          <div style={{ textAlign: 'center', marginTop: '4px' }}>
            <p style={{ fontSize: '9px', color: 'rgba(52,211,153,0.7)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700, margin: 0 }}>Student ID</p>
            <p style={{ fontFamily: 'monospace', fontWeight: 900, color: '#34d399', fontSize: '13px', letterSpacing: '0.1em', margin: '2px 0 0' }}>{reg.student_id}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', padding: '5px 14px', borderRadius: '999px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399', flexShrink: 0, display: 'inline-block', verticalAlign: 'middle' }} />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'inline-block', verticalAlign: 'middle', lineHeight: '10px' }}>Verified</span>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 32px', boxSizing: 'border-box' }}>
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
          <div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 4px' }}>Program</p>
            <h2 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: '0 0 4px', lineHeight: 1.1 }}>School of <span style={{ color: '#34d399' }}>Destiny</span></h2>
            <p style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{deptName}</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 24px' }}>
            {[{ label: 'Full Name', value: reg.full_name }, { label: 'Issue Date', value: issueDate }].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 2px', lineHeight: 1.2 }}>{label}</p>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.3, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{value}</p>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.25)', margin: 0 }}>This card is the property of FCS Futminna. If found, please return.</p>
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
        className="flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
      >
        <Download size={18} /> Download ID Card
      </button>
    </div>
  );
};

const SODRegister: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [departments, setDepartments] = useState<SodDepartmentRow[]>([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registration, setRegistration] = useState<SodRegistrationRow | null>(null);
  const [selectedDept, setSelectedDept] = useState<SodDepartmentRow | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [couponCode, setCouponCode] = useState('');
  const [couponValid, setCouponValid] = useState<boolean | null>(null);
  const [couponChecking, setCouponChecking] = useState(false);
  const [couponDept, setCouponDept] = useState<SodDepartmentRow | null>(null);
  const [couponId, setCouponId] = useState<string | null>(null);

  const handlePhotoChange = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      showToast('Image must be 10MB or less.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => setPhotoUrl(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadPhoto = async (studentId: string): Promise<string | null> => {
    if (!photoUrl || !photoUrl.startsWith('data:')) return null;
    const res = await fetch(photoUrl);
    const blob = await res.blob();
    const ext = blob.type.split('/')[1] || 'jpg';
    const path = `${studentId}.${ext}`;
    const { data, error } = await supabase.storage.from('sod-photos').upload(path, blob, { upsert: true, contentType: blob.type });
    if (error) {
      showToast(`Photo upload failed: ${error.message}`, 'error');
      console.error('Photo upload error:', error);
      return null;
    }
    const { data: urlData } = supabase.storage.from('sod-photos').getPublicUrl(path);
    return urlData.publicUrl;
  };

  const [form, setForm] = useState({
    department_id: searchParams.get('dept') ?? '',
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    if (authLoading) return;
    const init = async () => {
      if (user) {
        const { data } = await supabase.from('sod_registrations').select('id').eq('user_id', user.id).maybeSingle();
        if (data) { setAlreadyRegistered(true); setLoadingDepts(false); return; }
      }
      const { data } = await dbService.getSodDepartments();
      if (data) {
        setDepartments(data);
        const preselect = searchParams.get('dept');
        if (preselect) setSelectedDept(data.find(d => d.id === preselect) ?? null);
      }
      setLoadingDepts(false);
    };
    init();
  }, [user, authLoading]);

  useEffect(() => {
    if (form.department_id) {
      setSelectedDept(departments.find(d => d.id === form.department_id) ?? null);
    }
  }, [form.department_id, departments]);

  const [paystackReady] = useState(true); // always ready with npm package

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.department_id || !form.full_name || !form.email || !form.phone) {
      showToast('Please fill all fields.', 'error'); return;
    }
    if (!selectedDept) { showToast('Please select a department.', 'error'); return; }

    const studentId = generateStudentId();

    // Use already-validated coupon state; only re-check if user typed a code but never clicked Validate
    let validCoupon = false;
    if (couponCode.trim()) {
      if (couponValid === true) {
        validCoupon = true;
      } else {
        const { data: couponData, error: couponError } = await dbService.validateSodCoupon(couponCode);
        if (couponError || !couponData) {
          showToast('Invalid or already used coupon code.', 'error');
          setProcessing(false);
          return;
        }
        validCoupon = true;
      }
    }

    if (selectedDept.fee > 0 && !validCoupon) {
      if (!PAYSTACK_PUBLIC_KEY) {
        showToast('Paystack public key not configured.', 'error');
        return;
      }

      const paystack = new PaystackPop();
      paystack.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email,
        amount: selectedDept.fee * 100,
        currency: 'NGN',
        ref: `SOD-${studentId}-${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: 'Name', variable_name: 'name', value: form.full_name },
            { display_name: 'Department', variable_name: 'department', value: selectedDept.name },
          ],
        },
        onSuccess: async (transaction: { reference: string }) => {
          setProcessing(true);
          const uploadedPhotoUrl = await uploadPhoto(studentId);
          await verifyAndSave(studentId, transaction.reference, selectedDept.fee, uploadedPhotoUrl);
        },
        onCancel: () => showToast('Payment cancelled.', 'info'),
      });
    } else {
      // Free department or valid coupon — save directly
      setProcessing(true);
      const uploadedPhotoUrl = await uploadPhoto(studentId);
      const payload: Omit<SodRegistrationRow, 'id' | 'created_at'> = {
        department_id: form.department_id,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        level: '',
        faculty_dept: '',
        paystack_ref: null,
        payment_status: 'paid',
        student_id: studentId,
        photo_url: uploadedPhotoUrl,
        coupon_code: validCoupon ? couponCode.toUpperCase() : null,
        user_id: user?.id ?? null,
      };
      const { data, error } = await dbService.createSodRegistration(payload);
      if (error) showToast(error.message ?? 'Registration failed.', 'error');
      else if (data) {
        if (validCoupon) await dbService.markCouponUsed(couponCode, form.email, couponId ?? undefined);
        setRegistration(data);
      }
      setProcessing(false);
    }
  };

  const verifyAndSave = async (studentId: string, reference: string, expectedAmount: number, uploadedPhotoUrl: string | null = null) => {
    try {
      const url = `${SUPABASE_URL}/functions/v1/hyper-handler`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          reference,
          registration: {
            department_id: form.department_id,
            full_name: form.full_name,
            email: form.email,
            phone: form.phone,
            level: '',
            faculty_dept: '',
            student_id: studentId,
            expected_amount: expectedAmount,
            photo_url: uploadedPhotoUrl,
            user_id: user?.id ?? null,
          },
        }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        showToast(result.error ?? 'Payment verification failed.', 'error');
      } else {
        // Patch user_id from frontend since edge function may not have it
        if (user?.id && result.data?.id) {
          await supabase.from('sod_registrations').update({ user_id: user.id }).eq('id', result.data.id);
        }
        setRegistration(result.data);
        if (couponCode.trim() && couponValid) await dbService.markCouponUsed(couponCode, form.email, couponId ?? undefined);
      }
    } catch (err) {
      showToast(`Network error: ${String(err)}`, 'error');
    }
    setProcessing(false);
  };

  if (registration && selectedDept) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-24 transition-colors">
        <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} />
            </div>
            <h1 className="text-4xl font-poppins font-bold mb-3">Registration Complete!</h1>
            <p className="text-indigo-200 dark:text-gray-400 max-w-md mx-auto">Welcome to the School of Destiny. Your ID card is ready below.</p>
          </div>
        </section>
        <div className="max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-10 overflow-x-auto">
          <IDCard reg={registration} deptName={selectedDept.name} localPhoto={photoUrl || undefined} />
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Lost your card? You can always retrieve it at{' '}
            <Link to="/sod/card" className="text-primary font-bold hover:underline">/sod/card</Link>{' '}using your Student ID or email.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
            <Link to="/sod" className="flex-1 text-center py-3 rounded-xl border border-gray-200 dark:border-slate-700 font-bold text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition">Back to SOD</Link>
            <Link to="/" className="flex-1 text-center py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  if (authLoading || (user && loadingDepts && !alreadyRegistered && !registration)) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (alreadyRegistered) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700">
          <div className="w-20 h-20 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">Already Registered</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">You have already registered for SOD this session. You can retrieve your ID card below.</p>
          <Link to="/sod/card" className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition">
            Retrieve ID Card
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors">
      <section className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/sod" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to SOD
          </Link>
          <h1 className="text-4xl font-poppins font-bold mb-4">Register for SOD</h1>
          <p className="text-indigo-200 dark:text-gray-400 max-w-xl mx-auto">Choose your department and complete your registration. Payment is processed securely via Paystack.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32" />
      </section>

      <div className="max-w-2xl mx-auto px-4 -mt-10 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-slate-700 transition-colors">
          <div className="p-8 md:p-10 space-y-8">

            {/* Coupon Code */}
            <div className="space-y-3">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <CreditCard size={16} /> Coupon Code
              </h3>
              <input
                type="text"
                value={couponCode}
                onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponValid(null); }}
                className="w-full bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary dark:text-white uppercase"
              />
              <button
                type="button"
                onClick={async () => {
                  if (!couponCode.trim()) { showToast('Enter a coupon code.', 'error'); return; }
                  setCouponChecking(true);
                  const { data, error } = await dbService.validateSodCoupon(couponCode);
                  setCouponChecking(false);
                  if (error || !data) {
                    setCouponValid(false);
                    setCouponDept(null);
                    showToast('Invalid or already used coupon.', 'error');
                  } else {
                    setCouponValid(true);
                    setCouponDept(data.sod_departments as SodDepartmentRow);
                    setCouponId(data.id);
                    setForm(f => ({ ...f, department_id: data.department_id }));
                    setSelectedDept(data.sod_departments as SodDepartmentRow);
                    showToast(`Coupon valid! Department: ${data.sod_departments.name}`, 'success');
                  }
                }}
                disabled={couponChecking || !couponCode}
                className="w-full py-3 rounded-xl text-sm font-bold border-2 border-primary text-primary hover:bg-primary hover:text-white transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {couponChecking ? <><Loader size={16} className="animate-spin" /> Validating...</> : 'Validate Coupon'}
              </button>
              {couponValid === true && couponDept && <p className="text-emerald-600 text-xs font-bold flex items-center gap-1"><CheckCircle size={13} /> Valid — {couponDept.name} (payment waived)</p>}
              {couponValid === false && <p className="text-red-500 text-xs font-bold">✗ Invalid or already used</p>}
            </div>

            {/* Department Selection */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <BookOpen size={16} /> Select Department
              </h3>
              {couponValid && couponDept ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl border-2 border-primary bg-emerald-50 dark:bg-emerald-950/20">
                  <CheckCircle size={18} className="text-primary flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-bold text-indigo-900 dark:text-white text-sm">{couponDept.name}</p>
                    <p className="text-xs text-primary font-bold">Auto-selected via coupon — Free</p>
                  </div>
                </div>
              ) : loadingDepts ? (
                <div className="flex items-center justify-center py-8"><Loader size={24} className="animate-spin text-primary" /></div>
              ) : departments.length === 0 ? (
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-100 dark:border-amber-900/50 text-amber-700 dark:text-amber-400 text-sm">
                  <AlertCircle size={18} className="flex-shrink-0" />
                  No departments available yet. Check back soon.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {departments.map(dept => (
                    <label key={dept.id}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${form.department_id === dept.id ? 'border-primary bg-emerald-50 dark:bg-emerald-950/20' : 'border-gray-100 dark:border-slate-700 hover:border-primary/40'}`}>
                      <input type="radio" name="department" value={dept.id} checked={form.department_id === dept.id}
                        onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))} className="accent-primary w-4 h-4" />
                      <div className="flex-grow min-w-0">
                        <p className="font-bold text-indigo-900 dark:text-white text-sm">{dept.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{dept.description}</p>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${dept.fee === 0 ? 'text-primary' : 'text-indigo-900 dark:text-white'}`}>
                        {dept.fee === 0 ? 'Free' : `₦${dept.fee.toLocaleString()}`}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Photo Upload */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <User size={16} /> Profile Photo <span className="normal-case font-normal text-gray-400 text-xs">(optional — appears on ID card)</span>
              </h3>
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-slate-700 border-2 border-dashed border-gray-200 dark:border-slate-600 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {photoUrl
                    ? <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    : <User size={28} className="text-gray-300 dark:text-slate-500" />
                  }
                </div>
                <div className="flex-grow">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoChange(file);
                    }}
                    className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-emerald-50 file:text-primary dark:file:bg-emerald-950/20 hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">JPG or PNG, max 10MB. Will appear on your ID card.</p>
                </div>
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                      placeholder="e.g. Samuel Adekunle"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Email *</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="you@example.com"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5">Phone (WhatsApp) *</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+234 812 345 6789"
                      className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white" />
                  </div>
                </div>
              </div>
            </div>



          </div>

          {/* Footer */}
          <div className="p-8 md:p-10 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              {selectedDept && selectedDept.fee > 0 && !couponValid ? (
                <div className="flex items-center gap-2 text-sm font-bold text-indigo-900 dark:text-white">
                  <CreditCard size={16} className="text-primary" />
                  You will be charged <span className="text-primary">₦{selectedDept.fee.toLocaleString()}</span> via Paystack
                </div>
              ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">Your unique ID card will be generated after registration.</p>
              )}
            </div>
            <button type="submit" disabled={processing || loadingDepts || (departments.length === 0 && !couponValid)}
              className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold shadow-xl transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed">
              {processing
                ? <><Loader size={18} className="animate-spin" /> Processing...</>
                : selectedDept && selectedDept.fee > 0 && !couponValid
                ? <><CreditCard size={18} /> Pay & Register</>
                : 'Complete Registration'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SODRegister;
