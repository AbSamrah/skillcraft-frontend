import apiClient from "./apiClient";

/**
 * Fetches all multiple-choice quizzes from the server.
 * @returns {Promise<Array>} A promise that resolves to an array of quizzes.
 */
export const getAllQuizzes = async () => {
  const response = await apiClient.get("/MultipleChoicesQuiz");
  return response.data;
};

/**
 * Fetches a single quiz by its ID.
 * @param {string} id - The ID of the quiz to fetch.
 * @returns {Promise<Object>} A promise that resolves to the quiz object.
 */
export const getQuizById = async (id) => {
  const response = await apiClient.get(`/MultipleChoicesQuiz/${id}`);
  return response.data;
};

/**
 * Creates a new quiz.
 * @param {Object} quizData - The data for the new quiz.
 * @returns {Promise<Object>} A promise that resolves to the newly created quiz object.
 */
export const createQuiz = async (quizData) => {
  const response = await apiClient.post("/MultipleChoicesQuiz", quizData);
  return response.data;
};

/**
 * Updates an existing quiz.
 * @param {string} id - The ID of the quiz to update.
 * @param {Object} quizData - The updated data for the quiz.
 * @returns {Promise<Object>} A promise that resolves to the updated quiz object.
 */
export const updateQuiz = async (id, quizData) => {
  const payload = { id, ...quizData };
  const response = await apiClient.put(`/MultipleChoicesQuiz/${id}`, payload);
  return response.data;
};

/**
 * Deletes a quiz by its ID.
 * @param {string} id - The ID of the quiz to delete.
 * @returns {Promise<Object>} A promise that resolves to the deleted quiz object.
 */
export const deleteQuiz = async (id) => {
  const response = await apiClient.delete(`/MultipleChoicesQuiz/${id}`);
  return response.data;
};

/**
 * Submits an answer for a quiz and checks if it's correct.
 * @param {string} id - The ID of the quiz.
 * @param {string} answer - The user's selected answer.
 * @returns {Promise<boolean>} A promise that resolves to true if the answer is correct, otherwise false.
 */
export const checkAnswer = async (id, answer) => {
  const response = await apiClient.put(
    `/answer/${id}`,
    JSON.stringify(answer),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
