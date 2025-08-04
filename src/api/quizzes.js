import apiClient from "./apiClient";

export const getAllQuizzes = async (filter = {}) => {
  try {
    const response = await apiClient.get("/Quizzes", {
      params: filter,
      paramsSerializer: (params) => {
        let result = "";
        for (const key in params) {
          if (Array.isArray(params[key])) {
            params[key].forEach((val) => {
              result += `${key}=${encodeURIComponent(val)}&`;
            });
          } else {
            result += `${key}=${encodeURIComponent(params[key])}&`;
          }
        }
        return result.substring(0, result.length - 1);
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const getQuizById = async (id, type) => {
  try {
    const endpoint = type === "MultipleChoices" ? `mcq/${id}` : `tfq/${id}`;
    const response = await apiClient.get(`/Quizzes/${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch quiz with id ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const createQuiz = async (quizData) => {
  try {
    const endpoint =
      quizData.type === "MultipleChoices" ? "mcq/manual" : "tfq/manual";
    const response = await apiClient.post(`/Quizzes/${endpoint}`, quizData);
    return response.data;
  } catch (error) {
    console.error("Failed to create quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const updateQuiz = async (id, quizData) => {
  try {
    const endpoint =
      quizData.type === "MultipleChoices" ? `mcq/${id}` : `tfq/${id}`;
    const response = await apiClient.put(`/Quizzes/${endpoint}`, quizData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update quiz with id ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const deleteQuiz = async (id) => {
  try {
    await apiClient.delete(`/Quizzes/${id}`);
  } catch (error) {
    console.error(`Failed to delete quiz with id ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const checkAnswer = async (id, answer, type) => {
  try {
    const endpoint =
      type === "MultipleChoices" ? `mcq/answer/${id}` : `tfq/answer/${id}`;
    const response = await apiClient.get(`/Quizzes/${endpoint}`, {
      params: { answer },
    });
    return response.data;
  } catch (error) {
    console.error(`Failed to check answer for quiz ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const generateMcqWithAi = async (params) => {
  try {
    const response = await apiClient.post("/Quizzes/mcq/ai", params);
    return response.data;
  } catch (error) {
    console.error("Failed to generate AI MCQ quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

export const generateTfqWithAi = async (params) => {
  try {
    const response = await apiClient.post("/Quizzes/tfq/ai", params);
    return response.data;
  } catch (error) {
    console.error("Failed to generate AI T/F quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};
