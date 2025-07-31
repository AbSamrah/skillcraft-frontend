import apiClient from "./apiClient";

/**
 * Fetches all quizzes of every type from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of all quizzes.
 */
export const getAllQuizzes = async () => {
  try {
    const response = await apiClient.get("/Quizzes");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch quizzes:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

/**
 * Fetches a single quiz by its ID. It requires the quiz type to call the correct endpoint.
 * @param {string} id - The ID of the quiz to fetch.
 * @param {string} type - The type of quiz ('MultipleChoicesQuiz' or 'TrueOrFalseQuiz').
 * @returns {Promise<Object>} A promise that resolves to the quiz object.
 */
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

/**
 * Creates a new quiz. The quizData must contain a 'type' field.
 * @param {Object} quizData - The data for the new quiz.
 * @returns {Promise<Object>} A promise that resolves to the newly created quiz object.
 */
export const createQuiz = async (quizData) => {
  try {
    const endpoint =
      quizData.type === "MultipleChoicesQuiz" ? "mcq/manual" : "tfq/manual";
    const response = await apiClient.post(`/Quizzes/${endpoint}`, quizData);
    return response.data;
  } catch (error) {
    console.error("Failed to create quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

/**
 * Updates an existing quiz. The quizData must contain a 'type' field.
 * @param {string} id - The ID of the quiz to update.
 * @param {Object} quizData - The updated data for the quiz.
 * @returns {Promise<Object>} A promise that resolves to the updated quiz object.
 */
export const updateQuiz = async (id, quizData) => {
  try {
    const endpoint =
      quizData.type === "MultipleChoicesQuiz" ? `mcq/${id}` : `tfq/${id}`;
    const response = await apiClient.put(`/Quizzes/${endpoint}`, quizData);
    return response.data;
  } catch (error) {
    console.error(`Failed to update quiz with id ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

/**
 * Deletes a quiz by its ID.
 * @param {string} id - The ID of the quiz to delete.
 * @returns {Promise<void>}
 */
export const deleteQuiz = async (id) => {
  try {
    await apiClient.delete(`/Quizzes/${id}`);
  } catch (error) {
    console.error(`Failed to delete quiz with id ${id}:`, error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

/**
 * Checks if an answer is correct for a given quiz.
 * @param {string} id - The ID of the quiz.
 * @param {string|boolean} answer - The user's selected answer.
 * @param {string} type - The type of quiz ('MultipleChoicesQuiz' or 'TrueOrFalseQuiz').
 * @returns {Promise<boolean>} A promise that resolves to true if correct, false otherwise.
 */
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

/**
 * Generates a new Multiple Choice quiz using AI.
 * @param {Object} params - The parameters for the quiz, including topic and difficulty.
 * @returns {Promise<Object>} A promise that resolves to the generated quiz data.
 */
export const generateMcqWithAi = async (params) => {
  try {
    const response = await apiClient.post("/Quizzes/mcq/ai", params);
    return response.data;
  } catch (error) {
    console.error("Failed to generate AI MCQ quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};

/**
 * Generates a new True/False quiz using AI.
 * @param {Object} params - The parameters for the quiz, including topic and difficulty.
 * @returns {Promise<Object>} A promise that resolves to the generated quiz data.
 */
export const generateTfqWithAi = async (params) => {
  try {
    const response = await apiClient.post("/Quizzes/tfq/ai", params);
    return response.data;
  } catch (error) {
    console.error("Failed to generate AI T/F quiz:", error);
    throw error.response?.data || { message: "An unknown error occurred" };
  }
};
