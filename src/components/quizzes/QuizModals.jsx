import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { createQuiz, updateQuiz, getQuizById } from "../../api/quizzes";

const getInitialFormData = (initialData) => ({
  question: initialData?.question || "",
  options: initialData?.options || ["", "", "", ""],
  answer: initialData?.answer || "",
  isTrue: initialData?.isTrue ?? true,
  type: initialData?.type || "MultipleChoices",
});

export const CreateQuizModal = ({
  show,
  handleClose,
  onQuizCreated,
  initialData,
}) => {
  const [quizType, setQuizType] = useState(
    initialData?.type || "MultipleChoices"
  );
  const [formData, setFormData] = useState(getInitialFormData(initialData));
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      const initialForm = getInitialFormData(initialData);
      setFormData(initialForm);
      setTags(Array.isArray(initialData?.tags) ? initialData.tags : []);
      setQuizType(initialData?.type || "MultipleChoices");
    } else {
      // Reset form when modal is closed
      setFormData(getInitialFormData());
      setTags([]);
      setCurrentTag("");
      setQuizType("MultipleChoices");
    }
  }, [initialData, show]);

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

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...formData, tags, type: quizType };
      await createQuiz(payload);
      onQuizCreated();
      handleClose();
    } catch (err) {
      setError("Failed to create quiz.");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                  <option value="MultipleChoices">Multiple Choice</option>
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
              {quizType === "MultipleChoices" && (
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
                    <label className="form-label">Correct Answer</label>
                    {formData.options.map((option, index) => (
                      <div className="form-check" key={index}>
                        <input
                          className="form-check-input"
                          type="radio"
                          name="answer"
                          id={`answer-radio-${index}`}
                          value={option}
                          checked={formData.answer === option}
                          onChange={handleChange}
                          disabled={!option}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`answer-radio-${index}`}>
                          {option || `Option ${index + 1}`}
                        </label>
                      </div>
                    ))}
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
                  Tags
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="Add a tag..."
                  />
                  <Button
                    type="button"
                    variant="outline-secondary"
                    onClick={handleAddTag}>
                    Add
                  </Button>
                </div>
                <div className="mt-2">
                  {tags.map((tag) => (
                    <span key={tag} className="badge bg-primary me-1">
                      {tag}{" "}
                      <button
                        type="button"
                        className="btn-close btn-close-white ms-1"
                        onClick={() => handleRemoveTag(tag)}></button>
                    </span>
                  ))}
                </div>
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
  // FIX: Initialize formData with a default structure
  const [formData, setFormData] = useState({
    question: "",
    options: ["", "", "", ""],
    answer: "",
    isTrue: true,
    type: "MultipleChoicesQuiz",
  });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFullQuiz = async () => {
      if (quiz) {
        setLoading(true);
        try {
          // FIX: Call getQuizById to get the full quiz details, including the answer
          const fullQuizData = await getQuizById(quiz.id, quiz.type);

          setFormData({
            question: fullQuizData.question || "",
            options: [
              ...(fullQuizData.options || []),
              ...Array(
                Math.max(0, 4 - (fullQuizData.options?.length || 0))
              ).fill(""),
            ],
            answer: fullQuizData.answer || "",
            isTrue: fullQuizData.isTrue ?? true,
            type: fullQuizData.type,
          });
          setTags(Array.isArray(fullQuizData.tags) ? fullQuizData.tags : []);
        } catch (err) {
          setError("Failed to load quiz details for editing.");
        } finally {
          setLoading(false);
        }
      }
    };

    if (show) {
      fetchFullQuiz();
    }
  }, [quiz, show]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleAddTag = () => {
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { ...formData, tags };
      await updateQuiz(quiz.id, payload);
      onQuizUpdated();
      handleClose();
    } catch (err) {
      setError("Failed to update quiz.");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
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
              {loading ? (
                <p>Loading quiz details...</p>
              ) : error ? (
                <div className="alert alert-danger">{error}</div>
              ) : (
                <>
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
                  {formData.type === "MultipleChoices" && (
                    <>
                      {formData.options?.map((option, index) => (
                        <div className="mb-3" key={index}>
                          <label
                            htmlFor={`option${index}`}
                            className="form-label">
                            Option {index + 1}
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id={`option${index}`}
                            value={option || ""}
                            onChange={(e) =>
                              handleOptionChange(index, e.target.value)
                            }
                            required
                          />
                        </div>
                      ))}
                      <div className="mb-3">
                        <label className="form-label">Correct Answer</label>
                        {formData.options?.map((option, index) => (
                          <div className="form-check" key={index}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="answer"
                              id={`edit-answer-radio-${index}`}
                              value={option}
                              checked={formData.answer === option}
                              onChange={handleChange}
                              disabled={!option}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`edit-answer-radio-${index}`}>
                              {option || `Option ${index + 1}`}
                            </label>
                          </div>
                        ))}
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
                        The correct answer is True
                      </label>
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="tags" className="form-label">
                      Tags
                    </label>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag..."
                      />
                      <Button
                        type="button"
                        variant="outline-secondary"
                        onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    <div className="mt-2">
                      {tags.map((tag) => (
                        <span key={tag} className="badge bg-primary me-1">
                          {tag}{" "}
                          <button
                            type="button"
                            className="btn-close btn-close-white ms-1"
                            onClick={() => handleRemoveTag(tag)}></button>
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
