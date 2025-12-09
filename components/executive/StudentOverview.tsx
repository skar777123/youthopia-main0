
import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, Calendar, TrendingUp } from 'lucide-react';
import { SimpleAreaChart } from '../admin/Charts';

const StudentOverview: React.FC = () => {
  const stats = [
    { label: 'Total Student Base', value: '1,248', change: '+12%', icon: <Users size={20} />, color: 'text-blue-400' },
    { label: 'Active Engagement', value: '86%', change: '+5%', icon: <TrendingUp size={20} />, color: 'text-green-400' },
    { label: 'Total Bonus Issued', value: '45.2k', change: '+8%', icon: <Trophy size={20} />, color: 'text-yellow-400' },
    { label: 'Event Participation', value: '3,890', change: '+15%', icon: <Calendar size={20} />, color: 'text-purple-400' },
  ];

  // Mock Data for Charts
  const footfallData = [120, 350, 420, 600, 550, 800, 950, 1100, 1050, 1248];
  const bonusData = [1000, 5000, 12000, 15000, 22000, 28000, 35000, 40000, 42000, 45200];

  return (
    <div className="space-y-6">
      {/* AI Brief Card */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#1a1a1a] to-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden"
      >
         <div className="absolute top-0 right-0 p-10 bg-yellow-500/5 rounded-bl-full" />
         <h2 className="text-xl font-bold text-white mb-2">Executive Briefing</h2>
         <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">
            Good afternoon. Activity levels are <span className="text-green-400 font-bold">peaking</span> as we enter Day 2. 
            "Pulse Parade" has the highest engagement. 
            Bonus circulation is within projected limits. 
            No critical system anomalies detected.
         </p>
      </motion.div>

      <h2 className="text-2xl font-bold text-white mb-6">Student Ecosystem Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl relative overflow-hidden group hover:border-yellow-500/30 transition-colors"
          >
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-white">{stat.icon}</div>
                <span className={`text-xs font-bold ${stat.color} bg-white/5 px-2 py-1 rounded border border-white/5`}>{stat.change}</span>
             </div>
             <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
             <p className="text-sm text-slate-400">{stat.label}</p>
             <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-500/10 transition-colors" />
          </motion.div>
        ))}
      </div>

      {/* Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl h-[350px] flex flex-col"
         >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Hourly Footfall Trend</h3>
               <div className="text-xs text-slate-500 font-mono">Last 10 Hours</div>
            </div>
            <div className="flex-1 w-full relative">
               {/* Premium Chart */}
               <SimpleAreaChart data={footfallData} color="#eab308" fillColor="#eab308" id="footfall" />
            </div>
         </motion.div>

         <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-[#111] border border-white/10 p-6 rounded-2xl h-[350px] flex flex-col"
         >
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-white">Bonus Economy Growth</h3>
               <div className="text-xs text-slate-500 font-mono">Cumulative</div>
            </div>
             <div className="flex-1 w-full relative">
                <SimpleAreaChart data={bonusData} color="#a855f7" fillColor="#a855f7" id="bonus" />
            </div>
         </motion.div>
      </div>
    </div>
  );
};

export default StudentOverview;
