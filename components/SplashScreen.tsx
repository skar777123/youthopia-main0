
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-50 overflow-hidden text-white">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
              x: [0, 50, 0],
              y: [0, -30, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-purple rounded-full blur-[120px]" 
         />
         <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.1, 0.2, 0.1],
              x: [0, -40, 0],
              y: [0, 40, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-pink rounded-full blur-[120px]" 
         />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center p-8"
      >
        {/* Custom Logo Image */}
        <div className="w-80 h-80 relative mb-4">
            <img 
              src="/splash-logo.png" 
              alt="Welcome to Youthopia" 
              className="w-full h-full object-contain drop-shadow-2xl"
              onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80";
              }}
            />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
