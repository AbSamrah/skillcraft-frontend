import apiClient from "./apiClient";

export const getAllRoadmaps = async (filter = {}) => {
  try {
    const response = await apiClient.get("/Roadmaps", { params: filter });
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
    const response = await apiClient.post("/Roadmaps/manual", roadmapData);
    console.log(response);
    return response.data;
  } catch (error) {
    console.error("Failed to create roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const updateRoadmap = async (id, roadmapData) => {
  try {
    const response = await apiClient.put(`/Roadmaps/${id}`, roadmapData);
    return response.data;
  } catch (error) {
    console.error("Failed to update roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const deleteRoadmap = async (id) => {
  try {
    const response = await apiClient.delete(`/Roadmaps/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete roadmap:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const generateRoadmapWithAi = async (userId, topic) => {
  try {
    const response = await apiClient.post("/Roadmaps/ai", {
      userId: userId,
      prompt: topic,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to generate AI roadmap:", error.response.data);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};
