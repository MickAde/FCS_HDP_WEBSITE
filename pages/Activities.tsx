import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Bell, CalendarDays, Sparkles, Loader, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { dbService, ActivityRow } from '../services/dbService';

const FILTERS = ['All', 'General', 'Workshop', 'Outreach', 'Prayer'];

const TYPE_COLORS: Record<string, string> = {
  Workshop: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600',
  Prayer: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600',
  Outreach: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600',
  General: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
};

const WEEKLY_SCHEDULE = [
  { day: 'Sunday', event: 'Sunday Revival Hour', time: '6:00 PM - 8:30 PM', location: 'CHAPEL OF GRACE, MAIN AND BOSSO CAMPUS' },
  { day: 'Monday', event: 'Prayer Meeting', time: '7:00 PM - 8:30 PM', location: 'CHAPEL OF GRACE, MAIN AND BOSSO CAMPUS' },
  { day: 'Wednesday', event: 'Bible Study Meeting', time: '7:00 PM - 8:30 PM', location: 'CHAPEL OF GRACE, MAIN AND BOSSO CAMPUS' },
];

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [subEmail, setSubEmail] = useState('');
  const [subState, setSubState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubState('loading');
    const { error } = await supabase.from('subscribers').insert({ email: subEmail });
    if (error) {
      setSubState(error.code === '23505' ? 'success' : 'error');
    } else {
      setSubState('success');
      setSubEmail('');
    }
  };

  useEffect(() => {
    dbService.getActivities().then(({ data }) => {
      if (data) setActivities(data as ActivityRow[]);
      setLoading(false);
    });
  }, []);

  const filtered = activeFilter === 'All'
    ? activities
    : activities.filter(a => a.type === activeFilter);

  const featuredEvent = activities.find(a => a.featured);

  const handleSyncCalendar = () => {
    if (!activities.length) return;

    const pad = (n: number) => String(n).padStart(2, '0');
    const toIcsDate = (dateStr: string, timeStr: string) => {
      const d = new Date(`${dateStr} ${timeStr}`);
      if (isNaN(d.getTime())) return null;
      return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
    };

    const events = activities.map(a => {
      const dtstart = toIcsDate(a.date, a.time);
      const dtend = toIcsDate(a.end_date ?? a.date, a.time);
      if (!dtstart || !dtend) return '';
      return [
        'BEGIN:VEVENT',
        `UID:${a.id}@fcs-futminna`,
        `SUMMARY:${a.title}`,
        `DTSTART:${dtstart}`,
        `DTEND:${dtend}`,
        `LOCATION:${a.location}`,
        `DESCRIPTION:${(a.description ?? '').replace(/\n/g, '\\n')}`,
        'END:VEVENT',
      ].join('\r\n');
    }).filter(Boolean);

    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//FCS FUTMinna//Fellowship Calendar//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      ...events,
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fcs-futminna-calendar.ics';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      <section className="bg-indigo-900 dark:bg-slate-950 py-20 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Upcoming Activities</h1>
            <p className="text-indigo-200 dark:text-gray-400 text-lg leading-relaxed">
              Stay connected and grow with us. Explore our calendar of events designed to build your spiritual life and academic career.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-12">

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <Loader size={32} className="animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Featured Event */}
                {featuredEvent && (
                  <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700 group">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-2/5 h-64 md:h-auto overflow-hidden bg-gray-100 dark:bg-slate-700">
                        {featuredEvent.image_url
                          ? <img src={featuredEvent.image_url} alt={featuredEvent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          : <div className="w-full h-full flex items-center justify-center"><CalendarDays size={48} className="text-gray-300" /></div>
                        }
                      </div>
                      <div className="md:w-3/5 p-8 md:p-12">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full flex items-center">
                            <Sparkles size={12} className="mr-1" /> Featured
                          </span>
                          <span className="text-gray-400 text-xs">•</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-widest">{featuredEvent.type}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold text-indigo-900 dark:text-white mb-4">{featuredEvent.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{featuredEvent.description}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={18} className="mr-2 text-primary" /> {featuredEvent.date}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock size={18} className="mr-2 text-primary" /> {featuredEvent.time}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 sm:col-span-2">
                            <MapPin size={18} className="mr-2 text-primary" /> {featuredEvent.location}
                          </div>
                        </div>
                        <Link to={`/activities/${featuredEvent.id}`} className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-100 dark:shadow-none">
                          View Event Details <ArrowRight size={18} className="inline ml-2" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter + List */}
                <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h2 className="text-2xl font-bold text-indigo-900 dark:text-white">Events Calendar</h2>
                    <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                      {FILTERS.map(f => (
                        <button
                          key={f}
                          onClick={() => setActiveFilter(f)}
                          className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${
                            activeFilter === f
                              ? 'bg-primary text-white'
                              : 'text-gray-500 dark:text-gray-400 hover:text-indigo-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {filtered.map(event => (
                      <div key={event.id} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="bg-emerald-50 dark:bg-emerald-950/20 text-primary w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                          <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                          <span className="text-xl font-bold">{event.date.split(' ')[1]?.replace(',', '') ?? ''}</span>
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h4 className="text-xl font-bold text-indigo-900 dark:text-white">{event.title}</h4>
                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${TYPE_COLORS[event.type]}`}>
                              {event.type}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                            <div className="flex items-center">
                              <Calendar size={14} className="mr-1.5 text-primary" />
                              {event.end_date ? `${event.date} – ${event.end_date}` : event.date}
                            </div>
                            <div className="flex items-center"><Clock size={14} className="mr-1.5 text-primary" /> {event.time}</div>
                            <div className="flex items-center"><MapPin size={14} className="mr-1.5 text-primary" /> {event.location}</div>
                          </div>
                        </div>
                        <Link to={`/activities/${event.id}`} className="text-primary font-bold text-sm flex items-center hover:gap-2 transition-all whitespace-nowrap">
                          View Details <ArrowRight size={16} className="ml-1" />
                        </Link>
                      </div>
                    ))}

                    {filtered.length === 0 && (
                      <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                        <CalendarDays className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
                        <p className="text-gray-500 dark:text-gray-400">No events found for this category yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8 lg:sticky lg:top-20">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-6 flex items-center">
                <Clock className="mr-2 text-primary" size={20} /> Weekly Schedule
              </h3>
              <div className="space-y-6">
                {WEEKLY_SCHEDULE.map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary" />
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{item.day}</p>
                    <h5 className="font-bold text-indigo-900 dark:text-white text-sm mb-1">{item.event}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 flex items-center"><MapPin size={10} className="mr-1" /> {item.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-indigo-900 dark:bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <Bell className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Never Miss an Update</h3>
                <p className="text-indigo-200 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Subscribe to get email reminders for upcoming programs and special outreaches.
                </p>
                <div className="space-y-3">
                  {subState === 'success' ? (
                    <p className="text-emerald-400 font-bold text-sm text-center">You're subscribed! 🎉</p>
                  ) : (
                    <form onSubmit={handleSubscribe} className="space-y-3">
                      <input
                        required type="email" value={subEmail}
                        onChange={e => setSubEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full bg-white/10 dark:bg-slate-900 border border-white/20 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                      />
                      {subState === 'error' && <p className="text-red-400 text-xs">Something went wrong. Try again.</p>}
                      <button type="submit" disabled={subState === 'loading'} className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-60">
                        {subState === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                      </button>
                    </form>
                  )}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16" />
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-8 rounded-[2.5rem] text-center">
              <CalendarDays className="mx-auto text-primary mb-4" size={32} />
              <h4 className="font-bold text-indigo-900 dark:text-white mb-2">Fellowship Calendar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Import our full academic year calendar directly to your Google or Apple Calendar.</p>
              <button
                onClick={handleSyncCalendar}
                disabled={!activities.length}
                className="text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Download size={14} /> Download .ics Calendar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
