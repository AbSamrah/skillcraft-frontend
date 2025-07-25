import apiClient from "./apiClient";

export const getAllUsers = async (filter = {}) => {
  try {
    const response = await apiClient.get("/Users", { params: filter });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getUserById = async (id) => {
  try {
    const response = await apiClient.get(`/Users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await apiClient.post("/Users", userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateUser = async (userData) => {
  try {
    const response = await apiClient.put(`/Users/${userData.id}`, userData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`/Users/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
