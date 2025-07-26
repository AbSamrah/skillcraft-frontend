import axios from "axios";

// The base URL for your backend API
const API_URL = "http://localhost:5093/api";

const apiClient = axios.create({
  baseURL: API_URL,
});

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // User is not authenticated
      // You can clear local storage and redirect to the login page
      console.log("Unauthorized, logging out...");
      localStorage.removeItem("token"); // or wherever you store it
      window.location.href = "/login"; // Force a full page refresh to clear state
    }

    // Pass the error along to the calling code
    return Promise.reject(error);
  }
);

export default apiClient;
