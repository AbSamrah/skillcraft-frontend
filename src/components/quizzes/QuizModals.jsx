import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { createQuiz, updateQuiz } from "../../api/quizzes";

const tagsToArray = (tagsString) => {
  if (!tagsString || typeof tagsString !== "string") return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const getInitialFormData = (initialData) => ({
  question: initialData?.question || "",
  options: initialData?.options || ["", "", "", ""],
  answer: initialData?.answer || "",
  isTrue: initialData?.isTrue ?? true,
  type: initialData?.type || "MultipleChoicesQuiz",
});

export const CreateQuizModal = ({
  show,
  handleClose,
  onQuizCreated,
  initialData,
}) => {
  const [quizType, setQuizType] = useState(
    initialData?.type || "MultipleChoicesQuiz"
  );
  const [formData, setFormData] = useState(getInitialFormData(initialData));
  const [tags, setTags] = useState(
    Array.isArray(initialData?.tags) ? initialData.tags.join(", ") : ""
  );
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(getInitialFormData(initialData));
      setTags(
        Array.isArray(initialData.tags) ? initialData.tags.join(", ") : ""
      );
      setQuizType(initialData.type || "MultipleChoicesQuiz");
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || ["", "", "", ""])];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...formData, tags: tagsToArray(tags), type: quizType };
      await createQuiz(payload);
      onQuizCreated();
      handleClose();
    } catch (err) {
      setError("Failed to create quiz.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Create New Quiz</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}></button>
            </div>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label htmlFor="quizType" className="form-label">
                  Quiz Type
                </label>
                <select
                  id="quizType"
                  className="form-select"
                  value={quizType}
                  onChange={(e) => setQuizType(e.target.value)}>
                  <option value="MultipleChoicesQuiz">Multiple Choice</option>
                  <option value="TrueOrFalseQuiz">True/False</option>
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="question" className="form-label">
                  Question
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="question"
                  name="question"
                  value={formData.question || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              {quizType === "MultipleChoicesQuiz" && (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="mb-3" key={index}>
                      <label htmlFor={`option${index}`} className="form-label">
                        Option {index + 1}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`option${index}`}
                        value={formData.options?.[index] || ""}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
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
                      value={formData.answer || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              {quizType === "TrueOrFalseQuiz" && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isTrue"
                    name="isTrue"
                    checked={formData.isTrue}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isTrue">
                    The statement is True
                  </label>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="tags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g., JavaScript, React"
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Create Quiz
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export const EditQuizModal = ({ show, handleClose, quiz, onQuizUpdated }) => {
  const [formData, setFormData] = useState({});
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (quiz) {
      setFormData({
        ...quiz,
        isTrue: quiz.isTrue ?? true, // Default to true if not present
      });
      setTags(Array.isArray(quiz.tags) ? quiz.tags.join(", ") : "");
    }
  }, [quiz]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...(formData.options || ["", "", "", ""])];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...formData, tags: tagsToArray(tags) };
      await updateQuiz(quiz.id, payload);
      onQuizUpdated();
      handleClose();
    } catch (err) {
      setError("Failed to update quiz.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Edit Quiz</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}></button>
            </div>
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
                  value={formData.question || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.type === "MultipleChoicesQuiz" && (
                <>
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="mb-3" key={index}>
                      <label htmlFor={`option${index}`} className="form-label">
                        Option {index + 1}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id={`option${index}`}
                        value={formData.options?.[index] || ""}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
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
                      value={formData.answer || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </>
              )}
              {formData.type === "TrueOrFalseQuiz" && (
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isTrue"
                    name="isTrue"
                    checked={formData.isTrue}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="isTrue">
                    The statement is True
                  </label>
                </div>
              )}
              <div className="mb-3">
                <label htmlFor="tags" className="form-label">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
