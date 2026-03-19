import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ArrowLeft, Chrome, Loader2, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const { Link, useNavigate } = ReactRouterDOM;

const LEVELS = ['100L', '200L', '300L', '400L', '500L', 'Alumni', 'Staff'];

const Register: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [level, setLevel] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp, signInWithGoogle } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setIsLoading(true);
    const { error } = await signUp(email, password, fullName);
    setIsLoading(false);
    if (error) {
      const msg = error.message === 'User already registered'
        ? 'An account with this email already exists.'
        : error.message;
      setError(msg);
      showToast(msg, 'error');
    } else {
      showToast('Account created! Check your email to confirm.', 'success');
      setSuccess(true);
    }
  };

  const handleGoogle = async () => {
    setError('');
    const { error } = await signInWithGoogle();
    if (error) setError(error.message);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 p-12 text-center">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-2xl font-poppins font-bold text-indigo-900 dark:text-white mb-3">You're almost in!</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
            We sent a confirmation link to <span className="font-bold text-indigo-900 dark:text-white">{email}</span>. Check your inbox and click the link to activate your account.
          </p>
          <Link to="/login" className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all">
            Go to Sign In <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        {/* Left Side */}
        <div className="md:w-1/2 bg-indigo-900 dark:bg-slate-950 p-12 text-white relative flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Fellowship"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 to-transparent"></div>
          </div>

          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center text-indigo-200 hover:text-white mb-12 transition group">
              <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </Link>
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">
              Join the <br /><span className="text-primary">FCS Family!</span>
            </h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-xs">
              Create your account to access the AI Study Buddy, test simulator, and personalized resources.
            </p>
          </div>

          <div className="relative z-10 space-y-4">
            {['Access AI Study Buddy', 'Save test results & history', 'Register for SOD & events'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
                <span className="text-sm text-indigo-100/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-primary/20 blur-3xl rounded-full"></div>
        </div>

        {/* Right Side */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-gray-500 dark:text-gray-400">Join thousands of students at FUTMINNA.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-2xl text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                <input required type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Academic Level</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}
                className="w-full px-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary transition-all dark:text-white appearance-none">
                <option value="">Select your level</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <button type="submit" disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2">
              {isLoading ? <><Loader2 size={18} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative flex items-center justify-center mb-5">
              <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
              <span className="px-4 text-xs font-bold text-gray-400 uppercase bg-white dark:bg-slate-800">Or</span>
              <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
            </div>
            <button onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-slate-700 rounded-2xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-gray-600 dark:text-gray-300">
              <Chrome size={18} className="text-red-500" /> Continue with Google
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
