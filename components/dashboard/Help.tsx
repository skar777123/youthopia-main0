
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ChevronDown, Mail, Phone, AlertTriangle, MessageCircle } from 'lucide-react';
import Button from '../Button';

const Help: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I earn Bonus points?",
      answer: "You earn bonus points by registering for and attending events. You can also win points by playing the 'Spin the Wheel' game after completing every 4 events."
    },
    {
      question: "Where can I redeem my rewards?",
      answer: "Go to the 'Redeem' tab in your dashboard. Select an item you can afford with your bonus balance and click 'Redeem'. You can collect your item from the Registration Desk."
    },
    {
      question: "Can I register for overlapping events?",
      answer: "Technically yes, but we recommend checking the schedule carefully to ensure you can attend both. You only get attendance points if you are physically present."
    },
    {
      question: "I lost my ID card. What should I do?",
      answer: "Please report to the Help Desk immediately near the Main Entrance. You can also use your digital profile on the 'Me' page as a temporary verification."
    },
    {
      question: "How do I register a full team?",
      answer: "In the Activities page, select a Team Event. As the leader, you will be asked to enter the Student IDs of all your team members. They must be registered on the app first."
    }
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Help & Support</h2>
        <p className="text-slate-500 mt-1">Find answers or get in touch with the festival team.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* FAQs Section */}
         <div className="md:col-span-2 space-y-4">
            <h3 className="font-bold text-slate-800 text-xl mb-4 flex items-center gap-2">
               <HelpCircle className="text-brand-purple" /> Frequently Asked Questions
            </h3>
            
            <div className="space-y-3">
               {faqs.map((faq, idx) => (
                 <div key={idx} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <button 
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                       {faq.question}
                       <ChevronDown 
                         size={20} 
                         className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} 
                       />
                    </button>
                    <AnimatePresence>
                       {openFaq === idx && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                             <div className="p-4 pt-0 text-slate-500 text-sm leading-relaxed border-t border-slate-50">
                                {faq.answer}
                             </div>
                          </motion.div>
                       )}
                    </AnimatePresence>
                 </div>
               ))}
            </div>
         </div>

         {/* Contact Cards */}
         <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
               <h3 className="font-bold text-slate-800 mb-4">Contact Us</h3>
               <div className="space-y-4">
                  <div className="flex items-center gap-3 text-slate-600">
                     <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <Mail size={18} />
                     </div>
                     <div>
                        <div className="text-xs font-bold uppercase text-slate-400">Email Support</div>
                        <div className="text-sm font-semibold">help@youthopia.com</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                     <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                        <Phone size={18} />
                     </div>
                     <div>
                        <div className="text-xs font-bold uppercase text-slate-400">Helpline</div>
                        <div className="text-sm font-semibold">+91 98765 43210</div>
                     </div>
                  </div>
               </div>
               
               <div className="mt-6 pt-6 border-t border-slate-100">
                  <Button variant="secondary" fullWidth className="text-sm">
                     <MessageCircle size={16} className="mr-2" /> Start Live Chat
                  </Button>
               </div>
            </div>

            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
               <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle size={20} /> Emergency
               </h3>
               <p className="text-xs text-red-600 mb-4">
                  For medical emergencies or security issues, please contact the on-ground response team immediately.
               </p>
               <div className="text-2xl font-black text-red-600 tracking-wider">
                  108 <span className="text-sm font-normal text-red-400 ml-1">(Ambulance)</span>
               </div>
               <div className="text-lg font-bold text-red-600 mt-1">
                  Ext: 555 <span className="text-sm font-normal text-red-400 ml-1">(Security)</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Help;
