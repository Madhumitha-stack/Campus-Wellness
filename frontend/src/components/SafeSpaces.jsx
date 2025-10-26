import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend.up.railway.app'
  : 'http://localhost:3000';

const SafeSpaces = ({ accessibility }) => {
  const [safeSpaces, setSafeSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Enhanced mock data with more details
  const mockSafeSpaces = [
    {
      id: 1,
      name: "Campus Counseling Center",
      type: "professional",
      location: { lat: 40.7589, lng: -73.9851 },
      hours: "9AM-5PM Mon-Fri",
      phone: "+1-555-0123",
      accessibility: ["wheelchair", "quiet_room", "asl_interpreter"],
      description: "Professional mental health services and counseling. Licensed therapists provide individual and group sessions.",
      services: ["Individual Therapy", "Group Counseling", "Crisis Intervention"],
      emergency: false,
      distance: "0.2 miles",
      building: "Student Services Building, Room 201"
    },
    {
      id: 2,
      name: "Student Wellness Garden",
      type: "outdoor",
      location: { lat: 40.7590, lng: -73.9845 },
      hours: "24/7",
      phone: null,
      accessibility: ["wheelchair", "braille_signs", "sensory_friendly"],
      description: "Peaceful outdoor space for relaxation and meditation. Features walking paths, benches, and quiet zones.",
      services: ["Meditation Areas", "Walking Paths", "Quiet Zones"],
      emergency: false,
      distance: "0.1 miles",
      building: "Behind Library"
    },
    {
      id: 3,
      name: "Peer Support Lounge",
      type: "peer_support",
      location: { lat: 40.7580, lng: -73.9860 },
      hours: "10AM-8PM Daily",
      phone: "+1-555-0124",
      accessibility: ["wheelchair", "large_text", "assistive_listening"],
      description: "Casual space for student peer support and socializing. Trained peer supporters available.",
      services: ["Peer Support", "Social Events", "Study Groups"],
      emergency: false,
      distance: "0.3 miles",
      building: "Student Union, Room 105"
    },
    {
      id: 4,
      name: "24/7 Crisis Center",
      type: "emergency",
      location: { lat: 40.7575, lng: -73.9855 },
      hours: "24/7",
      phone: "+1-555-0199",
      accessibility: ["wheelchair", "asl_interpreter", "quiet_room"],
      description: "Immediate mental health support for urgent situations. No appointment needed.",
      services: ["Crisis Counseling", "Emergency Support", "Safety Planning"],
      emergency: true,
      distance: "0.4 miles",
      building: "Health Center Annex"
    }
  ];

  useEffect(() => {
    fetchSafeSpaces();
  }, []);

  const fetchSafeSpaces = async () => {
    try {
      setLoading(true);
      // Try to fetch from backend first
      const response = await axios.get(`${API_URL}/api/safe-spaces`);
      setSafeSpaces(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching safe spaces, using mock data:', error);
      setSafeSpaces(mockSafeSpaces);
      setError('Using demo data - backend not connected');
    } finally {
      setLoading(false);
    }
  };

  const spaceTypes = {
    all: { label: 'All Spaces', emoji: '🏢', color: 'gray' },
    professional: { label: 'Professional Help', emoji: '👨‍⚕️', color: 'blue' },
    outdoor: { label: 'Outdoor Spaces', emoji: '🌳', color: 'green' },
    peer_support: { label: 'Peer Support', emoji: '👥', color: 'purple' },
    emergency: { label: 'Emergency', emoji: '🚨', color: 'red' },
    quiet: { label: 'Quiet Spaces', emoji: '🔇', color: 'indigo' }
  };

  const accessibilityIcons = {
    wheelchair: { icon: '♿', label: 'Wheelchair Access' },
    quiet_room: { icon: '🔇', label: 'Quiet Room' },
    asl_interpreter: { icon: '👐', label: 'ASL Interpreter' },
    braille_signs: { icon: '🔤', label: 'Braille Signs' },
    sensory_friendly: { icon: '🎵', label: 'Sensory Friendly' },
    large_text: { icon: '🔍', label: 'Large Text' },
    assistive_listening: { icon: '🎧', label: 'Assistive Listening' }
  };

  const filteredSpaces = filter === 'all' 
    ? safeSpaces 
    : safeSpaces.filter(space => space.type === filter);

  const handleGetDirections = (space) => {
    // For demo purposes - in real app, this would open maps
    const message = `Directions to ${space.name}:\n\n${space.building}\n${space.distance} from your location\n\nOpen in Google Maps?`;
    if (window.confirm(message)) {
      // This would open actual maps in production
      console.log(`Opening maps for: ${space.location.lat}, ${space.location.lng}`);
      alert(`Opening maps application for ${space.name}`);
    }
  };

  const handleSaveToFavorites = (space) => {
    const favorites = JSON.parse(localStorage.getItem('favoriteSpaces') || '[]');
    if (!favorites.find(fav => fav.id === space.id)) {
      favorites.push(space);
      localStorage.setItem('favoriteSpaces', JSON.stringify(favorites));
      alert(`✅ ${space.name} added to favorites!`);
    } else {
      alert(`⭐ ${space.name} is already in your favorites!`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto text-center py-12">
        <div className="text-4xl mb-4">🏢</div>
        <h2 className="text-2xl font-bold mb-2">Loading Safe Spaces...</h2>
        <p className="text-gray-600">Finding support resources near you</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-mental-blue to-mental-green bg-clip-text text-transparent">
          Campus Safe Spaces
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find supportive environments, mental health resources, and accessible spaces across campus
        </p>
        
        {error && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-400 rounded-lg text-yellow-800">
            ⚠️ {error} - Some features may be limited
          </div>
        )}
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Type Filters */}
          <div className={`rounded-xl shadow-lg p-6 ${
            accessibility.highContrast ? 'bg-white text-black border-2 border-black' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Filter by Type</h3>
            <div className="space-y-2">
              {Object.entries(spaceTypes).map(([key, { label, emoji, color }]) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`w-full text-left p-3 rounded-lg transition-all flex items-center space-x-3 ${
                    filter === key
                      ? accessibility.highContrast
                        ? 'bg-black text-white'
                        : `bg-mental-${color} text-white`
                      : accessibility.highContrast
                        ? 'bg-gray-200 text-black hover:bg-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Legend */}
          <div className={`rounded-xl shadow-lg p-6 ${
            accessibility.highContrast ? 'bg-white text-black border-2 border-black' : 'bg-white'
          }`}>
            <h3 className="text-xl font-bold mb-4">Accessibility Guide</h3>
            <div className="space-y-3">
              {Object.entries(accessibilityIcons).map(([key, { icon, label }]) => (
                <div key={key} className="flex items-center space-x-3">
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Spaces List */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4">
                {filteredSpaces.length} {spaceTypes[filter].label} Found
              </h3>
              
              {filteredSpaces.map((space) => (
                <motion.div
                  key={space.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedSpace(space)}
                  className={`p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedSpace?.id === space.id
                      ? accessibility.highContrast
                        ? 'bg-black text-white border-white'
                        : 'bg-mental-blue text-white border-mental-blue'
                      : accessibility.highContrast
                        ? 'bg-white text-black border-black hover:border-gray-500'
                        : space.emergency
                        ? 'bg-red-50 border-red-200 hover:border-red-300'
                        : 'bg-white border-gray-200 hover:border-mental-blue shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-lg">{space.name}</h4>
                    {space.emergency && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        🚨 EMERGENCY
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm opacity-80 mb-2">{space.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {space.accessibility.map(access => (
                      <span key={access} className="text-lg" title={accessibilityIcons[access].label}>
                        {accessibilityIcons[access].icon}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">📅 {space.hours}</span>
                    <span className="text-gray-600">📍 {space.distance}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Space Details */}
            <div className={`rounded-xl shadow-lg p-6 sticky top-4 ${
              accessibility.highContrast ? 'bg-white text-black border-2 border-black' : 'bg-white'
            }`}>
              {selectedSpace ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold">{selectedSpace.name}</h3>
                    {selectedSpace.emergency && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-bold">
                        🚨 24/7 CRISIS SUPPORT
                      </span>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold mb-3">📍 Location Details</h4>
                      <div className="space-y-2">
                        <p><span className="font-semibold">Type:</span> {spaceTypes[selectedSpace.type]?.label}</p>
                        <p><span className="font-semibold">Hours:</span> {selectedSpace.hours}</p>
                        <p><span className="font-semibold">Building:</span> {selectedSpace.building}</p>
                        <p><span className="font-semibold">Distance:</span> {selectedSpace.distance}</p>
                        {selectedSpace.phone && (
                          <p>
                            <span className="font-semibold">Phone:</span>{' '}
                            <a 
                              href={`tel:${selectedSpace.phone}`}
                              className="text-mental-blue hover:underline font-mono"
                            >
                              {selectedSpace.phone}
                            </a>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">♿ Accessibility</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedSpace.accessibility.map(access => (
                          <span 
                            key={access}
                            className={`px-3 py-2 rounded-lg text-sm flex items-center space-x-2 ${
                              accessibility.highContrast
                                ? 'bg-black text-white'
                                : 'bg-mental-green text-white'
                            }`}
                          >
                            <span className="text-lg">{accessibilityIcons[access].icon}</span>
                            <span>{accessibilityIcons[access].label}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">📋 Services Available</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSpace.services?.map((service, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-mental-blue-100 text-mental-blue rounded-full text-sm"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold mb-2">ℹ️ Description</h4>
                    <p className="text-gray-700 leading-relaxed">{selectedSpace.description}</p>
                  </div>

                  {/* Interactive Map Placeholder */}
                  <div className="bg-gray-100 rounded-lg p-4 mb-6">
                    <h4 className="font-semibold mb-3">🗺️ Campus Location</h4>
                    <div className="bg-mental-blue-100 rounded-lg h-48 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🏫</div>
                        <p className="text-gray-600 font-semibold">{selectedSpace.building}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {selectedSpace.distance} • {selectedSpace.location.lat.toFixed(4)}, {selectedSpace.location.lng.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3">
                    {selectedSpace.phone && (
                      <a
                        href={`tel:${selectedSpace.phone}`}
                        className={`px-4 py-3 rounded-lg font-semibold flex items-center space-x-2 ${
                          accessibility.highContrast
                            ? 'bg-black text-white hover:bg-gray-800'
                            : selectedSpace.emergency
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-mental-green text-white hover:bg-green-600'
                        }`}
                      >
                        <span>📞</span>
                        <span>{selectedSpace.emergency ? 'Call Emergency' : 'Call Now'}</span>
                      </a>
                    )}
                    <button
                      onClick={() => handleGetDirections(selectedSpace)}
                      className="px-4 py-3 bg-mental-blue text-white rounded-lg font-semibold hover:bg-blue-600 flex items-center space-x-2"
                    >
                      <span>🗺️</span>
                      <span>Get Directions</span>
                    </button>
                    <button
                      onClick={() => handleSaveToFavorites(selectedSpace)}
                      className="px-4 py-3 bg-mental-purple text-white rounded-lg font-semibold hover:bg-purple-600 flex items-center space-x-2"
                    >
                      <span>⭐</span>
                      <span>Save to Favorites</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🏢</div>
                  <h3 className="text-xl font-semibold mb-2">Select a Safe Space</h3>
                  <p className="text-gray-600">
                    Choose a location from the list to view detailed information, accessibility features, and contact details
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Resources Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-8 rounded-xl p-6 ${
          accessibility.highContrast
            ? 'bg-red-900 text-white border-2 border-white'
            : 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl'
        }`}
      >
        <h3 className="text-2xl font-bold mb-4 text-center">🚨 Immediate Crisis Support Available 24/7</h3>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="p-4 bg-white/20 rounded-lg">
            <div className="text-2xl font-bold">National Suicide Prevention</div>
            <div className="text-lg font-mono">988</div>
            <div className="text-sm opacity-90">Free, confidential 24/7</div>
          </div>
          <div className="p-4 bg-white/20 rounded-lg">
            <div className="text-2xl font-bold">Campus Crisis Line</div>
            <div className="text-lg font-mono">555-0199</div>
            <div className="text-sm opacity-90">Immediate campus support</div>
          </div>
          <div className="p-4 bg-white/20 rounded-lg">
            <div className="text-2xl font-bold">Campus Security</div>
            <div className="text-lg font-mono">555-0111</div>
            <div className="text-sm opacity-90">Emergency response</div>
          </div>
          <div className="p-4 bg-white/20 rounded-lg">
            <div className="text-2xl font-bold">Crisis Text Line</div>
            <div className="text-lg font-mono">HOME to 741741</div>
            <div className="text-sm opacity-90">Text support 24/7</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SafeSpaces;