import apiClient from "./apiClient";

export const signup = async (userData) => {
  try {
    const response = await apiClient.post("/Auth/signUp", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const login = async (credentials) => {
  try {
    const response = await apiClient.post("/Auth/login", credentials);
    if (response.data) {
      localStorage.setItem("authToken", response.data);
    }
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await apiClient.put("/Auth", passwordData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const logout = () => {
  localStorage.removeItem("authToken");
};

export const verifyEmail = async (email, token) => {
  try {
    const response = await apiClient.get("/Auth/verify-email", {
      params: { email, token },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
