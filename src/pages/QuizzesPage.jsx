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
import Button from "../components/ui/Button";

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 9;

  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState("Beginner");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchQuizzes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const filter = { Tags: tags, pageNumber, pageSize };
      const data = await getAllQuizzes(filter);
      setQuizzes(data);
      setIsLastPage(data.length < pageSize);
    } catch (err) {
      setError("Failed to fetch quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [tags, pageNumber]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
        setPageNumber(0);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
    setPageNumber(0);
  };

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

      if (!generatedQuiz.tags) {
        generatedQuiz.tags = [];
      }

      navigate(`/quizzes/${generatedQuiz.id}`, {
        state: { quizType: generatedQuiz.type },
      });
    } catch (err) {
      setAiError("Failed to generate quiz. The AI may be busy.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading && quizzes.length === 0) {
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

      <div className="card mb-4">
        <div className="card-body">
          <label htmlFor="tag-input" className="form-label">
            Filter by Tags
          </label>
          <input
            type="text"
            id="tag-input"
            className="form-control"
            placeholder="Type a tag and press Enter..."
            value={tagInput}
            onChange={handleTagInputChange}
            onKeyDown={handleTagInputKeyDown}
          />
          <div className="mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="badge bg-primary me-2">
                {tag}
                <button
                  type="button"
                  className="btn-close btn-close-white ms-1"
                  aria-label="Remove"
                  onClick={() => removeTag(tag)}></button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {loading && <p className="text-center">Loading quizzes...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <QuizList quizzes={quizzes} />

      <div className="d-flex justify-content-center align-items-center mt-5">
        <Button
          onClick={() => setPageNumber((p) => Math.max(0, p - 1))}
          disabled={pageNumber === 0 || loading}
          className="me-2">
          &larr; Previous
        </Button>
        <span className="mx-2 fs-5">Page {pageNumber + 1}</span>
        <Button
          onClick={() => setPageNumber((p) => p + 1)}
          disabled={isLastPage || loading}
          className="ms-2">
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default QuizzesPage;
