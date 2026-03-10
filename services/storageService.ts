import { supabase } from '../lib/supabase';

export const storageService = {
  uploadFile: async (bucket: string, path: string, file: File) => {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    return { data, error };
  },

  getPublicUrl: (bucket: string, path: string) => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  deleteFile: async (bucket: string, path: string) => {
    const { error } = await supabase.storage.from(bucket).remove([path]);
    return { error };
  }
};
