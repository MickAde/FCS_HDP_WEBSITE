import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader, FileText } from 'lucide-react';
import { dbService } from '../services/dbService';
import { BlogPost } from '../types';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import RichTextEditor from '../components/RichTextEditor';

const CATEGORIES = ['Freshmen Tips', 'Study Guide', 'Productivity', 'Events', 'Devotional', 'Announcement'];

const emptyForm = { title: '', excerpt: '', content: '', author: '', category: 'Freshmen Tips', image_url: '' };

const AdminBlog: React.FC = () => {
  const { profile } = useAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    const { data, error } = await dbService.getBlogPosts();
    if (!error && data) setPosts(data);
    setLoading(false);
  };

  useEffect(() => { fetchPosts(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, author: profile?.full_name ?? '' });
    setShowForm(true);
  };

  const openEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      image_url: post.image_url ?? '',
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.excerpt || !form.content || !form.author) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }
    setSaving(true);
    const payload = { ...form, image_url: form.image_url || null };

    if (editingId) {
      const { error } = await dbService.updateBlogPost(editingId, payload);
      if (error) { showToast('Failed to update post.', 'error'); }
      else { showToast('Post updated successfully!', 'success'); setShowForm(false); fetchPosts(); }
    } else {
      const { error } = await dbService.createBlogPost(payload);
      if (error) { showToast('Failed to create post.', 'error'); }
      else { showToast('Post published successfully!', 'success'); setShowForm(false); fetchPosts(); }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await dbService.deleteBlogPost(id);
    if (error) showToast('Failed to delete post.', 'error');
    else { showToast('Post deleted.', 'info'); setPosts(p => p.filter(x => x.id !== id)); }
    setDeleteConfirm(null);
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen pb-20 transition-colors">
      {/* Header */}
      <div className="bg-indigo-900 dark:bg-slate-950 py-12 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Admin Panel</p>
            <h1 className="text-3xl font-poppins font-bold">Blog Management</h1>
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-primary text-white px-5 py-3 rounded-xl font-bold hover:opacity-90 transition shadow-lg"
          >
            <Plus size={18} /> New Post
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <Loader size={32} className="animate-spin text-primary" />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-32 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-slate-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">No blog posts yet.</p>
            <button onClick={openCreate} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition">
              Create First Post
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 p-5 flex items-center gap-5 shadow-sm">
                {post.image_url && (
                  <img src={post.image_url} alt={post.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                )}
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-indigo-900 dark:text-white truncate">{post.title}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{post.author} · {new Date(post.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => openEdit(post)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(post.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl my-8 border border-gray-100 dark:border-slate-700">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-bold text-indigo-900 dark:text-white">
                {editingId ? 'Edit Post' : 'New Blog Post'}
              </h2>
              <button onClick={() => setShowForm(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 transition">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="Post title"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Author *</label>
                  <input
                    value={form.author}
                    onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                    placeholder="Author name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Category *</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Cover Image URL</label>
                <input
                  value={form.image_url}
                  onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
                {form.image_url && (
                  <div className="mt-2 rounded-xl overflow-hidden h-36 bg-gray-100 dark:bg-slate-700 border border-gray-200 dark:border-slate-600">
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}
                <p className="text-[11px] text-gray-400 mt-1.5">Use Unsplash URLs for best results: <span className="text-primary">images.unsplash.com</span></p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Excerpt *</label>
                <textarea
                  value={form.excerpt}
                  onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white resize-none"
                  placeholder="Short summary shown on the blog listing..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">Content *</label>
                <RichTextEditor
                  content={form.content}
                  onChange={html => setForm(f => ({ ...f, content: html }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-slate-800">
              <button onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {saving ? <Loader size={16} className="animate-spin" /> : <Save size={16} />}
                {editingId ? 'Save Changes' : 'Publish Post'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 max-w-sm w-full border border-gray-100 dark:border-slate-700 text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-indigo-900 dark:text-white mb-2">Delete this post?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-sm font-bold text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
