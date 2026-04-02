
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight,
  CheckCircle2, 
  Clock, 
  Info, 
  Calendar,
  Zap,
  Loader,
  Theater, 
  Users, 
  CalendarDays, 
  Wrench, 
  Music, 
  Camera, 
  Mic2, 
  HeartHandshake,
  ShieldCheck,
  Flame,
  Utensils,
  LucideIcon
} from 'lucide-react';
import { dbService, UnitRow } from '../services/dbService';

const { useParams, useNavigate, Link } = ReactRouterDOM;

const ICON_MAP: Record<string, LucideIcon> = {
  Theater, Users, CalendarDays, Wrench, Music, Camera,
  Mic2, HeartHandshake, ShieldCheck, Zap, Flame, Utensils,
};

const UnitDetail: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  const [unit, setUnit] = useState<UnitRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!unitId) return;
    dbService.getUnit(unitId).then(({ data, error }) => {
      if (!error && data) setUnit(data as UnitRow);
      setLoading(false);
    });
  }, [unitId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  if (!unit) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors">
      <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-4">Unit not found</h2>
      <button onClick={() => navigate('/units')} className="text-primary font-bold hover:underline">Back to Units</button>
    </div>
  );

  const Icon = ICON_MAP[unit.icon] ?? Users;

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      {/* Hero */}
      <div className="bg-indigo-900 dark:bg-slate-950 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <button 
            onClick={() => navigate('/units')}
            className="flex items-center text-indigo-200 dark:text-gray-400 hover:text-white mb-8 transition group"
          >
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Units
          </button>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className={`w-24 h-24 ${unit.color} rounded-[2rem] flex items-center justify-center shadow-xl`}>
              <Icon size={48} />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4 text-white">{unit.name}</h1>
              <p className="text-indigo-200 dark:text-gray-400 text-lg max-w-2xl leading-relaxed">
                {unit.description}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/10 blur-[100px] rounded-full -mr-48 -mb-48"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-6 flex items-center border-b border-gray-100 dark:border-slate-700 pb-4">
                <Info size={24} className="mr-3 text-primary" /> About the Unit
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg mb-8">
                {unit.long_description ?? unit.description}
              </p>
              
              {unit.activities.length > 0 && (
                <>
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-white mb-6 uppercase tracking-wider">Activities & Impact</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {unit.activities.map((activity, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl border border-emerald-50 dark:border-emerald-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-colors">
                        <CheckCircle2 size={18} className="text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{activity}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </section>

            {unit.meetings && (
              <section className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-6 flex items-center">
                  <Clock size={24} className="mr-3 text-primary" /> Meeting Schedule
                </h2>
                <div className="flex items-center gap-4 bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm">
                  <Calendar className="text-primary" size={32} />
                  <div>
                    <p className="text-indigo-900 dark:text-white font-bold text-lg">{unit.meetings}</p>
                    <p className="text-emerald-700 dark:text-emerald-400 text-sm font-medium">Spiritual growth through service.</p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden shadow-emerald-900/20 dark:shadow-none">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-4">How to Join</h3>
                <p className="text-emerald-50 text-sm mb-6 leading-relaxed">
                  {unit.requirements ?? 'Contact the unit coordinator to join.'}
                </p>
                <p className="text-xs text-emerald-100 text-center italic">
                  Speak to any unit member or the unit coordinator during fellowship to express your interest.
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-6">Unit Leaders</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Meet the dedicated team behind this unit and the entire fellowship.</p>
              <Link
                to="/about#team"
                className="w-full flex items-center justify-center gap-2 bg-indigo-50 dark:bg-slate-700 text-indigo-900 dark:text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-indigo-100 dark:hover:bg-slate-600 transition"
              >
                Meet the Team <ArrowRight size={16} />
              </Link>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/50 text-center">
              <Zap className="mx-auto text-primary mb-4" size={32} />
              <h3 className="font-bold text-indigo-900 dark:text-white mb-2">Not sure yet?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">You can visit any of our unit meetings as an observer before deciding.</p>
              <button className="text-primary font-bold text-sm hover:underline">Chat with a Mentor</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
