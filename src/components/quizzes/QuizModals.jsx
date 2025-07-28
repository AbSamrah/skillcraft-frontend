import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { createQuiz, updateQuiz } from "../../api/quizzes";

// Modal for Creating a New Quiz
export const CreateQuizModal = ({ show, handleClose, onQuizCreated }) => {
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    tag: "",
  });
  const [error, setError] = useState("");

  const resetForm = () => {
    setFormData({
      question: "",
      options: ["", "", "", ""],
      answer: "",
      tag: "",
    });
    setError("");
  };

  const handleModalClose = () => {
    resetForm();
    handleClose();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.question ||
      !formData.answer ||
      formData.options.some((opt) => !opt)
    ) {
      setError("Please fill out all fields.");
      return;
    }
    if (!formData.options.includes(formData.answer)) {
      setError("The correct answer must be one of the provided options.");
      return;
    }

    try {
      await createQuiz(formData);
      onQuizCreated();
      handleModalClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create quiz.");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Quiz</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleModalClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.options.map((option, index) => (
                <div className="mb-3" key={index}>
                  <label htmlFor={`option${index}`} className="form-label">
                    Option {index + 1}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`option${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Correct Answer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  placeholder="Must match one of the options"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                  Tag
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={handleModalClose}>
                Close
              </Button>
              <Button type="submit" className="btn btn-primary">
                Create Quiz
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// Modal for Editing an Existing Quiz
export const EditQuizModal = ({ show, handleClose, quiz, onQuizUpdated }) => {
  // **FIX:** Initialize formData with a default structure to prevent the "uncontrolled input" warning.
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    tag: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (quiz) {
      // When the quiz data is passed as a prop, update the form state.
      // Provide fallbacks to empty strings/arrays to be safe.
      setFormData({
        question: quiz.question || "",
        options: quiz.options || ["", "", "", ""],
        answer: quiz.answer || "",
        tag: quiz.tag || "",
      });
    }
  }, [quiz]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !formData.question ||
      !formData.answer ||
      formData.options.some((opt) => !opt)
    ) {
      setError("Please fill out all fields.");
      return;
    }
    if (!formData.options.includes(formData.answer)) {
      setError("The correct answer must be one of the provided options.");
      return;
    }
    try {
      await updateQuiz(quiz.id, formData);
      onQuizUpdated();
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update quiz.");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show"
      style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
      tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Quiz</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.options.map((option, index) => (
                <div className="mb-3" key={index}>
                  <label htmlFor={`option${index}`} className="form-label">
                    Option {index + 1}
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id={`option${index}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">
                  Correct Answer
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="answer"
                  name="answer"
                  value={formData.answer}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="tag" className="form-label">
                  Tag
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tag"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" className="btn btn-primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
