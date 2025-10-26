import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Simple chart component without Chart.js dependencies
const SimpleMoodChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No data to display yet
      </div>
    );
  }

  const maxValue = 6;
  const chartData = data.slice(-14); // Last 14 entries

  return (
    <div className="h-48 flex items-end space-x-1">
      {chartData.map((entry, index) => {
        const height = (entry.intensity / maxValue) * 100;
        return (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-mental-blue rounded-t transition-all"
              style={{ height: `${height}%` }}
            />
            <div className="text-xs text-gray-500 mt-1">
              {index + 1}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const MoodTracker = ({ user }) => {
  const [currentMood, setCurrentMood] = useState(5);
  const [moodNotes, setMoodNotes] = useState('');
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMoodHistory();
    }
  }, [user]);

  const fetchMoodHistory = async () => {
    try {
      // Mock data for demonstration
      const mockData = [
        {
          userId: user.id,
          mood: 'Good',
          intensity: 4,
          notes: 'Feeling positive today',
          timestamp: new Date(Date.now() - 86400000)
        },
        {
          userId: user.id,
          mood: 'Excellent',
          intensity: 6,
          notes: 'Great day!',
          timestamp: new Date(Date.now() - 172800000)
        }
      ];
      setMoodHistory(mockData);
      analyzeInsights(mockData);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  const analyzeInsights = (moods) => {
    if (!moods || moods.length < 2) {
      setInsights({
        averageMood: '0',
        dominantTrend: 'stable',
        recommendation: 'Start tracking your mood to get insights!'
      });
      return;
    }

    const recentMoods = moods.slice(-7);
    const avgMood = recentMoods.reduce((sum, mood) => sum + mood.intensity, 0) / recentMoods.length;
    
    const trends = {
      improving: recentMoods.filter(mood => mood.intensity >= 7).length,
      declining: recentMoods.filter(mood => mood.intensity <= 3).length,
      stable: recentMoods.filter(mood => mood.intensity > 3 && mood.intensity < 7).length
    };

    setInsights({
      averageMood: avgMood.toFixed(1),
      dominantTrend: Object.keys(trends).reduce((a, b) => trends[a] > trends[b] ? a : b),
      recommendation: avgMood <= 4 ? 
        "Consider trying some stress-relief activities" : 
        "You're maintaining good balance. Keep it up!"
    });
  };

  const submitMood = async () => {
    if (!user) {
      alert('Please wait for user initialization');
      return;
    }

    setIsLoading(true);
    try {
      // Mock API call
      const newMoodEntry = {
        userId: user.id,
        mood: getMoodLabel(currentMood),
        intensity: currentMood,
        notes: moodNotes,
        timestamp: new Date()
      };

      setMoodHistory(prev => [...prev, newMoodEntry]);
      setMoodNotes('');
      
      // Show success message
      alert('Mood recorded successfully!');
      
      // Re-analyze insights
      analyzeInsights([...moodHistory, newMoodEntry]);
      
    } catch (error) {
      console.error('Error submitting mood:', error);
      alert('Error recording mood. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getMoodLabel = (value) => {
    const moods = [
      'Very Sad', 'Sad', 'Okay', 'Good', 'Very Good', 'Excellent'
    ];
    return moods[value - 1] || 'Neutral';
  };

  const getMoodColor = (value) => {
    const colors = [
      'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 
      'bg-lime-500', 'bg-green-500', 'bg-emerald-500'
    ];
    return colors[value - 1] || 'bg-gray-500';
  };

  const getMoodEmoji = (intensity) => {
    if (intensity <= 2) return '😔';
    if (intensity <= 3) return '😐';
    if (intensity <= 4) return '🙂';
    if (intensity <= 5) return '😊';
    return '😄';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mb-6"
      >
        <h2 className="text-2xl font-bold mb-6">How are you feeling today?</h2>
        
        {/* Mood Slider */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-4">
            Select your current mood:
          </label>
          <div className="space-y-4">
            <input
              type="range"
              min="1"
              max="6"
              value={currentMood}
              onChange={(e) => setCurrentMood(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Very Sad</span>
              <span>Sad</span>
              <span>Okay</span>
              <span>Good</span>
              <span>Very Good</span>
              <span>Excellent</span>
            </div>
          </div>
          
          {/* Current Mood Display */}
          <div className="text-center mt-4">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-white font-semibold ${getMoodColor(currentMood)}`}>
              <span className="text-2xl mr-2">
                {getMoodEmoji(currentMood)}
              </span>
              {getMoodLabel(currentMood)}
            </div>
          </div>
        </div>

        {/* Mood Notes */}
        <div className="mb-6">
          <label className="block text-lg font-semibold mb-2">
            Optional notes about your mood:
          </label>
          <textarea
            value={moodNotes}
            onChange={(e) => setMoodNotes(e.target.value)}
            placeholder="What's influencing your mood today? Any specific thoughts or feelings?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-mental-blue focus:border-transparent"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={submitMood}
          disabled={isLoading}
          className="w-full bg-mental-green text-white py-3 rounded-lg font-semibold text-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Recording...' : 'Record My Mood'}
        </button>
      </motion.div>

      {/* Insights and Chart */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Mood Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4">Mood Trends</h3>
          <SimpleMoodChart data={moodHistory} />
          <p className="text-sm text-gray-500 text-center mt-4">
            Your mood intensity over time
          </p>
        </motion.div>

        {/* Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4">Your Insights</h3>
          {insights ? (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-mental-blue mb-1">Average Mood</h4>
                <p className="text-2xl font-bold">{insights.averageMood}/6</p>
                <p className="text-sm text-gray-600">
                  {getMoodLabel(Math.round(parseFloat(insights.averageMood)))}
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-mental-green mb-1">Pattern</h4>
                <p className="capitalize font-semibold">{insights.dominantTrend}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {insights.recommendation}
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              Record a few moods to get personalized insights!
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Mood History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6 mt-6"
      >
        <h3 className="text-xl font-bold mb-4">Recent Mood Entries</h3>
        {moodHistory.length > 0 ? (
          <div className="space-y-3">
            {moodHistory.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 border-b border-gray-100">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{getMoodEmoji(entry.intensity)}</span>
                  <div>
                    <div className="font-medium">{entry.mood}</div>
                    {entry.notes && (
                      <div className="text-sm text-gray-600">{entry.notes}</div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">Level {entry.intensity}/6</div>
                  <div className="text-sm text-gray-500">
                    {entry.timestamp.toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No mood entries yet. Start tracking your mood above!
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default MoodTracker;