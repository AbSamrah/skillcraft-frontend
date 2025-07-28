import React, { useState, useEffect, useCallback } from "react";
import QuizList from "../components/quizzes/QuizList";
import { getAllQuizzes } from "../api/quizzes"; // Import the API function

const QuizzesPage = () => {
  // State for quizzes, loading, and errors
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Function to fetch quizzes from the API
  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError("Failed to fetch quizzes. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quizzes when the component mounts
  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  if (loading) {
    return <p className="text-center mt-5">Loading Quizzes...</p>;
  }

  if (error) {
    return <div className="alert alert-danger container mt-5">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Test Your Knowledge</h1>
      {/* Pass the fetched quizzes down to the QuizList component */}
      <QuizList quizzes={quizzes} />
    </div>
  );
};

export default QuizzesPage;
