
import React, { useState } from 'react';
import { 
  Mail, 
  MessageSquare, 
  MapPin, 
  Send, 
  Phone, 
  CheckCircle, 
  ArrowRight,
  Info,
  LifeBuoy,
  Users,
  MessageCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Contact: React.FC = () => {
  const [formState, setFormState] = useState<'idle' | 'loading' | 'success'>('idle');
  const [category, setCategory] = useState('General Inquiry');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('loading');
    // Simulate API call
    setTimeout(() => {
      setFormState('success');
    }, 1500);
  };

  if (formState === 'success') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50 dark:bg-slate-900">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-800 p-12 rounded-[3rem] shadow-2xl border border-emerald-50 dark:border-slate-700 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-primary"></div>
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/20 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-4">Message Sent!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            Thank you for reaching out. Your message has been routed to the appropriate unit. We'll get back to you within 24-48 hours.
          </p>
          <button 
            onClick={() => setFormState('idle')}
            className="block w-full bg-primary text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-emerald-900/10"
          >
            Send another message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 min-h-screen pb-24 transition-colors">
      {/* Hero Section */}
      <section className="relative py-24 bg-indigo-900 dark:bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-emerald-300 text-sm font-bold tracking-widest uppercase mb-8 border border-emerald-500/30">
            How can we help?
          </div>
          <h1 className="text-5xl md:text-6xl font-poppins font-bold mb-8">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-indigo-100 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Whether you're a freshman seeking support, a partner looking to collaborate, or just want to say hello—we're here for you.
          </p>
        </div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/20 blur-3xl rounded-full"></div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Information Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-slate-700">
              <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-8">Quick Support</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 text-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Us</p>
                    <p className="text-indigo-900 dark:text-white font-bold">hello@fcsfutminna.edu</p>
                    <p className="text-xs text-gray-500 mt-1">Response in 24h</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Visit Us</p>
                    <p className="text-indigo-900 dark:text-white font-bold leading-tight">Student Center, Level 4,<br/>Gidan Kwano Campus</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Call/WhatsApp</p>
                    <p className="text-indigo-900 dark:text-white font-bold">+234 812 345 6789</p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Study Buddy Plug */}
            <div className="bg-gradient-to-br from-primary to-emerald-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group">
              <div className="relative z-10">
                <Sparkles size={32} className="mb-4 text-emerald-200" />
                <h4 className="text-xl font-bold mb-2">Need an Instant Answer?</h4>
                <p className="text-sm text-emerald-50 mb-6 leading-relaxed">Our AI Study Buddy can help with 100L questions, survival tips, and more, instantly.</p>
                <Link to="/study-buddy" className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-xl font-bold text-sm hover:scale-105 transition-transform">
                  Chat with AI <ArrowRight size={16} />
                </Link>
              </div>
              <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 blur-3xl rounded-full"></div>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-[3rem] shadow-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
              <div className="p-8 md:p-12 border-b border-gray-50 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50">
                <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-2">Send us a Message</h2>
                <p className="text-gray-500 dark:text-gray-400">Please choose a category so we can route your message correctly.</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                {/* Category Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'Support', icon: LifeBuoy },
                    { name: 'PR/Collab', icon: Users },
                    { name: 'Feedback', icon: MessageCircle },
                    { name: 'General', icon: Info },
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setCategory(item.name)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                        category === item.name 
                        ? 'border-primary bg-emerald-50/50 dark:bg-emerald-950/20 text-primary' 
                        : 'border-gray-100 dark:border-slate-700 hover:border-emerald-200 dark:text-gray-400'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="text-xs font-bold uppercase tracking-widest">{item.name}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Your Name</label>
                    <input required type="text" placeholder="John Doe" className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Email Address</label>
                    <input required type="email" placeholder="john@example.com" className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Subject</label>
                  <input required type="text" placeholder={`Inquiry regarding ${category.toLowerCase()}...`} className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all dark:text-white" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">Message</label>
                  <textarea required rows={5} placeholder="How can we help you today?" className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-950 transition-all resize-none dark:text-white"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={formState === 'loading'}
                  className={`w-full bg-primary text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 flex items-center justify-center gap-2 hover:opacity-90 transition-all transform active:scale-[0.98] ${formState === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {formState === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links / Footer Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-indigo-900 dark:text-white mb-12">Connect with our Community</h2>
          <div className="flex flex-wrap justify-center gap-10">
            {[
              { name: 'Instagram', handle: '@fcs_futminna', color: 'text-pink-600' },
              { name: 'YouTube', handle: 'FCS Futminna TV', color: 'text-red-600' },
              { name: 'Facebook', handle: 'FCS Futminna Official', color: 'text-blue-600' },
              { name: 'X / Twitter', handle: '@fcs_futminna', color: 'text-slate-900 dark:text-white' },
            ].map((social) => (
              <div key={social.name} className="flex flex-col items-center">
                <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 flex items-center justify-center mb-4 hover:-translate-y-2 transition-transform cursor-pointer">
                  <MessageSquare size={24} className={social.color} />
                </div>
                <p className="text-sm font-bold text-indigo-900 dark:text-white">{social.name}</p>
                <p className="text-xs text-gray-500">{social.handle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
