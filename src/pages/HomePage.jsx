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
        const [roadmapsData, quizzesData] = await Promise.all([
          getAllRoadmaps(),
          getAllQuizzes(),
        ]);
        // Get the first 3 items for the homepage preview
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
        <div className="row">
          {/* Roadmaps Section */}
          <div className="col-lg-6 mb-4">
            <h2>Featured Roadmaps</h2>
            <p>Start your learning journey with one of our popular roadmaps.</p>
            {roadmaps.length > 0 ? (
              roadmaps.map((roadmap) => (
                <Card key={roadmap.id} className="mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{roadmap.name}</h5>
                    <p className="card-text">{roadmap.description}</p>
                    <Link to={`/roadmaps/${roadmap.id}`}>
                      <Button>View Roadmap</Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <p>No roadmaps available at the moment.</p>
            )}
            <div className="text-center mt-3">
              <Link to="/roadmaps">
                <Button variant="secondary">View All Roadmaps</Button>
              </Link>
            </div>
          </div>

          {/* Quizzes Section */}
          <div className="col-lg-6 mb-4">
            <h2>Latest Quizzes</h2>
            <p>
              Challenge yourself and test your knowledge with these quizzes.
            </p>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <Card key={quiz.id} className="mb-3">
                  <div className="card-body">
                    <h5 className="card-title">{quiz.question}</h5>
                    <p className="card-text">Category: {quiz.tag}</p>
                    <Link to="/quizzes">
                      <Button>Take Quiz</Button>
                    </Link>
                  </div>
                </Card>
              ))
            ) : (
              <p>No quizzes available at the moment.</p>
            )}
            <div className="text-center mt-3">
              <Link to="/quizzes">
                <Button variant="secondary">View All Quizzes</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
