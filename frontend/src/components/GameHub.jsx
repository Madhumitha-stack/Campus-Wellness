import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// UNIQUE GAME 1: Breathing Bubble Pop
const BreathingBubblePop = ({ user, onGameComplete, accessibility }) => {
  const [bubbles, setBubbles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [breathPhase, setBreathPhase] = useState('inhale'); // inhale, hold, exhale

  useEffect(() => {
    let bubbleInterval;
    let breathInterval;
    let timer;

    if (isPlaying && timeLeft > 0) {
      // Create new bubbles
      bubbleInterval = setInterval(() => {
        setBubbles(prev => [...prev, {
          id: Date.now() + Math.random(),
          size: Math.random() * 30 + 20,
          x: Math.random() * 80 + 10,
          speed: Math.random() * 2 + 1
        }].slice(-20)); // Keep only 20 bubbles
      }, 800);

      // Breathing guide
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
            setIsPlaying(false);
            onGameComplete(score, 60 - prev);
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
  }, [isPlaying, timeLeft, score, onGameComplete]);

  const popBubble = (bubbleId, isPerfect) => {
    setBubbles(prev => prev.filter(b => b.id !== bubbleId));
    setScore(prev => prev + (isPerfect ? 20 : 10));
  };

  const startGame = () => {
    setBubbles([]);
    setScore(0);
    setTimeLeft(60);
    setIsPlaying(true);
    setBreathPhase('inhale');
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe In... 🌬️';
      case 'hold': return 'Hold... ⏱️';
      case 'exhale': return 'Breathe Out... 💨';
      default: return 'Follow the rhythm';
    }
  };

  return (
    <div className={`p-6 rounded-xl ${
      accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
    }`}>
      <h3 className="text-2xl font-bold mb-4">Breathing Bubble Pop</h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Game Instructions */}
        <div>
          <p className="mb-4">Follow the breathing rhythm and pop bubbles in sync with your breath for maximum points!</p>
          
          <div className="mb-4 p-4 bg-mental-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Current Phase:</h4>
            <div className={`text-2xl font-bold text-center py-2 rounded ${
              breathPhase === 'inhale' ? 'bg-green-200 text-green-800' :
              breathPhase === 'exhale' ? 'bg-blue-200 text-blue-800' :
              'bg-yellow-200 text-yellow-800'
            }`}>
              {getBreathInstruction()}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-gray-100 rounded">
              <div className="text-2xl font-bold text-mental-blue">{score}</div>
              <div className="text-sm">Score</div>
            </div>
            <div className="text-center p-3 bg-gray-100 rounded">
              <div className="text-2xl font-bold text-mental-orange">{timeLeft}</div>
              <div className="text-sm">Seconds Left</div>
            </div>
          </div>

          {!isPlaying ? (
            <button
              onClick={startGame}
              className={`w-full py-3 rounded-lg font-bold text-lg ${
                accessibility.highContrast
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-mental-green text-white hover:bg-green-600'
              }`}
            >
              Start Breathing Game
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="w-full py-3 bg-mental-orange text-white rounded-lg font-bold text-lg hover:bg-orange-600"
            >
              End Game
            </button>
          )}
        </div>

        {/* Game Area */}
        <div className="relative h-64 bg-gradient-to-b from-mental-blue-100 to-mental-green-100 rounded-lg overflow-hidden">
          {bubbles.map(bubble => (
            <motion.div
              key={bubble.id}
              className={`absolute cursor-pointer rounded-full ${
                breathPhase === 'exhale' ? 'bg-mental-green-300' : 'bg-mental-blue-300'
              } border-2 border-white`}
              style={{
                width: bubble.size,
                height: bubble.size,
                left: `${bubble.x}%`,
                bottom: -bubble.size
              }}
              initial={{ bottom: -bubble.size }}
              animate={{ bottom: '100%' }}
              transition={{ duration: bubble.speed }}
              onClick={() => popBubble(bubble.id, breathPhase === 'exhale')}
              whileHover={{ scale: 1.1 }}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  popBubble(bubble.id, breathPhase === 'exhale');
                }
              }}
            />
          ))}
          
          {/* Breathing indicator */}
          <motion.div
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-mental-purple-300 rounded-full flex items-center justify-center text-white font-bold"
            animate={{
              scale: breathPhase === 'inhale' ? 1.2 : 
                     breathPhase === 'hold' ? 1.3 : 1
            }}
            transition={{ duration: 2 }}
          >
            {breathPhase === 'inhale' ? 'IN' : 
             breathPhase === 'hold' ? 'HOLD' : 'OUT'}
          </motion.div>
        </div>
      </div>

      {/* Accessibility Controls */}
      <div className="mt-4 p-3 bg-gray-100 rounded-lg">
        <h4 className="font-semibold mb-2">Accessibility Controls:</h4>
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-1 bg-mental-blue text-white rounded text-sm">
            Spacebar: Pop Bubble
          </button>
          <button className="px-3 py-1 bg-mental-green text-white rounded text-sm">
            Voice: "Pop"
          </button>
        </div>
      </div>
    </div>
  );
};

