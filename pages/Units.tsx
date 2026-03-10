
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Theater, 
  Users, 
  CalendarDays, 
  Wrench, 
  Music, 
  Camera, 
  Mic2, 
  HeartHandshake,
  ShieldCheck,
  Zap,
  Flame,
  Utensils
} from 'lucide-react';

export const unitsData = [
  {
    id: "drama",
    name: "Drama Unit",
    icon: Theater,
    description: "Expressing divine messages through powerful stage performances, spoken word, and creative storytelling.",
    color: "bg-rose-50 text-rose-600",
    border: "border-rose-100",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Drama Unit is a community of creative individuals dedicated to the propagation of the gospel through theatrical arts. We believe that stories have the power to change lives, and we use our talents to depict spiritual truths in relatable, impactful ways.",
    activities: [
      "Stage plays and drama ministrations",
      "Spoken word and poetry",
      "Script writing workshops",
      "Set design and prop management",
      "Character development and acting coaching"
    ],
    meetings: "Saturdays, 4:00 PM at the Fellowship Hall",
    requirements: "A passion for acting/storytelling and a commitment to rehearsals."
  },
  {
    id: "ushering",
    name: "Ushering Unit",
    icon: ShieldCheck,
    description: "The gatekeepers of the fellowship, ensuring order, warmth, and a welcoming atmosphere for every member.",
    color: "bg-blue-50 text-blue-600",
    border: "border-blue-100",
    img: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Ushering Unit represents the first point of contact for members and visitors. We are committed to maintaining a serene and organized environment conducive for worship while providing hospitable support to everyone who walks through our doors.",
    activities: [
      "Welcoming and seating members",
      "Maintaining order during services",
      "Coordinating offerings and distributions",
      "Guest hospitality and information",
      "Venue preparation and cleanup coordination"
    ],
    meetings: "Fridays, 5:00 PM at the Fellowship Hall",
    requirements: "A welcoming smile, patience, and a heart for service."
  },
  {
    id: "organizing",
    name: "Organizing Unit",
    icon: CalendarDays,
    description: "The logistical engine of FCS, planning events, coordinating schedules, and making sure every program runs smoothly.",
    color: "bg-amber-50 text-amber-600",
    border: "border-amber-100",
    img: "https://images.unsplash.com/photo-1505373633560-82d6ef236130?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Organizing Unit is responsible for the 'behind-the-scenes' logistics of every FCS program. From major conferences to weekly gatherings, we handle the planning, coordination, and execution of schedules to ensure excellence.",
    activities: [
      "Event planning and logistics",
      "Program coordination",
      "Resource procurement and management",
      "Venue booking and management",
      "Protocol for visiting ministers"
    ],
    meetings: "Thursdays, 6:00 PM (Hybrid)",
    requirements: "Strong organizational skills and ability to work under pressure."
  },
  {
    id: "maintenance",
    name: "Maintenance Unit",
    icon: Wrench,
    description: "Dedicated to the upkeep of the fellowship's physical assets and ensuring the environment is conducive for worship.",
    color: "bg-slate-50 text-slate-600",
    border: "border-slate-100",
    img: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "We ensure that all fellowship equipment and facilities are in top condition. Our work allows other units to function effectively and provides a comfortable space for every member of the fellowship.",
    activities: [
      "Equipment inventory and repair",
      "Sound system setup and maintenance",
      "Musical instrument care",
      "Facility cleaning and arrangement",
      "Technical troubleshooting during programs"
    ],
    meetings: "Saturdays, 10:00 AM (Monthly Cleanup)",
    requirements: "Technical mindset or a willingness to learn equipment care."
  },
  {
    id: "music",
    name: "Music Unit",
    icon: Music,
    description: "Leading the congregation into deep sessions of worship and praise through melodies and spiritual songs.",
    color: "bg-indigo-50 text-indigo-600",
    border: "border-indigo-100",
    img: "https://images.unsplash.com/photo-1514320298574-c5f581156ea0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Music Unit (FCS Choir) is dedicated to raising a sound of worship that touches heaven and transforms earth. We train our voices and hands to play instruments with skill and spiritual sensitivity.",
    activities: [
      "Praise and worship leading",
      "Vocal training and choir rehearsals",
      "Instrumental practice (Keyboard, Drums, Guitar)",
      "Songwriting and arrangement",
      "Leading special music ministrations"
    ],
    meetings: "Tuesdays & Saturdays, 5:00 PM",
    requirements: "Audition required. Commitment to holiness and constant practice."
  },
  {
    id: "media",
    name: "Media & Technical",
    icon: Camera,
    description: "Capturing moments, managing sound systems, and projecting the fellowship's image to the world digitaly.",
    color: "bg-cyan-50 text-cyan-600",
    border: "border-cyan-100",
    img: "https://images.unsplash.com/photo-1492724441997-5dc865305da7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Media Unit leverages modern technology to document fellowship activities and reach a wider audience online. We handle the digital presence of FCS Futminna across all platforms.",
    activities: [
      "Photography and Videography",
      "Graphic design for programs",
      "Social media management",
      "Live streaming of services",
      "Projection and slide management"
    ],
    meetings: "Fridays, 4:00 PM at the Media Lab",
    requirements: "Basic knowledge of design, camera handling, or social media is a plus."
  },
  {
    id: "publicity",
    name: "Publicity Unit",
    icon: Mic2,
    description: "Spreading the word about fellowship activities across the campus using creative designs and announcements.",
    color: "bg-purple-50 text-purple-600",
    border: "border-purple-100",
    img: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "We are the voice of the fellowship on campus. Our goal is to ensure that every student knows about the life-transforming programs hosted by FCS through creative and consistent outreach.",
    activities: [
      "Campus-wide announcements",
      "Flyer distribution and poster placement",
      "Public relations and branding",
      "Coordination with hostel reps",
      "Creative awareness campaigns"
    ],
    meetings: "Wednesdays, 5:30 PM",
    requirements: "Good communication skills and creativity."
  },
  {
    id: "evangelism",
    name: "Evangelism Unit",
    icon: HeartHandshake,
    description: "The heartbeat of the fellowship mission—reaching out to the campus with the message of hope and love.",
    color: "bg-emerald-50 text-emerald-600",
    border: "border-emerald-100",
    img: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Evangelism Unit is at the forefront of the Great Commission. We organize outreaches, follow up on new converts, and ensure that the message of Christ reaches every nook and cranny of the campus.",
    activities: [
      "Hostel-to-hostel evangelism",
      "New converts follow-up and discipleship",
      "Intercessory prayer for souls",
      "Organizing rural and campus outreaches",
      "Counseling and spiritual support"
    ],
    meetings: "Sundays, 3:00 PM (Pre-Service Prayer)",
    requirements: "A heart for souls and a basic understanding of the gospel."
  },
  {
    id: "intercessory",
    name: "Intercessory Unit",
    icon: Flame,
    description: "The powerhouse of the fellowship, standing in the gap through fervent and consistent prayer.",
    color: "bg-orange-50 text-orange-600",
    border: "border-orange-100",
    img: "https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "The Intercessory Unit is the 'engine room' where spiritual battles are fought and won. We are a dedicated team committed to continuous intercession for the fellowship, the university community, and the global spread of the gospel.",
    activities: [
      "Leading pre-service prayer sessions",
      "Organizing all-night prayer vigils",
      "Interceding for individual member needs",
      "Spiritual mapping of the campus environment",
      "Training members in the art of effective prayer"
    ],
    meetings: "Fridays, 6:00 PM at the Prayer Garden",
    requirements: "A disciplined prayer life and a heart for spiritual warfare."
  },
  {
    id: "hospitality",
    name: "Hospitality & Welfare",
    icon: Utensils,
    description: "Expressing Christ's love through practical care, nourishing members, and supporting those in need.",
    color: "bg-yellow-50 text-yellow-600",
    border: "border-yellow-100",
    img: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    longDescription: "We believe that faith is expressed through love. Our unit focuses on the physical well-being of fellowship members, ensuring that everyone is cared for, especially during times of sickness, bereavement, or academic pressure.",
    activities: [
      "Coordinating refreshments for fellowship events",
      "Visiting and supporting sick or bereaved members",
      "Organizing welfare drives for underprivileged students",
      "Managing the fellowship's emergency fund",
      "Hosting special 'Love Feast' gatherings"
    ],
    meetings: "Mondays, 5:30 PM (Bi-weekly)",
    requirements: "A compassionate heart and a desire to serve others practically."
  }
];

