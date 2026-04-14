import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Theater, Users, CalendarDays, Wrench, Music, Camera,
  Mic2, HeartHandshake, ShieldCheck, Zap, Flame, Utensils,
  Loader, LucideIcon
} from 'lucide-react';
import { dbService, UnitRow } from '../services/dbService';

const ICON_MAP: Record<string, LucideIcon> = {
  Theater, Users, CalendarDays, Wrench, Music, Camera,
  Mic2, HeartHandshake, ShieldCheck, Zap, Flame, Utensils,
};

const Units: React.FC = () => {
  const [units, setUnits] = useState<UnitRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dbService.getUnits().then(({ data }) => {
      if (data) setUnits(data as UnitRow[]);
      setLoading(false);
    });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      <section className="relative bg-indigo-900 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="../public/assets/images/dance tlv.jpg"
            alt="Service"
            loading="lazy"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Our Service Units</h1>
          <p className="text-indigo-200 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every member has a gift, and every gift has a home. Find where you belong and serve the community with your unique talents.
          </p>
        </div>
      </section>

      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader size={32} className="animate-spin text-primary" />
          </div>
        ) : units.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <Users size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No units have been added yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {units.map((unit) => {
              const Icon = ICON_MAP[unit.icon] ?? Users;
              return (
                <Link
                  to={`/units/${unit.id}`}
                  key={unit.id}
                  className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col"
                >
                  <div className="h-40 overflow-hidden relative">
                    {unit.img
                      ? <img src={unit.img} alt={unit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      : <div className="w-full h-full bg-gray-100 dark:bg-slate-700" />
                    }
                    <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className={`absolute bottom-4 left-4 w-12 h-12 ${unit.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="p-8 flex-grow">
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3">{unit.name}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">{unit.description}</p>
                    <span className="text-primary font-bold text-sm flex items-center group-hover:gap-2 transition-all mt-auto">
                      Learn More <Zap size={14} className="ml-1 fill-current" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <section className="pb-32 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-xl relative overflow-hidden transition-colors">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-white mb-4">Ready to Serve?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Joining a unit is the best way to grow spiritually and build lasting relationships within FCS Futminna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/units" className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-900/20">
                Register for a Unit
              </Link>
              <Link to="/about" className="border border-emerald-100 dark:border-emerald-900/30 text-primary px-8 py-4 rounded-full font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all">
                View Requirements
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Units;
