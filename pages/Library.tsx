
import React from 'react';
// Fixed: Using star import for react-router-dom to resolve missing named exports issues in this environment
import * as ReactRouterDOM from 'react-router-dom';
import { 
  Smartphone, 
  Download, 
  ShieldCheck, 
  Zap, 
  WifiOff, 
  Bell, 
  ArrowRight,
  Info
} from 'lucide-react';

const { Link } = ReactRouterDOM;

const Library: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-24 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-indigo-900 dark:bg-slate-950 py-24 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-emerald-500/30">
            <Smartphone size={14} /> Mobile Experience
          </div>
          <h1 className="text-5xl md:text-7xl font-poppins font-bold mb-8">
            <span className="text-primary">E-Library</span>, In Your Pocket.
          </h1>
          <p className="text-indigo-100 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-12">
            We've built a dedicated mobile app to give you the best reading experience. Access hundreds of books, study guides, and resources even without an internet connection.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a 
              href="/fcs-library-v1.apk" 
              download
              className="bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-3"
            >
              <Download size={24} /> Download for Android (.APK)
            </a>
            <button className="bg-white/10 backdrop-blur-md border border-white/20 px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              Learn More <ArrowRight size={20} />
            </button>
          </div>
          <p className="mt-6 text-sm text-indigo-200/60 italic">Version 1.2.0 • Last updated: Oct 2024 • 18.5 MB</p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 blur-3xl rounded-full"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
      </section>

      {/* App Features Bento Grid */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-4">Why use the Mobile App?</h2>
          <p className="text-gray-500 dark:text-gray-400">The mobile app is optimized for your smartphone, offering features not available on the website.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 dark:bg-slate-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-2xl flex items-center justify-center mb-8">
              <WifiOff size={28} />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-4">Offline Access</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Download your favorite books and study materials once and read them anywhere, even in lecture halls with poor signal.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-950/30 text-blue-600 rounded-2xl flex items-center justify-center mb-8">
              <Bell size={28} />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-4">Smart Notifications</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Be the first to know when new study guides are uploaded or when there's an upcoming fellowship activity.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-slate-800 p-10 rounded-[2.5rem] border border-gray-100 dark:border-slate-700 transition-colors">
            <div className="w-14 h-14 bg-purple-50 dark:bg-purple-950/30 text-purple-600 rounded-2xl flex items-center justify-center mb-8">
              <Zap size={28} />
            </div>
            <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-4">Fast Performance</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              The app is designed to be lightweight and fast, ensuring smooth navigation even on older Android devices.
            </p>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] p-8 md:p-16 border border-gray-100 dark:border-slate-700 shadow-xl transition-colors">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <Info size={24} />
              </div>
              <h2 className="text-2xl md:text-3xl font-poppins font-bold text-indigo-900 dark:text-white">How to Install</h2>
            </div>
            
            <div className="space-y-10">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-900 dark:bg-primary text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-white mb-2">Download the APK</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Click the download button above to save the file to your device.</p>
                </div>
              </div>
              
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-900 dark:bg-primary text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-white mb-2">Allow Unknown Sources</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Open your Phone Settings > Security and enable "Install from Unknown Sources" or "Allow from this source" for your browser.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-900 dark:bg-primary text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-bold text-indigo-900 dark:text-white mb-2">Install & Enjoy</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Locate the downloaded file in your "Downloads" folder and tap it to install.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-4">
              <ShieldCheck className="text-primary flex-shrink-0" size={24} />
              <p className="text-xs text-emerald-800 dark:text-emerald-400 font-medium">
                Verified Secure: This application is developed and maintained by the FCS Futminna Media Unit.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-24 text-center">
        <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-4">Having trouble installing?</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-8">Visit our support desk or send us a message.</p>
        <Link to="/contact" className="text-primary font-bold hover:underline flex items-center justify-center gap-2">
          Contact Support <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
};

export default Library;
