import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import QuizList from "../components/quizzes/QuizList";
import {
  getAllQuizzes,
  generateMcqWithAi,
  generateTfqWithAi,
} from "../api/quizzes";
import useAuth from "../hooks/useAuth";
import "../assets/styles/AiGenerator.css";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("Beginner");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

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

  const handleAiGenerate = async (generatorFunction, quizType) => {
    if (!aiTopic.trim()) {
      setAiError("Please enter a topic.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const params = { topic: aiTopic, difficulty: aiDifficulty };
      const generatedQuiz = await generatorFunction(params);

      navigate("/editor/dashboard", {
        state: {
          newQuiz: { ...generatedQuiz, type: quizType },
          activeTab: "quizzes",
        },
      });
    } catch (err) {
      setAiError("Failed to generate quiz. The AI may be busy.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-5">Loading Quizzes...</p>;
  }

  if (error) {
    return <div className="alert alert-danger container mt-5">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Test Your Knowledge</h1>

      {user && (
        <div className="ai-generator-container">
          {aiLoading && (
            <div className="generating-overlay">
              <div className="typing-effect">Generating a new challenge...</div>
            </div>
          )}
          <div className="ai-input-group mb-3">
            <input
              type="text"
              className="ai-input-field"
              placeholder="Enter a topic to generate a quiz..."
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              disabled={aiLoading}
            />
            <select
              className="form-select"
              style={{ maxWidth: "150px" }}
              value={aiDifficulty}
              onChange={(e) => setAiDifficulty(e.target.value)}
              disabled={aiLoading}>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>
          <div className="d-flex justify-content-end">
            <div className="btn-group">
              <button
                onClick={() =>
                  handleAiGenerate(generateMcqWithAi, "MultipleChoices")
                }
                className="ai-generate-btn"
                disabled={aiLoading}>
                {aiLoading ? "..." : "✨ Generate MCQ"}
              </button>
              <button
                onClick={() =>
                  handleAiGenerate(generateTfqWithAi, "TrueOrFalse")
                }
                className="ai-generate-btn"
                disabled={aiLoading}>
                {aiLoading ? "..." : "✨ Generate T/F"}
              </button>
            </div>
          </div>
          {aiError && <div className="text-danger mt-2">{aiError}</div>}
        </div>
      )}

      <QuizList quizzes={quizzes} />
    </div>
  );
};

export default QuizzesPage;
