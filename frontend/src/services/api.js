import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? 'http://localhost:5005/api' : 'https://infinity-event-app.onrender.com/api'),
  timeout: 100000, // Render free tier can take up to 50 seconds to wake up
  withCredentials: false,
  headers: {
    "Content-Type": "application/json"
  }
});

console.log("API URL:", import.meta.env.VITE_API_URL);

// Add a request interceptor to automatically attach the JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      "API ERROR:",
      error?.response?.status,
      error?.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default API;
