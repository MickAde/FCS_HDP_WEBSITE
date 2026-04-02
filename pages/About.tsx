
import React from 'react';
import { Users, Target, Shield, Mail, Phone, MapPin, Zap, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  const teamMembers = [
    { name: "Dr. Elena Vance", role: "Academic Director", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Julian Thorne", role: "Student President", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Sophia Martinez", role: "Tech Lead (AI Lab)", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Marcus Reed", role: "Community Manager", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Sarah Abiodun", role: "Vice President", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Michael Ojo", role: "General Secretary", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Praise Emmanuel", role: "Prayer Coordinator", img: "https://images.unsplash.com/photo-1521119989659-a83eee488004?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Daniel Wright", role: "Music Director", img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Grace Okafor", role: "Welfare Secretary", img: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Samuel David", role: "Evangelism Lead", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Deborah Peters", role: "Media Coordinator", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Joshua Bello", role: "Financial Secretary", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Esther Sunday", role: "Drama Lead", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Isaac Newton", role: "Organizing Secretary", img: "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Ruth Williams", role: "Librarian", img: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Caleb Joshua", role: "Publicity Head", img: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Mary Magdalene", role: "Sister's Coordinator", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Paul Silas", role: "Brother's Coordinator", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Timothy Titus", role: "Assistant Gen Sec", img: "https://images.unsplash.com/photo-1504257432389-52343af06ae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Lydia Philip", role: "Protocol Head", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Barnabas Mark", role: "Maintenance Head", img: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Silas Jude", role: "Transport Head", img: "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Priscilla Aquila", role: "SOD Coordinator", img: "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" },
    { name: "Stephen Martyr", role: "Missions Lead", img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" }
  ];

  return (
    <div className="bg-white dark:bg-slate-900 transition-colors">
      {/* Hero with Image Overlay */}
      <section className="relative py-32 bg-indigo-950 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Students on Campus" 
            className="w-full h-full object-cover opacity-30" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/20 text-emerald-300 text-xs font-bold uppercase tracking-[0.2em] mb-8 border border-emerald-500/20 backdrop-blur-md">
            Our Foundation
          </span>
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">More Than Just a Study Group</h1>
          <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed opacity-90">
            FCS Futminna was founded with a single mission: to ensure no freshman feels overwhelmed by the transition to higher education. We build the support system you need to succeed.
          </p>
        </div>
      </section>

      {/* Values with illustrative images */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { 
                icon: Target, 
                title: "Academic Excellence", 
                desc: "We believe in rigorous preparation. Our AI test simulator and study guides are designed to push your boundaries.",
                img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                color: "indigo"
              },
              { 
                icon: Users, 
                title: "Strong Community", 
                desc: "Loneliness is the biggest barrier to success. We foster connections that turn classmates into lifelong friends.",
                img: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                color: "emerald"
              },
              { 
                icon: Shield, 
                title: "Safe Environment", 
                desc: "A judgment-free zone where questions are welcomed and mistakes are seen as stepping stones to mastery.",
                img: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                color: "blue"
              }
            ].map((v, i) => (
              <div key={i} className="group flex flex-col items-center text-center">
                <div className="w-full h-48 rounded-[2.5rem] overflow-hidden mb-8 shadow-lg group-hover:shadow-2xl transition-all duration-500">
                  <img src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className={`w-16 h-16 bg-${v.color}-100 dark:bg-${v.color}-950/30 text-${v.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <v.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-4">{v.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Section with Side Image */}
      <section className="py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2 order-2 lg:order-1">
                 <h2 className="text-3xl font-poppins font-bold text-indigo-900 dark:text-white mb-6">Our Journey So Far</h2>
                 <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                   Starting as a small gathering of students in a hostel common room, FCS Futminna has grown into a vibrant community of scholars and light-bearers. We've weathered challenges and celebrated thousands of first-class graduates who call this fellowship home.
                 </p>
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <Zap className="text-primary" size={20} />
                       <span className="font-bold text-indigo-900 dark:text-white">Est. 1995 on Gidan Kwano Campus</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <Heart className="text-primary" size={20} />
                       <span className="font-bold text-indigo-900 dark:text-white">Serving 1000+ Students Yearly</span>
                    </div>
                 </div>
              </div>
              <div className="lg:w-1/2 order-1 lg:order-2">
                 <img 
                   src="https://images.unsplash.com/photo-1544531585-9847b68c8c86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                   className="rounded-[3rem] shadow-2xl" 
                   alt="Fellowship History" 
                 />
              </div>
           </div>
        </div>
      </section>

      {/* Team - Now featuring 24 members */}
      <section id="team" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-white">The Hearts Behind FCS Futminna</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">Meet the dedicated team of students and mentors who volunteer their time and talents to serve the community.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center group transition-all duration-300 hover:shadow-xl hover:border-emerald-50 dark:hover:border-slate-600">
                <div className="mb-4 overflow-hidden rounded-2xl h-64 relative">
                   <img src={member.img} alt={member.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500"></div>
                </div>
                <h4 className="font-bold text-indigo-900 dark:text-white text-lg">{member.name}</h4>
                <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1.5">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact with side Image */}
      <section className="py-24 bg-gray-50 dark:bg-slate-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-slate-800 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 lg:p-20">
               <h2 className="text-3xl font-bold text-indigo-900 dark:text-white mb-6">Want to Reach Out?</h2>
               <p className="text-gray-600 dark:text-gray-400 mb-10">Our dedicated support and PR teams are ready to help with any inquiries, feedback, or collaboration requests.</p>
               <div className="space-y-6">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 rounded-xl flex items-center justify-center">
                     <Mail size={20} />
                   </div>
                   <div>
                      <div className="text-xs text-gray-400 font-bold uppercase">Official Mail</div>
                      <div className="text-indigo-900 dark:text-white font-semibold">pr@fcsfutminna.edu</div>
                   </div>
                 </div>
                 <Link 
                   to="/contact" 
                   className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-900/10 mt-4"
                 >
                   Go to Help Center <ArrowRight size={18} />
                 </Link>
               </div>
            </div>
            <div className="relative">
               <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Office" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-indigo-900/60 flex items-center justify-center p-12 text-white text-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Dedicated Support</h3>
                    <p className="text-sm opacity-80 leading-relaxed">From academic guidance to spiritual support, we're one message away.</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
