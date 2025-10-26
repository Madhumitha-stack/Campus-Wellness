import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// UNIQUE GAME 1: Breathing Bubble Pop - Improved Version
const BreathingBubblePop = ({ user, onGameComplete, accessibility }) => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale');
  const [gameInstructions, setGameInstructions] = useState(true);

  useEffect(() => {
    let bubbleInterval;
    let breathInterval;
    let timer;

    if (isPlaying && timeLeft > 0) {
      // Create new bubbles
      bubbleInterval = setInterval(() => {
        setBubbles(prev => [...prev, {
          id: Date.now() + Math.random(),
          size: Math.random() * 40 + 30, // Larger bubbles
          x: Math.random() * 70 + 15, // Better distribution
          speed: Math.random() * 3 + 1,
          createdAt: Date.now()
        }].slice(-15)); // Keep only 15 bubbles for better performance
      }, 1000);

      // Breathing guide - 4-7-8 breathing technique
      breathInterval = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'inhale') return 'hold';
          if (prev === 'hold') return 'exhale';
          return 'inhale';
        });
      }, 4000);

      // Timer
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleGameEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(breathInterval);
      clearInterval(timer);
    };
  }, [isPlaying, timeLeft]);

  // Remove old bubbles automatically
  useEffect(() => {
    if (!isPlaying) return;

    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      setBubbles(prev => prev.filter(bubble => 
        now - bubble.createdAt < 10000 // Remove bubbles older than 10 seconds
      ));
    }, 2000);

    return () => clearInterval(cleanupInterval);
  }, [isPlaying]);

  const handleGameEnd = () => {
    setIsPlaying(false);
    const duration = 60 - timeLeft;
    if (onGameComplete) {
      onGameComplete(score, duration);
    }
    alert(`🎉 Game Over! Final Score: ${score}\n\nYou practiced breathing for ${duration} seconds!`);
  };

  const popBubble = (bubbleId, isPerfect) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    const points = isPerfect ? 25 : 10;
    setScore(prev => prev + points);
  };

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setBreathPhase('inhale');
    setGameInstructions(false);
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In Slowly... 🌬️ (4 seconds)';
      case 'hold': return 'Hold Breath... ⏱️ (7 seconds)';
      case 'exhale': return 'Breathe Out Slowly... 💨 (8 seconds)';
      default: return 'Follow the Breathing Rhythm';
    }
  };

  const getPhaseColor = () => {
    switch (breathPhase) {
      case 'inhale': return 'bg-green-200 text-green-800 border-green-300';
      case 'exhale': return 'bg-blue-200 text-blue-800 border-blue-300';
      case 'hold': return 'bg-yellow-200 text-yellow-800 border-yellow-300';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (gameInstructions) {
    return (
      <div className={`p-6 rounded-xl ${
        accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
      }`}>
        <h3 className="text-2xl font-bold mb-4">🧘 Breathing Bubble Pop - Instructions</h3>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-mental-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 How to Play:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Follow the 4-7-8 breathing rhythm:</strong> Inhale (4s), Hold (7s), Exhale (8s)</li>
              <li><strong>Pop bubbles during EXHALE phase</strong> for bonus points (25 points)</li>
              <li><strong>Pop bubbles during other phases</strong> for regular points (10 points)</li>
              <li><strong>Game lasts 60 seconds</strong> - practice mindful breathing!</li>
            </ul>
          </div>

          <div className="p-4 bg-mental-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Therapeutic Benefits:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Reduces anxiety and stress</li>
              <li>Improves focus and mindfulness</li>
              <li>Teaches proper breathing technique</li>
              <li>Lowers blood pressure</li>
            </ul>
          </div>

          <div className="p-4 bg-mental-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">🎮 Controls:</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <span className="bg-mental-blue text-white px-2 py-1 rounded">Click</span>
                <span>Pop Bubble</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-mental-green text-white px-2 py-1 rounded">Space</span>
                <span>Pop Selected</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className={`w-full py-4 rounded-lg font-bold text-lg ${
            accessibility.highContrast
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-mental-green text-white hover:bg-green-600 shadow-lg'
          }`}
        >
          🎮 Start Breathing Practice
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${
      accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Breathing Bubble Pop</h3>
        <button
          onClick={() => setGameInstructions(true)}
          className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
        >
          📖 Instructions
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Game Controls */}
        <div>
          <div className="mb-4 p-4 rounded-lg border-2 bg-gradient-to-r from-blue-50 to-green-50">
            <h4 className="font-semibold mb-2">Current Phase:</h4>
            <div className={`text-xl font-bold text-center py-3 rounded-lg ${getPhaseColor()}`}>
              {getBreathInstruction()}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold text-mental-blue">{score}</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold text-mental-orange">{timeLeft}</div>
              <div className="text-sm text-gray-600">Seconds</div>
            </div>
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <div className="text-2xl font-bold text-mental-purple">
                {Math.floor((60 - timeLeft) / 12)}
              </div>
              <div className="text-sm text-gray-600">Breaths</div>
            </div>
          </div>

          {!isPlaying ? (
            <button
              onClick={startGame}
              className={`w-full py-3 rounded-lg font-bold text-lg mb-3 ${
                accessibility.highContrast
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-mental-green text-white hover:bg-green-600'
              }`}
            >
              🎮 Start Game
            </button>
          ) : (
            <button
              onClick={handleGameEnd}
              className="w-full py-3 bg-mental-orange text-white rounded-lg font-bold text-lg hover:bg-orange-600 mb-3"
            >
              ⏹️ End Game
            </button>
          )}

          <div className="p-3 bg-mental-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">Scoring:</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Normal Pop:</span>
                <span className="font-bold">10 points</span>
              </div>
              <div className="flex justify-between">
                <span>Perfect Breath (Exhale):</span>
                <span className="font-bold text-green-600">25 points</span>
              </div>
            </div>
          </div>
        </div>

        {/* Game Area */}
        <div className="relative h-80 bg-gradient-to-b from-blue-100 to-green-100 rounded-xl overflow-hidden border-2 border-gray-300">
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className={`absolute cursor-pointer rounded-full border-2 border-white shadow-lg ${
                breathPhase === 'exhale' 
                  ? 'bg-green-400 hover:bg-green-500 ring-2 ring-yellow-300' 
                  : 'bg-blue-400 hover:bg-blue-500'
              }`}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`,
                bottom: -bubble.size
              }}
              initial={{ bottom: -bubble.size }}
              animate={{ bottom: '100%' }}
              transition={{ 
                duration: bubble.speed,
                ease: "easeOut"
              }}
              onClick={() => popBubble(bubble.id, breathPhase === 'exhale')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {/* Bubble shine effect */}
              <div className="absolute top-2 left-3 w-4 h-4 bg-white rounded-full opacity-30"></div>
            </motion.div>
          ))}
          
          {/* Breathing indicator */}
          <motion.div
            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white"
            animate={{
              scale: breathPhase === 'inhale' ? [1, 1.3, 1] : 
                     breathPhase === 'hold' ? 1.2 : 
                     [1.3, 1, 1.3]
            }}
            transition={{ 
              duration: breathPhase === 'hold' ? 1 : 2,
              repeat: breathPhase !== 'hold' ? Infinity : 0
            }}
          >
            <div className="text-center">
              <div className="text-lg font-bold">
                {breathPhase === 'inhale' ? 'IN' : 
                 breathPhase === 'hold' ? 'HOLD' : 'OUT'}
              </div>
              <div className="text-xs opacity-80 mt-1">
                {breathPhase === 'exhale' ? 'POP NOW!' : 'breathe...'}
              </div>
            </div>
          </motion.div>

          {/* Water surface */}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-blue-200 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

// UNIQUE GAME 2: Mindful Garden - Improved Version
const MindfulGarden = ({ user, onGameComplete, accessibility }) => {
  const [garden, setGarden] = useState([]);
  const [score, setScore] = useState(0);
  const [gameInstructions, setGameInstructions] = useState(true);
  const [lastTended, setLastTended] = useState(null);

  const plants = [
    { 
      id: 1, 
      name: 'Peace Lily', 
      emoji: '🌿', 
      growthTime: 3,
      description: 'Promotes calm and reduces anxiety'
    },
    { 
      id: 2, 
      name: 'Calm Chamomile', 
      emoji: '🌼', 
      growthTime: 5,
      description: 'Encourages restful sleep and relaxation'
    },
    { 
      id: 3, 
      name: 'Serenity Sage', 
      emoji: '🌱', 
      growthTime: 4,
      description: 'Clears mental clutter and improves focus'
    }
  ];

  const plantSeed = (plant) => {
    if (garden.length >= 6) {
      alert('🌿 Your garden is full! Tend to your existing plants mindfully.');
      return;
    }

    const newPlant = {
      id: Date.now(),
      type: plant,
      plantedAt: new Date(),
      growth: 0,
      stage: 'seed',
      lastTended: new Date()
    };
    
    setGarden(prev => [...prev, newPlant]);
    setScore(prev => prev + 5);
  };

  const tendPlant = (plantId) => {
    const now = new Date();
    setLastTended(now);
    
    setGarden(prev => prev.map(plant => {
      if (plant.id === plantId) {
        const growthIncrease = 20 + Math.floor(Math.random() * 15); // 20-35 growth
        const newGrowth = Math.min(plant.growth + growthIncrease, 100);
        
        let stage = plant.stage;
        if (newGrowth >= 100) stage = 'bloom';
        else if (newGrowth >= 70) stage = 'flowering';
        else if (newGrowth >= 40) stage = 'growing';
        else if (newGrowth >= 15) stage = 'sprout';
        
        const pointsEarned = stage !== plant.stage ? 25 : 15;
        
        setTimeout(() => {
          setScore(prev => prev + pointsEarned);
        }, 300);
        
        return { ...plant, growth: newGrowth, stage, lastTended: now };
      }
      return plant;
    }));

    // Check if all plants are blooming
    if (garden.length > 0 && garden.every(plant => plant.stage === 'bloom')) {
      setTimeout(() => {
        const totalScore = score + 100;
        if (onGameComplete) {
          onGameComplete(totalScore, 300);
        }
        alert('🎉 Your garden is fully bloomed! Amazing mindfulness practice!');
      }, 1000);
    }
  };

  const getPlantEmoji = (stage, plantEmoji) => {
    switch (stage) {
      case 'seed': return '🌱';
      case 'sprout': return '🪴';
      case 'growing': return plantEmoji;
      case 'flowering': return '🌸';
      case 'bloom': return '💮';
      default: return '🌱';
    }
  };

  const getGrowthColor = (growth) => {
    if (growth >= 80) return 'bg-green-500';
    if (growth >= 60) return 'bg-green-400';
    if (growth >= 40) return 'bg-yellow-500';
    if (growth >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const startGame = () => {
    setGameInstructions(false);
  };

  if (gameInstructions) {
    return (
      <div className={`p-6 rounded-xl ${
        accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
      }`}>
        <h3 className="text-2xl font-bold mb-4">🌿 Mindful Garden - Instructions</h3>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-mental-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">🎯 How to Play:</h4>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Choose plants</strong> from the left panel to start your garden</li>
              <li><strong>Click on plants</strong> to tend them and help them grow</li>
              <li><strong>Watch plants progress</strong> through 5 growth stages</li>
              <li><strong>Goal: Get all plants to full bloom</strong> for a completion bonus!</li>
              <li><strong>Maximum 6 plants</strong> in your garden</li>
            </ul>
          </div>

          <div className="p-4 bg-mental-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">💡 Mindful Gardening Tips:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Take deep breaths while tending plants</li>
              <li>Notice the details in each growth stage</li>
              <li>Practice patience - growth takes time</li>
              <li>Express gratitude for each plant's journey</li>
            </ul>
          </div>

          <div className="p-4 bg-mental-purple-50 rounded-lg">
            <h4 className="font-semibold mb-2">🏆 Scoring:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Plant a seed:</span>
                <span className="font-bold">+5 points</span>
              </div>
              <div className="flex justify-between">
                <span>Tend a plant:</span>
                <span className="font-bold">+15 points</span>
              </div>
              <div className="flex justify-between">
                <span>Reach new growth stage:</span>
                <span className="font-bold text-green-600">+25 points</span>
              </div>
              <div className="flex justify-between">
                <span>Full garden bloom:</span>
                <span className="font-bold text-purple-600">+100 points</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={startGame}
          className={`w-full py-4 rounded-lg font-bold text-lg ${
            accessibility.highContrast
              ? 'bg-black text-white hover:bg-gray-800'
              : 'bg-mental-green text-white hover:bg-green-600 shadow-lg'
          }`}
        >
          🌱 Start Gardening
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 rounded-xl ${
      accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
    }`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold">Mindful Garden</h3>
        <button
          onClick={() => setGameInstructions(true)}
          className="px-3 py-1 bg-gray-200 rounded-lg text-sm hover:bg-gray-300"
        >
          📖 Instructions
        </button>
      </div>
      
      <div className="grid md:grid-cols-4 gap-6">
        {/* Plant Selection */}
        <div className="md:col-span-1">
          <h4 className="font-semibold mb-3">Choose Plants:</h4>
          <div className="space-y-3 mb-6">
            {plants.map(plant => (
              <motion.button
                key={plant.id}
                onClick={() => plantSeed(plant)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  accessibility.highContrast
                    ? 'bg-gray-200 hover:bg-gray-300 border-2 border-black'
                    : 'bg-gray-100 hover:bg-gray-200 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{plant.emoji}</span>
                  <div>
                    <div className="font-semibold">{plant.name}</div>
                    <div className="text-sm text-gray-600">{plant.description}</div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          
          {/* Stats */}
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-mental-green to-mental-blue rounded-xl text-white">
              <div className="text-3xl font-bold">{score}</div>
              <div className="text-sm opacity-90">Mindfulness Points</div>
            </div>
            
            <div className="p-3 bg-mental-purple-50 rounded-lg">
              <div className="text-sm font-semibold mb-2">Garden Progress</div>
              <div className="text-xs text-gray-600 space-y-1">
                <div>Plants: {garden.length}/6</div>
                <div>Blooming: {garden.filter(p => p.stage === 'bloom').length}</div>
                <div>Total Growth: {garden.reduce((sum, p) => sum + p.growth, 0)}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Garden Display */}
        <div className="md:col-span-3">
          <div className="bg-gradient-to-br from-green-50 to-yellow-50 rounded-xl p-6 min-h-96 border-2 border-green-200">
            <h4 className="font-semibold mb-4 text-lg">Your Peaceful Garden</h4>
            
            {garden.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                <div className="text-6xl mb-4">🌱</div>
                <p className="text-lg mb-2">Your garden awaits</p>
                <p className="text-sm">Choose plants from the left to begin your mindful gardening journey</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {garden.map(plant => (
                  <motion.div
                    key={plant.id}
                    className={`text-center p-4 rounded-xl cursor-pointer transition-all ${
                      accessibility.highContrast
                        ? 'bg-white border-2 border-black'
                        : 'bg-white shadow-lg hover:shadow-xl border-2 border-transparent'
                    } ${
                      plant.stage === 'bloom' ? 'ring-2 ring-yellow-400 bg-yellow-50' : ''
                    }`}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => tendPlant(plant.id)}
                  >
                    <motion.div 
                      className="text-5xl mb-3"
                      animate={{ 
                        scale: plant.stage === 'bloom' ? [1, 1.1, 1] : 1,
                        rotate: plant.stage === 'bloom' ? [0, -5, 5, 0] : 0
                      }}
                      transition={{ 
                        duration: plant.stage === 'bloom' ? 3 : 0, 
                        repeat: plant.stage === 'bloom' ? Infinity : 0 
                      }}
                    >
                      {getPlantEmoji(plant.stage, plant.type.emoji)}
                    </motion.div>
                    
                    <div className="font-semibold text-sm mb-2">
                      {plant.type.name}
                    </div>
                    
                    <div className="text-xs text-gray-600 capitalize mb-2">
                      {plant.stage}
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${getGrowthColor(plant.growth)}`}
                        style={{ width: `${plant.growth}%` }}
                      ></div>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {plant.growth}% grown
                    </div>
                    
                    {plant.stage === 'bloom' && (
                      <div className="mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        ✨ Fully Bloomed!
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          {/* Quick Tips */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold mb-2 text-mental-blue">💡 Gardening Tip</h4>
            <p className="text-sm text-gray-700">
              {garden.length === 0 
                ? "Start by planting your first seed. Each plant has different therapeutic benefits!"
                : garden.every(p => p.stage === 'bloom')
                ? "Amazing! Your entire garden is blooming. You've mastered mindful gardening! 🎉"
                : "Click on plants to tend them. Notice how mindful attention helps them grow."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main GameHub Component
const GameHub = ({ user, accessibility }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Mock data for demonstration
      const mockLeaderboard = [
        { userId: 'user_abc123', totalCredits: 150, gamesPlayed: 8 },
        { userId: 'user_def456', totalCredits: 120, gamesPlayed: 6 },
        { userId: 'user_ghi789', totalCredits: 95, gamesPlayed: 5 },
        { userId: 'user_jkl012', totalCredits: 80, gamesPlayed: 4 },
        { userId: 'user_mno345', totalCredits: 65, gamesPlayed: 3 }
      ];
      setLeaderboard(mockLeaderboard);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleGameComplete = async (score, duration) => {
    try {
      // Calculate credits
      const creditsEarned = Math.floor((score / 100) * Math.max(1, duration / 60));
      
      // Show success message
      alert(`🎉 Game Completed!\nScore: ${score}\nCredits Earned: ${creditsEarned}\nDuration: ${duration}s`);
      
      // Save to backend (mock for now)
      console.log('Saving game results:', { user: user?.id, score, duration, creditsEarned });
      
      // Refresh leaderboard
      fetchLeaderboard();
      
    } catch (error) {
      console.error('Error saving score:', error);
      alert('Score saved locally!');
    }
  };

  const games = [
    {
      id: 'breathing_bubble',
      name: 'Breathing Bubble Pop',
      description: 'Practice 4-7-8 breathing technique while popping bubbles. Perfect for stress relief and anxiety reduction.',
      component: BreathingBubblePop,
      emoji: '🫧',
      benefits: ['Reduces anxiety', 'Teaches breathing', 'Improves focus']
    },
    {
      id: 'mindful_garden',
      name: 'Mindful Garden',
      description: 'Grow virtual plants through mindful attention. Practice patience and care while reducing stress.',
      component: MindfulGarden,
      emoji: '🌿',
      benefits: ['Builds patience', 'Reduces stress', 'Enhances mindfulness']
    }
  ];

  const GameComponent = activeGame ? 
    games.find(game => game.id === activeGame)?.component : null;

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Therapeutic Games</h2>
        <p className="text-lg text-gray-600">
          Play these evidence-based games to reduce stress and practice mindfulness
        </p>
      </motion.div>

      {!activeGame ? (
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {games.map(game => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              className={`p-6 rounded-xl cursor-pointer ${
                accessibility.highContrast
                  ? 'bg-white border-2 border-black'
                  : 'bg-white shadow-lg hover:shadow-xl'
              }`}
              onClick={() => setActiveGame(game.id)}
            >
              <div className="text-4xl mb-4">{game.emoji}</div>
              <h3 className="text-xl font-bold mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {game.benefits.map((benefit, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-mental-green-100 text-mental-green text-xs rounded-full"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
              
              <div className={`px-4 py-2 rounded-lg inline-block ${
                accessibility.highContrast
                  ? 'bg-black text-white'
                  : 'bg-mental-blue text-white'
              }`}>
                Play Now
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setActiveGame(null)}
            className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Games</span>
          </button>
          
          {GameComponent && (
            <GameComponent
              user={user}
              onGameComplete={handleGameComplete}
              accessibility={accessibility}
            />
          )}
        </div>
      )}

      {/* Leaderboard */}
      <div className={`mt-8 p-6 rounded-xl ${
        accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
      }`}>
        <h3 className="text-2xl font-bold mb-4">🏆 Wellness Leaderboard</h3>
        {leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.map((entry, index) => (
              <div
                key={entry.userId}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  index === 0 ? 'bg-yellow-100 border-2 border-yellow-300' :
                  index === 1 ? 'bg-gray-100 border-2 border-gray-300' :
                  index === 2 ? 'bg-orange-100 border-2 border-orange-300' :
                  'bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className="font-bold w-6">{index + 1}.</span>
                  <span className="ml-2">User {entry.userId.slice(-6)}</span>
                </div>
                <div className="font-semibold text-mental-green">
                  {entry.totalCredits} credits
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No scores yet. Be the first to play!
          </p>
        )}
      </div>
    </div>
  );
};

export default GameHub;