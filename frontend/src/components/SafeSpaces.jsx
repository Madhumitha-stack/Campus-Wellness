import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const SafeSpaces = ({ accessibility }) => {
  const [safeSpaces, setSafeSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSafeSpaces();
  }, []);

  const fetchSafeSpaces = async () => {
    try {
      const response = await axios.get('/api/safe-spaces');
      setSafeSpaces(response.data);
    } catch (error) {
      console.error('Error fetching safe spaces:', error);
      // Fallback mock data
      setSafeSpaces([
        {
          id: 1,
          name: "Campus Counseling Center",
          type: "professional",
          location: { lat: 40.7589, lng: -73.9851 },
          hours: "9AM-5PM Mon-Fri",
          phone: "+1-555-0123",
          accessibility: ["wheelchair", "quiet_room", "asl_interpreter"],
          description: "Professional mental health services and counseling"
        },
        {
          id: 2,
          name: "Student Wellness Garden",
          type: "outdoor",
          location: { lat: 40.7590, lng: -73.9845 },
          hours: "24/7",
          phone: null,
          accessibility: ["wheelchair", "braille_signs", "sensory_friendly"],
          description: "Peaceful outdoor space for relaxation and meditation"
        },
        {
          id: 3,
          name: "Peer Support Lounge",
          type: "peer_support",
          location: { lat: 40.7580, lng: -73.9860 },
          hours: "10AM-8PM Daily",
          phone: "+1-555-0124",
          accessibility: ["wheelchair", "large_text", "assistive_listening"],
          description: "Casual space for student peer support and socializing"
        }
      ]);
    }
  };

  const spaceTypes = {
    all: { label: 'All Spaces', emoji: '🏢' },
    professional: { label: 'Professional Help', emoji: '👨‍⚕️' },
    outdoor: { label: 'Outdoor Spaces', emoji: '🌳' },
    peer_support: { label: 'Peer Support', emoji: '👥' }
  };

  const accessibilityIcons = {
    wheelchair: '♿',
    quiet_room: '🔇',
    asl_interpreter: '👐',
    braille_signs: '🔤',
    sensory_friendly: '🎵',
    large_text: '🔍',
    assistive_listening: '🎧'
  };

  const filteredSpaces = filter === 'all' 
    ? safeSpaces 
    : safeSpaces.filter(space => space.type === filter);

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold mb-2">Safe Spaces on Campus</h2>
        <p className="text-lg text-gray-600">
          Find supportive environments and mental health resources near you
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Filters and List */}
        <div className="lg:col-span-1">
          <div className={`rounded-xl shadow-lg p-6 ${
            accessibility.highContrast ? 'bg-white text-black' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Filter Spaces</h3>
            
            {/* Space Type Filters */}
            <div className="space-y-2 mb-6">
              {Object.entries(spaceTypes).map(([key, { label, emoji }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    filter === key
                      ? accessibility.highContrast
                        ? 'bg-black text-white'
                        : 'bg-mental-blue text-white'
                      : accessibility.highContrast
                        ? 'bg-gray-200 text-black hover:bg-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="mr-2">{emoji}</span>
                  {label}
                </button>
              ))}
            </div>

            {/* Accessibility Features Legend */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Accessibility Features</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(accessibilityIcons).map(([key, icon]) => (
                  <div key={key} className="flex items-center">
                    <span className="mr-2">{icon}</span>
                    <span className="capitalize">{key.replace('_', ' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Spaces List */}
          <div className="mt-6 space-y-4">
            {filteredSpaces.map((space) => (
              <motion.div
                key={space.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => setSelectedSpace(space)}
                className={`p-4 rounded-lg cursor-pointer ${
                  selectedSpace?.id === space.id
                    ? accessibility.highContrast
                      ? 'bg-black text-white border-2 border-white'
                      : 'bg-mental-blue text-white border-2 border-mental-blue'
                    : accessibility.highContrast
                      ? 'bg-white text-black border-2 border-black'
                      : 'bg-white shadow-md border-2 border-transparent'
                }`}
              >
                <h4 className="font-semibold text-lg">{space.name}</h4>
                <p className="text-sm opacity-80 mt-1">{space.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {space.accessibility.map(access => (
                    <span key={access} className="text-lg">
                      {accessibilityIcons[access]}
                    </span>
                  ))}
                </div>
                <p className="text-sm mt-2">
                  <span className="font-semibold">Hours:</span> {space.hours}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Space Details */}
        <div className="lg:col-span-2">
          <div className={`rounded-xl shadow-lg p-6 sticky top-4 ${
            accessibility.highContrast ? 'bg-white text-black' : 'bg-white'
          }`}>
            {selectedSpace ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h3 className="text-2xl font-bold mb-4">{selectedSpace.name}</h3>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold mb-2">Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Type:</span> {spaceTypes[selectedSpace.type]?.label}</p>
                      <p><span className="font-semibold">Hours:</span> {selectedSpace.hours}</p>
                      {selectedSpace.phone && (
                        <p>
                          <span className="font-semibold">Phone:</span>{' '}
                          <a 
                            href={`tel:${selectedSpace.phone}`}
                            className="text-mental-blue hover:underline"
                          >
                            {selectedSpace.phone}
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Accessibility Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpace.accessibility.map(access => (
                        <span 
                          key={access}
                          className={`px-3 py-1 rounded-full text-sm ${
                            accessibility.highContrast
                              ? 'bg-black text-white'
                              : 'bg-mental-green text-white'
                          }`}
                        >
                          {accessibilityIcons[access]} {access.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-gray-700">{selectedSpace.description}</p>
                </div>

                {/* Mock Map */}
                <div className="bg-gray-100 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-3">Location</h4>
                  <div className="bg-mental-blue-100 rounded-lg h-48 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-4xl mb-2">🗺️</div>
                      <p className="text-gray-600">
                        Interactive campus map would appear here
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Coordinates: {selectedSpace.location.lat.toFixed(4)}, {selectedSpace.location.lng.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-3">
                  {selectedSpace.phone && (
                    <a
                      href={`tel:${selectedSpace.phone}`}
                      className={`px-4 py-2 rounded-lg font-semibold ${
                        accessibility.highContrast
                          ? 'bg-black text-white hover:bg-gray-800'
                          : 'bg-mental-green text-white hover:bg-green-600'
                      }`}
                    >
                      📞 Call Now
                    </a>
                  )}
                  <button
                    onClick={() => {
                      // Simulate getting directions
                      alert(`Directions to ${selectedSpace.name} would open in maps app`);
                    }}
                    className="px-4 py-2 bg-mental-blue text-white rounded-lg font-semibold hover:bg-blue-600"
                  >
                    🗺️ Get Directions
                  </button>
                  <button
                    onClick={() => {
                      // Add to favorites
                      alert(`Added ${selectedSpace.name} to your favorites`);
                    }}
                    className="px-4 py-2 bg-mental-purple text-white rounded-lg font-semibold hover:bg-purple-600"
                  >
                    ⭐ Save to Favorites
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold mb-2">Select a Safe Space</h3>
                <p className="text-gray-600">
                  Choose a location from the list to view details, accessibility features, and contact information
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-8 rounded-xl p-6 ${
          accessibility.highContrast
            ? 'bg-red-900 text-white'
            : 'bg-red-600 text-white'
        }`}
      >
        <h3 className="text-xl font-bold mb-3">🚨 Immediate Crisis Support</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">24/7 Crisis Line</div>
            <div className="text-lg">555-0199</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">Campus Security</div>
            <div className="text-lg">555-0111</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">Emergency Counseling</div>
            <div className="text-lg">Available Now</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafeSpaces;