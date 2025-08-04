import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllRoadmaps } from "../api/roadmaps";
import { getAllQuizzes } from "../api/quizzes";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

const HomePage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const filter = { pageSize: 3 };
        const [roadmapsData, quizzesData] = await Promise.all([
          getAllRoadmaps(filter),
          getAllQuizzes(filter),
        ]);
        setRoadmaps(roadmapsData.slice(0, 3));
        setQuizzes(quizzesData.slice(0, 3));
      } catch (err) {
        setError("Failed to load content. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container py-5">
      <div className="p-5 mb-4 bg-light rounded-3 text-center">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold">Welcome to SkillCraft</h1>
          <p className="fs-4">
            Your personal guide to mastering new skills. Follow our
            expert-curated roadmaps and test your knowledge with interactive
            quizzes.
          </p>
        </div>
      </div>

      {loading && <p className="text-center">Loading content...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          <div className="mb-5">
            <h2 className="text-center mb-4">Featured Roadmaps</h2>
            {roadmaps.length > 0 ? (
              <div className="row g-4 justify-content-center">
                {roadmaps.map((roadmap) => (
                  <div className="col-md-6 col-lg-4" key={roadmap.id}>
                    <Card className="h-100">
                      <div className="card-body">
                        <h5 className="card-title">{roadmap.name}</h5>
                        <p className="card-text">
                          Tags:{" "}
                          {roadmap.tags.map((tag) => (
                            <span key={tag} className="badge bg-secondary ms-1">
                              {tag}
                            </span>
                          ))}
                        </p>
                        <Link to={`/roadmaps/${roadmap.id}`}>
                          <Button>View Roadmap</Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <p>No roadmaps available at the moment.</p>
            )}
            <div className="text-center mt-4">
              <Link to="/roadmaps">
                <Button variant="secondary">View All Roadmaps</Button>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-center mb-4">Latest Quizzes</h2>
            {quizzes.length > 0 ? (
              <div className="row g-4 justify-content-center">
                {quizzes.map((quiz) => (
                  <div className="col-md-6 col-lg-4" key={quiz.id}>
                    <Card className="h-100">
                      <div className="card-body">
                        <h5 className="card-title">{quiz.question}</h5>
                        <p className="card-text">
                          Tags:{" "}
                          <span
                            className={`badge bg-${
                              quiz.type === "MultipleChoices"
                                ? "primary"
                                : "success"
                            }`}>
                            {quiz.type === "MultipleChoices" ? "MCQ" : "T/F"}
                          </span>
                          {quiz.tags.map((tag) => (
                            <span key={tag} className="badge bg-secondary ms-1">
                              {tag}
                            </span>
                          ))}
                        </p>
                        <Link to={`/quizzes/${quiz.id}`}>
                          <Button>Take Quiz</Button>
                        </Link>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <p>No quizzes available at the moment.</p>
            )}
            <div className="text-center mt-4">
              <Link to="/quizzes">
                <Button variant="secondary">View All Quizzes</Button>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default HomePage;
