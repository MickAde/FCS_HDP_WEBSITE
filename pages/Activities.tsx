
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Clock, ArrowRight, Bell, CalendarDays, Filter, Sparkles } from 'lucide-react';

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  longDescription?: string;
  type: 'General' | 'Workshop' | 'Outreach' | 'Prayer';
  featured?: boolean;
  expectations?: string[];
  imageUrl?: string;
}

export const SAMPLE_EVENTS: Event[] = [
  {
    id: 'missions-2026',
    title: 'Missions 2026: The Great Harvest',
    date: 'Jan 05 - 12, 2026',
    time: '8:00 AM Daily',
    location: 'Remote Villages, Niger State',
    description: 'Our flagship biennial mission outreach. Join over 200 light-bearers as we take the gospel, medical aid, and community support to the unreached hinterlands of Niger State.',
    longDescription: 'Missions 2026 is our most significant outreach of the year. We are heading into several rural communities across Niger State to provide physical aid—including medical checkups and educational supplies—while sharing the transformative message of Christ. Participants will experience intensive discipleship, community living, and the joy of reaching the unreached.',
    type: 'Outreach',
    featured: true,
    expectations: [
      "Evangelism training and practice",
      "Medical outreach support",
      "Children's ministry programs",
      "Deep communal worship and prayer",
      "Inter-cultural ministry experience"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'freshmen-welcome',
    title: 'Freshmen Welcome Banquet',
    date: 'Oct 25, 2024',
    time: '4:00 PM',
    location: 'Main Fellowship Hall',
    description: 'A special evening of dinner, networking, and inspiration specifically for all 100-level students.',
    longDescription: 'The Freshmen Welcome Banquet is designed to give our new members a warm welcome into the FCS family. It’s an evening filled with music, testimonies from seniors, a grand dinner, and practical survival tips for life at Futminna. You’ll meet your mentors and learn about the resources available to help you excel academically and spiritually.',
    type: 'General',
    expectations: [
      "Delicious buffet dinner",
      "Interactive ice-breaking sessions",
      "Inspiring word from fellowship leaders",
      "Mentorship pairing",
      "Free survival kits for freshmen"
    ],
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'academic-workshop',
    title: 'Academic Excellence Workshop',
    date: 'Nov 02, 2024',
    time: '10:00 AM',
    location: 'LT 1, Engineering Complex',
    description: 'Learn effective study habits, time management, and how to balance faith with academic rigors.',
    longDescription: 'Don’t just survive; thrive! This workshop features top-performing seniors and alumni who have maintained high CGPAs while being active in the fellowship. We will cover technical note-taking, exam strategies for Futminna modules, and how to use the E-Test simulator effectively.',
    type: 'Workshop',
    expectations: [
      "Study technique demonstrations",
      "Time management planning",
      "Past question analysis",
      "Q&A session with department toppers",
      "Access to premium digital resources"
    ]
  },
  {
    id: 'prayer-retreat',
    title: 'Weekend Prayer Retreat',
    date: 'Nov 15 - 17, 2024',
    time: 'Fri 6:00 PM',
    location: 'Mount Zion Camp Ground',
    description: 'Three days of spiritual renewal, deep worship, and intercession for our campus and nation.',
    longDescription: 'The Weekend Prayer Retreat is a time to separate from the noise of campus life and seek God’s face. It is a period of deep intercession, spiritual alignment, and personal renewal. Whether you need clarity on your purpose or a fresh touch from the Spirit, this retreat is for you.',
    type: 'Prayer',
    expectations: [
      "Intensive worship sessions",
      "Fasting and prayer modules",
      "Spiritual gift activations",
      "Quiet time and reflection",
      "Prophetic ministrations"
    ]
  },
  {
    id: 'community-outreach',
    title: 'Community Outreach Program',
    date: 'Dec 05, 2024',
    time: '9:00 AM',
    location: 'Bosso Community Center',
    description: 'Spreading the love of Christ through medical checkups, educational support, and grocery distribution.',
    longDescription: 'Our community outreach focuses on the Bosso area surrounding our campus. We aim to be the hands and feet of Jesus by providing tangible support to underprivileged families. We will be conducting basic medical checkups and donating books to local primary students.',
    type: 'Outreach',
    expectations: [
      "Food basket distribution",
      "Basic health screenings",
      "Tutoring for local kids",
      "Street evangelism",
      "Welfare support"
    ]
  }
];

const WEEKLY_SCHEDULE = [
  { day: 'Sunday', event: 'Sunday Worship Service', time: '8:00 AM - 10:30 AM', location: 'Fellowship Hall' },
  { day: 'Wednesday', event: 'Mid-week Bible Study', time: '5:30 PM - 7:00 PM', location: 'Hostel Clusters' },
  { day: 'Friday', event: 'Prayer and Intercession', time: '6:00 PM - 7:30 PM', location: 'Fellowship Hall' },
];

const Activities: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'General', 'Workshop', 'Outreach', 'Prayer'];

  const filteredEvents = activeFilter === 'All' 
    ? SAMPLE_EVENTS 
    : SAMPLE_EVENTS.filter(e => e.type === activeFilter);

  const featuredEvent = SAMPLE_EVENTS.find(e => e.featured);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Header */}
      <section className="bg-indigo-900 dark:bg-slate-950 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-6">Upcoming Activities</h1>
            <p className="text-indigo-200 dark:text-gray-400 text-lg leading-relaxed">
              Stay connected and grow with us. Explore our calendar of events designed to build your spiritual life and academic career.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Column: Events */}
          <div className="lg:col-span-2 space-y-12">
            {/* Featured Event */}
            {featuredEvent && (
              <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] overflow-hidden shadow-xl border border-gray-100 dark:border-slate-700 group">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/5 h-64 md:h-auto overflow-hidden">
                    <img 
                      src={featuredEvent.imageUrl || 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt="Featured event" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
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
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {featuredEvent.description}
                    </p>
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

            {/* Event List & Filter */}
            <div className="space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-white">Events Calendar</h2>
                <div className="flex gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-gray-100 dark:border-slate-700 shadow-sm overflow-x-auto no-scrollbar max-w-full">
                  {filters.map(f => (
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
                {filteredEvents.map(event => (
                  <div key={event.id} className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start md:items-center">
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 text-primary w-16 h-16 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 border border-emerald-100 dark:border-emerald-900/50">
                      <span className="text-xs font-bold uppercase">{event.date.split(' ')[0]}</span>
                      <span className="text-xl font-bold">{event.date.split(' ')[1].replace(',', '')}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="text-xl font-bold text-indigo-900 dark:text-white">{event.title}</h4>
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md ${
                          event.type === 'Workshop' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-600' :
                          event.type === 'Prayer' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600' :
                          event.type === 'Outreach' ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600' :
                          'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                        }`}>
                          {event.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <div className="flex items-center"><Clock size={14} className="mr-1.5 text-primary" /> {event.time}</div>
                        <div className="flex items-center"><MapPin size={14} className="mr-1.5 text-primary" /> {event.location}</div>
                      </div>
                    </div>
                    <Link to={`/activities/${event.id}`} className="text-primary font-bold text-sm flex items-center hover:gap-2 transition-all whitespace-nowrap">
                      View Details <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                ))}

                {filteredEvents.length === 0 && (
                  <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-gray-200 dark:border-slate-700">
                    <CalendarDays className="mx-auto text-gray-300 dark:text-slate-600 mb-4" size={48} />
                    <p className="text-gray-500 dark:text-gray-400">No events found for this category yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar: Weekly Schedule & Reminders */}
          <div className="space-y-8">
            {/* Weekly Schedule */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-6 flex items-center">
                <Clock className="mr-2 text-primary" size={20} /> Weekly Schedule
              </h3>
              <div className="space-y-6">
                {WEEKLY_SCHEDULE.map((item, idx) => (
                  <div key={idx} className="relative pl-6 border-l-2 border-indigo-100 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                    <div className="absolute left-[-5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
                    <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{item.day}</p>
                    <h5 className="font-bold text-indigo-900 dark:text-white text-sm mb-1">{item.event}</h5>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.time}</p>
                    <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 flex items-center"><MapPin size={10} className="mr-1" /> {item.location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Subscription */}
            <div className="bg-indigo-900 dark:bg-slate-950 text-white p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <Bell className="text-primary mb-4" size={32} />
                <h3 className="text-xl font-bold mb-2">Never Miss an Update</h3>
                <p className="text-indigo-200 dark:text-gray-400 text-sm mb-6 leading-relaxed">
                  Subscribe to get SMS and email reminders for upcoming programs and special outreaches.
                </p>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Email address" 
                    className="w-full bg-white/10 dark:bg-slate-900 border border-white/20 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  />
                  <button className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition shadow-lg dark:shadow-none">
                    Subscribe Now
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16"></div>
            </div>

            {/* Add to Calendar Button (Generic) */}
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 p-8 rounded-[2.5rem] text-center">
              <CalendarDays className="mx-auto text-primary mb-4" size={32} />
              <h4 className="font-bold text-indigo-900 dark:text-white mb-2">Fellowship Calendar</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Import our full academic year calendar directly to your Google or Apple Calendar.</p>
              <button className="text-primary font-bold text-sm hover:underline flex items-center justify-center gap-1 mx-auto">
                Sync Calendar <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
