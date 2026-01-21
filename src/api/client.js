import axios from "axios";

// Base URL for all API requests.
// Allows overriding via Vite env variable, falls back to local backend.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Keep this true so we can support cookie-based auth if needed.
  withCredentials: true,
  timeout: 10000,
});

export default apiClient;

