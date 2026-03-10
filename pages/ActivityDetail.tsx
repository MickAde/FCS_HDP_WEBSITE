
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Share2, 
  Bookmark, 
  Bell,
  CalendarDays,
  ArrowRight,
  Zap,
  Star
} from 'lucide-react';
import { SAMPLE_EVENTS } from './Activities';

const ActivityDetail: React.FC = () => {
  const { activityId } = useParams<{ activityId: string }>();
  const navigate = useNavigate();
  const event = SAMPLE_EVENTS.find(e => e.id === activityId);

  if (!event) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors">
        <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-4">Event not found</h2>
        <Link to="/activities" className="text-primary font-bold hover:underline">Back to Activities</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Header */}
      <div className="relative h-[450px] w-full overflow-hidden">
        <img 
          src={event.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
          alt={event.title} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-indigo-900/70 flex items-end">
          <div className="max-w-4xl mx-auto px-4 w-full pb-16">
             <button 
               onClick={() => navigate('/activities')}
               className="flex items-center text-white/80 hover:text-white mb-8 transition group"
             >
               <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Activities
             </button>
             <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="bg-primary text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
                  {event.type}
                </span>
                {event.featured && (
                  <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 border border-white/20">
                    <Star size={12} fill="currentColor" /> Featured
                  </span>
                )}
             </div>
             <h1 className="text-3xl md:text-5xl font-poppins font-bold text-white leading-tight">
               {event.title}
             </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Quick Info Bar */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700 grid grid-cols-1 md:grid-cols-3 gap-6 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Date</p>
                  <p className="text-secondary dark:text-white font-bold">{event.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Time</p>
                  <p className="text-secondary dark:text-white font-bold">{event.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Location</p>
                  <p className="text-secondary dark:text-white font-bold">{event.location}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-8 border-b border-gray-100 dark:border-slate-700 pb-4">Event Overview</h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg space-y-6">
                <p>{event.longDescription || event.description}</p>
              </div>

              {event.expectations && (
                <div className="mt-12">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-6 uppercase tracking-wider text-sm">What to Expect</h3>
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

            {/* Actions Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-4">
               <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-semibold">
                    <Share2 size={20} /> Share
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary transition-colors font-semibold">
                    <Bookmark size={20} /> Save
                  </button>
               </div>
               <p className="text-sm text-gray-400">Invite a friend to come along!</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden shadow-emerald-900/20">
              <div className="relative z-10 text-center">
                <Bell size={32} className="mx-auto mb-6 text-white" />
                <h3 className="text-2xl font-bold mb-4">Register Now</h3>
                <p className="text-emerald-50 text-sm mb-8 leading-relaxed">
                  Join us for this life-transforming session. Registration helps us plan resources and logistics effectively.
                </p>
                <button className="w-full bg-white text-primary font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition shadow-lg flex items-center justify-center gap-2">
                  Count Me In <ArrowRight size={18} />
                </button>
                <p className="text-[10px] text-emerald-100 mt-6 font-bold uppercase tracking-widest opacity-80">
                  Open to all 100-500 level students
                </p>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16"></div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700 transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <CalendarDays className="text-primary" size={24} />
                <h3 className="text-lg font-bold text-indigo-900 dark:text-white">Save the Date</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Import this event to your personal calendar to receive automatic reminders.</p>
              <button className="w-full border border-emerald-100 dark:border-emerald-900/50 text-primary px-6 py-3 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all text-sm flex items-center justify-center gap-2">
                Add to Calendar
              </button>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-indigo-950 dark:from-slate-950 dark:to-slate-900 p-8 rounded-[2.5rem] border border-white/10 text-center text-white relative overflow-hidden">
              <Zap className="mx-auto text-primary mb-4" size={32} />
              <h3 className="font-bold mb-2">Need a Mentor?</h3>
              <p className="text-sm text-indigo-200 mb-8 leading-relaxed">If you have questions about how to balance this program with your exams, our seniors are here to guide you.</p>
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
