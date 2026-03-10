
import React, { useState } from 'react';
import { 
  Search, 
  Mic2, 
  Download, 
  Play, 
  Pause, 
  Calendar, 
  User, 
  Clock, 
  Music,
  Share2,
  Headphones
} from 'lucide-react';
import { Sermon } from '../types';

const SAMPLE_SERMONS: Sermon[] = [
  {
    id: '1',
    title: 'The Power of Divine Purpose',
    preacher: 'Pst. Kolawole Segun',
    date: 'Oct 20, 2024',
    category: 'Purpose',
    duration: '45:22',
    fileSize: '12.4 MB',
    // Resolved: preacherImg is now a known property of Sermon
    preacherImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '2',
    title: 'Academic Excellence through Faith',
    preacher: 'Dr. (Mrs) Adeyemi',
    date: 'Oct 13, 2024',
    category: 'Academic',
    duration: '38:15',
    fileSize: '10.2 MB',
    // Resolved: preacherImg is now a known property of Sermon
    preacherImg: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '3',
    title: 'Walking in Financial Stewardship',
    preacher: 'Bro. Emmanuel Isaac',
    date: 'Oct 06, 2024',
    category: 'Finance',
    duration: '52:10',
    fileSize: '14.8 MB',
    // Resolved: preacherImg is now a known property of Sermon
    preacherImg: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '4',
    title: 'Overcoming Modern Distractions',
    preacher: 'Pst. Kolawole Segun',
    date: 'Sep 29, 2024',
    category: 'Spiritual Growth',
    duration: '42:05',
    fileSize: '11.5 MB',
    // Resolved: preacherImg is now a known property of Sermon
    preacherImg: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  },
  {
    id: '5',
    title: 'The Great Commission: Our Campus Mission',
    preacher: 'Evang. Samuel David',
    date: 'Sep 22, 2024',
    category: 'Evangelism',
    duration: '48:30',
    fileSize: '13.2 MB',
    // Resolved: preacherImg is now a known property of Sermon
    preacherImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'
  }
];

const Sermons: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [playingId, setPlayingId] = useState<string | null>(null);

  const categories = ['All', 'Purpose', 'Academic', 'Spiritual Growth', 'Finance', 'Evangelism'];

  const filteredSermons = SAMPLE_SERMONS.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || sermon.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const togglePlay = (id: string) => {
    if (playingId === id) setPlayingId(null);
    else setPlayingId(id);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors duration-300">
      {/* Hero Header with Background Image */}
      <section className="relative bg-indigo-900 dark:bg-slate-950 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img src="https://images.unsplash.com/photo-1514361892635-6b07e31e75f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" alt="" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-primary/30 backdrop-blur-md">
            <Mic2 size={14} /> Fellowship Audio Archives
          </div>
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Faith Comes by Hearing</h1>
          <p className="text-indigo-200 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Missed a service or want to relive a powerful message? Access our full library of sermons delivered at FCS Futminna.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 mb-12 flex flex-col lg:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-slate-700 transition-colors">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by topic or preacher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat 
                  ? 'bg-primary text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sermon List */}
        <div className="space-y-4">
          {filteredSermons.map((sermon) => (
            <div 
              key={sermon.id} 
              className="bg-white dark:bg-slate-800 p-4 md:p-6 rounded-[2rem] border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group"
            >
              {/* Play/Pause Circle with Hover Image */}
              <div className="relative">
                <button 
                  onClick={() => togglePlay(sermon.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all flex-shrink-0 z-10 relative ${
                    playingId === sermon.id 
                    ? 'bg-primary text-white scale-110 shadow-lg' 
                    : 'bg-emerald-50 dark:bg-emerald-950/20 text-primary hover:bg-primary hover:text-white'
                  }`}
                >
                  {playingId === sermon.id ? <Pause fill="currentColor" size={24} /> : <Play fill="currentColor" size={24} className="ml-1" />}
                </button>
              </div>

              {/* Preacher Avatar */}
              <div className="hidden md:block w-12 h-12 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
                {/* Resolved: accessing preacherImg directly after type fix */}
                <img src={sermon.preacherImg} alt={sermon.preacher} className="w-full h-full object-cover" />
              </div>

              {/* Info */}
              <div className="flex-grow text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="text-xl font-bold text-indigo-900 dark:text-white group-hover:text-primary transition-colors">
                    {sermon.title}
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-gray-400">
                    {sermon.category}
                  </span>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1.5"><User size={14} className="text-primary" /> {sermon.preacher}</div>
                  <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary" /> {sermon.date}</div>
                  <div className="flex items-center gap-1.5"><Clock size={14} className="text-primary" /> {sermon.duration}</div>
                  <div className="flex items-center gap-1.5"><Music size={14} className="text-primary" /> {sermon.fileSize}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                 <button className="p-3 rounded-xl bg-gray-50 dark:bg-slate-900 text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all" title="Share Message">
                    <Share2 size={18} />
                 </button>
                 <a 
                   href="#" 
                   className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-100 dark:shadow-none"
                   onClick={(e) => {
                     e.preventDefault();
                     alert(`Downloading: ${sermon.title}`);
                   }}
                 >
                   <Download size={18} /> Download
                 </a>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredSermons.length === 0 && (
            <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
              <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-slate-600">
                <Headphones size={40} />
              </div>
              <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-2">No sermons found</h3>
              <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms or category filters.</p>
              <button 
                onClick={() => {setSearchQuery(''); setActiveCategory('All');}}
                className="mt-6 text-primary font-bold hover:underline"
              >
                View all sermons
              </button>
            </div>
          )}
        </div>

        {/* Feature Bottom with Visuals */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="relative overflow-hidden bg-emerald-50 dark:bg-emerald-950/20 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-6">
              <div className="absolute right-0 top-0 opacity-10 -mr-10 -mt-10">
                 <Play size={120} fill="currentColor" className="text-primary" />
              </div>
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm flex-shrink-0 z-10">
                <Headphones size={32} />
              </div>
              <div className="z-10">
                <h4 className="text-lg font-bold text-indigo-900 dark:text-white mb-1">Live Services</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Can't make it to the hall? Join our live audio stream every Sunday at 8:00 AM.</p>
                <button className="mt-3 text-primary font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Tune in Live <Play size={12} fill="currentColor" />
                </button>
              </div>
           </div>
           
           <div className="relative overflow-hidden bg-indigo-50 dark:bg-indigo-950/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/50 flex items-center gap-6">
              <div className="absolute right-0 top-0 opacity-10 -mr-10 -mt-10">
                 <Mic2 size={120} fill="currentColor" className="text-indigo-600" />
              </div>
              <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm flex-shrink-0 z-10">
                <Mic2 size={32} />
              </div>
              <div className="z-10">
                <h4 className="text-lg font-bold text-indigo-900 dark:text-white mb-1">Request a Message</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Looking for a specific sermon from the past years? Request our full archive.</p>
                <button className="mt-3 text-indigo-600 dark:text-indigo-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                  Request Audio <Download size={14} />
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Sermons;
