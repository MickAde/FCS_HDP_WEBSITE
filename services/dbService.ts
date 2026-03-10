import { supabase } from '../lib/supabase';
import { BlogPost, Sermon, Book, Event } from '../types';

export const dbService = {
  // Blog Posts
  getBlogPosts: async () => {
    const { data, error } = await supabase.from('blog_posts').select('*').order('date', { ascending: false });
    return { data: data as BlogPost[], error };
  },

  getBlogPost: async (id: string) => {
    const { data, error } = await supabase.from('blog_posts').select('*').eq('id', id).single();
    return { data: data as BlogPost, error };
  },

  // Sermons
  getSermons: async () => {
    const { data, error } = await supabase.from('sermons').select('*').order('date', { ascending: false });
    return { data: data as Sermon[], error };
  },

  // Books
  getBooks: async () => {
    const { data, error } = await supabase.from('books').select('*');
    return { data: data as Book[], error };
  },

  // Events
  getEvents: async () => {
    const { data, error } = await supabase.from('events').select('*').order('date', { ascending: false });
    return { data: data as Event[], error };
  }
};
