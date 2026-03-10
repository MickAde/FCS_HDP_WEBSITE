
import React, { useState } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  ArrowLeft,
  Github,
  Chrome
} from 'lucide-react';

const { Link, useNavigate, useLocation } = ReactRouterDOM;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate authentication and store state
    setTimeout(() => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoading(false);
      
      // Redirect back to where the user came from, or home
      const from = (location.state as any)?.from || '/';
      navigate(from, { replace: true });
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-5xl w-full bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* Left Side: Branding/Imagery */}
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
            <h2 className="text-3xl md:text-4xl font-poppins font-bold mb-6">Welcome Back, <br/><span className="text-primary">Scholar!</span></h2>
            <p className="text-indigo-100/70 text-lg leading-relaxed max-w-xs">
              Sign in to access your personalized study plans, saved blog posts, and test history.
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

        {/* Right Side: Form */}
        <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10 text-center md:text-left">
            <h1 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400">Enter your credentials to continue your journey.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Password</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Forgot?</a>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  required 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white" 
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer" />
              <label htmlFor="remember" className="text-xs text-gray-600 dark:text-gray-400 cursor-pointer select-none">Keep me signed in</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 hover:opacity-90 transition-all transform active:scale-[0.98] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
              <span className="px-4 text-xs font-bold text-gray-400 uppercase bg-white dark:bg-slate-800 relative z-10">Or continue with</span>
              <div className="flex-grow border-t border-gray-100 dark:border-slate-700"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-gray-600 dark:text-gray-300">
                <Chrome size={18} className="text-red-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all text-sm font-bold text-gray-600 dark:text-gray-300">
                <Github size={18} className="text-gray-900 dark:text-white" /> Github
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? <Link to="/sod/register" className="text-primary font-bold hover:underline">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
