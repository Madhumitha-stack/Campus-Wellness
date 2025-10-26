import React from 'react';
import { motion } from 'framer-motion';

const AccessibilityPanel = ({ settings, onSettingsChange }) => {
  const toggleSetting = (setting) => {
    onSettingsChange({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const accessibilityFeatures = [
    {
      id: 'highContrast',
      name: 'High Contrast Mode',
      description: 'Increase color contrast for better visibility',
      icon: '🎨'
    },
    {
      id: 'largeText',
      name: 'Large Text',
      description: 'Increase text size for better readability',
      icon: '🔍'
    },
    {
      id: 'screenReader',
      name: 'Screen Reader Support',
      description: 'Enable text-to-speech for all content',
      icon: '📢'
    },
    {
      id: 'reducedMotion',
      name: 'Reduced Motion',
      description: 'Minimize animations and transitions',
      icon: '⚡'
    },
    {
      id: 'voiceNavigation',
      name: 'Voice Navigation',
      description: 'Navigate using voice commands',
      icon: '🎤'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-2">Accessibility Settings</h2>
        <p className="text-gray-600 mb-6">
          Customize your experience to meet your accessibility needs
        </p>

        <div className="grid gap-4">
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
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[feature.id]}
                  onChange={() => toggleSetting(feature.id)}
                  className="sr-only peer"
                />
                <div className={`w-11 h-6 rounded-full peer ${
                  settings[feature.id] ? 'bg-mental-blue' : 'bg-gray-300'
                } peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all`}></div>
              </label>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-3">Quick Actions</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                // Speak current page content
                if ('speechSynthesis' in window) {
                  const content = document.body.innerText;
                  const utterance = new SpeechSynthesisUtterance(content.substring(0, 1000));
                  speechSynthesis.speak(utterance);
                }
              }}
              className="px-4 py-2 bg-mental-purple text-white rounded-lg text-sm"
            >
              🔊 Read Page Aloud
            </button>
            <button
              onClick={() => {
                // Increase all text sizes
                document.body.style.fontSize = 'larger';
              }}
              className="px-4 py-2 bg-mental-green text-white rounded-lg text-sm"
            >
              🔍 Increase Text Size
            </button>
            <button
              onClick={() => {
                // Reset text sizes
                document.body.style.fontSize = '';
              }}
              className="px-4 py-2 bg-mental-orange text-white rounded-lg text-sm"
            >
              📝 Reset Text Size
            </button>
          </div>
        </div>

        {/* Accessibility Information */}
        <div className="mt-6 p-4 bg-mental-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Accessibility Features Included:</h3>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Keyboard navigation support</li>
            <li>Screen reader compatibility</li>
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