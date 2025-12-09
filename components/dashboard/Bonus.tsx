
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from 'framer-motion';
import { Activity, ShoppingBag, Sparkles, Trophy, Lock, CheckCircle2, ChevronRight, HelpCircle, CircleCheck, CircleAlert } from 'lucide-react';
import Button from '../Button';

interface BonusProps {
  bonus: number;
  onAddBonus: (amount: number) => void;
  spinsAvailable: number;
  eventsCount: number;
  onSpinUsed: () => void;
  onNavigateToRedeem: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  type: 'single' | 'multi';
}

const QUESTION_BANK: Question[] = [
  // Social Media
  { id: 1, type: 'single', question: "On average, how many hours per day do you spend on social media?", options: ["Less than 1 hour", "1-2 hours", "3-4 hours", "5-6 hours", "More than 6 hours"] },
  { id: 2, type: 'single', question: "How often do you compare yourself to others based on what you see on social media?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { id: 3, type: 'single', question: "After spending time on social media, how do you typically feel about yourself?", options: ["Much more positive", "Slightly more positive", "No change", "Slightly more negative", "Much more negative"] },
  { id: 4, type: 'multi', question: "In the past 6 months, has social media made you feel any of the following? (Select all that apply)", options: ["More confident about myself", "Anxious about my appearance", "Left out or excluded", "Pressure to present a perfect image", "Inspired or motivated", "Inadequate compared to others", "Connected to friends/community", "None of the above"] },
  
  // Rumination
  { id: 5, type: 'single', question: "How often do you find yourself replaying past negative experiences in your mind?", options: ["Never or rarely", "Sometimes (1-2 times per week)", "Often (3-5 times per week)", "Very often (almost daily)", "Constantly (multiple times daily)"] },
  { id: 6, type: 'single', question: "When you think about difficult situations from your past, do you:", options: ["Actively try to understand and move forward", "Think about them occasionally but don't dwell", "Find it difficult to stop thinking about them", "Feel stuck reliving the same thoughts repeatedly", "Intentionally revisit them to process feelings"] },
  { id: 7, type: 'single', question: "Which statement best describes how you relate to your past negative experiences?", options: ["They are part of my history but don’t define who I am.", "I have learned from them and mostly moved on.", "I think about them regularly, and they influence my current identity.", "They are central to understanding who I am and how I see myself.", "I actively work to not let them define me."] },
  { id: 8, type: 'multi', question: "In the past month, have you repeatedly thought about negative experiences affecting any of the following? (Select all that apply)", options: ["My academic performance", "My relationships with friends/family", "My mood or emotional well-being", "My ability to trust others", "My self-confidence", "My physical health (sleep, appetite, etc.)", "My sense of personal agency/control", "None of the above"] },

  // Body Image
  { id: 9, type: 'single', question: "On average, how many hours per day do you spend viewing beauty, fashion, fitness, or lifestyle content on social media?", options: ["Less than 30 minutes", "30 minutes to 1 hour", "1-2 hours", "3-4 hours", "More than 4 hours"] },
  { id: 10, type: 'multi', question: "Which beauty standards do you feel most pressured by? (Select all that apply)", options: ["Fair/light skin tone", "Slim body type", "Western facial features", "Traditional Indian beauty ideals", "Influencer/celebrity aesthetics", "Perfect skin (acne-free, blemish-free)", "Specific body measurements", "None of the above"] },
  { id: 11, type: 'single', question: "How often do you compare your appearance to Indian celebrities/influencers?", options: ["Never", "Rarely", "Sometimes", "Often", "Always"] },
  { id: 12, type: 'multi', question: "In the past 6 months, has social media content about beauty/appearance made you feel: (Select all that apply)", options: ["Anxious or stressed about my looks", "Motivated to improve my appearance", "Ashamed of my body or features", "Pressure to use beauty products/treatments", "A desire to edit or filter my photos", "Inadequate or not good enough", "Inspired and confident", "No significant impact"] },

  // Toxic Relationships
  { id: 13, type: 'multi', question: "How have toxic relationships affected your mental health? (Select all that apply)", options: ["Anxiety, panic attacks, or constant worry", "Depression or persistent sadness", "Low self-esteem or loss of identity", "Difficulty trusting others", "Post-traumatic stress symptoms", "Sleep disturbances", "Self-harm or suicidal thoughts", "Eating disorders", "Substance use/abuse", "Physical symptoms", "Difficulty setting boundaries", "People-pleasing or fear of conflict", "No significant mental health impact"] },
  { id: 14, type: 'single', question: "How would you rate your current self-esteem/self-worth in the context of your toxic relationship experiences?", options: ["1. Very Poor", "2. Poor", "3. Neutral", "4. Good", "5. Excellent"] },
  { id: 15, type: 'multi', question: "What factors have made it harder to leave or avoid toxic relationships? (Select all that apply)", options: ["Financial dependence", "Fear of the person’s reaction", "Cultural or religious expectations", "Family/community pressure", "I still loved them/hoped they would change", "Low self-worth", "I didn't recognize it was toxic until later", "Lack of support system", "Shared living situation/children", "Identity factors", "Mental health challenges", "Disability or chronic illness", "Immigration status", "Not applicable"] }
];

const AnimatedCounter = ({ value }: { value: number }) => {
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const controls = animate(count, value, { duration: 1, ease: "easeOut" });
    return controls.stop;
  }, [value, count]);

  return <motion.span>{rounded}</motion.span>;
};

