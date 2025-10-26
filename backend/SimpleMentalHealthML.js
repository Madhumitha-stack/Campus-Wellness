// Simple Mental Health ML Model for Testing
class SimpleMentalHealthML {
  constructor() {
    this.crisisKeywords = new Set([
      'suicide', 'kill myself', 'end it all', 'want to die', 'end my life',
      'harm myself', 'hurt myself', 'better off dead', 'no reason to live'
    ]);

    this.positiveWords = new Set(['happy', 'good', 'great', 'better', 'well', 'okay', 'fine']);
    this.negativeWords = new Set(['sad', 'bad', 'terrible', 'awful', 'depressed', 'anxious', 'stressed']);
  }

  async analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    const crisisDetected = Array.from(this.crisisKeywords).some(keyword => 
      lowerMessage.includes(keyword)
    );

    let sentiment = 'neutral';
    let positiveCount = 0;
    let negativeCount = 0;

    this.positiveWords.forEach(word => {
      if (lowerMessage.includes(word)) positiveCount++;
    });

    this.negativeWords.forEach(word => {
      if (lowerMessage.includes(word)) negativeCount++;
    });

    if (crisisDetected) {
      sentiment = 'crisis';
    } else if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }

    return {
      sentiment,
      crisisDetected,
      emotionalIntensity: Math.max(positiveCount, negativeCount),
      confidence: 0.8,
      context: {},
      detectedNeeds: ['general_support'],
      recommendedActions: ['listen', 'support'],
      riskLevel: crisisDetected ? 'high' : 'low'
    };
  }

  async generateResponse(message, analysis) {
    let responseText = "";
    let resources = [];

    if (analysis.crisisDetected) {
      responseText = "I'm deeply concerned about what you're sharing. Your safety is the most important thing. Please contact the crisis lifeline at 988 or emergency services at 911 right now. You are not alone in this.";
      resources = ["Emergency: 911", "Crisis Lifeline: 988", "Crisis Text Line: Text HOME to 741741"];
    } else if (analysis.sentiment === 'negative') {
      responseText = "I hear that you're going through a tough time. Thank you for sharing this with me. Would you like to talk more about what's coming up for you?";
      resources = ["Deep breathing exercise", "Talk to a trusted friend", "Practice mindfulness"];
    } else if (analysis.sentiment === 'positive') {
      responseText = "It's wonderful to hear you're feeling positive! What's helping create these good feelings?";
      resources = ["Gratitude journaling", "Share positive energy", "Continue self-care"];
    } else {
      responseText = "Thanks for sharing. I'm here to listen and support you. How are you really feeling beneath the surface?";
      resources = ["Mindfulness practice", "Self-reflection", "Emotional awareness"];
    }

    return {
      message: responseText,
      resources,
      priority: analysis.crisisDetected ? 'emergency' : 'normal',
      followUp: "How are you feeling after sharing that?",
      therapeuticAction: "supportive listening"
    };
  }
}

// Export singleton instance
const simpleMentalHealthML = new SimpleMentalHealthML();
export default simpleMentalHealthML;