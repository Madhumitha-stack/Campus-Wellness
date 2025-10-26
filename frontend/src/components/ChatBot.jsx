import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const ChatBot = ({ user, accessibility }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const messagesEndRef = useRef(null);
  const [hasInitialized, setHasInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message - FIXED: Only run once
  useEffect(() => {
    if (!hasInitialized) {
      setMessages([{
        id: 'welcome-1',
        text: "Hello! I'm an AI assistant here to provide emotional support. I'm not a medical professional, but I'm here to listen and help you find resources. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }]);
      setHasInitialized(true);
    }
  }, [hasInitialized]);

  // Simple ML analysis function
  const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    
    const crisisKeywords = ['suicide', 'kill myself', 'end it all', 'want to die', 'harm myself'];
    const positiveWords = ['happy', 'good', 'great', 'better', 'well', 'fine', 'okay'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'depressed', 'anxious', 'stressed', 'lonely'];

    const crisisDetected = crisisKeywords.some(keyword => lowerMessage.includes(keyword));
    const positiveCount = positiveWords.filter(word => lowerMessage.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerMessage.includes(word)).length;

    let sentiment = 'neutral';
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
      emotionalIntensity: Math.max(positiveCount, negativeCount) + 1
    };
  };

  // Generate response based on analysis
  const generateResponse = (analysis) => {
    if (analysis.crisisDetected) {
      return {
        message: "I'm deeply concerned about your safety. Please contact emergency services immediately at 911 or the crisis hotline at 988. You are not alone in this.",
        resources: ["Emergency: 911", "Crisis Lifeline: 988", "Text HOME to 741741"],
        priority: "emergency"
      };
    }

    switch (analysis.sentiment) {
      case 'positive':
        return {
          message: "It's wonderful to hear you're feeling positive! What's helping create these good feelings?",
          resources: ["Gratitude journaling", "Share your positive energy", "Continue self-care practices"],
          priority: "low"
        };
      case 'negative':
        return {
          message: "I hear that you're going through a tough time. Thank you for sharing this with me. Would you like to talk more about what's coming up for you?",
          resources: ["Deep breathing exercise", "Talk to a trusted friend", "Practice mindfulness"],
          priority: "medium"
        };
      default:
        return {
          message: "Thanks for sharing. I'm here to listen and support you. How are you really feeling?",
          resources: ["Mindfulness practice", "Self-reflection", "Emotional awareness"],
          priority: "low"
        };
    }
  };

  const sendMessage = async () => {
    // FIXED: Better check to prevent multiple sends
    if (!inputMessage.trim() || isLoading) {
      console.log('Prevented duplicate send');
      return;
    }

    // Create unique timestamp for this message batch
    const timestamp = Date.now();
    const userMessageId = `user-${timestamp}`;
    const botMessageId = `bot-${timestamp}`;

    // Add user message immediately
    const userMessage = {
      id: userMessageId,
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // FIXED: Add artificial delay to prevent instant responses
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));

    try {
      // Analyze the message
      const analysis = analyzeMessage(inputMessage);
      
      // Generate response
      const response = generateResponse(analysis);

      // Add bot message
      const botMessage = {
        id: botMessageId,
        text: response.message,
        sender: 'bot',
        timestamp: new Date(),
        sentiment: analysis.sentiment,
        resources: response.resources,
        analysis: analysis
      };

      setMessages(prev => {
        // FIXED: Check if message already exists to prevent duplicates
        const messageExists = prev.some(msg => msg.id === botMessageId);
        if (messageExists) {
          console.log('Bot message already exists, skipping');
          return prev;
        }
        return [...prev, botMessage];
      });

      // Show crisis modal if needed
      if (analysis.crisisDetected) {
        setShowCrisisModal(true);
      }

      // Text-to-speech for accessibility
      if (accessibility.screenReader) {
        speakText(botMessage.text);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: `error-${timestamp}`,
        text: "I'm having trouble processing your message right now. Please try again.",
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => {
        const messageExists = prev.some(msg => msg.id === errorMessage.id);
        if (messageExists) return prev;
        return [...prev, errorMessage];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input not supported in your browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome-cleared',
      text: "Chat cleared. How can I help you today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  };

  const handleEmergencyContact = () => {
    setShowCrisisModal(false);
    window.open('tel:988', '_self');
  };

  return (
    <div className={`max-w-4xl mx-auto ${
      accessibility.highContrast ? 'bg-white text-black border-2 border-black' : 'bg-white'
    } rounded-xl shadow-lg`}>
      
      {/* Crisis Modal */}
      {showCrisisModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-6 max-w-md w-full"
          >
            <h3 className="text-xl font-bold text-red-600 mb-4">Immediate Support Available</h3>
            <p className="mb-4">
              I'm concerned about your safety. You're not alone, and professional help is available right now.
            </p>
            <div className="space-y-3 mb-4">
              <button
                onClick={handleEmergencyContact}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700"
              >
                Call 988 Crisis Lifeline
              </button>
              <button
                onClick={() => window.open('sms:741741?body=HOME')}
                className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-700"
              >
                Text HOME to 741741
              </button>
              <button
                onClick={() => window.open('tel:911')}
                className="w-full bg-red-800 text-white py-3 rounded-lg font-bold hover:bg-red-900"
              >
                Call 911 for Emergency
              </button>
            </div>
            <button
              onClick={() => setShowCrisisModal(false)}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
            >
              I'll reach out for help
            </button>
          </motion.div>
        </div>
      )}

      {/* Chat Header */}
      <div className={`p-4 rounded-t-xl ${
        accessibility.highContrast ? 'bg-black text-white border-b-2 border-white' : 'bg-blue-600 text-white'
      }`}>
        <h2 className="text-xl font-bold">Mental Health Support Chat</h2>
        <p className="text-sm opacity-90">AI-powered emotional support • Not a medical service</p>
      </div>

      {/* Crisis Resources Banner */}
      <div className="bg-red-50 border-b border-red-200 px-4 py-2">
        <p className="text-xs text-red-700 text-center">
          <strong>In crisis?</strong> Call 988 or text HOME to 741741 • Available 24/7
        </p>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.sender === 'user'
                  ? accessibility.highContrast
                    ? 'bg-black text-white'
                    : 'bg-blue-600 text-white'
                  : accessibility.highContrast
                    ? 'bg-gray-300 text-black border border-black'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className={accessibility.largeText ? 'text-lg' : ''}>
                {message.text}
              </p>
              
              {message.resources && message.resources.length > 0 && (
                <div className={`mt-2 pt-2 ${
                  accessibility.highContrast ? 'border-t-2 border-black' : 'border-t border-gray-300'
                }`}>
                  <p className="text-sm font-semibold">Helpful Resources:</p>
                  <ul className="text-sm list-disc list-inside">
                    {message.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className={`px-4 py-2 rounded-2xl ${
              accessibility.highContrast ? 'bg-gray-300 border border-black' : 'bg-gray-100'
            }`}>
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share how you're feeling... (For emergencies, call 988)"
              className={`w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 ${
                accessibility.highContrast
                  ? 'bg-white border-black text-black focus:ring-black'
                  : 'border-gray-300 focus:ring-blue-500'
              } ${accessibility.largeText ? 'text-lg' : ''}`}
              rows="2"
              aria-label="Type your message"
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {inputMessage.length}/500
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                accessibility.highContrast
                  ? 'bg-black text-white hover:bg-gray-800 disabled:bg-gray-400'
                  : 'bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-400'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              Send
            </button>
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isListening
                  ? 'bg-orange-500 text-white'
                  : accessibility.highContrast
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-purple-600 text-white hover:bg-purple-700'
              } disabled:opacity-50`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Voice'}
            </button>
          </div>
        </div>
        
        {/* Accessibility Features */}
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            onClick={() => speakText(messages[messages.length - 1]?.text)}
            disabled={messages.length === 0}
            className={`text-sm px-3 py-1 rounded-lg transition-all ${
              accessibility.highContrast 
                ? 'bg-gray-300 text-black hover:bg-gray-400' 
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            🔊 Read Last Message
          </button>
          <button
            onClick={clearChat}
            className={`text-sm px-3 py-1 rounded-lg transition-all ${
              accessibility.highContrast
                ? 'bg-gray-300 text-black hover:bg-gray-400'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            🗑️ Clear Chat
          </button>
          <button
            onClick={() => setShowCrisisModal(true)}
            className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all"
          >
            🚨 Crisis Help
          </button>
        </div>
      </div>

      {/* Legal Disclaimer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <p className="text-xs text-gray-600 text-center">
          <strong>Important:</strong> This AI assistant provides emotional support but is not a substitute for professional medical advice, diagnosis, or treatment. 
          For emergencies, contact 911 or the 988 Suicide & Crisis Lifeline.
        </p>
      </div>
    </div>
  );
};

export default ChatBot;