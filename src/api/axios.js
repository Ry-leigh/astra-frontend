import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api",  // Laravel API endpoint
  withCredentials: true,                 // allows cookies if using Sanctum
  headers: {
    "Accept": "application/json",        // tells Laravel we expect JSON
    "Content-Type": "application/json",  // sends JSON in request body
  },
});

// If a token exists, attach it to all requests
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;