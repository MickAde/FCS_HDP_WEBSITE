import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Share2, Loader, AlertCircle } from 'lucide-react';
import { BlogPost } from '../types';
import { dbService } from '../services/dbService';

const BlogPostDetail: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!postId) return;
    dbService.getBlogPost(postId).then(({ data, error }) => {
      if (error || !data) setNotFound(true);
      else setPost(data);
      setLoading(false);
    });
  }, [postId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900">
      <Loader size={32} className="animate-spin text-primary" />
    </div>
  );

  if (notFound || !post) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-900 text-center px-4">
      <AlertCircle size={48} className="text-gray-300 dark:text-slate-600 mb-4" />
      <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-2">Post not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">This article may have been removed or doesn't exist.</p>
      <Link to="/blog" className="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition">
        Back to Blog
      </Link>
    </div>
  );

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Hero */}
      <div className="relative h-[400px] w-full overflow-hidden">
        {post.image_url
          ? <img src={post.image_url} alt={post.title} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-indigo-900 dark:bg-slate-950" />
        }
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
        {/* Meta */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-8 mb-8 gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-primary font-bold text-lg">
              {post.author.charAt(0)}
            </div>
            <div>
              <p className="text-indigo-900 dark:text-white font-bold">{post.author}</p>
              <div className="flex items-center text-xs text-gray-400 gap-3">
                <span className="flex items-center"><Calendar size={14} className="mr-1" /> {new Date(post.date).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href).then(() => {})}
            className="p-2.5 rounded-full border border-gray-100 dark:border-slate-800 text-gray-400 hover:text-primary hover:border-primary transition-all"
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Content */}
        <div
          className="prose prose-indigo dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed text-lg"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Back link */}
        <div className="mt-16 pt-8 border-t border-gray-100 dark:border-slate-800">
          <Link to="/blog" className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to all articles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogPostDetail;
