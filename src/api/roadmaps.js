import apiClient from "./apiClient";

export const getAllRoadmaps = async () => {
  try {
    const response = await apiClient.get("/Roadmaps");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch roadmaps:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const getRoadmapById = async (id) => {
  const response = await apiClient.get(`/roadmaps/${id}`);
  return response.data;
};

export const createRoadmap = async (roadmapData) => {
  try {
    const response = await apiClient.post("/Roadmaps", roadmapData);
    return response.data;
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

// ADD THIS FUNCTION
export const updateRoadmap = async (id, roadmapData) => {
  try {
    const response = await apiClient.put(`/Roadmaps/${id}`, roadmapData);
    return response.data;
  } catch (error) {
    console.error("Failed to update roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

// ADD THIS FUNCTION
export const deleteRoadmap = async (id) => {
  try {
    const response = await apiClient.delete(`/Roadmaps/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};
