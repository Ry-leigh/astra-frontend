import axios from "axios";

const axiosClient = axios.create({
  // baseURL: "http://127.0.0.1:8000/api",  
  baseURL: "https://astra-backend-qbfe.onrender.com/api",  
  withCredentials: true,                 
  headers: {
    "Accept": "application/json",       
    "Content-Type": "application/json", 
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;