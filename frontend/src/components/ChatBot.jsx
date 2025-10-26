import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const ChatBot = ({ user, accessibility }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([{
      id: 1,
      text: "Hello! I'm here to support you. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }]);
  }, []);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', {
        message: inputMessage,
        userId: user.id
      });

      const botMessage = {
        id: messages.length + 2,
        text: response.data.response.message,
        sender: 'bot',
        timestamp: new Date(),
        sentiment: response.data.sentiment,
        resources: response.data.response.resources
      };

      setMessages(prev => [...prev, botMessage]);

      // Text-to-speech for accessibility
      if (accessibility.screenReader) {
        speakText(botMessage.text);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        id: messages.length + 2,
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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
      alert('Voice input not supported in your browser');
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

  return (
    <div className={`max-w-4xl mx-auto ${
      accessibility.highContrast ? 'bg-white text-black' : 'bg-white'
    } rounded-xl shadow-lg`}>
      {/* Chat Header */}
      <div className={`p-4 rounded-t-xl ${
        accessibility.highContrast ? 'bg-black text-white' : 'bg-mental-blue text-white'
      }`}>
        <h2 className="text-xl font-bold">Mental Health Support Chat</h2>
        <p className="text-sm opacity-90">24/7 AI-powered emotional support</p>
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
                    : 'bg-mental-blue text-white'
                  : accessibility.highContrast
                    ? 'bg-gray-300 text-black'
                    : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className={accessibility.largeText ? 'text-lg' : ''}>
                {message.text}
              </p>
              {message.resources && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <p className="text-sm font-semibold">Helpful Resources:</p>
                  <ul className="text-sm list-disc list-inside">
                    {message.resources.map((resource, index) => (
                      <li key={index}>{resource}</li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
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
            <div className="bg-gray-100 px-4 py-2 rounded-2xl">
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
              placeholder="Type your message here..."
              className={`w-full px-3 py-2 border rounded-lg resize-none ${
                accessibility.highContrast
                  ? 'bg-white border-black text-black'
                  : 'border-gray-300'
              } ${accessibility.largeText ? 'text-lg' : ''}`}
              rows="2"
              aria-label="Type your message"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-semibold ${
                accessibility.highContrast
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-mental-green text-white hover:bg-green-600'
              } disabled:opacity-50`}
            >
              Send
            </button>
            <button
              onClick={startVoiceInput}
              disabled={isListening}
              className={`px-4 py-2 rounded-lg font-semibold ${
                isListening
                  ? 'bg-mental-orange text-white'
                  : accessibility.highContrast
                  ? 'bg-gray-600 text-white'
                  : 'bg-mental-purple text-white'
              }`}
            >
              {isListening ? '🎤 Listening...' : '🎤 Voice'}
            </button>
          </div>
        </div>
        
        {/* Accessibility Features */}
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            onClick={() => speakText(messages[messages.length - 1]?.text)}
            disabled={messages.length === 0}
            className="text-sm px-3 py-1 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            🔊 Read Last Message
          </button>
          <button
            onClick={() => setMessages([])}
            className="text-sm px-3 py-1 bg-gray-200 rounded-lg"
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;