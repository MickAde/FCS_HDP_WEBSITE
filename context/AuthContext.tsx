import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { Profile } from '../types';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signInWithGoogle: () => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const initialLoad = React.useRef(true);

  useEffect(() => {
    const { data: { subscription } } = authService.onAuthStateChange(async (currentUser) => {
      if (initialLoad.current) {
        // On first load just restore session silently
        setUser(currentUser);
        if (currentUser) {
          const p = await authService.getProfile(currentUser.id);
          setProfile(p);
        }
        initialLoad.current = false;
        setLoading(false);
        return;
      }

      // Subsequent changes = real sign in / sign out
      if (currentUser) {
        const p = await authService.getProfile(currentUser.id);
        setProfile(p);
        setUser(currentUser);
        const name = p?.full_name?.split(' ')[0] ?? 'back';
        showToast(`Welcome, ${name}! 🙌`, 'success');
      } else {
        setUser(null);
        setProfile(null);
        showToast('You have been signed out. See you soon!', 'info');
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await authService.signIn(email, password);
    return { error };
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { error } = await authService.signUp(email, password, fullName);
    return { error };
  };

  const signInWithGoogle = async () => {
    const { error } = await authService.signInWithGoogle();
    return { error };
  };

  const signOut = async () => {
    await authService.signOut();
  };

  const resetPassword = async (email: string) => {
    const { error } = await authService.resetPassword(email);
    if (!error) showToast('Password reset email sent! Check your inbox.', 'success');
    else showToast(error.message, 'error');
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    const { data, error } = await authService.updateProfile(user.id, updates);
    if (data) {
      setProfile(data as Profile);
      showToast('Profile updated successfully!', 'success');
    }
    if (error) showToast('Failed to update profile.', 'error');
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signInWithGoogle, signOut, resetPassword, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
