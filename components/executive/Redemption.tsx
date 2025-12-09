
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock } from 'lucide-react';

const Redemption: React.FC = () => {
  const [requests, setRequests] = useState<{ id: string; user: string; item: string; cost: number; status: string }[]>([]);

  const process = (id: string) => {
     setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6">High-Value Redemptions</h2>
       
       <div className="grid grid-cols-1 gap-4">
          <AnimatePresence>
             {requests.length > 0 ? requests.map(req => (
               <motion.div
                 key={req.id}
                 exit={{ opacity: 0, x: -20 }}
                 className="bg-[#111] border border-white/10 p-4 rounded-xl flex items-center justify-between group hover:border-yellow-500/30 transition-colors"
               >
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-yellow-500">
                        <Clock size={20} />
                     </div>
                     <div>
                        <h3 className="font-bold text-white">{req.item}</h3>
                        <p className="text-sm text-slate-400">{req.user} • <span className="text-yellow-500 font-mono">{req.cost} Bonus</span></p>
                     </div>
                  </div>
                  <div className="flex gap-2">
                     <button 
                        onClick={() => process(req.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20" title="Reject"
                     >
                        <X size={18} />
                     </button>
                     <button 
                        onClick={() => process(req.id)}
                        className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20" title="Approve"
                     >
                        <Check size={18} />
                     </button>
                  </div>
               </motion.div>
             )) : (
                 <div className="text-center py-20 text-slate-500">No pending requests</div>
             )}
          </AnimatePresence>
       </div>
    </div>
  );
};

export default Redemption;
