import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = ({ user }) => {
  const [quickStats, setQuickStats] = useState({
    moodEntries: 0,
    gamesPlayed: 0,
    creditsEarned: 0,
    chatSessions: 0
  });
  const [recentMoods, setRecentMoods] = useState([]);
  const [dailyTip, setDailyTip] = useState('');

  useEffect(() => {
    loadDashboardData();
    loadDailyTip();
  }, [user]);

  const loadDashboardData = async () => {
    // Mock data for demonstration
    setQuickStats({
      moodEntries: 12,
      gamesPlayed: 8,
      creditsEarned: 45,
      chatSessions: 5
    });
    
    setRecentMoods([
      { mood: 'Good', intensity: 4, timestamp: new Date(Date.now() - 86400000) },
      { mood: 'Excellent', intensity: 6, timestamp: new Date(Date.now() - 172800000) },
      { mood: 'Okay', intensity: 3, timestamp: new Date(Date.now() - 259200000) }
    ]);
  };

  const loadDailyTip = () => {
    const tips = [
      "Take a 5-minute breathing break when feeling overwhelmed",
      "Practice gratitude by writing down three things you're thankful for today",
      "Connect with a friend or support person regularly",
      "Get some sunlight and fresh air - even a short walk can help",
      "Remember it's okay to ask for help when you need it"
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  };

  const getMoodEmoji = (intensity) => {
    if (intensity <= 2) return '😔';
    if (intensity <= 3) return '😐';
    if (intensity <= 4) return '🙂';
    if (intensity <= 5) return '😊';
    return '😄';
  };

  const QuickStatCard = ({ title, value, description, icon, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`p-6 rounded-xl text-white ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="font-semibold">{title}</div>
          <div className="text-sm opacity-90 mt-1">{description}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </motion.div>
  );

  const FeatureCard = ({ title, description, icon, link, action }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl transition-shadow"
      onClick={action}
    >
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </motion.div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold mb-2">
          Welcome back, {user?.username || 'Student'}! 👋
        </h1>
        <p className="text-xl text-gray-600">
          Ready to continue your wellness journey today?
        </p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        <QuickStatCard
          title="Mood Entries"
          value={quickStats.moodEntries}
          description="Tracked this month"
          icon="📊"
          color="bg-mental-blue"
        />
        <QuickStatCard
          title="Games Played"
          value={quickStats.gamesPlayed}
          description="Stress relief sessions"
          icon="🎮"
          color="bg-mental-green"
        />
        <QuickStatCard
          title="Credits Earned"
          value={quickStats.creditsEarned}
          description="Wellness points"
          icon="⭐"
          color="bg-mental-purple"
        />
        <QuickStatCard
          title="Chat Sessions"
          value={quickStats.chatSessions}
          description="Support conversations"
          icon="💬"
          color="bg-mental-orange"
        />
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Features */}
        <div className="lg:col-span-2">
          <motion.h2 
            className="text-2xl font-bold mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Quick Access
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FeatureCard
              title="Support Chat"
              description="Talk with our AI assistant for immediate emotional support and guidance"
              icon="💬"
              action={() => window.location.hash = '#chat'}
            />
            <FeatureCard
              title="Mood Tracker"
              description="Log your current mood and track patterns over time"
              icon="📈"
              action={() => window.location.hash = '#mood'}
            />
            <FeatureCard
              title="Stress Relief Games"
              description="Play therapeutic games to reduce stress and earn credits"
              icon="🎮"
              action={() => window.location.hash = '#games'}
            />
            <FeatureCard
              title="Safe Spaces"
              description="Find supportive locations and resources on campus"
              icon="🏢"
              action={() => window.location.hash = '#spaces'}
            />
          </div>

          {/* Recent Mood History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4">Recent Mood History</h3>
            {recentMoods.length > 0 ? (
              <div className="space-y-3">
                {recentMoods.map((mood, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{getMoodEmoji(mood.intensity)}</span>
                      <div>
                        <div className="font-semibold">{mood.mood}</div>
                        <div className="text-sm text-gray-600">
                          {mood.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">Level {mood.intensity}/6</div>
                      <div className="text-sm text-gray-600">
                        {mood.intensity <= 2 ? 'Low' : 
                         mood.intensity <= 4 ? 'Moderate' : 'High'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <div className="text-4xl mb-2">📊</div>
                <p>No mood entries yet</p>
                <button 
                  onClick={() => window.location.hash = '#mood'}
                  className="mt-2 px-4 py-2 bg-mental-blue text-white rounded-lg hover:bg-blue-600"
                >
                  Track Your First Mood
                </button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Tip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-mental-green to-mental-blue rounded-xl shadow-lg p-6 text-white"
          >
            <h3 className="text-xl font-bold mb-3">💡 Daily Wellness Tip</h3>
            <p className="text-lg">{dailyTip}</p>
            <button
              onClick={loadDailyTip}
              className="mt-4 px-4 py-2 bg-white text-mental-green rounded-lg font-semibold hover:bg-gray-100"
            >
              New Tip
            </button>
          </motion.div>

          {/* Emergency Resources */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-3 text-red-600">🚨 Emergency Support</h3>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 rounded-lg">
                <div className="font-semibold">Crisis Hotline</div>
                <div className="text-lg text-red-600">555-0199</div>
                <div className="text-sm text-gray-600">24/7 Available</div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-semibold">Campus Counseling</div>
                <div className="text-lg text-mental-blue">555-0123</div>
                <div className="text-sm text-gray-600">Mon-Fri 9AM-5PM</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-semibold">Peer Support</div>
                <div className="text-lg text-mental-green">555-0124</div>
                <div className="text-sm text-gray-600">10AM-8PM Daily</div>
              </div>
            </div>
          </motion.div>

          {/* Wellness Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4">Your Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Mood Tracking</span>
                  <span className="text-mental-green">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-mental-green h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Stress Management</span>
                  <span className="text-mental-blue">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-mental-blue h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold">Social Support</span>
                  <span className="text-mental-purple">45%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-mental-purple h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;