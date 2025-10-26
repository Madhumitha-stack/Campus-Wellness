// Mock ML model for sentiment analysis and crisis detection
class MentalHealthML {
  
  // Analyze message sentiment and detect crisis keywords
  async analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    // Crisis keywords
    const crisisKeywords = [
      'suicide', 'kill myself', 'end it all', 'want to die', 
      'harm myself', 'no reason to live', 'better off dead'
    ];
    
    const crisisDetected = crisisKeywords.some(keyword => 
      lowerMessage.includes(keyword)
    );
    
    // Simple sentiment analysis
    const positiveWords = ['happy', 'good', 'great', 'better', 'improving', 'calm', 'peaceful'];
    const negativeWords = ['sad', 'bad', 'terrible', 'worse', 'anxious', 'depressed', 'hopeless'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });
    
    negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });
    
    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    if (negativeCount > positiveCount) sentiment = 'negative';
    if (crisisDetected) sentiment = 'crisis';
    
    return {
      sentiment,
      crisisDetected,
      confidence: Math.random() * 0.3 + 0.7 // Mock confidence score
    };
  }
  
  // Generate empathetic response
  async generateResponse(message, analysis) {
    const { sentiment, crisisDetected } = analysis;
    
    if (crisisDetected) {
      return {
        message: "I'm really concerned about what you're sharing. Please know you're not alone. For immediate support, contact Campus Crisis Line: 555-0199. Would you like me to connect you with a counselor right now?",
        resources: ["Campus Crisis Line", "Emergency Counseling", "24/7 Support"],
        priority: "high"
      };
    }
    
    const responses = {
      positive: [
        "I'm glad to hear you're feeling positive! What's helping you maintain this good mood?",
        "That's wonderful! Celebrating small wins is important. Want to explore ways to build on this positive energy?",
        "Great to hear! Remembering these positive moments can be helpful during tougher times."
      ],
      negative: [
        "I hear that you're going through a tough time. Would you like to talk more about what's bothering you?",
        "It sounds like things are really challenging right now. Remember that these feelings are valid and temporary.",
        "Thank you for sharing this with me. Let's work through this together. What's one small thing that might help right now?"
      ],
      neutral: [
        "Thanks for sharing. How has your day been overall?",
        "I'm here to listen. Is there anything specific on your mind today?",
        "Let's check in - how are you really feeling beneath the surface?"
      ]
    };
    
    const randomResponse = responses[sentiment][
      Math.floor(Math.random() * responses[sentiment].length)
    ];
    
    return {
      message: randomResponse,
      resources: this.getResources(sentiment),
      priority: "normal"
    };
  }
  
  getResources(sentiment) {
    const resourceMap = {
      positive: ["Mindfulness Exercises", "Gratitude Journaling", "Community Activities"],
      negative: ["Breathing Exercises", "Campus Counseling", "Peer Support Groups"],
      neutral: ["Mood Tracking", "Wellness Resources", "Campus Events"]
    };
    
    return resourceMap[sentiment] || ["General Wellness Resources"];
  }
  
  // Analyze mood patterns over time
  analyzeMoodPattern(moodEntries) {
    if (moodEntries.length < 3) {
      return { pattern: 'insufficient_data', trend: 'neutral' };
    }
    
    const recentMoods = moodEntries.slice(-7); // Last 7 entries
    const intensities = recentMoods.map(entry => entry.intensity);
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;
    
    // Simple trend analysis
    const firstHalf = intensities.slice(0, Math.floor(intensities.length / 2));
    const secondHalf = intensities.slice(Math.floor(intensities.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    let trend = 'stable';
    if (secondAvg > firstAvg + 1) trend = 'improving';
    if (secondAvg < firstAvg - 1) trend = 'declining';
    
    return {
      pattern: this.detectPattern(recentMoods),
      trend,
      averageIntensity: avgIntensity,
      recommendation: this.getRecommendation(trend, avgIntensity)
    };
  }
  
  detectPattern(moods) {
    // Simple pattern detection
    const lowCount = moods.filter(m => m.intensity <= 3).length;
    const highCount = moods.filter(m => m.intensity >= 7).length;
    
    if (lowCount > highCount * 2) return 'consistently_low';
    if (highCount > lowCount * 2) return 'consistently_high';
    return 'fluctuating';
  }
  
  getRecommendation(trend, intensity) {
    if (intensity <= 3 && trend === 'declining') {
      return "Consider reaching out to campus support services for additional help.";
    } else if (intensity >= 7 && trend === 'improving') {
      return "Great progress! Continue with your current coping strategies.";
    } else {
      return "Regular mood tracking is helping you stay aware. Keep it up!";
    }
  }
}

module.exports = new MentalHealthML();