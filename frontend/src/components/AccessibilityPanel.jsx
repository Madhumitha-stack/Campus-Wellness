import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

const AccessibilityPanel = ({ settings, onSettingsChange }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechError, setSpeechError] = useState('');
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const speechUtteranceRef = useRef(null);

  // Check speech synthesis support on component mount
  useEffect(() => {
    const checkSpeechSupport = () => {
      if (!('speechSynthesis' in window)) {
        setIsSpeechSupported(false);
        setSpeechError('Speech synthesis not supported in your browser');
        return false;
      }
      
      // Check if speech synthesis is actually working
      try {
        const utterance = new SpeechSynthesisUtterance();
        const voices = window.speechSynthesis.getVoices();
        if (voices.length === 0) {
          setSpeechError('No speech voices available');
          return false;
        }
        return true;
      } catch (error) {
        setIsSpeechSupported(false);
        setSpeechError('Speech synthesis failed to initialize');
        return false;
      }
    };

    setIsSpeechSupported(checkSpeechSupport());
  }, []);

  const toggleSetting = (setting) => {
    onSettingsChange({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeechError('');
    }
  };

  const speakText = (text, priority = 'normal') => {
    // Clear previous errors
    setSpeechError('');
    
    // Check if speech is supported and enabled
    if (!isSpeechSupported) {
      setSpeechError('Speech synthesis not available');
      return;
    }

    if (!settings.screenReader) {
      setSpeechError('Enable Screen Reader Support first');
      return;
    }

    try {
      // Stop any current speech
      stopSpeaking();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure speech properties
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      // Get available voices and select a good one
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en') && !voice.localService
      );
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      // Event handlers
      utterance.onstart = () => {
        setIsSpeaking(true);
        setSpeechError('');
        console.log('Speech started');
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        console.log('Speech ended');
      };
      
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        setSpeechError(`Speech error: ${event.error}`);
        console.error('Speech error:', event);
      };

      speechUtteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      setSpeechError(`Speech failed: ${error.message}`);
      console.error('Speech synthesis error:', error);
    }
  };

  // Test speech function
  const testSpeech = () => {
    speakText('Hello! This is a test of the screen reader functionality. The speech synthesis is working correctly.');
  };

  const readPageSummary = () => {
    const summary = 'Accessibility Settings Page. You can customize various accessibility features including screen reader, high contrast mode, and text size adjustments. Use the toggle switches to enable or disable features.';
    speakText(summary);
  };

  const readCurrentSetting = (feature) => {
    const status = settings[feature.id] ? 'enabled' : 'disabled';
    const message = `${feature.name} is currently ${status}. ${feature.description}`;
    speakText(message);
  };

  const increaseTextSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize) || 16;
    document.body.style.fontSize = `${currentSize * 1.2}px`;
    speakText('Text size increased');
  };

  const decreaseTextSize = () => {
    const currentSize = parseFloat(getComputedStyle(document.body).fontSize) || 16;
    document.body.style.fontSize = `${Math.max(12, currentSize / 1.2)}px`;
    speakText('Text size decreased');
  };

  const resetTextSize = () => {
    document.body.style.fontSize = '';
    speakText('Text size reset to default');
  };

  const accessibilityFeatures = [
    {
      id: 'highContrast',
      name: 'High Contrast Mode',
      description: 'Enhanced color contrast for better visibility',
      icon: '🎨',
      action: () => toggleSetting('highContrast')
    },
    {
      id: 'largeText',
      name: 'Large Text Mode',
      description: 'Increased text size throughout the application',
      icon: '🔍',
      action: () => toggleSetting('largeText')
    },
    {
      id: 'screenReader',
      name: 'Screen Reader Support',
      description: 'Text-to-speech for all content with intelligent reading',
      icon: '📢',
      action: () => toggleSetting('screenReader')
    },
    {
      id: 'reducedMotion',
      name: 'Reduced Motion',
      description: 'Minimizes animations for users with vestibular disorders',
      icon: '⚡',
      action: () => toggleSetting('reducedMotion')
    },
    {
      id: 'voiceNavigation',
      name: 'Voice Navigation',
      description: 'Navigate using voice commands',
      icon: '🎤',
      action: () => toggleSetting('voiceNavigation')
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-2">Accessibility Settings</h2>
        <p className="text-gray-600 mb-6">
          Customize your experience to meet your accessibility needs
        </p>

        {/* Speech Status Panel */}
        {!isSpeechSupported && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 rounded-lg">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔇</span>
              <div>
                <p className="font-semibold text-red-800">Speech Synthesis Not Available</p>
                <p className="text-sm text-red-700">
                  {speechError || 'Your browser does not support text-to-speech functionality.'}
                </p>
                <p className="text-xs text-red-600 mt-1">
                  Try using Chrome, Edge, or Safari for best speech synthesis support.
                </p>
              </div>
            </div>
          </div>
        )}

        {speechError && isSpeechSupported && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-yellow-800">Speech Error</p>
                  <p className="text-sm text-yellow-700">{speechError}</p>
                </div>
              </div>
              <button
                onClick={() => setSpeechError('')}
                className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {isSpeaking && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 rounded-lg flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔊</span>
              <div>
                <p className="font-semibold text-green-800">Screen Reader Active</p>
                <p className="text-sm text-green-700">Reading content aloud</p>
              </div>
            </div>
            <button
              onClick={stopSpeaking}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-semibold"
            >
              Stop Reading
            </button>
          </div>
        )}

        <div className="grid gap-4 mb-8">
          {accessibilityFeatures.map((feature) => (
            <motion.div
              key={feature.id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                settings[feature.id]
                  ? 'border-mental-blue bg-blue-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-4">{feature.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">{feature.name}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Info/Speak Button */}
                {feature.id === 'screenReader' && isSpeechSupported && (
                  <button
                    onClick={testSpeech}
                    className="p-2 text-gray-400 hover:text-mental-blue transition-colors"
                    title="Test speech synthesis"
                  >
                    <span className="text-lg">🎵</span>
                  </button>
                )}
                
                {feature.id !== 'screenReader' && (
                  <button
                    onClick={() => readCurrentSetting(feature)}
                    className="p-2 text-gray-400 hover:text-mental-blue transition-colors"
                    title={`Learn about ${feature.name}`}
                  >
                    <span className="text-lg">ℹ️</span>
                  </button>
                )}
                
                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings[feature.id]}
                    onChange={feature.action}
                    className="sr-only peer"
                  />
                  <div className={`w-11 h-6 rounded-full peer ${
                    settings[feature.id] ? 'bg-mental-blue' : 'bg-gray-300'
                  } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
                </label>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg mb-6">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            {isSpeechSupported && (
              <>
                <button
                  onClick={readPageSummary}
                  disabled={!settings.screenReader}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                    settings.screenReader
                      ? 'bg-mental-purple text-white hover:bg-purple-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>🔊</span>
                  <span>Read Page Summary</span>
                </button>
                
                <button
                  onClick={testSpeech}
                  disabled={!settings.screenReader}
                  className={`px-4 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                    settings.screenReader
                      ? 'bg-mental-green text-white hover:bg-green-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <span>🎵</span>
                  <span>Test Speech</span>
                </button>
                
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 flex items-center space-x-2"
                  >
                    <span>⏹️</span>
                    <span>Stop Speech</span>
                  </button>
                )}
              </>
            )}
            
            <button
              onClick={increaseTextSize}
              className="px-4 py-2 bg-mental-blue text-white rounded-lg text-sm hover:bg-blue-600 flex items-center space-x-2"
            >
              <span>🔍</span>
              <span>Increase Text</span>
            </button>
            
            <button
              onClick={decreaseTextSize}
              className="px-4 py-2 bg-mental-orange text-white rounded-lg text-sm hover:bg-orange-600 flex items-center space-x-2"
            >
              <span>📝</span>
              <span>Decrease Text</span>
            </button>
            
            <button
              onClick={resetTextSize}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Reset Text Size</span>
            </button>
          </div>
        </div>

        {/* Speech Help Section */}
        {isSpeechSupported && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-mental-blue">🔊 Speech Synthesis Help</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              <li>First enable <strong>"Screen Reader Support"</strong> toggle</li>
              <li>Use <strong>"Test Speech"</strong> button to verify functionality</li>
              <li>Click the <strong>ℹ️ info button</strong> next to any setting to hear its description</li>
              <li>Use <strong>"Stop Speech"</strong> to cancel any ongoing reading</li>
              <li>Make sure your device volume is turned up</li>
            </ul>
          </div>
        )}

        {/* General Accessibility Information */}
        <div className="mt-6 p-4 bg-mental-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Accessibility Features Included:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Keyboard navigation support</li>
            <li>Screen reader compatibility {isSpeechSupported ? '✅' : '❌'}</li>
            <li>Voice command integration</li>
            <li>High contrast color schemes</li>
            <li>Adjustable text sizes</li>
            <li>Reduced motion options</li>
            <li>Alternative text for images</li>
            <li>Focus indicators for interactive elements</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessibilityPanel;