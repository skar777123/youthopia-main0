import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import ExecutiveDashboard from './components/ExecutiveDashboard';
import FestivalChat from './components/FestivalChat';
import { ViewState, UserData } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('splash');
  const [user, setUser] = useState<UserData | null>(null);
  const [initialBonus, setInitialBonus] = useState(0);

  const handleLogin = (userData?: UserData, bonus: number = 0) => {
    if (userData) {
      setUser(userData);
      setInitialBonus(bonus);
      // Role handling is done in renderView
      setCurrentView('dashboard');
    }
  };

  const renderView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen onComplete={() => setCurrentView('landing')} />;
      case 'landing':
        return (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onNavigateAuth={() => setCurrentView('auth')} />
          </motion.div>
        );
      case 'auth':
        return (
          <motion.div
            key="auth"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <AuthPage 
              onBack={() => setCurrentView('landing')} 
              onLogin={handleLogin}
            />
          </motion.div>
        );
      case 'dashboard':
        // Determine which dashboard to show based on user role
        if (user?.role === 'executive') {
           return (
             <motion.div
              key="executive-dashboard"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
             >
                <ExecutiveDashboard onLogout={() => setCurrentView('landing')} />
             </motion.div>
           );
        }
        if (user?.adminId) {
          return (
            <motion.div
              key="admin-dashboard"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
               <AdminDashboard onLogout={() => setCurrentView('landing')} />
            </motion.div>
          );
        }
        return (
          <motion.div
            key="student-dashboard"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
             <StudentDashboard user={user} onLogout={() => setCurrentView('landing')} initialBonus={initialBonus} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="font-sans text-white min-h-screen bg-brand-dark">
      <AnimatePresence mode="wait">
        {renderView()}
      </AnimatePresence>
      
      {/* 
        Persistent Chat Assistant
        Show on Landing, Auth and Dashboard, hidden on Splash 
        Hide on Admin/Executive Dashboard for a cleaner UI.
      */}
      {currentView !== 'splash' && !user?.adminId && !user?.role && <FestivalChat />}
    </div>
  );
};

export default App;