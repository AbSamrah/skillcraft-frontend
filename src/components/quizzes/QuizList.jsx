import React from "react";
import { Link } from "react-router-dom"; // Import Link
import Card from "../ui/Card";
import Button from "../ui/Button";

const QuizList = ({ quizzes, onEdit, onDelete, showActions = false }) => {
  if (!quizzes || quizzes.length === 0) {
    return <p>No quizzes available at the moment.</p>;
  }

  return (
    <div className="row g-4">
      {quizzes.map((quiz) => (
        <div className="col-md-6 col-lg-4" key={quiz.id}>
          <Card className="h-100 d-flex flex-column">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{quiz.question}</h5>
              <p className="card-text text-muted">Topic: {quiz.topic}</p>

              {/* Spacer to push buttons to the bottom */}
              <div className="mt-auto">
                {showActions ? (
                  <div className="mt-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => onEdit(quiz)}
                      className="me-2">
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => onDelete(quiz.id)}>
                      Delete
                    </Button>
                  </div>
                ) : (
                  // Link the button to the TakeQuizPage
                  <Link
                    to={`/quizzes/${quiz.id}`}
                    className="btn btn-primary mt-3">
                    Take Quiz
                  </Link>
                )}
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default QuizList;
