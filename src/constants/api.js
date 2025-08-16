// src/constants/api.js

// Define the base URL for the API.
// Automatically detect the current host and use port 3002 for backend
const getApiBaseUrl = () => {
  // If running in development mode and accessing via localhost, use localhost
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    return "http://localhost:3002";
  }

  // For network access (other machines), use the current hostname with port 3002
  return `http://${window.location.hostname}:3002`;
};

export const API_BASE_URL = getApiBaseUrl();

// Debug logging
console.log("🔧 API Configuration:", {
  hostname: window.location.hostname,
  port: window.location.port,
  protocol: window.location.protocol,
  API_BASE_URL: API_BASE_URL,
});

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/login`,
  REGISTER: `${API_BASE_URL}/api/register`,
  USERS: `${API_BASE_URL}/api/users`,
  MAILS: `${API_BASE_URL}/api/mails`,
  MAIL_STATS: `${API_BASE_URL}/api/mail-stats`,
  ASSIGNED_MAILS: `${API_BASE_URL}/api/assigned-mails`,
  GROUPS: `${API_BASE_URL}/api/groups`,
  PICS: `${API_BASE_URL}/api/pics`,
  // Add other endpoints here as needed
};