const Units: React.FC = () => {
  return (
    <div className="bg-gray-50 dark:bg-slate-900 min-h-screen transition-colors">
      {/* Hero Section with background imagery */}
      <section className="relative bg-indigo-900 py-32 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
            alt="Service" 
            className="w-full h-full object-cover opacity-10" 
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-poppins font-bold mb-6">Our Service Units</h1>
          <p className="text-indigo-200 dark:text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Every member has a gift, and every gift has a home. Find where you belong and serve the community with your unique talents.
          </p>
        </div>
      </section>

      {/* Units Grid with Images */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {unitsData.map((unit, index) => (
            <Link 
              to={`/units/${unit.id}`}
              key={index} 
              className={`bg-white dark:bg-slate-800 rounded-3xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden flex flex-col`}
            >
              <div className="h-40 overflow-hidden relative">
                 <img src={unit.img} alt={unit.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                 <div className="absolute inset-0 bg-indigo-900/20 group-hover:bg-transparent transition-colors duration-500"></div>
                 <div className={`absolute bottom-4 left-4 w-12 h-12 ${unit.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <unit.icon size={24} />
                 </div>
              </div>
              <div className="p-8 flex-grow">
                <h3 className="text-xl font-bold text-indigo-900 dark:text-white mb-3">{unit.name}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
                  {unit.description}
                </p>
                <span className="text-primary font-bold text-sm flex items-center group-hover:gap-2 transition-all mt-auto">
                  Learn More <Zap size={14} className="ml-1 fill-current" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Call to Action with Visuals */}
      <section className="pb-32 max-w-4xl mx-auto px-4 text-center">
        <div className="bg-white dark:bg-slate-800 p-12 rounded-[3rem] border border-gray-100 dark:border-slate-700 shadow-xl relative overflow-hidden transition-colors">
          <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none">
             <img src="https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-indigo-900 dark:text-white mb-4">Ready to Serve?</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Joining a unit is the best way to grow spiritually and build lasting relationships within FCS Futminna.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary text-white px-8 py-4 rounded-full font-bold hover:opacity-90 transition-all shadow-lg shadow-emerald-900/20">
                Register for a Unit
              </button>
              <button className="border border-emerald-100 dark:border-emerald-900/30 text-primary px-8 py-4 rounded-full font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition-all">
                View Requirements
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Units;