// UNIQUE GAME 2: Mindful Garden
const MindfulGarden = ({ user, onGameComplete, accessibility }) => {
  const [garden, setGarden] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedPlant, setSelectedPlant] = useState(null);

  const plants = [
    { id: 1, name: 'Peace Lily', emoji: '🌿', growthTime: 3 },
    { id: 2, name: 'Calm Chamomile', emoji: '🌼', growthTime: 5 },
    { id: 3, name: 'Serenity Sage', emoji: '🌱', growthTime: 4 }
  ];

  const plantSeed = (plant) => {
    const newPlant = {
      id: Date.now(),
      type: plant,
      plantedAt: new Date(),
      growth: 0,
      stage: 'seed'
    };
    
    setGarden(prev => [...prev, newPlant]);
    setScore(prev => prev + 10);
  };

  const tendPlant = (plantId) => {
    setGarden(prev => prev.map(plant => {
      if (plant.id === plantId) {
        const newGrowth = plant.growth + 25;
        let stage = plant.stage;
        
        if (newGrowth >= 100) stage = 'bloom';
        else if (newGrowth >= 60) stage = 'growing';
        else if (newGrowth >= 30) stage = 'sprout';
        
        return { ...plant, growth: newGrowth, stage };
      }
      return plant;
    }));
    
    setScore(prev => prev + 15);
  };

  const getPlantEmoji = (stage) => {
    switch (stage) {
      case 'seed': return '🌱';
      case 'sprout': return '🪴';
      case 'growing': return '🌿';
      case 'bloom': return '🌸';
      default: return '🌱';
    }
  };

  return (
    <div className={`p-6 rounded-xl ${
      accessibility.highContrast ? 'bg-white text-black' : 'bg-white shadow-lg'
    }`}>
      <h3 className="text-2xl font-bold mb-4">Mindful Garden</h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Plant Selection */}
        <div>
          <h4 className="font-semibold mb-3">Choose a Plant:</h4>
          <div className="space-y-2">
            {plants.map(plant => (
              <button
                key={plant.id}
                onClick={() => plantSeed(plant)}
                className={`w-full p-3 rounded-lg text-left ${
                  accessibility.highContrast
                    ? 'bg-gray-200 hover:bg-gray-300'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                <span className="text-2xl mr-2">{plant.emoji}</span>
                {plant.name}
              </button>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-mental-green-50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-mental-green">{score}</div>
              <div className="text-sm">Mindfulness Score</div>
            </div>
          </div>
        </div>

        {/* Garden Display */}
        <div className="md:col-span-2">
          <div className="bg-gradient-to-br from-green-100 to-yellow-100 rounded-lg p-4 min-h-64">
            <h4 className="font-semibold mb-3">Your Garden:</h4>
            
            {garden.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                Plant your first seed to start your mindful garden!
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {garden.map(plant => (
                  <motion.div
                    key={plant.id}
                    className={`text-center p-3 rounded-lg cursor-pointer ${
                      accessibility.highContrast
                        ? 'bg-white border-2 border-black'
                        : 'bg-white shadow-md'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => tendPlant(plant.id)}
                  >
                    <div className="text-4xl mb-2">
                      {getPlantEmoji(plant.stage)}
                    </div>
                    <div className="text-sm font-semibold">
                      {plant.type.name}
                    </div>
                    <div className="text-xs text-gray-600 capitalize">
                      {plant.stage}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-mental-green h-2 rounded-full"
                        style={{ width: `${plant.growth}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>💡 Tip: Tending to plants mindfully can reduce stress and improve focus.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GameHub = ({ user, accessibility }) => {
  const [activeGame, setActiveGame] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('/api/game/leaderboard');
      setLeaderboard(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const handleGameComplete = async (score, duration) => {
    try {
      await axios.post('/api/game/score', {
        userId: user.id,
        gameType: activeGame,
        score,
        duration
      });
      fetchLeaderboard(); // Refresh leaderboard
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  const games = [
    {
      id: 'breathing_bubble',
      name: 'Breathing Bubble Pop',
      description: 'Sync your breathing with bubble popping for stress relief',
      component: BreathingBubblePop,
      emoji: '🫧'
    },
    {
      id: 'mindful_garden',
      name: 'Mindful Garden',
      description: 'Grow plants mindfully to cultivate peace and focus',
      component: MindfulGarden,
      emoji: '🌿'
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
        <h2 className="text-3xl font-bold mb-2">Stress Relief Games</h2>
        <p className="text-lg text-gray-600">Play these accessible games to reduce stress and earn wellness credits</p>
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
            className="mb-4 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            ← Back to Games
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
        <h3 className="text-2xl font-bold mb-4">Wellness Leaderboard</h3>
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