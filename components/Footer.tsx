
import React from 'react';
import { Mail, Youtube, Twitter, Facebook, Instagram, Heart } from 'lucide-react';
// Fixed: Using star import for react-router-dom to resolve missing named exports issues in this environment
import * as ReactRouterDOM from 'react-router-dom';

const { Link } = ReactRouterDOM;

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-gray-100 dark:border-slate-800 pt-16 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/assets/icon.png" 
                alt="FCS Logo" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-poppins font-bold text-indigo-900 dark:text-white">FCS Futminna</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
              Fellowship of Christian Students, Federal University of Technology Minna.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/fcsfutminna" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="https://x.com/fcshdp" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="https://youtube.com/@FCSFUTMINNA" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Youtube size={20} /></a>
              <a href="https://www.facebook.com/fcsfutminna" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors"><Facebook size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-indigo-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/activities" className="hover:text-primary transition-colors">Activities</Link></li>
              <li><Link to="/sod" className="hover:text-primary transition-colors">SOD (School of Destiny)</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-indigo-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Fellowship</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/units" className="hover:text-primary transition-colors">Join a Unit</Link></li>
              <li><Link to="/simulator" className="hover:text-primary transition-colors">E-Test Simulator</Link></li>
              <li><Link to="/library" className="hover:text-primary transition-colors">E-Library</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-indigo-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Subscribe</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get the latest updates and study materials.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-full dark:text-white"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:opacity-90 transition">
                Join
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-50 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>© 2025 – {new Date().getFullYear() > 2025 ? new Date().getFullYear() : ''} FCS Futminna. All rights reserved.</p>
          <p className="flex items-center mt-4 md:mt-0">
            Made with <Heart size={14} className="mx-1 text-red-500" /> for the community
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
