import React, { useState, useEffect, useCallback } from "react";
import Button from "../ui/Button";
// **FIX:** Only import the functions that are actually used in this file.
import { getAllQuizzes, checkAnswer, getQuizById } from "../../api/quizzes";

// Reusable Quiz Card Component for users to answer questions
const QuizCard = ({ quiz, onAnswerSubmit }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(quiz.answer);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
    setIsCorrect(null);
    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedOption) return;
    const result = await onAnswerSubmit(quiz.id, selectedOption);
    setIsCorrect(result);
    setSubmitted(true);
  };

  useEffect(() => {
    // This ensures the correct answer is displayed after submission
    if (submitted) {
      setCorrectAnswer(quiz.answer);
    }
  }, [quiz.answer, submitted]);

  // **FIX:** Ensure quiz.options is always an array before mapping to prevent crashes.
  const options = Array.isArray(quiz.options) ? quiz.options : [];

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-header">
        <h5 className="mb-0">{quiz.question}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {options.map((option, index) => (
            <div className="form-check" key={index}>
              <input
                className="form-check-input"
                type="radio"
                name={`quiz-${quiz.id}`}
                id={`option-${quiz.id}-${index}`}
                value={option}
                checked={selectedOption === option}
                onChange={handleOptionChange}
                disabled={submitted}
              />
              <label
                className="form-check-label"
                htmlFor={`option-${quiz.id}-${index}`}>
                {option}
              </label>
            </div>
          ))}
          <Button
            type="submit"
            className="btn btn-primary mt-3"
            disabled={submitted || !selectedOption}>
            Check Answer
          </Button>
        </form>
        {submitted && (
          <div
            className={`alert mt-3 ${
              isCorrect ? "alert-success" : "alert-danger"
            }`}>
            {isCorrect
              ? "That's correct!"
              : `Not quite. The correct answer is: ${correctAnswer}`}
          </div>
        )}
      </div>
      <div className="card-footer text-muted">Category: {quiz.tag}</div>
    </div>
  );
};

// Main List Component for the Quizzes Page
const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuizzes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      setError("Failed to fetch quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleAnswerSubmit = async (quizId, answer) => {
    try {
      const result = await checkAnswer(quizId, answer);
      // After checking, we need the correct answer from the API to display it.
      const updatedQuiz = await getQuizById(quizId);
      setQuizzes((currentQuizzes) =>
        currentQuizzes.map((q) =>
          q.id === quizId ? { ...q, answer: updatedQuiz.answer } : q
        )
      );
      return result;
    } catch (err) {
      console.error("Failed to check answer:", err);
      setError("Could not verify your answer. Please try again.");
      return false;
    }
  };

  if (loading) return <p className="text-center mt-5">Loading Quizzes...</p>;

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Test Your Knowledge</h1>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      {quizzes.length > 0
        ? quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              onAnswerSubmit={handleAnswerSubmit}
            />
          ))
        : !loading && <p>No quizzes available at the moment.</p>}
    </div>
  );
};

export default QuizList;
