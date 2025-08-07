import apiClient from "./apiClient";

export const getProfileRoadmaps = async () => {
  const response = await apiClient.get(`/Profile/MyRoadmaps`);
  return response.data;
};

export const addRoadmapToProfile = async (roadmapId) => {
  await apiClient.put(`/Profile/AddRoadmap/${roadmapId}`);
};

export const removeRoadmapFromProfile = async (roadmapId) => {
  await apiClient.put(`/Profile/RemoveRoadmap/${roadmapId}`);
};

export const getFinishedSteps = async (roadmapId) => {
  const response = await apiClient.get(`/Profile/FinishedSteps/${roadmapId}`);
  return response.data;
};

export const finishSteps = async (stepIds) => {
  await apiClient.put(`/Profile/FinishSteps`, stepIds, {
    headers: { "Content-Type": "application/json" },
  });
};

export const unfinishSteps = async (stepIds) => {
  await apiClient.put(`/Profile/UnFinishSteps`, stepIds, {
    headers: { "Content-Type": "application/json" },
  });
};

export const setRoadmapStatus = async (roadmapId, isFinished) => {
  await apiClient.put(`/Profile/Roadmaps/${roadmapId}?finish=${isFinished}`);
};

export const checkRoadmapInProfile = async (roadmapId) => {
  const response = await apiClient.get(`/Profile/CheckRoadmap/${roadmapId}`);
  return response.data;
};

export const getUserEnergy = async (id) => {
  const response = await apiClient.get(`/Profile/energy/${id}`);
  return response.data;
};
