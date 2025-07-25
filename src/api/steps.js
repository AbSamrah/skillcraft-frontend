import apiClient from "./apiClient";

export const getAllSteps = async () => {
  try {
    const response = await apiClient.get("/Steps");
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const getStepById = async (id) => {
  try {
    const response = await apiClient.get(`/Steps/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const createStep = async (stepData) => {
  try {
    const response = await apiClient.post("/Steps", stepData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export const updateStep = async (id, stepData) => {
  try {
    const response = await apiClient.put(`/Steps/${id}`, stepData);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

// ADD THIS FUNCTION
export const deleteStep = async (id) => {
  try {
    const response = await apiClient.delete(`/Steps/${id}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
