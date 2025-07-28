import apiClient from "./apiClient";

export const getProfileRoadmaps = async (userId) => {
  const response = await apiClient.get(`/Profile/${userId}/AllRoadmaps`);
  return response.data;
};

export const addRoadmapToProfile = async (userId, roadmapId) => {
  await apiClient.put(`/Profile/${userId}/AddRoadmap/${roadmapId}`);
};

export const removeRoadmapFromProfile = async (userId, roadmapId) => {
  await apiClient.put(`/Profile/${userId}/RemoveRoadmap/${roadmapId}`);
};

export const getFinishedSteps = async (userId, roadmapId) => {
  const response = await apiClient.get(
    `/Profile/${userId}/FinishedSteps/${roadmapId}`
  );
  return response.data;
};

export const finishSteps = async (userId, stepIds) => {
  await apiClient.put(`/Profile/${userId}/FinishSteps`, stepIds, {
    headers: { "Content-Type": "application/json" },
  });
};

export const unfinishSteps = async (userId, stepIds) => {
  await apiClient.put(`/Profile/${userId}/UnFinishSteps`, stepIds, {
    headers: { "Content-Type": "application/json" },
  });
};

export const setRoadmapStatus = async (userId, roadmapId, isFinished) => {
  await apiClient.put(
    `/Profile/${userId}/Roadmaps/${roadmapId}?finish=${isFinished}`
  );
};

export const checkRoadmapInProfile = async (userId, roadmapId) => {
  const response = await apiClient.get(
    `/Profile/${userId}/CheckRoadmap/${roadmapId}`
  );
  return response.data;
};
