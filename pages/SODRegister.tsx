
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Send, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  Target,
  CheckCircle,
  Clock
} from 'lucide-react';

const SODRegister: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full text-center bg-white p-12 rounded-[3rem] shadow-2xl border border-emerald-50 relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-2 bg-primary"></div>
          <div className="w-20 h-20 bg-emerald-50 text-primary rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
            <CheckCircle size={40} />
          </div>
          <h2 className="text-3xl font-poppins font-bold text-secondary mb-4">Registration Received!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Thank you for registering for the School of Destiny. Our coordination team will review your details and reach out via email within 3-5 business days.
          </p>
          <div className="space-y-4">
            <Link 
              to="/sod" 
              className="block w-full bg-secondary text-white font-bold py-4 rounded-2xl hover:bg-indigo-950 transition-all"
            >
              Back to SOD Home
            </Link>
            <Link 
              to="/" 
              className="block w-full bg-gray-50 text-gray-500 font-bold py-4 rounded-2xl hover:bg-gray-100 transition-all"
            >
              Return to Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      <section className="bg-secondary py-16 text-white text-center relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <Link to="/sod" className="inline-flex items-center text-indigo-200 hover:text-white mb-6 transition group">
            <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to SOD
          </Link>
          <h1 className="text-4xl font-poppins font-bold mb-4">Registration Form</h1>
          <p className="text-indigo-200 max-w-xl mx-auto">Take the first step towards a life of purpose and impact. Fill out the details below carefully.</p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
      </section>

      <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
        <form onSubmit={handleSubmit} className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100">
          <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div>
               <h2 className="text-2xl font-bold text-secondary">Registrant Information</h2>
               <p className="text-sm text-gray-500">All fields are required for consideration.</p>
             </div>
             <div className="flex items-center gap-2 text-primary font-bold text-sm bg-emerald-50 px-4 py-2 rounded-xl">
               <Clock size={16} /> Est. Time: 5 mins
             </div>
          </div>

          <div className="p-8 md:p-12 space-y-10">
            {/* Personal Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <User size={16} /> Personal Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="text" placeholder="e.g. Samuel Adekunle" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="email" placeholder="samuel@example.com" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Phone Number (WhatsApp Preferred)</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="tel" placeholder="+234 812 345 6789" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <GraduationCap size={16} /> Academic Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Department</label>
                  <div className="relative">
                    <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input required type="text" placeholder="e.g. Computer Science" className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Level</label>
                  <select required className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all appearance-none cursor-pointer">
                    <option value="">Select Level</option>
                    <option value="100">100 Level</option>
                    <option value="200">200 Level</option>
                    <option value="300">300 Level</option>
                    <option value="400">400 Level</option>
                    <option value="500">500 Level</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Motivation Section */}
            <div className="space-y-6">
              <h3 className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-xs">
                <Target size={16} /> Purpose & Goals
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Why do you want to participate in SOD?</label>
                  <textarea required rows={4} placeholder="Describe your current spiritual journey and why you feel SOD is the right step..." className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"></textarea>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">What are your top 3 expectations?</label>
                  <textarea required rows={4} placeholder="1. Clarity on my purpose&#10;2. Leadership skills&#10;3. ..." className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-none"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12 bg-gray-50 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
             <p className="text-sm text-gray-500 max-w-sm">
               By submitting, you agree to commit to the full 14-day intensive program schedule.
             </p>
             <button 
               type="submit" 
               disabled={loading}
               className={`w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:scale-[1.02] hover:opacity-90'}`}
             >
               {loading ? 'Submitting...' : 'Submit Registration'} <Send size={18} />
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SODRegister;
