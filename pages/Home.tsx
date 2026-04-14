
import React, { useState, useEffect } from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  BrainCircuit, 
  ChevronRight, 
  Star, 
  Quote, 
  Library, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Camera,
  MapPin,
  Heart,
  Search,
  ArrowDown,
  Flame,
  Music,
  HeartHandshake,
  Cross,
  ArrowRight
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

const { Link } = ReactRouterDOM;

const HERO_IMAGES = [
  "../public/assets/images/dance2.jpg",
  "../public/assets/images/audience.jpg",
  "../public/assets/images/audience1.jpg",
  "../public/assets/images/gp_pray.jpg",
  "../public/assets/images/dance1.jpg"
];

const FeatureCard = ({ icon: Icon, title, description, link, bgImage }: any) => (
  <div className="group relative bg-white dark:bg-slate-800 p-8 rounded-3xl border border-gray-100 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 flex flex-col overflow-hidden">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
      <img src={bgImage} alt="" className="w-full h-full object-cover" />
    </div>
    <div className="relative z-10">
      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/30 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 flex-grow">{description}</p>
      <Link to={link} className="inline-flex items-center text-primary font-semibold text-sm hover:gap-2 transition-all">
        Explore Now <ChevronRight size={16} className="ml-1" />
      </Link>
    </div>
  </div>
);

