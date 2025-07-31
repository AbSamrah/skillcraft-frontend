import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getQuizById, checkAnswer } from "../../api/quizzes";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import "../../assets/styles/QuizOptions.css";

const TakeQuizPage = () => {
  const { id: quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { quizType } = location.state || {};

  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuiz = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    if (!quizType) {
      setError("Quiz type not provided. Cannot load quiz.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await getQuizById(quizId, quizType);
      setQuiz(data);
    } catch (err) {
      setError("Failed to load the quiz. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [quizId, user, quizType]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerChange = (option) => {
    if (!result) {
      setSelectedAnswer(option);
    }
  };

  const handleCheckAnswer = async () => {
    if (selectedAnswer === null) {
      alert("Please select an answer.");
      return;
    }
    setIsSubmitting(true);
    try {
      const isCorrect = await checkAnswer(quizId, selectedAnswer, quiz.type);
      setResult(isCorrect ? "correct" : "incorrect");
    } catch (err) {
      alert("Could not check the answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReanswer = () => {
    setSelectedAnswer(null);
    setResult(null);
  };

  if (loading) return <p className="text-center mt-5">Loading Quiz...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!quiz) return <p className="text-center mt-5">Quiz not found.</p>;

  return (
    <div className="container py-5">
      <h1 className="mb-4">Take Quiz</h1>
      <Card>
        <div className="card-body">
          <h4 className="card-title">{quiz.question}</h4>
          <div className="mt-2 mb-3">
            {quiz.tags?.map((tag) => (
              <span key={tag} className="badge bg-info me-1">
                {tag}
              </span>
            ))}
          </div>
          <hr />
          <div className="options-container my-4">
            {quiz.type === "MultipleChoices" &&
              quiz.options?.map((option, index) => (
                <button
                  key={index}
                  className={`quiz-option-btn ${
                    selectedAnswer === option ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerChange(option)}
                  disabled={!!result}>
                  {option}
                </button>
              ))}
            {quiz.type === "TrueOrFalse" && (
              <>
                <button
                  className={`quiz-option-btn ${
                    selectedAnswer === true ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerChange(true)}
                  disabled={!!result}>
                  True
                </button>
                <button
                  className={`quiz-option-btn ${
                    selectedAnswer === false ? "selected" : ""
                  }`}
                  onClick={() => handleAnswerChange(false)}
                  disabled={!!result}>
                  False
                </button>
              </>
            )}
          </div>

          {!result ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null || isSubmitting}>
              {isSubmitting ? "Checking..." : "Check Answer"}
            </Button>
          ) : (
            <div>
              <div
                className={`alert ${
                  result === "correct" ? "alert-success" : "alert-danger"
                }`}>
                {result === "correct"
                  ? "That's correct!"
                  : "Sorry, that's incorrect."}
              </div>
              <div className="mt-3">
                {result === "incorrect" && (
                  <Button
                    onClick={handleReanswer}
                    variant="secondary"
                    className="me-2">
                    Re-answer
                  </Button>
                )}
                <Button onClick={() => navigate("/quizzes")} variant="primary">
                  Back to Quiz List
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TakeQuizPage;
