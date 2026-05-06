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
  coupon_code: string | null;
  user_id: string | null;
  created_at?: string;
}

export interface SodCouponRow {
  id: string;
  code: string;
  department_id: string;
  used: boolean;
  used_by: string | null;
  created_by: string | null;
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

  // User role management
  getUserByEmail: async (email: string) => {
    const { data, error } = await supabase.from('profiles').select('id, full_name, email, role').eq('email', email).single();
    return { data, error };
  },

  updateUserRole: async (id: string, role: string) => {
    const { error } = await supabase.from('profiles').update({ role }).eq('id', id);
    return { error };
  },

  // SOD Coupons
  getSodCoupons: async () => {
    const { data, error } = await supabase
      .from('sod_coupons')
      .select('*, sod_departments(name)')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  createSodCoupon: async (department_id: string, created_by: string) => {
    const code = 'SOD-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from('sod_coupons')
      .insert({ code, department_id, created_by })
      .select()
      .single();
    return { data, error };
  },

  validateSodCoupon: async (code: string) => {
    const { data, error } = await supabase
      .from('sod_coupons')
      .select('*, sod_departments(*)')
      .eq('code', code.toUpperCase())
      .eq('used', false)
      .single();
    return { data, error };
  },

  markCouponUsed: async (code: string, used_by: string, id?: string) => {
    const query = supabase.from('sod_coupons').update({ used: true, used_by });
    const { error } = id ? await query.eq('id', id) : await query.eq('code', code.toUpperCase());
    return { error };
  },

  deleteSodCoupon: async (id: string) => {
    const { error } = await supabase.from('sod_coupons').delete().eq('id', id);
    return { error };
  },
  getSodSettings: async () => {
    const { data, error } = await supabase.from('sod_settings').select('*').eq('id', 'main').single();
    return { data, error };
  },

  updateSodSettings: async (countdown_target: string | null) => {
    const { data, error } = await supabase.from('sod_settings').upsert({ id: 'main', countdown_target }).select().single();
    return { data, error };
  },

  // SOD Exams
  getSodExams: async () => {
    const { data, error } = await supabase.from('sod_exams').select('*, sod_departments(name)').order('created_at', { ascending: false });
    return { data, error };
  },

  getSodExamsByDepartment: async (department_id: string) => {
    const { data, error } = await supabase.from('sod_exams').select('*').eq('department_id', department_id).eq('is_published', true);
    return { data, error };
  },

  getSodExam: async (id: string) => {
    const { data, error } = await supabase.from('sod_exams').select('*').eq('id', id).single();
    return { data, error };
  },

  createSodExam: async (exam: { department_id: string; title: string; description?: string; duration_minutes: number; pass_mark: number }) => {
    const { data, error } = await supabase.from('sod_exams').insert([exam]).select().single();
    return { data, error };
  },

  updateSodExam: async (id: string, updates: Partial<{ title: string; description: string; duration_minutes: number; pass_mark: number; is_published: boolean; results_visible: boolean }>) => {
    const { data, error } = await supabase.from('sod_exams').update(updates).eq('id', id).select().single();
    return { data, error };
  },

  deleteSodExam: async (id: string) => {
    const { error } = await supabase.from('sod_exams').delete().eq('id', id);
    return { error };
  },

  // SOD Questions
  getSodQuestions: async (exam_id: string) => {
    const { data, error } = await supabase.from('sod_questions').select('id, exam_id, question, type, options, marks, "order"').eq('exam_id', exam_id).order('order');
    return { data, error };
  },

  getSodQuestionsAdmin: async (exam_id: string) => {
    const { data, error } = await supabase.from('sod_questions').select('*').eq('exam_id', exam_id).order('order');
    return { data, error };
  },

  createSodQuestion: async (q: { exam_id: string; question: string; type: string; options: string[]; correct_answer: string; marks: number; order: number }) => {
    const { data, error } = await supabase.from('sod_questions').insert([q]).select().single();
    return { data, error };
  },

  updateSodQuestion: async (id: string, updates: Partial<{ question: string; type: string; options: string[]; correct_answer: string; marks: number; order: number }>) => {
    const { data, error } = await supabase.from('sod_questions').update(updates).eq('id', id).select().single();
    return { data, error };
  },

  deleteSodQuestion: async (id: string) => {
    const { error } = await supabase.from('sod_questions').delete().eq('id', id);
    return { error };
  },

  // SOD Submissions
  getMySubmission: async (exam_id: string, user_id: string) => {
    const { data, error } = await supabase.from('sod_submissions').select('*').eq('exam_id', exam_id).eq('user_id', user_id).maybeSingle();
    return { data, error };
  },

  startExam: async (exam_id: string, user_id: string, student_id: string) => {
    const { data, error } = await supabase.from('sod_submissions').insert([{ exam_id, user_id, student_id }]).select().single();
    return { data, error };
  },

  getSodSubmissions: async (exam_id: string) => {
    const { data, error } = await supabase.from('sod_submissions').select('*, sod_answers(*, sod_questions(id, question, type, marks, "order"))').eq('exam_id', exam_id).order('created_at', { ascending: false });
    return { data, error };
  },

  updateAnswerMarks: async (answer_id: string, marks_awarded: number) => {
    const { error } = await supabase.from('sod_answers').update({ marks_awarded }).eq('id', answer_id);
    return { error };
  },

  finalizeGrading: async (submission_id: string) => {
    const { data: answers, error: aErr } = await supabase.from('sod_answers').select('marks_awarded').eq('submission_id', submission_id);
    if (aErr) return { error: aErr };
    const score = (answers ?? []).reduce((sum, a) => sum + (a.marks_awarded ?? 0), 0);
    const { error } = await supabase.from('sod_submissions').update({ score, graded: true }).eq('id', submission_id);
    return { error };
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