const Home: React.FC = () => {
  const [insight, setInsight] = useState<string>("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: "Generate a short (max 20 words) spiritual quote or scripture-based encouragement for a university student focused on leadership and purpose in Christ. No hashtags.",
        });
        setInsight(response.text || "Your purpose is not accidental. You were chosen to be a light on this campus.");
      } catch (e) {
        setInsight("Let your light so shine before men, that they may see your good works and glorify your Father.");
      } finally {
        setLoadingInsight(false);
      }
    };
    fetchInsight();

    const bgTimer = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);

    return () => clearInterval(bgTimer);
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 bg-indigo-950 dark:bg-slate-950 text-white transition-colors duration-1000">
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((img, idx) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out bg-cover bg-center mix-blend-overlay ${
                idx === currentBgIndex ? 'opacity-40' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/90 via-indigo-900/60 to-slate-900/90 dark:from-slate-950 dark:via-indigo-950/80 dark:to-slate-900"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <span className="inline-block py-2 px-6 rounded-full bg-primary/20 text-emerald-300 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-md border border-emerald-400/20">
                Fellowship of Christian Students (FCS)
              </span>
              <h1 className="text-5xl md:text-7xl font-poppins font-black leading-tight mb-8">
                Welcome to <span className="text-primary">His Dwelling Place</span>.
              </h1>
              <p className="text-indigo-100/80 text-lg md:text-xl mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                More than a fellowship, we are a family. Whether you are looking for a place to grow, a shoulder to lean on, or a home away from home at FUTMINNA, there is a seat at the table for you.
              </p>
              
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2.5rem] mb-12 text-left relative overflow-hidden max-w-lg mx-auto lg:mx-0 shadow-2xl">
                <Sparkles className="absolute top-6 right-6 text-emerald-400 animate-pulse" size={24} />
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-3">A Word for Your Soul</p>
                <p className="text-lg italic leading-relaxed font-medium">
                  "{loadingInsight ? "Waiting on a word..." : insight}"
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/activities" className="group bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-2">
                  Join our Next Service <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/units" className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 rounded-2xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2">
                  <Users size={18} /> Find Your Service Unit
                </Link>
              </div>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="relative z-10 animate-float grid grid-cols-2 gap-6">
                <div className="space-y-6">
                  <img 
                    src="../public/assets/images/audience.jpg" 
                    alt="Worship" 
                    className="rounded-[3rem] shadow-2xl border border-white/10 h-72 w-full object-cover"
                  />
                  <div className="bg-primary/90 backdrop-blur-md p-6 rounded-[2.5rem] text-white">
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">You’ve Found</p>
                    <p className="text-2xl font-black mb-1">A Home of Love</p>
                  </div>
                </div>
                <div className="space-y-6 pt-12">
                  <div className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/10 text-white">
                    <p className="text-2xl font-black mb-1">3000+ Hearts</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-80"> United in Christ.</p>
                  </div>
                  <img 
                    src="../public/assets/images/audience1.jpg" 
                    alt="Fellowship" 
                    className="rounded-[3rem] shadow-2xl border border-white/10 h-72 w-full object-cover"
                  />
                </div>
              </div>
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary/20 blur-[100px] rounded-full"></div>
              <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* The Core Pillars Section */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="text-primary font-bold text-xs uppercase tracking-[0.4em] mb-4 block">The Heart of FCS</span>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold text-indigo-950 dark:text-white">Our Foundation in Christ</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                title: "Deep Worship", 
                desc: "Lose yourself in His presence. Our worship isn’t just music. It’s a heartfelt encounter where you meet God.",
                icon: Music,
                color: "rose"
              },
              { 
                title: "Sound Doctrine", 
                desc: "Truth that anchors. Navigate campus life with clarity through teachings that are deeply rooted in Scripture.",
                icon: Cross,
                color: "blue"
              },
              { 
                title: "Genuine Love", 
                desc: "Here, you’re never alone. We carry each other's burdens and celebrate every victory together.",
                icon: HeartHandshake,
                color: "emerald"
              }
            ].map((item, idx) => (
              <div key={idx} className="group relative p-10 bg-gray-50 dark:bg-slate-800 rounded-[3rem] border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 hover:shadow-2xl transition-all duration-500 text-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 text-primary rounded-[2rem] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform mx-auto">
                  <item.icon size={36} />
                </div>
                <h3 className="text-2xl font-bold text-indigo-900 dark:text-white mb-4">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Life at FCS - Dynamic Visual Section */}
      <section className="py-24 bg-indigo-900 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2">
                <h2 className="text-4xl md:text-6xl font-poppins font-bold text-white mb-8 leading-tight">Much More Than a Fellowship.</h2>
                <p className="text-indigo-100/70 text-lg mb-12 leading-relaxed">
                  We are a training ground for destiny. Whether through our School of Destiny (SOD), missions outreaches, or service units, we provide the platform for you to discover and refine your divine assignment.
                </p>
                <div className="grid grid-cols-2 gap-10">
                   <div className="flex flex-col">
                     <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                       <Flame size={20} />
                     </span>
                     <h4 className="text-white font-bold mb-2">Spiritual Fire</h4>
                     <p className="text-xs text-indigo-200/60 uppercase tracking-widest leading-relaxed">Igniting passion for God's kingdom.</p>
                   </div>
                   <div className="flex flex-col">
                     <span className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4">
                       <Users size={20} />
                     </span>
                     <h4 className="text-white font-bold mb-2">Community Support</h4>
                     <p className="text-xs text-indigo-200/60 uppercase tracking-widest leading-relaxed">A home for every tribe and tongue.</p>
                   </div>
                </div>
              </div>
              <div className="lg:w-1/2 relative">
                <div className="relative z-10 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[4rem]">
                   <img 
                     src="../public/assets/images/gp_pray.jpg" 
                     className="rounded-[3rem] w-full h-[500px] object-cover" 
                     alt="Students Together" 
                   />
                </div>
                <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 blur-[100px] rounded-full"></div>
              </div>
           </div>
        </div>
      </section>

      {/* Balanced Excellence - Academics Supporting Spirit */}
      <section className="py-32 bg-gray-50 dark:bg-slate-900/50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-poppins font-bold text-indigo-950 dark:text-white mb-6">Balanced Excellence</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">We serve a God of excellence. Beyond spiritual growth, we provide the tools to ensure you represent Him well in your academics.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard 
              icon={BrainCircuit}
              title="E-Test Simulator"
              description="AI-generated practice tests that mimic standard freshman curriculum to help you master your GSTs."
              link="/simulator"
              bgImage="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            />
            <FeatureCard 
              icon={Library}
              title="Knowledge Archive"
              description="Access hundreds of Christian classics and study resources through our e-library app."
              link="/library"
              bgImage="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            />
            <FeatureCard 
              icon={MessageSquare}
              title="AI Study Buddy"
              description="Instant answers to academic questions and survival tips from our custom-trained AI assistant."
              link="/study-buddy"
              bgImage="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            />
            <FeatureCard 
              icon={BookOpen}
              title="Survival Blog"
              description="Read battle-tested strategies for time management and spiritual focus written by graduating seniors."
              link="/blog"
              bgImage="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
            />
          </div>
        </div>
      </section>

      {/* Final Call to Fellowship */}
      <section className="relative py-40 overflow-hidden bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <div className="inline-block p-4 bg-primary/10 rounded-full text-primary mb-8">
            <Cross size={48} />
          </div>
          <h2 className="text-4xl md:text-6xl font-poppins font-black text-indigo-950 dark:text-white mb-8">Ready to Walk with Us?</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-12 text-xl max-w-xl mx-auto">Whether you are a seeker, a new believer, or looking to deepen your walk, FCS is your family at FUTMINNA.</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/contact" className="bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl shadow-emerald-900/20">
              Talk to a Fellowship Leader
            </Link>
            <Link to="/activities" className="bg-indigo-950 dark:bg-white text-white dark:text-indigo-950 px-12 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-2xl">
              See Upcoming Programs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
