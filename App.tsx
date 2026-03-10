
import React, { useState, useEffect, useRef } from 'react';
// Fixed: Using star import for react-router-dom to resolve missing named exports issues in this environment
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Sun,
  Moon
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
import Footer from './components/Footer';

// Fixed: Destructuring from star import to bypass named export resolution errors
const { HashRouter, Routes, Route, Link, useLocation } = ReactRouterDOM;
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
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative w-10 h-10">
                <img 
                  src="https://www.facebook.com/photo/?fbid=850097043824206&set=a.549911547176092" 
                  alt="FCS Logo" 
                  className="w-full h-full object-contain rounded-full shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLImageElement).classList.add('hidden');
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent) {
                      const fallback = parent.querySelector('.fallback-logo');
                      if (fallback) fallback.classList.remove('hidden');
                    }
                  }}
                />
                <div className="fallback-logo hidden absolute inset-0 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl border-2 border-white dark:border-slate-800 shadow-sm">
                  F
                </div>
              </div>
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

            <Link 
              to="/simulator" 
              className="bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition shadow-lg shadow-emerald-100 dark:shadow-none"
            >
              Get Started
            </Link>
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
          
          <Link
            to="/simulator"
            onClick={() => setIsOpen(false)}
            className="block py-3 mt-4 bg-primary text-white text-center rounded-xl font-bold shadow-lg"
          >
            Try Simulator
          </Link>
        </div>
      )}
    </nav>
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
