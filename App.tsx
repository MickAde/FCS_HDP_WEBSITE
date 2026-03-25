
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
// Fixed: Using star import for react-router-dom to resolve missing named exports issues in this environment
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Sun,
  Moon,
  LogOut,
  User,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// Components
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import Simulator from './pages/Simulator';
import About from './pages/About';
import Units from './pages/Units';
import UnitDetail from './pages/UnitDetail';
import Library from './pages/Library';
import Sermons from './pages/Sermons';
import Gallery from './pages/Gallery';
import Activities from './pages/Activities';
import ActivityDetail from './pages/ActivityDetail';
import SOD from './pages/SOD';
import SODRegister from './pages/SODRegister';
import StudyBuddy from './pages/StudyBuddy';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminBlog from './pages/AdminBlog';
import AdminUnits from './pages/AdminUnits';
import AdminActivities from './pages/AdminActivities';
import Footer from './components/Footer';

// Fixed: Destructuring from star import to bypass named export resolution errors
const { HashRouter, Routes, Route, Link, useLocation, Navigate } = ReactRouterDOM;
const Router = HashRouter;

const Navbar = ({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean; toggleDarkMode: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Blog', path: '/blog' },
    { name: 'Units', path: '/units' },
    { name: 'Activities', path: '/activities' },
    { name: 'SOD', path: '/sod' },
    { name: 'Contact', path: '/contact' },
  ];

  const resourceLinks = [
    { name: 'E-Library', path: '/library' },
    { name: 'Audio Sermons', path: '/sermons' },
    { name: 'Photo Gallery', path: '/gallery' },
    { name: 'E-Test Simulator', path: '/simulator' },
    { name: 'AI Study Buddy', path: '/study-buddy' },
  ];

  const isResourceActive = resourceLinks.some(link => location.pathname === link.path);

  return (
    <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
              <img 
                src="/assets/icon.png" 
                alt="FCS Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-poppins font-bold text-indigo-900 dark:text-white">FCS Futminna</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`${
                  location.pathname === link.path 
                  ? 'text-primary font-semibold' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary transition'
                } text-sm font-medium`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="relative" ref={dropdownRef}>
              <button
                onMouseEnter={() => setIsDropdownOpen(true)}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1 text-sm font-medium transition ${
                  isResourceActive || isDropdownOpen ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary'
                }`}
              >
                <span>Resources</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div 
                  onMouseLeave={() => setIsDropdownOpen(false)}
                  className="absolute top-full right-0 mt-1 w-56 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-xl py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  {resourceLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center px-4 py-2 text-sm transition ${
                        location.pathname === link.path 
                        ? 'text-primary bg-emerald-50 dark:bg-emerald-950/30 font-semibold' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {link.name === 'AI Study Buddy' && <Sparkles size={14} className="mr-2 text-primary" />}
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <AuthButtons />
          </div>

          <div className="md:hidden flex items-center space-x-2">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-gray-600 dark:text-gray-300"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600 dark:text-gray-300 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 pb-4 px-4 space-y-1 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block py-2 px-3 rounded-lg text-sm font-medium ${
                location.pathname === link.path ? 'text-primary bg-emerald-50 dark:bg-emerald-950/20' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          <div className="py-2 border-t border-gray-50 dark:border-slate-800 mt-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Resources</p>
            {resourceLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center py-2 px-3 rounded-lg text-sm font-medium ${
                  location.pathname === link.path ? 'text-primary bg-emerald-50 dark:bg-emerald-950/20' : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.name === 'AI Study Buddy' && <Sparkles size={14} className="mr-2 text-primary" />}
                {link.name}
              </Link>
            ))}
          </div>
          
          <Link to="/simulator" onClick={() => setIsOpen(false)} className="block py-3 mt-4 bg-primary text-white text-center rounded-xl font-bold shadow-lg">
            Try Simulator
          </Link>
          <MobileAuthButtons setIsOpen={setIsOpen} />
        </div>
      )}
    </nav>
  );
};

// Only admins and leaders can access admin routes
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin' && profile?.role !== 'leader') return <Navigate to="/" replace />;
  return <>{children}</>;
};

// Redirect logged-in users away from login/register
const ProtectedLoginRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AuthButtons = () => {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (user) {
    const name = profile?.full_name ?? user.email;
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

    return (
      <div className="relative" ref={ref}>
        <button onClick={() => setOpen(!open)}
          className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 dark:border-slate-700 hover:border-primary transition-all bg-white dark:bg-slate-800 shadow-sm">
          {avatarUrl
            ? <img src={avatarUrl} alt={name} className="w-7 h-7 rounded-full object-cover" />
            : <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{initials}</div>
          }
          <span className="text-sm font-semibold text-indigo-900 dark:text-white max-w-[80px] truncate">
            {profile?.full_name?.split(' ')[0] ?? 'Member'}
          </span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="px-4 py-3 border-b border-gray-50 dark:border-slate-700">
              <p className="text-sm font-bold text-indigo-900 dark:text-white truncate">{profile?.full_name ?? 'Member'}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
              {profile?.level && <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-widest text-primary bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">{profile.level}</span>}
            </div>
            {(profile?.role === 'admin' || profile?.role === 'leader') && (
              <div className="border-b border-gray-50 dark:border-slate-700">
                <Link to="/admin/blog" onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-indigo-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <User size={16} className="text-primary" /> Manage Blog
                </Link>
                <Link to="/admin/units" onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-indigo-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <User size={16} className="text-primary" /> Manage Units
                </Link>
                <Link to="/admin/activities" onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-indigo-900 dark:text-white hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                  <User size={16} className="text-primary" /> Manage Activities
                </Link>
              </div>
            )}
            <button onClick={() => { signOut(); setOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors rounded-b-2xl">
              <LogOut size={16} /> Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link to="/login" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary transition px-3 py-2">
        Sign In
      </Link>
      <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg shadow-emerald-100 dark:shadow-none">
        Join Us
      </Link>
    </div>
  );
};

const MobileAuthButtons = ({ setIsOpen }: { setIsOpen: (v: boolean) => void }) => {
  const { user, profile, signOut } = useAuth();
  if (user) {
    const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
    const name = profile?.full_name ?? user.email;
    const initials = name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
    return (
      <div className="mt-2 border-t border-gray-100 dark:border-slate-800 pt-3">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          {avatarUrl
            ? <img src={avatarUrl} alt={name} className="w-9 h-9 rounded-full object-cover" />
            : <div className="w-9 h-9 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">{initials}</div>
          }
          <div>
            <p className="text-sm font-bold text-indigo-900 dark:text-white">{profile?.full_name ?? 'Member'}</p>
            <p className="text-xs text-gray-400 truncate max-w-[180px]">{user.email}</p>
          </div>
        </div>
        <button onClick={() => { signOut(); setIsOpen(false); }}
          className="w-full flex items-center justify-center gap-2 py-3 border border-red-100 dark:border-red-900/30 text-red-500 rounded-xl font-bold text-sm">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    );
  }
  return (
    <div className="mt-2 flex flex-col gap-2">
      <Link to="/login" onClick={() => setIsOpen(false)}
        className="block py-3 border border-gray-200 dark:border-slate-700 text-indigo-900 dark:text-white text-center rounded-xl font-bold text-sm">
        Sign In
      </Link>
      <Link to="/register" onClick={() => setIsOpen(false)}
        className="block py-3 bg-primary text-white text-center rounded-xl font-bold text-sm">
        Join Us
      </Link>
    </div>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <Router>
      <ToastProvider>
      <AuthProvider>
      <div className="min-h-screen flex flex-col bg-[#fcfcfd] dark:bg-slate-900 text-gray-900 dark:text-gray-100 transition-colors">
        <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:postId" element={<BlogPostDetail />} />
            <Route path="/units" element={<Units />} />
            <Route path="/units/:unitId" element={<UnitDetail />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/activities/:activityId" element={<ActivityDetail />} />
            <Route path="/sod" element={<SOD />} />
            <Route path="/sod/register" element={<SODRegister />} />
            <Route path="/library" element={<Library />} />
            <Route path="/sermons" element={<Sermons />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/simulator" element={<Simulator />} />
            <Route path="/study-buddy" element={<StudyBuddy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<ProtectedLoginRoute><Login /></ProtectedLoginRoute>} />
            <Route path="/register" element={<ProtectedLoginRoute><Register /></ProtectedLoginRoute>} />
            <Route path="/admin/blog" element={<AdminRoute><AdminBlog /></AdminRoute>} />
            <Route path="/admin/units" element={<AdminRoute><AdminUnits /></AdminRoute>} />
            <Route path="/admin/activities" element={<AdminRoute><AdminActivities /></AdminRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
      </AuthProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
