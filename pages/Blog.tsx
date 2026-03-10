
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Tag, Calendar, User, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';

const SAMPLE_POSTS: BlogPost[] = [
  {
    id: '1',
    title: '5 Secrets to Surviving Your First Semester',
    excerpt: 'Transitioning to college life can be tough. Here are 5 battle-tested strategies to help you thrive.',
    content: 'Full content goes here...',
    author: 'Prof. David Chen',
    date: 'Oct 12, 2023',
    category: 'Freshmen Tips',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Mastering Engineering Mathematics',
    excerpt: 'Complex numbers and calculus dont have to be scary. We break down the hardest concepts.',
    content: 'Full content goes here...',
    author: 'Emily Watson',
    date: 'Oct 10, 2023',
    category: 'Study Guide',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd482180c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'The Art of Note-Taking: Digital vs Paper',
    excerpt: 'Which method is better for memory retention? Explore the pros and cons of iPads vs traditional notebooks.',
    content: 'Full content goes here...',
    author: 'Alex Rivera',
    date: 'Oct 05, 2023',
    category: 'Productivity',
    imageUrl: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Freshmen Tips', 'Study Guide', 'Productivity', 'Events'];

  const filteredPosts = activeCategory === 'All' 
    ? SAMPLE_POSTS 
    : SAMPLE_POSTS.filter(post => post.category === activeCategory);

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Header */}
      <div className="bg-indigo-900 dark:bg-slate-950 py-16 text-white text-center">
        <h1 className="text-4xl font-poppins font-bold mb-4">FCS Insights</h1>
        <p className="text-indigo-200 dark:text-gray-400 max-w-xl mx-auto px-4">Expert advice, community stories, and everything you need to know about academic success at Futminna.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        {/* Toolbar */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 mb-12 flex flex-col md:flex-row justify-between items-center gap-6 border border-gray-100 dark:border-slate-700">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search articles..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all flex flex-col group">
              <div className="h-56 overflow-hidden relative">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <div className="flex items-center text-xs text-gray-400 mb-4 space-x-4">
                  <span className="flex items-center"><Calendar size={14} className="mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User size={14} className="mr-1" /> {post.author}</span>
                </div>
                <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} className="inline-flex items-center text-primary font-bold text-sm hover:gap-2 transition-all">
                  Read Full Article <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700 transition-colors">
            <p className="text-gray-500 dark:text-gray-400">No articles found in this category yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
