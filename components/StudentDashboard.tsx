import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, User, Activity, Trophy, Coins, ShoppingBag, 
  ClipboardList, LogOut, Map as MapIcon, HelpCircle
} from 'lucide-react';

// Import Sub-pages
import Me from './dashboard/Me';
import Activities from './dashboard/Activities';
import Leaderboard from './dashboard/Leaderboard';
import Bonus from './dashboard/Bonus';
import Redeem from './dashboard/Redeem';
import Score from './dashboard/Score';
import MapPage from './dashboard/Map';
import Help from './dashboard/Help';
import { UserData } from '../types';

interface StudentDashboardProps {
  onLogout: () => void;
  user: UserData | null;
  initialBonus?: number;
}

type DashboardSection = 'me' | 'activities' | 'leaderboard' | 'bonus' | 'redeem' | 'score' | 'map' | 'help';

const StudentDashboard: React.FC<StudentDashboardProps> = ({ onLogout, user, initialBonus = 0 }) => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('me');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Initial bonus based on prop (e.g. 5 from registration)
  const [bonus, setBonus] = useState(initialBonus);
  // Shared state for registered events
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  // Track how many spins the user has consumed
  const [spinsUsed, setSpinsUsed] = useState(0);

  const handleRedeem = (cost: number) => {
    setBonus(prev => Math.max(0, prev - cost));
  };

  const handleAddBonus = (amount: number) => {
    setBonus(prev => prev + amount);
  };

  const handleEventRegistration = (eventId: string) => {
    if (!registeredEventIds.includes(eventId)) {
        setRegisteredEventIds(prev => [...prev, eventId]);
    }
  };

  const handleSpinUsed = () => {
    setSpinsUsed(prev => prev + 1);
  };

  const handleNavigateToRedeem = () => {
    setActiveSection('redeem');
  };

  // Logic: 1 Spin for every 4 events registered/completed
  const totalSpinsEarned = Math.floor(registeredEventIds.length / 4);
  const spinsAvailable = Math.max(0, totalSpinsEarned - spinsUsed);

  const menuItems = [
    { id: 'me', label: 'Me', icon: <User size={20} /> },
    { id: 'activities', label: 'Activities', icon: <Activity size={20} /> },
    { id: 'bonus', label: 'Bonus', icon: <Coins size={20} /> },
    { id: 'leaderboard', label: 'Leaderboard', icon: <Trophy size={20} /> },
    { id: 'score', label: 'Score', icon: <ClipboardList size={20} /> },
    { id: 'redeem', label: 'Redeem', icon: <ShoppingBag size={20} /> },
    { id: 'map', label: 'Map', icon: <MapIcon size={20} /> },
    { id: 'help', label: 'Help', icon: <HelpCircle size={20} /> },
  ];

  // Mobile Bottom Tab Configuration
  const bottomTabs = [
    { id: 'me', label: 'Me', icon: <User size={20} /> },
    { id: 'activities', label: 'Events', icon: <Activity size={20} /> },
    { id: 'bonus', label: 'Bonus', icon: <Coins size={20} /> },
    { id: 'map', label: 'Map', icon: <MapIcon size={20} /> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'me': 
        return <Me bonus={bonus} user={user} registeredEventIds={registeredEventIds} />;
      case 'activities': 
        return <Activities registeredEventIds={registeredEventIds} onRegister={handleEventRegistration} />;
      case 'leaderboard': 
        return <Leaderboard bonus={bonus} />;
      case 'bonus': 
        return (
          <Bonus 
            bonus={bonus} 
            onAddBonus={handleAddBonus} 
            spinsAvailable={spinsAvailable}
            eventsCount={registeredEventIds.length}
            onSpinUsed={handleSpinUsed}
            onNavigateToRedeem={handleNavigateToRedeem}
          />
        );
      case 'redeem': 
        return <Redeem onRedeem={handleRedeem} userBonus={bonus} />;
      case 'score': 
        return <Score bonus={bonus} />;
      case 'map':
        return <MapPage />;
      case 'help':
        return <Help />;
      default: 
        return <Me bonus={bonus} user={user} registeredEventIds={registeredEventIds} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans">
      
      {/* Mobile Header (Minimal Branding) */}
      <header className="md:hidden bg-brand-dark text-white p-4 flex justify-center items-center z-40 sticky top-0 shadow-md">
         <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-yellow to-brand-pink">YOUTHOPIA</span>
         </div>
      </header>

      {/* Mobile Menu Drawer (For 'More' options) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-brand-dark z-[60] flex flex-col md:hidden"
          >
             <div className="p-4 flex justify-between items-center border-b border-slate-800">
                <span className="text-xl font-bold text-white">All Menu Items</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white p-2 bg-slate-800 rounded-full">
                  <X size={24} />
                </button>
             </div>
             <div className="flex-1 overflow-y-auto p-4 space-y-2 pb-24">
                {menuItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveSection(item.id as DashboardSection);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                      activeSection === item.id 
                        ? 'bg-brand-purple text-white' 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    {item.icon}
                    <span className="font-semibold">{item.label}</span>
                    {activeSection === item.id && <div className="ml-auto w-2 h-2 bg-green-400 rounded-full" />}
                  </button>
                ))}
                
                <div className="pt-8 border-t border-slate-800 mt-4">
                  <button 
                    onClick={onLogout}
                    className="w-full flex items-center gap-4 p-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={20} />
                    <span className="font-semibold">Logout</span>
                  </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Unchanged) */}
      <aside className="hidden md:flex flex-col w-64 bg-brand-dark text-white h-screen sticky top-0 shadow-xl z-40">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-pink">
            YOUTHOPIA
          </h1>
          <p className="text-xs text-slate-500 tracking-widest mt-1">STUDENT PORTAL</p>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as DashboardSection)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all relative overflow-hidden group ${
                activeSection === item.id 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {activeSection === item.id && (
                <motion.div 
                  layoutId="activeTab" 
                  className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-pink z-0" 
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              {activeSection !== item.id && (
                <motion.div 
                   className="absolute inset-0 bg-slate-800 opacity-0 group-hover:opacity-100 z-0 rounded-xl"
                   transition={{ duration: 0.2 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-3">
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </div>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
           <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/5 transition-colors"
           >
             <LogOut size={20} />
             <span className="font-medium">Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-60px)] md:h-screen p-4 md:p-8 bg-slate-50 pb-24 md:pb-8">
         <AnimatePresence mode="wait">
             <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.98 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="max-w-5xl mx-auto"
             >
               {renderContent()}
             </motion.div>
         </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 py-2 safe-area-bottom shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center">
          {bottomTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as DashboardSection)}
              className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors min-w-[64px] ${
                activeSection === tab.id 
                  ? 'text-brand-purple' 
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {activeSection === tab.id && (
                <motion.div
                  layoutId="activeBottomTabBg"
                  className="absolute inset-0 bg-brand-purple/10 rounded-xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <motion.div
                whileTap={{ scale: 0.9 }}
                animate={activeSection === tab.id ? { y: -2, scale: 1.1 } : { y: 0, scale: 1 }}
                className="relative z-10"
              >
                {tab.icon}
              </motion.div>
              <span className={`relative z-10 text-[10px] font-bold ${activeSection === tab.id ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>
            </button>
          ))}
          
          {/* More Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-slate-600 min-w-[64px]`}
          >
             <motion.div whileTap={{ scale: 0.9 }}>
               <Menu size={20} />
             </motion.div>
             <span className="text-[10px] font-bold opacity-70">More</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default StudentDashboard;