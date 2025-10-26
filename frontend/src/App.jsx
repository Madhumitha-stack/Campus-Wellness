import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBot from './components/ChatBot';
import MoodTracker from './components/MoodTracker';
import GameHub from './components/GameHub';
import SafeSpaces from './components/SafeSpaces';
import Dashboard from './components/Dashboard';
import AccessibilityPanel from './components/AccessibilityPanel';
import logo from './assets/logo.svg';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    highContrast: false,
    largeText: false,
    screenReader: false,
    reducedMotion: false,
    voiceNavigation: false
  });

  // Handle hash navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['dashboard', 'chat', 'mood', 'games', 'spaces', 'accessibility'].includes(hash)) {
        setCurrentView(hash);
      }
    };

    // Initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when view changes
  useEffect(() => {
    window.location.hash = currentView;
  }, [currentView]);

  // Initialize user
  useEffect(() => {
    const initializeUser = async () => {
      // Mock user registration
      const mockUser = {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        username: 'Student',
        accessibilityNeeds: []
      };
      setUser(mockUser);
    };
    
    initializeUser();
  }, []);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'chat', label: 'Support Chat', icon: '💬' },
    { id: 'mood', label: 'Mood Tracker', icon: '📊' },
    { id: 'games', label: 'Stress Relief', icon: '🎮' },
    { id: 'spaces', label: 'Safe Spaces', icon: '🗺️' },
    { id: 'accessibility', label: 'Accessibility', icon: '♿' }
  ];

  return (
    <div className={`min-h-screen ${
      accessibilitySettings.highContrast 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-mental-blue-50 to-mental-green-50'
    } ${accessibilitySettings.largeText ? 'text-xl' : ''}`}>
      
      {/* Header */}
      <header className={`${
        accessibilitySettings.highContrast 
          ? 'bg-white text-black' 
          : 'bg-white shadow-lg'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <img src={logo} alt="Campus Mental Health Logo" className="h-8 w-8" />
              <h1 
                className={`text-2xl font-bold ${
                  accessibilitySettings.highContrast 
                    ? 'text-black' 
                    : 'text-mental-blue'
                }`}
              >
                Campus Mental Health Hub
              </h1>
            </motion.div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <span className={`${
                  accessibilitySettings.highContrast ? 'text-black' : 'text-gray-600'
                }`}>
                  Welcome, {user.username}
                </span>
                <div className={`px-3 py-1 rounded-full ${
                  accessibilitySettings.highContrast 
                    ? 'bg-black text-white' 
                    : 'bg-mental-green text-white'
                }`}>
                  45 credits
                </div>
              </div>
            )}
          </div>
          
          {/* Navigation */}
          <nav className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setCurrentView(item.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      currentView === item.id
                        ? accessibilitySettings.highContrast
                          ? 'bg-black text-white'
                          : 'bg-mental-blue text-white'
                        : accessibilitySettings.highContrast
                          ? 'bg-gray-200 text-black hover:bg-gray-300'
                          : 'bg-gray-100 hover:bg-gray-200'
                    } ${accessibilitySettings.largeText ? 'text-lg' : ''}`}
                    aria-current={currentView === item.id ? 'page' : undefined}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Dashboard user={user} />
            </motion.div>
          )}
          
          {currentView === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <ChatBot user={user} accessibility={accessibilitySettings} />
            </motion.div>
          )}
          
          {currentView === 'mood' && (
            <motion.div
              key="mood"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <MoodTracker user={user} />
            </motion.div>
          )}
          
          {currentView === 'games' && (
            <motion.div
              key="games"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <GameHub user={user} accessibility={accessibilitySettings} />
            </motion.div>
          )}
          
          {currentView === 'spaces' && (
            <motion.div
              key="spaces"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <SafeSpaces accessibility={accessibilitySettings} />
            </motion.div>
          )}
          
          {currentView === 'accessibility' && (
            <motion.div
              key="accessibility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <AccessibilityPanel 
                settings={accessibilitySettings}
                onSettingsChange={setAccessibilitySettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;