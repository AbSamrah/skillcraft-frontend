import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getQuizById, checkAnswer } from "../../api/quizzes";
import useAuth from "../../hooks/useAuth";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";

const TakeQuizPage = () => {
  const { id: quizId } = useParams();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [result, setResult] = useState(null); // 'correct' or 'incorrect'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuiz = useCallback(async () => {
    if (!user) return;
    try {
      const data = await getQuizById(quizId);
      setQuiz(data);
    } catch (err) {
      setError("Failed to load the quiz.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [quizId, user]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleAnswerChange = (option) => {
    if (!result) {
      // Prevent changing answer after submission
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
      const isCorrect = await checkAnswer(quizId, selectedAnswer);
      setResult(isCorrect ? "correct" : "incorrect");
    } catch (err) {
      alert("Could not check the answer. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
          <p className="text-muted">Topic: {quiz.topic}</p>
          <hr />
          <div className="options-container my-4">
            {quiz.options?.map((option, index) => (
              <Button
                key={index}
                variant={
                  selectedAnswer === option ? "primary" : "outline-secondary"
                }
                onClick={() => handleAnswerChange(option)}
                className="d-block w-100 text-start mb-2"
                disabled={!!result}>
                {option}
              </Button>
            ))}
          </div>

          {!result ? (
            <Button
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null || isSubmitting}>
              {isSubmitting ? "Checking..." : "Check Answer"}
            </Button>
          ) : (
            <div
              className={`alert ${
                result === "correct" ? "alert-success" : "alert-danger"
              }`}>
              {result === "correct"
                ? "That's correct!"
                : "Sorry, that's incorrect."}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TakeQuizPage;
