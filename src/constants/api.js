// src/constants/api.js

// Define the base URL for the API.
// In development, this will be proxied by react-scripts via the "proxy" field in package.json.
// In production, the frontend and backend are expected to be served from the same origin.
export const API_BASE_URL = "http://localhost:3002";

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
