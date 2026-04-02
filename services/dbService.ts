import { supabase } from '../lib/supabase';
import { BlogPost, Sermon, Book, Event } from '../types';

export interface UnitRow {
  id: string;
  name: string;
  description: string;
  long_description: string | null;
  icon: string;
  color: string;
  border: string;
  img: string | null;
  activities: string[];
  meetings: string | null;
  requirements: string | null;
  created_at?: string;
}

export interface SodDepartmentRow {
  id: string;
  name: string;
  description: string;
  teachers: string[];
  fee: number;
  image_url: string | null;
  created_at?: string;
}

export interface SodRegistrationRow {
  id: string;
  department_id: string;
  full_name: string;
  email: string;
  phone: string;
  level: string;
  faculty_dept: string;
  paystack_ref: string | null;
  payment_status: 'pending' | 'paid';
  student_id: string;
  photo_url: string | null;
  created_at?: string;
}

export interface ActivityRow {
  id: string;
  title: string;
  description: string;
  long_description: string | null;
  date: string;
  end_date: string | null;
  time: string;
  location: string;
  type: 'General' | 'Workshop' | 'Outreach' | 'Prayer';
  featured: boolean;
  image_url: string | null;
  expectations: string[];
  created_at?: string;
}

export const dbService = {
  // Blog Posts
  getBlogPosts: async () => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });
    return { data: data as BlogPost[], error };
  },

  getBlogPost: async (id: string) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();
    return { data: data as BlogPost, error };
  },

  createBlogPost: async (post: Omit<BlogPost, 'id' | 'date'>) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert([post])
      .select()
      .single();
    return { data: data as BlogPost, error };
  },

  updateBlogPost: async (id: string, updates: Partial<Omit<BlogPost, 'id' | 'date'>>) => {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data: data as BlogPost, error };
  },

  deleteBlogPost: async (id: string) => {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);
    return { error };
  },

  // Units
  getUnits: async () => {
    const { data, error } = await supabase.from('units').select('*').order('name');
    return { data, error };
  },

  getUnit: async (id: string) => {
    const { data, error } = await supabase.from('units').select('*').eq('id', id).single();
    return { data, error };
  },

  createUnit: async (unit: Omit<UnitRow, 'created_at'>) => {
    const { data, error } = await supabase.from('units').insert([unit]).select().single();
    return { data, error };
  },

  updateUnit: async (id: string, updates: Partial<Omit<UnitRow, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('units').update(updates).eq('id', id).select().single();
    return { data, error };
  },

  deleteUnit: async (id: string) => {
    const { error } = await supabase.from('units').delete().eq('id', id);
    return { error };
  },

  // Activities
  getActivities: async () => {
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    return { data, error };
  },

  getActivity: async (id: string) => {
    const { data, error } = await supabase.from('activities').select('*').eq('id', id).single();
    return { data, error };
  },

  createActivity: async (activity: Omit<ActivityRow, 'created_at'>) => {
    const { data, error } = await supabase.from('activities').insert([activity]).select().single();
    return { data, error };
  },

  updateActivity: async (id: string, updates: Partial<Omit<ActivityRow, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('activities').update(updates).eq('id', id).select().single();
    return { data, error };
  },

  deleteActivity: async (id: string) => {
    const { error } = await supabase.from('activities').delete().eq('id', id);
    return { error };
  },

  // SOD Departments
  getSodDepartments: async () => {
    const { data, error } = await supabase.from('sod_departments').select('*').order('created_at', { ascending: true });
    return { data: data as SodDepartmentRow[], error };
  },

  createSodDepartment: async (dept: Omit<SodDepartmentRow, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('sod_departments').insert([dept]).select().single();
    return { data: data as SodDepartmentRow, error };
  },

  updateSodDepartment: async (id: string, updates: Partial<Omit<SodDepartmentRow, 'id' | 'created_at'>>) => {
    const { data, error } = await supabase.from('sod_departments').update(updates).eq('id', id).select().single();
    return { data: data as SodDepartmentRow, error };
  },

  deleteSodDepartment: async (id: string) => {
    const { error } = await supabase.from('sod_departments').delete().eq('id', id);
    return { error };
  },

  // SOD Registrations
  getSodRegistrations: async () => {
    const { data, error } = await supabase
      .from('sod_registrations')
      .select('*, sod_departments(name)')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createSodRegistration: async (reg: Omit<SodRegistrationRow, 'id' | 'created_at'>) => {
    const { data, error } = await supabase.from('sod_registrations').insert([reg]).select().single();
    return { data: data as SodRegistrationRow, error };
  },

  updateSodRegistration: async (id: string, updates: Partial<SodRegistrationRow>) => {
    const { data, error } = await supabase.from('sod_registrations').update(updates).eq('id', id).select().single();
    return { data: data as SodRegistrationRow, error };
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
  },
};
