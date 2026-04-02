import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, MapPin, CheckCircle2,
  Share2, CalendarDays, ArrowRight, Zap, Star, Loader, AlertCircle
} from 'lucide-react';
import { dbService, ActivityRow } from '../services/dbService';

const TYPE_COLORS: Record<string, string> = {
  Workshop: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600',
  Prayer: 'bg-purple-50 dark:bg-purple-950/30 text-purple-600',
  Outreach: 'bg-rose-50 dark:bg-rose-950/30 text-rose-600',
  General: 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400',
};

const ActivityDetail: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<ActivityRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!activityId) return;
    dbService.getActivity(activityId).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setEvent(data as ActivityRow);
      setLoading(false);
    });
  }, [activityId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  if (notFound || !event) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 text-center px-4">
      <AlertCircle size={48} className="text-gray-300 dark:text-slate-600 mb-4" />
      <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-2">Event not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">This activity may have been removed or doesn't exist.</p>
      <Link to="/activities" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
        Back to Activities
      </Link>
    </div>
  );

  const getGoogleCalendarUrl = () => {
    const base = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
    const title = `&text=${encodeURIComponent(event.title)}`;
    const details = `&details=${encodeURIComponent(event.long_description || event.description)}`;
    const location = `&location=${encodeURIComponent(event.location)}`;
    const startISO = `${event.date}T${event.time}:00`;
    const start = startISO.replace(/[-:]/g, '').slice(0, 15);
    let end: string;
    if (event.end_date) {
      // End date: use end_date at same time
      const endISO = `${event.end_date}T${event.time}:00`;
      end = endISO.replace(/[-:]/g, '').slice(0, 15);
    } else {
      const endDate = new Date(`${event.date}T${event.time}:00`);
      endDate.setHours(endDate.getHours() + 2);
      end = endDate.toISOString().replace(/[-:]/g, '').slice(0, 15);
    }
    const dates = `&dates=${start}/${end}`;
    return `${base}${title}${details}${location}${dates}`;
  };

  // Format date for display e.g. "2025-10-25" -> "Oct 25, 2025"
  const formatDate = (d: string) => {
    const parsed = new Date(d);
    return isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Format time for display e.g. "16:00" -> "4:00 PM"
  const formatTime = (t: string) => {
    const [h, m] = t.split(':').map(Number);
    if (isNaN(h)) return t;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero */}
      <div className="relative h-[450px] w-full overflow-hidden">
        {event.image_url
          ? <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-indigo-900 dark:bg-slate-950" />
        }
        <div className="absolute inset-0 bg-indigo-900/70 flex items-end">
          <div className="max-w-4xl mx-auto px-4 w-full pb-16">
            <button
              onClick={() => navigate('/activities')}
              className="flex items-center text-white/80 hover:text-white mb-8 transition group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Activities
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${TYPE_COLORS[event.type]}`}>
                {event.type}
              </span>
              {event.featured && (
                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border border-white/20">
                  <Star size={12} fill="currentColor" /> Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl md:text-5xl font-poppins font-bold text-white leading-tight">{event.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
              {[
                {
                  icon: Calendar,
                  label: 'Date',
                  value: event.end_date
                    ? `${formatDate(event.date)} – ${formatDate(event.end_date)}`
                    : formatDate(event.date),
                },
                { icon: Clock, label: 'Time', value: formatTime(event.time) },
                { icon: MapPin, label: 'Location', value: event.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                    <Icon size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
                    <p className="text-indigo-900 dark:text-white font-bold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <section className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-700 pb-4">Event Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                {event.long_description || event.description}
              </p>

              {event.expectations.length > 0 && (
                <div className="mt-12">
                  <h3 className="text-sm font-bold text-indigo-900 dark:text-white mb-6 uppercase tracking-wider">What to Expect</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.expectations.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-2xl border border-emerald-50 dark:border-emerald-900/50">
                        <CheckCircle2 size={18} className="text-primary mt-1 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <div className="flex items-center gap-4 p-4">
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-semibold"
              >
                <Share2 size={20} /> Share
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="text-primary" size={24} />
                <h3 className="text-lg font-bold text-indigo-900 dark:text-white">Save the Date</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Import this event to your personal calendar to receive automatic reminders.</p>
              <a
                href={getGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full border border-emerald-100 dark:border-emerald-900/50 text-primary px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all text-sm flex items-center justify-center gap-2"
              >
                Add to Google Calendar
              </a>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 dark:from-slate-950 dark:to-slate-900 p-8 rounded-[2.5rem] border border-white/10 text-center text-white relative overflow-hidden">
              <Zap className="mx-auto text-primary mb-4" size={32} />
              <h3 className="font-bold mb-2">Need a Mentor?</h3>
              <p className="text-sm text-indigo-200 mb-8 leading-relaxed">If you have questions about how to balance this program with your exams, our AI is here to guide you.</p>
              <Link to="/study-buddy" className="inline-flex items-center gap-2 text-white font-bold text-sm hover:underline">
                Talk to AI Study Buddy <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDetail;
