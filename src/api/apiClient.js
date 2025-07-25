import axios from "axios";

// The base URL for your backend API
const API_URL = "http://localhost:5093/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor to add the auth token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
