
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Bookmark, MessageCircle } from 'lucide-react';

const BlogPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();

  // Mock data fetching logic
  const post = {
    title: '5 Secrets to Surviving Your First Semester',
    author: 'Prof. David Chen',
    date: 'Oct 12, 2023',
    category: 'Freshmen Tips',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    content: `
      <p class="mb-6">Entering university life is one of the most exciting yet daunting transitions you'll ever make. At Futminna, the pace is fast, and the expectations are high. However, with the right mindset and strategies, you can not only survive but truly thrive.</p>
      <h2 class="text-2xl font-bold text-indigo-900 dark:text-white mb-4">1. Master Your Schedule Early</h2>
      <p class="mb-6">Don't wait until mid-semester to figure out your rhythm. Use digital tools like Google Calendar or a physical planner to map out every lecture, study block, and fellowship meeting. Consistency is your best friend.</p>
      <h2 class="text-2xl font-bold text-indigo-900 dark:text-white mb-4">2. Find Your Tribe</h2>
      <p class="mb-6">Success is a team sport. Join a study group or a fellowship unit within FCS. Having peers who share your values and goals will keep you accountable when things get tough.</p>
      <h2 class="text-2xl font-bold text-indigo-900 dark:text-white mb-4">3. Utilize Campus Resources</h2>
      <p class="mb-6">The library and departmental resources are there for a reason. Don't be afraid to ask seniors for past questions or guidance on specific modules. Our E-Test simulator is also a great place to start your practice.</p>
      <blockquote class="border-l-4 border-primary pl-6 py-2 italic text-gray-700 dark:text-gray-300 bg-emerald-50 dark:bg-emerald-950/20 my-8 rounded-r-xl">
        "Your first year sets the foundation for your entire academic career. Build it on discipline and faith."
      </blockquote>
      <h2 class="text-2xl font-bold text-indigo-900 dark:text-white mb-4">4. Prioritize Mental and Spiritual Well-being</h2>
      <p class="mb-6">It's easy to get lost in the books. Remember to rest. Attend weekly fellowship to recharge and stay connected to the Source of all wisdom.</p>
    `
  };

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Hero Header */}
      <div className="relative h-[400px] w-full overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-indigo-900/60 dark:bg-slate-950/70 flex items-end">
          <div className="max-w-4xl mx-auto px-4 w-full pb-12">
             <button 
               onClick={() => navigate('/blog')}
               className="flex items-center text-white/80 hover:text-white mb-6 transition group"
             >
               <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Blog
             </button>
             <span className="bg-primary text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
               {post.category}
             </span>
             <h1 className="text-3xl md:text-5xl font-poppins font-bold text-white leading-tight">
               {post.title}
             </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-8 mb-8 gap-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-primary font-bold">
               {post.author.charAt(0)}
             </div>
             <div>
               <p className="text-indigo-900 dark:text-white font-bold">{post.author}</p>
               <div className="flex items-center text-xs text-gray-400 gap-3">
                 <span className="flex items-center"><Calendar size={14} className="mr-1" /> {post.date}</span>
                 <span className="flex items-center"><MessageCircle size={14} className="mr-1" /> 12 Comments</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-full border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary transition-all">
              <Share2 size={18} />
            </button>
            <button className="p-2.5 rounded-full border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary transition-all">
              <Bookmark size={18} />
            </button>
          </div>
        </div>

        {/* Article Content */}
        <div 
          className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Navigation / Next Posts */}
        <div className="mt-20 border-t border-gray-100 dark:border-slate-800 pt-12">
           <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-8">You might also like</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Link to="/blog" className="group bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all">
               <p className="text-xs font-bold text-primary mb-2 uppercase">Next Article</p>
               <h4 className="font-bold text-indigo-900 dark:text-white group-hover:text-primary transition-colors">Mastering Engineering Mathematics</h4>
             </Link>
             <Link to="/blog" className="group bg-gray-50 dark:bg-slate-800 rounded-2xl p-6 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:shadow-xl transition-all">
               <p className="text-xs font-bold text-primary mb-2 uppercase">Previous Article</p>
               <h4 className="font-bold text-indigo-900 dark:text-white group-hover:text-primary transition-colors">The Art of Note-Taking</h4>
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
