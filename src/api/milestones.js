import apiClient from "./apiClient";

export const getAllMilestones = async (filter = {}) => {
  try {
    const response = await apiClient.get("/Milestones", { params: filter });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getMilestoneById = async (id) => {
  try {
    const response = await apiClient.get(`/Milestones/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createMilestone = async (milestoneData) => {
  try {
    const response = await apiClient.post("/Milestones", milestoneData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateMilestone = async (id, milestoneData) => {
  try {
    const response = await apiClient.put(`/Milestones/${id}`, milestoneData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const deleteMilestone = async (id) => {
  try {
    const response = await apiClient.delete(`/Milestones/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
