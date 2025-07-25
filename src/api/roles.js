import apiClient from "./apiClient";

export const getAllRoles = async () => {
  try {
    const response = await apiClient.get("/Roles");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};
