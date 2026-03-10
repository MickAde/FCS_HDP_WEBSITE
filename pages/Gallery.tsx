
import React, { useState } from 'react';
import { Camera, Image as ImageIcon, X, ZoomIn, Filter, Share2, Heart, ExternalLink } from 'lucide-react';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: 'Worship' | 'Outreach' | 'Sports' | 'Drama' | 'Social';
  date: string;
}

const SAMPLE_GALLERY: GalleryImage[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Worship Night 2024',
    category: 'Worship',
    date: 'March 15, 2024'
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Missions Outreach - Niger State',
    category: 'Outreach',
    date: 'January 10, 2024'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Freshmen Welcome Games',
    category: 'Sports',
    date: 'October 25, 2023'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Stage Play: The Prodigal Son',
    category: 'Drama',
    date: 'November 12, 2023'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Fellowship Picnic',
    category: 'Social',
    date: 'February 14, 2024'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Mid-week Bible Study Session',
    category: 'Worship',
    date: 'March 20, 2024'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Academic Seminar Prep',
    category: 'Social',
    date: 'November 05, 2023'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    title: 'Rural Evangelism Team',
    category: 'Outreach',
    date: 'January 08, 2024'
  }
];

const Gallery: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  const filters = ['All', 'Worship', 'Outreach', 'Drama', 'Sports', 'Social'];

  const filteredImages = activeFilter === 'All' 
    ? SAMPLE_GALLERY 
    : SAMPLE_GALLERY.filter(img => img.category === activeFilter);

  // Function to determine grid span classes based on index for a bento-style layout
  const getSpanClasses = (index: number) => {
    // If filtering is active, we stick to a more uniform grid to prevent layout weirdness,
    // otherwise we use a dense pattern.
    if (activeFilter !== 'All') return 'md:col-span-1 md:row-span-1';

    const patterns = [
      'md:col-span-2 md:row-span-2', // Large feature
      'md:col-span-1 md:row-span-1', 
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-1',
      'md:col-span-1 md:row-span-1',
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-1',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Header */}
      <section className="bg-indigo-900 dark:bg-slate-950 py-24 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-500/30">
            <Camera size={14} /> Capturing His Glory
          </div>
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Our Photo Gallery</h1>
          <p className="text-indigo-200 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Relive the powerful moments of worship, service, and fellowship. Every picture tells a story of God's faithfulness among us.
          </p>
        </div>
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 text-indigo-900 dark:text-white font-bold">
            <Filter size={20} className="text-primary" />
            <span>Filter by Category</span>
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeFilter === f 
                  ? 'bg-primary text-white shadow-lg shadow-emerald-100 dark:shadow-none' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid - Bento Style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 grid-flow-dense auto-rows-[250px]">
          {filteredImages.map((img, idx) => (
            <div 
              key={img.id}
              className={`group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer ${getSpanClasses(idx)}`}
              onClick={() => setSelectedImage(img)}
            >
              <div className="w-full h-full overflow-hidden">
                <img 
                  src={img.url} 
                  alt={img.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-indigo-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block">
                    {img.category}
                  </span>
                  <h3 className="text-white font-bold text-lg mb-1">{img.title}</h3>
                  <div className="flex items-center justify-between">
                    <p className="text-indigo-200 text-xs">{img.date}</p>
                    <div className="flex gap-2">
                       <button className="p-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-primary transition-colors">
                          <ZoomIn size={16} />
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-gray-200 dark:border-slate-700 transition-colors">
            <div className="w-20 h-20 bg-gray-50 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300 dark:text-slate-600">
              <ImageIcon size={40} />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-2">No photos found</h3>
            <p className="text-gray-500 dark:text-gray-400">We don't have any pictures in this category yet. Check back soon!</p>
            <button 
              onClick={() => setActiveFilter('All')}
              className="mt-6 text-primary font-bold hover:underline"
            >
              View all photos
            </button>
          </div>
        )}

        {/* Community Submission CTA */}
        <section className="mt-24 bg-indigo-50 dark:bg-indigo-950/30 rounded-[3rem] p-12 text-center border border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden">
           <div className="relative z-10">
             <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-4">Share Your Moments</h2>
             <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
               Did you take some great shots at our last program? We'd love to feature them in the gallery! Submit your high-quality photos to our media team.
             </p>
             <button className="bg-indigo-900 dark:bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all flex items-center gap-2 mx-auto shadow-lg shadow-indigo-900/10">
               <Share2 size={18} /> Submit Photos <ExternalLink size={14} />
             </button>
           </div>
           {/* Decorative */}
           <div className="absolute top-0 left-0 w-32 h-32 bg-primary/5 rounded-full -ml-16 -mt-16 blur-2xl"></div>
        </section>
      </div>

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/5 p-3 rounded-full z-[110]"
          >
            <X size={28} />
          </button>
          
          <div className="max-w-6xl w-full flex flex-col md:flex-row items-center gap-10">
            <div className="flex-grow flex items-center justify-center">
              <img 
                src={selectedImage.url} 
                alt={selectedImage.title} 
                className="max-h-[70vh] md:max-h-[85vh] w-auto rounded-3xl shadow-2xl animate-in zoom-in-95 duration-500"
              />
            </div>
            
            <div className="md:w-80 flex-shrink-0 text-white space-y-8 animate-in slide-in-from-right duration-500">
              <div>
                <span className="bg-primary text-white text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4 inline-block">
                  {selectedImage.category}
                </span>
                <h2 className="text-3xl font-poppins font-bold mb-2">{selectedImage.title}</h2>
                <p className="text-gray-400">{selectedImage.date}</p>
              </div>
              
              <div className="space-y-4">
                 <button className="w-full bg-white text-indigo-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-50 transition-colors">
                   <Share2 size={18} /> Share Photo
                 </button>
                 <button className="w-full border border-white/10 hover:bg-white/5 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-colors">
                   <Heart size={18} /> Add to Favorites
                 </button>
              </div>
              
              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/5 text-sm text-gray-400 leading-relaxed italic">
                "Behold, how good and how pleasant it is for brethren to dwell together in unity!" — Psalm 133:1
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
