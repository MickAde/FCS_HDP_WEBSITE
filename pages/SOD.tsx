
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Compass, 
  Map, 
  Award, 
  ArrowRight,
  Quote,
  Flame,
  Sparkles,
  ChevronDown,
  BellRing
} from 'lucide-react';

const { Link } = ReactRouterDOM;

const SOD: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 22 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const preparationSteps = [
    { title: "Consecration", desc: "Start setting aside specific times for prayer as we approach the start date." },
    { title: "Academic Planning", desc: "Organize your studies now to create space for this 2-week intensive journey." },
    { title: "Open Heart", desc: "Come with zero expectations from man, but 100% expectation from God." }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white min-h-screen pb-20 transition-colors">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-indigo-950 dark:bg-slate-950">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Expectation" 
            className="w-full h-full object-cover opacity-20 scale-110" 
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/60 to-indigo-950 dark:via-slate-950/60 dark:to-slate-950"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-emerald-400 text-xs font-bold uppercase tracking-[0.3em] mb-12 animate-in fade-in slide-in-from-bottom duration-700">
            <Sparkles size={14} /> The Wait is Almost Over
          </div>
          
          <h1 className="text-5xl md:text-8xl font-poppins font-black mb-8 leading-tight tracking-tight text-white">
            Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-primary">Life-Changing</span> is Coming.
          </h1>
          
          <p className="text-indigo-200 dark:text-gray-400 text-lg md:text-2xl max-w-3xl mx-auto mb-16 font-light leading-relaxed">
            School of Destiny 2024. Fourteen days that will redefine your identity, refine your character, and launch your purpose.
          </p>

          {/* Countdown Timer */}
          <div className="grid grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto mb-16">
            {[
              { label: 'Days', value: timeLeft.days },
              { label: 'Hours', value: timeLeft.hours },
              { label: 'Minutes', value: timeLeft.minutes },
              { label: 'Seconds', value: timeLeft.seconds },
            ].map((unit, idx) => (
              <div key={idx} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[2rem] shadow-2xl">
                <div className="text-3xl md:text-6xl font-black text-white mb-2 font-mono tabular-nums">
                  {unit.value < 10 ? `0${unit.value}` : unit.value}
                </div>
                <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-primary">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link 
              to="/sod/register" 
              className="group relative bg-primary text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-900/40 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Join the Waiting List <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </Link>
            <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all backdrop-blur-md">
              <BellRing size={20} className="text-emerald-400" /> Get Notifications
            </button>
          </div>
          
          <div className="mt-20 animate-bounce">
            <ChevronDown size={32} className="mx-auto text-indigo-400 dark:text-gray-600" />
          </div>
        </div>
      </section>

      {/* Anticipation Content */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-6 block">The Transformation</span>
            <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-8 leading-tight text-indigo-900 dark:text-white">
              Prepare Your <br/>Heart for the <span className="italic text-emerald-500 dark:text-emerald-400">Encounter</span>.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-10 leading-relaxed">
              SOD is not just a seminar. It's a spiritual crucible. Those who have gone before describe it as the "turning point" of their campus life. We are creating space for 500 students to step into their divine assignments.
            </p>
            
            <div className="space-y-8">
              {preparationSteps.map((step, idx) => (
                <div key={idx} className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Flame size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2 text-indigo-900 dark:text-white">{step.title}</h4>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                alt="Community" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <p className="text-2xl font-bold mb-1">Coming This November</p>
                <p className="text-sm opacity-80">Gidan Kwano Campus • Intensive 14 Days</p>
              </div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/20 blur-3xl rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Expectation Cards */}
      <section className="py-32 bg-gray-50 dark:bg-slate-800/30 border-y border-gray-100 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold mb-6 text-indigo-900 dark:text-white">What to Expect</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">The curriculum is designed to break limitations and build vision.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Compass, title: "Divine Identity", desc: "Discover who you were created to be before the world told you otherwise." },
              { icon: Map, title: "Life Roadmap", desc: "Gain absolute clarity on your career, relationships, and ministry path." },
              { icon: Award, title: "Leadership Mastery", desc: "Practical skills to influence your sphere of influence with integrity." }
            ].map((item, idx) => (
              <div key={idx} className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 hover:shadow-xl transition-all duration-500">
                <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                  <item.icon size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-indigo-900 dark:text-white">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
          <h2 className="text-3xl md:text-5xl font-poppins font-bold text-indigo-900 dark:text-white">Voices of <br/>Transformation</h2>
          <div className="flex gap-4">
            <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300">
              <ArrowRight size={20} className="rotate-180" />
            </button>
            <button className="w-12 h-12 rounded-full border border-gray-200 dark:border-slate-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300">
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            {
              name: "David Adeleke",
              role: "Class of 2022",
              text: "I walked in with questions and walked out with a mandate. SOD was the single most important decision of my university years.",
              img: "https://picsum.photos/seed/sod1/100"
            },
            {
              name: "Sarah Omotayo",
              role: "Final Year Student",
              text: "The discipline I learned during those 14 days is what sustained me through the toughest exams. It's more than spiritual; it's total growth.",
              img: "https://picsum.photos/seed/sod2/100"
            }
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
      </section>

      {/* Final CTA */}
      <section className="py-32 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary to-emerald-900 p-12 md:p-20 rounded-[4rem] text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-poppins font-bold mb-8 text-white">Don't Miss Your Turn.</h2>
            <p className="text-emerald-100 text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Slots are limited and the demand is high. Join the waiting list now to get early access to registration.
            </p>
            <Link 
              to="/sod/register" 
              className="inline-block bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl"
            >
              Secure My Spot on the List
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 blur-[80px] rounded-full -ml-24 -mb-24"></div>
        </div>
      </section>
    </div>
  );
};

export default SOD;
