import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Mail, Lock, ArrowRight, Eye, EyeOff, ArrowLeft, Chrome, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const { Link, useNavigate, useLocation } = ReactRouterDOM;

type Mode = 'signin' | 'forgot';

const Login: React.FC = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { signIn, signInWithGoogle, resetPassword } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from || '/';

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { error } = await signIn(email, password);
    setIsLoading(false);
    if (error) {
      const msg = error.message === 'Invalid login credentials'
        ? 'Incorrect email or password. Please try again.'
        : error.message;
      setError(msg);
      showToast(msg, 'error');
    } else {
      navigate(from, { replace: true });
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side */}
        <div className="md:w-1/2 bg-indigo-900 dark:bg-slate-950 p-12 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1523050335102-c824af0331d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Campus"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center text-indigo-200 hover:text-white mb-12 transition group">
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
              Welcome Back, <br /><span className="text-primary">Scholar!</span>
            </h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-xs">
              Sign in to access your personalized study plans, saved resources, and test history.
            </p>
          </div>

          <div className="relative z-10">
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
              <p className="text-sm italic mb-4">"The fear of the Lord is the beginning of wisdom, and knowledge of the Holy One is understanding."</p>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">— Proverbs 9:10</p>
            </div>
          </div>

          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">

          {mode === 'signin' && (
            <>
              <div className="mb-10">
                <h1 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-2">Sign In</h1>
                <p className="text-gray-500 dark:text-gray-400">Enter your credentials to continue your journey.</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      required type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                    <button type="button" onClick={() => setMode('forgot')} className="text-xs font-bold text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative group">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                    <input
                      required type={showPassword ? 'text' : 'password'} value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed">
                  {isLoading ? <><Loader2 size={18} className="animate-spin" /> Signing in...</> : <>Sign In <ArrowRight size={18} /></>}
                </button>
              </form>

              <div className="mt-8">
                <div className="relative flex items-center justify-center mb-6">
                  <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
                  <span className="px-4 text-xs font-bold text-gray-400 uppercase bg-white dark:bg-slate-800">Or continue with</span>
                  <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
                </div>
                <button onClick={handleGoogle}
                  className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-gray-600 dark:text-gray-300">
                  <Chrome size={18} className="text-red-500" /> Continue with Google
                </button>
              </div>

              <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary font-bold hover:underline">Create one</Link>
              </p>
            </>
          )}

          {mode === 'forgot' && (
            <>
              <button onClick={() => { setMode('signin'); setResetSent(false); setError(''); }}
                className="flex items-center text-gray-400 hover:text-primary mb-8 transition group text-sm font-bold">
                <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Sign In
              </button>

              {resetSent ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-3">Check your email</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    We sent a password reset link to <span className="font-bold text-indigo-900 dark:text-white">{email}</span>
                  </p>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h1 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-2">Reset Password</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Enter your email and we'll send you a reset link.</p>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-sm text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleForgotPassword} className="space-y-5">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                        />
                      </div>
                    </div>
                    <button type="submit" disabled={isLoading}
                      className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70">
                      {isLoading ? <><Loader2 size={18} className="animate-spin" /> Sending...</> : <>Send Reset Link <ArrowRight size={18} /></>}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
