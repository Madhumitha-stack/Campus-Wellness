const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock database
let users = [];
let moodEntries = [];
let chatHistory = [];
let gameScores = [];

// Simple ML model functions (inline to avoid module issues)
const analyzeMessage = async (message) => {
  const lowerMessage = message.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die'];
  const crisisDetected = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  
  let sentiment = 'neutral';
  if (lowerMessage.includes('happy') || lowerMessage.includes('good')) sentiment = 'positive';
  if (lowerMessage.includes('sad') || lowerMessage.includes('bad')) sentiment = 'negative';
  if (crisisDetected) sentiment = 'crisis';
  
  return { sentiment, crisisDetected };
};

const generateResponse = async (message, analysis) => {
  const { sentiment, crisisDetected } = analysis;
  
  if (crisisDetected) {
    return {
      message: "I'm really concerned about what you're sharing. Please contact Campus Crisis Line: 555-0199.",
      resources: ["Campus Crisis Line", "Emergency Counseling"],
      priority: "high"
    };
  }
  
  const responses = {
    positive: ["I'm glad to hear you're feeling positive!"],
    negative: ["I hear that you're going through a tough time."],
    neutral: ["Thanks for sharing. How has your day been?"]
  };
  
  return {
    message: responses[sentiment]?.[0] || "I'm here to listen.",
    resources: ["General Wellness Resources"],
    priority: "normal"
  };
};

// API Endpoints
app.post('/api/chat', async (req, res) => {
  try {
    const { message, userId } = req.body;
    const analysis = await analyzeMessage(message);
    const response = await generateResponse(message, analysis);
    
    chatHistory.push({
      userId,
      userMessage: message,
      botResponse: response,
      timestamp: new Date()
    });
    
    res.json({
      response,
      sentiment: analysis.sentiment,
      crisisAlert: analysis.crisisDetected
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Chat service unavailable' });
  }
});

app.post('/api/mood', (req, res) => {
  const { userId, mood, intensity, notes } = req.body;
  
  moodEntries.push({
    userId,
    mood,
    intensity: parseInt(intensity),
    notes,
    timestamp: new Date()
  });
  
  res.json({
    success: true,
    message: 'Mood recorded successfully'
  });
});

app.get('/api/mood/:userId', (req, res) => {
  const { userId } = req.params;
  const userMoods = moodEntries.filter(entry => entry.userId === userId);
  res.json(userMoods);
});

app.post('/api/game/score', (req, res) => {
  const { userId, gameType, score, duration } = req.body;
  
  const creditsEarned = Math.floor((parseInt(score) / 100) * Math.max(1, parseInt(duration) / 60));
  
  gameScores.push({
    userId,
    gameType,
    score: parseInt(score),
    duration: parseInt(duration),
    timestamp: new Date(),
    creditsEarned
  });
  
  res.json({
    success: true,
    credits: creditsEarned,
    message: 'Score saved successfully'
  });
});

app.get('/api/game/leaderboard', (req, res) => {
  const userScores = {};
  
  gameScores.forEach(entry => {
    if (!userScores[entry.userId]) {
      userScores[entry.userId] = { totalCredits: 0, gamesPlayed: 0 };
    }
    userScores[entry.userId].totalCredits += entry.creditsEarned;
    userScores[entry.userId].gamesPlayed += 1;
  });
  
  const leaderboard = Object.entries(userScores)
    .map(([userId, data]) => ({ userId, ...data }))
    .sort((a, b) => b.totalCredits - a.totalCredits)
    .slice(0, 10);
  
  res.json(leaderboard);
});

app.get('/api/safe-spaces', (req, res) => {
  const safeSpaces = [
    {
      id: 1,
      name: "Campus Counseling Center",
      type: "professional",
      location: { lat: 40.7589, lng: -73.9851 },
      hours: "9AM-5PM Mon-Fri",
      phone: "+1-555-0123",
      accessibility: ["wheelchair", "quiet_room"],
      description: "Professional mental health services"
    }
  ];
  
  res.json(safeSpaces);
});

app.post('/api/register', (req, res) => {
  const { username, email } = req.body;
  
  const newUser = {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    username,
    email,
    joinDate: new Date(),
    credits: 0
  };
  
  users.push(newUser);
  res.json({ success: true, user: newUser });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ API ready: http://localhost:${PORT}/api`);
});