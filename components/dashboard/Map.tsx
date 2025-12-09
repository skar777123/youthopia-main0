
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Info, Compass } from 'lucide-react';

const Map: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const zones = [
    { id: 'main', name: 'Main Stage', color: 'bg-brand-purple', desc: 'Concerts, Inauguration, and Dance Battles.', x: '50%', y: '50%', w: '140px', h: '140px' },
    { id: 'food', name: 'Food Court', color: 'bg-brand-orange', desc: 'Snacks, Drinks, and Chill Zone.', x: '20%', y: '20%', w: '100px', h: '100px' },
    { id: 'tech', name: 'Tech Zone', color: 'bg-blue-500', desc: 'Hackathons, Gaming, and Workshops.', x: '80%', y: '20%', w: '110px', h: '110px' },
    { id: 'art', name: 'Art Arena', color: 'bg-brand-pink', desc: 'Painting, Exhibitions, and Creative Stalls.', x: '20%', y: '80%', w: '120px', h: '120px' },
    { id: 'reg', name: 'Registration', color: 'bg-green-500', desc: 'Help Desk, ID Cards, and entry.', x: '80%', y: '80%', w: '90px', h: '90px' },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Festival Map</h2>
          <p className="text-slate-500 mt-1">Navigate your way through Youthopia.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
           <Compass size={16} className="text-brand-purple" /> Interactive View
        </div>
      </div>

      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden min-h-[500px] flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
         {/* Background Grid Lines */}
         <div className="absolute inset-0 opacity-5" 
              style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
         />

         {/* Zones */}
         {zones.map((zone) => (
            <motion.div
               key={zone.id}
               className={`absolute rounded-full shadow-xl flex items-center justify-center cursor-pointer border-4 border-white/50 backdrop-blur-sm transition-transform ${zone.color} ${activeZone === zone.id ? 'z-20 scale-110 ring-4 ring-white' : 'z-10 hover:scale-105'}`}
               style={{ 
                 left: zone.x, 
                 top: zone.y, 
                 width: zone.w, 
                 height: zone.h,
                 transform: 'translate(-50%, -50%)' 
               }}
               onClick={() => setActiveZone(zone.id)}
               whileHover={{ scale: 1.1 }}
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
               <div className="text-center">
                  <MapPin className="text-white mx-auto mb-1 drop-shadow-md" size={24} />
                  <span className="text-white font-bold text-xs md:text-sm drop-shadow-md">{zone.name}</span>
               </div>
            </motion.div>
         ))}

         {/* Paths (Decorative) */}
         <svg className="absolute inset-0 pointer-events-none opacity-20" width="100%" height="100%">
            <path d="M 20% 20% L 50% 50%" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M 80% 20% L 50% 50%" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M 20% 80% L 50% 50%" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
            <path d="M 80% 80% L 50% 50%" stroke="black" strokeWidth="2" strokeDasharray="5,5" />
         </svg>

         {/* Zone Detail Card */}
         {activeZone && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-2xl z-30"
            >
               <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {zones.find(z => z.id === activeZone)?.name}
                  </h3>
                  <button onClick={() => setActiveZone(null)} className="text-slate-400 hover:text-slate-600">
                     <Info size={16} />
                  </button>
               </div>
               <p className="text-slate-600 text-sm">
                  {zones.find(z => z.id === activeZone)?.desc}
               </p>
               <button className="mt-3 w-full bg-slate-900 text-white py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
                  Navigate Here
               </button>
            </motion.div>
         )}
      </div>

      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
          {zones.map(zone => (
             <div key={zone.id} className="flex items-center gap-2 text-xs font-bold text-slate-600 whitespace-nowrap">
                <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                {zone.name}
             </div>
          ))}
      </div>
    </div>
  );
};

export default Map;
