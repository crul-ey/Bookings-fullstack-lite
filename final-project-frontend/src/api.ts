// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // ✅ Pas aan naar jouw backend URL indien nodig
  withCredentials: true,            // ✅ Nodig als je met cookies werkt (extra veiligheid)
});

// ✅ Interceptor om automatisch Authorization header toe te voegen
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
