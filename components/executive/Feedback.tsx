import React from 'react';
import { Smile, TrendingUp } from 'lucide-react';

const Feedback: React.FC = () => {
  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white mb-6">Sentiment Analysis</h2>
       
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl text-center">
             <div className="text-6xl mb-4">🤩</div>
             <h3 className="text-2xl font-bold text-white">85% Positive</h3>
             <p className="text-slate-400">Overall Festival Sentiment</p>
          </div>

          <div className="bg-[#111] border border-white/10 p-6 rounded-2xl lg:col-span-2">
             <h3 className="font-bold text-white mb-4">Feedback Keywords</h3>
             <div className="flex flex-wrap gap-2">
                {['Exciting', 'Well Organized', 'Fun', 'Great Music', 'Crowded', 'Tasty Food', 'Engaging'].map((tag, i) => (
                   <span 
                     key={i} 
                     className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300 text-sm hover:bg-white/10"
                   >
                     {tag}
                   </span>
                ))}
             </div>
          </div>
       </div>
    </div>
  );
};

export default Feedback;