const Bonus: React.FC<BonusProps> = ({ bonus, onAddBonus, spinsAvailable, eventsCount, onSpinUsed, onNavigateToRedeem }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  // Game Flow States
  const [pendingPrize, setPendingPrize] = useState(0); // Points won but not yet awarded
  const [showQuiz, setShowQuiz] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // Quiz Logic
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string | string[]>>({});

  // Wheel Segments: 8 segments, 45 degrees each
  // Values: 10, 20, 30, 40 repeated twice
  const segments = [10, 20, 30, 40, 10, 20, 30, 40];
  const segmentColors = ['#facc15', '#fbbf24', '#ec4899', '#8b5cf6', '#facc15', '#fbbf24', '#ec4899', '#8b5cf6'];
  const sliceAngle = 360 / segments.length;

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleSpin = () => {
    if (isSpinning || spinsAvailable <= 0) return;
    setIsSpinning(true);

    // Random spin
    const randomSegmentIndex = Math.floor(Math.random() * segments.length);
    const extraRotations = 360 * (5 + Math.floor(Math.random() * 5));
    const randomOffset = Math.random() * (sliceAngle - 2) + 1;
    const targetRotation = extraRotations + (360 - (randomSegmentIndex * sliceAngle)) - (sliceAngle / 2) + randomOffset;

    setRotation(rotation + targetRotation);

    setTimeout(() => {
      const prize = segments[randomSegmentIndex];
      setPendingPrize(prize);
      setIsSpinning(false);
      
      // Step 2: Prepare and Show Quiz
      const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
      setCurrentQuestions(shuffled.slice(0, 3));
      setQuizAnswers({}); // Reset answers
      onSpinUsed(); // Deduct spin
      setShowQuiz(true);
    }, 4000);
  };

  const handleAnswerChange = (qId: number, value: string, type: 'single' | 'multi') => {
    if (type === 'single') {
        setQuizAnswers(prev => ({ ...prev, [qId]: value }));
    } else {
        setQuizAnswers(prev => {
            const current = (prev[qId] as string[]) || [];
            if (current.includes(value)) {
                return { ...prev, [qId]: current.filter(v => v !== value) };
            } else {
                return { ...prev, [qId]: [...current, value] };
            }
        });
    }
  };

  const submitQuiz = () => {
      // Validate that all questions have at least one answer
      const allAnswered = currentQuestions.every(q => {
          const ans = quizAnswers[q.id];
          return ans && (Array.isArray(ans) ? ans.length > 0 : !!ans);
      });

      if (!allAnswered) {
          alert("Please answer all 3 questions to claim your bonus!");
          return;
      }

      // Step 3: Award Points
      setShowQuiz(false);
      onAddBonus(pendingPrize);
      setToast({ message: `Hooray! You won ${pendingPrize} Bonus Points!`, type: 'success' });
      setShowResult(true);
  };

  const progressToNextSpin = (eventsCount % 4) / 4 * 100;
  const eventsNeeded = 4 - (eventsCount % 4);

  return (
    <div className="space-y-12">
      {/* Header Bonus Display */}
      <div className="text-center pt-4">
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="relative inline-block"
        >
           <motion.div 
             key={bonus}
             initial={{ scale: 1.1 }}
             animate={{ scale: 1 }}
             transition={{ type: "spring", stiffness: 300, damping: 15 }}
             className="w-48 h-48 rounded-full border-8 border-slate-100 flex items-center justify-center bg-white shadow-xl relative overflow-hidden"
           >
              <motion.div 
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 3, repeat: Infinity }}
                 className="absolute inset-0 bg-gradient-to-tr from-yellow-50 via-white to-transparent opacity-50"
              />
              <div className="relative z-10">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-yellow"
                >
                  <AnimatedCounter value={bonus} />
                </motion.div>
                <div className="text-slate-400 font-semibold mt-1">Total Bonus</div>
              </div>
           </motion.div>
        </motion.div>
      </div>

      {/* Spin The Wheel Game Section */}
      <div className="max-w-md mx-auto relative">
         <motion.div 
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="bg-[#1e1b4b] rounded-3xl p-6 shadow-2xl border-4 border-[#312e81] relative overflow-hidden"
         >
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
                <div className="absolute top-10 left-10 w-4 h-4 bg-yellow-400 rounded-full" />
                <div className="absolute bottom-20 right-10 w-6 h-6 bg-pink-500 rounded-full" />
                <div className="absolute top-1/2 left-4 w-3 h-3 bg-purple-500 rounded-full" />
                <div className="absolute top-4 right-1/2 w-2 h-2 bg-blue-400 rounded-full" />
            </div>

            <div className="flex justify-between items-start mb-6">
                <h3 className="text-white font-bold text-xl tracking-widest uppercase flex items-center gap-2">
                   <Sparkles className="text-yellow-400" /> Spinner Game
                </h3>
                <div className="text-right">
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${spinsAvailable > 0 ? 'bg-green-500 text-white' : 'bg-slate-700 text-slate-300'}`}>
                        {spinsAvailable} Spins Left
                    </span>
                </div>
            </div>

            {/* Wheel Container */}
            <div className="relative w-64 h-64 mx-auto mb-8">
               {/* Pointer */}
               <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-8 h-10">
                  <div className="w-8 h-8 bg-red-500 rounded-full shadow-lg relative flex items-center justify-center border-2 border-white">
                     <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-red-500 absolute -bottom-3" />
                  </div>
               </div>

               {/* The Wheel */}
               <motion.div
                  className="w-full h-full rounded-full border-4 border-yellow-500 shadow-2xl bg-white relative overflow-hidden"
                  animate={{ rotate: rotation }}
                  transition={{ duration: 4, ease: "circOut" }}
                  style={{ transformOrigin: 'center' }}
               >
                  {spinsAvailable <= 0 && !isSpinning && (
                      <div className="absolute inset-0 bg-black/60 z-30 flex items-center justify-center backdrop-blur-[2px]">
                         <Lock className="text-white/50 w-16 h-16" />
                      </div>
                  )}
                  <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                     {segments.map((val, i) => {
                        const startAngle = (i * sliceAngle * Math.PI) / 180;
                        const endAngle = ((i + 1) * sliceAngle * Math.PI) / 180;
                        const x1 = 50 + 50 * Math.cos(startAngle);
                        const y1 = 50 + 50 * Math.sin(startAngle);
                        const x2 = 50 + 50 * Math.cos(endAngle);
                        const y2 = 50 + 50 * Math.sin(endAngle);
                        
                        return (
                           <g key={i}>
                              <path 
                                d={`M50,50 L${x1},${y1} A50,50 0 0,1 ${x2},${y2} Z`} 
                                fill={segmentColors[i]}
                                stroke="white"
                                strokeWidth="0.5"
                              />
                              <text
                                x={50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}
                                y={50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)}
                                fill="white"
                                fontSize="6"
                                fontWeight="bold"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                transform={`rotate(${(i * sliceAngle) + (sliceAngle/2)}, ${50 + 35 * Math.cos(startAngle + (sliceAngle * Math.PI) / 360)}, ${50 + 35 * Math.sin(startAngle + (sliceAngle * Math.PI) / 360)})`}
                              >
                                {val}
                              </text>
                           </g>
                        );
                     })}
                  </svg>
                  {/* Center Cap */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border-4 border-slate-200 z-30">
                     <div className="w-4 h-4 bg-slate-300 rounded-full" />
                  </div>
               </motion.div>
            </div>

            <div className="text-center px-4">
               {spinsAvailable > 0 ? (
                   <Button 
                    variant="secondary" 
                    fullWidth 
                    shape="pill"
                    onClick={handleSpin}
                    disabled={isSpinning}
                    className="shadow-xl shadow-yellow-500/20 text-lg py-4 border-b-4 border-yellow-600 active:border-b-0 active:translate-y-1 transition-all"
                  >
                    {isSpinning ? 'Spinning...' : '👆 SPIN!'}
                  </Button>
               ) : (
                   <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700">
                       <p className="text-slate-300 text-sm mb-3">
                         Complete <strong>{eventsNeeded}</strong> more event{eventsNeeded !== 1 && 's'} to unlock a spin!
                       </p>
                       <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                           <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${progressToNextSpin}%` }}
                              className="h-full bg-brand-yellow"
                           />
                       </div>
                       <p className="text-[10px] text-slate-500 mt-2 text-right">
                          {eventsCount % 4}/4 Completed
                       </p>
                   </div>
               )}
            </div>
         </motion.div>
      </div>

      {/* QUIZ MODAL */}
      <AnimatePresence>
        {showQuiz && (
            <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
               <motion.div 
                 initial={{ scale: 0.9, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]"
               >
                  <div className="bg-brand-purple p-6 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                      <HelpCircle className="mx-auto mb-2 opacity-80" size={32} />
                      <h2 className="text-2xl font-bold">Bonus Unlock Quiz</h2>
                      <p className="text-white/80 text-sm">Answer 3 quick questions to claim your {pendingPrize} points!</p>
                  </div>
                  
                  <div className="p-6 overflow-y-auto space-y-8 flex-1">
                      {currentQuestions.map((q, idx) => (
                          <div key={q.id} className="space-y-3">
                             <h3 className="font-bold text-slate-800 text-sm md:text-base">
                                <span className="text-brand-purple mr-2">{idx + 1}.</span>
                                {q.question}
                             </h3>
                             <div className="space-y-2">
                                {q.options.map((opt) => {
                                    const isSelected = q.type === 'single' 
                                        ? quizAnswers[q.id] === opt 
                                        : (quizAnswers[q.id] as string[] || []).includes(opt);
                                    
                                    return (
                                        <label 
                                            key={opt} 
                                            className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                isSelected ? 'bg-purple-50 border-brand-purple text-purple-900' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <div className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center shrink-0 ${
                                                isSelected ? 'bg-brand-purple border-brand-purple text-white' : 'bg-white border-slate-300'
                                            } ${q.type === 'single' ? 'rounded-full' : 'rounded-md'}`}>
                                                {isSelected && <CheckCircle2 size={14} />}
                                            </div>
                                            <input 
                                                type={q.type === 'single' ? 'radio' : 'checkbox'} 
                                                className="hidden"
                                                name={`q-${q.id}`}
                                                value={opt}
                                                checked={isSelected}
                                                onChange={() => handleAnswerChange(q.id, opt, q.type)}
                                            />
                                            <span className="text-sm">{opt}</span>
                                        </label>
                                    );
                                })}
                             </div>
                          </div>
                      ))}
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50">
                      <Button fullWidth variant="primary" onClick={submitQuiz}>
                          Claim My Bonus
                      </Button>
                  </div>
               </motion.div>
            </div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
               onClick={() => setShowResult(false)}
             />
             <motion.div
               initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
               animate={{ scale: 1, opacity: 1, rotate: 0 }}
               exit={{ scale: 0.8, opacity: 0 }}
               className="bg-white rounded-3xl p-8 text-center max-w-sm w-full relative z-10 shadow-2xl overflow-hidden"
             >
                {/* Confetti (Simple dots) */}
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className={`absolute w-3 h-3 rounded-full ${segmentColors[i % 4]}`}
                    initial={{ y: -20, x: Math.random() * 300, opacity: 1 }}
                    animate={{ y: 400, rotate: 360 }}
                    transition={{ duration: 2 + Math.random(), ease: "linear" }}
                  />
                ))}

                <div className="relative z-10">
                   <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4 text-yellow-600 shadow-inner">
                      <Trophy size={40} />
                   </div>
                   <h3 className="text-brand-purple font-extrabold text-2xl mb-1 uppercase tracking-wider">Congratulations!</h3>
                   <div className="text-slate-500 text-sm mb-6 font-medium">You Won</div>
                   
                   <div className="text-6xl font-black text-brand-dark mb-4">
                      {pendingPrize}
                   </div>
                   
                   <p className="text-slate-400 text-sm mb-6">Points added to your balance.</p>

                   <div className="space-y-3">
                       <Button 
                         variant="primary" 
                         fullWidth 
                         onClick={() => {
                             setShowResult(false);
                             onNavigateToRedeem();
                         }}
                         className="shadow-lg shadow-purple-500/20"
                        >
                          REDEEM NOW <ChevronRight size={18} />
                       </Button>
                       <button 
                         onClick={() => setShowResult(false)}
                         className="text-sm font-bold text-slate-500 hover:text-slate-800"
                       >
                          Spin Again Later
                       </button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed bottom-8 left-1/2 z-[100] px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 font-bold text-sm min-w-[300px] justify-center backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-slate-900/90 text-white border border-slate-700' 
                : 'bg-red-500/90 text-white border border-red-400'
            }`}
          >
             {toast.type === 'success' ? (
               <CircleCheck size={18} className="text-green-400" />
             ) : (
               <CircleAlert size={18} className="text-white" />
             )}
             {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section (Now empty by default) */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="max-w-md mx-auto bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-left"
      >
         <h3 className="font-bold text-slate-800 mb-4">Bonus History</h3>
         <div className="space-y-4">
            <p className="text-slate-400 text-sm text-center">No history yet.</p>
         </div>
      </motion.div>
    </div>
  );
};

export default Bonus;
