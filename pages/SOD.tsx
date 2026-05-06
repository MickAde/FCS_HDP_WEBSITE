import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Quote, Sparkles, ChevronDown, Users, BookOpen, Loader, DollarSign, Ticket, FileQuestion, Clock
} from 'lucide-react';
import { dbService, SodDepartmentRow } from '../services/dbService';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

const SOD: React.FC = () => {
  const { user, profile } = useAuth();
  const [departments, setDepartments] = useState<SodDepartmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdownTarget, setCountdownTarget] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [countdownActive, setCountdownActive] = useState(false);
  const [exams, setExams] = useState<any[]>([]);
  const [studentReg, setStudentReg] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      dbService.getSodDepartments(),
      dbService.getSodSettings(),
    ]).then(async ([{ data: depts }, { data: settings }]) => {
      if (depts) setDepartments(depts);
      if (settings?.countdown_target) {
        const target = new Date(settings.countdown_target);
        if (target > new Date()) {
          setCountdownTarget(target);
          setCountdownActive(true);
        }
      }
      // Load exams for student's department
      if (user) {
        const { data: reg } = await supabase.from('sod_registrations').select('department_id').eq('user_id', user.id).maybeSingle();
        if (reg) {
          setStudentReg(reg);
          const { data: examData } = await dbService.getSodExamsByDepartment(reg.department_id);
          if (examData) setExams(examData);
        }
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!countdownActive || !countdownTarget) return;
    const calc = () => {
      const diff = countdownTarget.getTime() - Date.now();
      if (diff <= 0) { setCountdownActive(false); return; }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const timer = setInterval(calc, 1000);
    return () => clearInterval(timer);
  }, [countdownActive, countdownTarget]);

  return (
    <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white min-h-screen pb-20 transition-colors">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-indigo-950 dark:bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="SOD" className="w-full h-full object-cover opacity-70 scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/60 to-indigo-950 dark:via-slate-950/60 dark:to-slate-950" />
        </div>
        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-12">
            <Sparkles size={14} /> School of Destiny
          </div>
          <h1 className="text-5xl md:text-8xl font-poppins font-black mb-8 leading-tight tracking-tight text-white">
            Discover Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Destiny.</span>
          </h1>
          <p className="text-indigo-200 dark:text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            An intensive school designed to shape identity, build character, and launch purpose. Choose your department and begin your journey.
          </p>
          <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mb-16">
            {countdownActive ? (
              [{ label: 'Days', value: timeLeft.days }, { label: 'Hours', value: timeLeft.hours }, { label: 'Minutes', value: timeLeft.minutes }, { label: 'Seconds', value: timeLeft.seconds }].map((u, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-2xl">
                  <div className="text-3xl md:text-6xl font-black text-white mb-2 font-mono tabular-nums">
                    {String(u.value).padStart(2, '0')}
                  </div>
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">{u.label}</div>
                </div>
              ))
            ) : (
              [{ label: 'Days' }, { label: 'Hours' }, { label: 'Minutes' }, { label: 'Seconds' }].map((u, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-2xl">
                  <div className="text-3xl md:text-6xl font-black text-white/20 mb-2 font-mono tabular-nums">--</div>
                  <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">{u.label}</div>
                </div>
              ))
            )}
          </div>
          {!countdownActive && (
            <p className="text-emerald-400/70 text-sm font-bold uppercase tracking-widest mb-8">⏳ Countdown begins soon</p>
          )}
          <Link to="/sod/register" className="group relative inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40">
            Register Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="mt-20 animate-bounce"><ChevronDown size={32} className="mx-auto text-indigo-400 dark:text-gray-600" /></div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Choose Your Path</span>
          <h2 className="text-4xl md:text-5xl font-poppins font-bold text-indigo-900 dark:text-white">Departments</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-xl mx-auto">Each department is a focused track led by experienced facilitators. Pick the one that aligns with your calling.</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><Loader size={32} className="animate-spin text-primary" /></div>
        ) : departments.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
            <BookOpen size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Departments will be announced soon. Check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map(dept => (
              <div key={dept.id} className="group bg-white dark:bg-slate-800 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
                {dept.image_url ? (
                  <div className="h-44 overflow-hidden">
                    <img src={dept.image_url} alt={dept.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-indigo-900 to-primary flex items-center justify-center">
                    <BookOpen size={48} className="text-white/40" />
                  </div>
                )}
                <div className="p-8 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3">{dept.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed flex-grow">{dept.description}</p>
                  {dept.teachers.length > 0 && (
                    <div className="mt-5 flex items-center gap-2 flex-wrap">
                      <Users size={14} className="text-primary flex-shrink-0" />
                      {dept.teachers.map((t, i) => (
                        <span key={i} className="text-xs bg-emerald-50 dark:bg-emerald-950/20 text-primary px-2.5 py-1 rounded-full font-medium">{t}</span>
                      ))}
                    </div>
                  )}
                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1 font-bold text-indigo-900 dark:text-white">
                      <DollarSign size={16} className="text-primary" />
                      {dept.fee === 0 ? <span className="text-primary">Free</span> : `₦${dept.fee.toLocaleString()}`}
                    </div>
                    <Link to={`/sod/register?dept=${dept.id}`}
                      className="flex items-center gap-1.5 text-primary font-bold text-sm hover:gap-2.5 transition-all">
                      Register <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Exams Section — only shown to registered students with published exams */}
      {user && studentReg && exams.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">Your Exams</span>
            <h2 className="text-4xl font-poppins font-bold text-indigo-900 dark:text-white">Available Exams</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map(exam => (
              <div key={exam.id} className="bg-white dark:bg-slate-800 rounded-[2rem] border border-gray-100 dark:border-slate-700 p-7 shadow-sm hover:shadow-lg transition-all flex flex-col gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FileQuestion size={24} className="text-primary" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-indigo-900 dark:text-white text-lg mb-1">{exam.title}</h3>
                  {exam.description && <p className="text-sm text-gray-500 dark:text-gray-400">{exam.description}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                    <Clock size={13} /> {exam.duration_minutes} min
                  </span>
                  <Link to={`/sod/exam/${exam.id}`}
                    className="flex items-center gap-1.5 bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition">
                    Take Exam <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Testimonials */}
      <section className="py-24 bg-gray-50 dark:bg-slate-800/30 border-y border-gray-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-indigo-900 dark:text-white mb-16">Voices of Transformation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'David Adeleke', role: 'Class of 2022', text: 'I walked in with questions and walked out with a mandate. SOD was the single most important decision of my university years.', img: 'https://picsum.photos/seed/sod1/100' },
              { name: 'Sarah Omotayo', role: 'Final Year Student', text: 'The discipline I learned during those 14 days is what sustained me through the toughest exams. It\'s more than spiritual; it\'s total growth.', img: 'https://picsum.photos/seed/sod2/100' },
            ].map((t, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                <div>
                  <Quote size={48} className="text-primary/20 mb-6" fill="currentColor" />
                  <p className="text-xl md:text-2xl font-medium leading-relaxed italic mb-8 text-gray-700 dark:text-gray-200">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-14 h-14 rounded-2xl object-cover" />
                  <div>
                    <h4 className="font-bold text-lg text-indigo-900 dark:text-white">{t.name}</h4>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-emerald-900 p-12 md:p-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-8 text-white">Don't Miss Your Turn.</h2>
            <p className="text-emerald-100 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">Slots are limited. Register for your department today.</p>
            <Link to="/sod/register" className="inline-block bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl">
              Register Now
            </Link>
            <Link to="/sod/card" className="inline-block bg-white/10 border border-white/20 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md">
              Retrieve ID Card
            </Link>
            {['admin', 'leader', 'registrar'].includes(profile?.role ?? '') && (
              <Link to="/registrar/sod" className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all backdrop-blur-md">
                <Ticket size={20} /> Generate Coupon
              </Link>
            )}
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 blur-[80px] rounded-full -ml-24 -mb-24" />
        </div>
      </section>
    </div>
  );
};

export default SOD;
