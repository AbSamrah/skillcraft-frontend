// src/components/quizzes/QuizList.jsx

import React from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";

const QuizList = ({ quizzes, onEdit, onDelete, showActions = false }) => {
  if (!quizzes || quizzes.length === 0) {
    return <p>No quizzes available at the moment.</p>;
  }

  return (
    <div className="row g-4">
      {quizzes.map((quiz) => (
        <div className="col-md-6 col-lg-4" key={quiz.id}>
          <Card>
            <h5 className="card-title">{quiz.question}</h5>
            <p className="card-text">
              Tags:{" "}
              <span
                className={`badge bg-${
                  quiz.type === "MultipleChoices" ? "primary" : "success"
                }`}>
                {quiz.type === "MultipleChoices" ? "MCQ" : "T/F"}
              </span>{" "}
              {quiz.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="badge bg-secondary me-1">
                  {tag}
                </span>
              ))}
            </p>
            <div className="mt-auto">
              {showActions ? (
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => onEdit(quiz)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => onDelete(quiz.id)}>
                    Delete
                  </button>
                </div>
              ) : (
                <Link
                  to={`/quizzes/${quiz.id}`}
                  state={{ quizType: quiz.type }}
                  className="btn btn-primary">
                  Take Quiz
                </Link>
              )}
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
