import axios from "axios";

// Get the base URL from environment variables
// Vite uses VITE_ prefix for environment variables exposed to the client
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  // withCredentials: true is required for cookie-based authentication
  // This ensures HTTP-only cookies are sent with every request
  withCredentials: true,
  // Set a reasonable timeout
  timeout: 10000,
  // Default headers
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - runs before every request
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other headers here if needed in the future
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - runs after every response
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle 401 Unauthorized - user needs to login
      if (status === 401) {
        console.error("Unauthorized - redirecting to login");
        // Optionally redirect to login page
        // window.location.href = "/login";
      }
      
      // Handle 403 Forbidden - user doesn't have permission
      if (status === 403) {
        console.error("Forbidden - insufficient permissions");
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error("Network error - no response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
