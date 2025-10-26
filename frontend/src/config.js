// API Configuration
export const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend.up.railway.app'  // Change this to your actual production API URL
  : '';  // Empty string will use the proxy configuration in vite.config.js

// Other configuration values can be added here