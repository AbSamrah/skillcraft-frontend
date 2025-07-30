import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { getAllRoadmaps, generateRoadmapWithAi } from "../../api/roadmaps";
import "../../assets/styles/AiInput.css";

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the AI generator
  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const data = await getAllRoadmaps();
        setRoadmaps(data);
      } catch (err) {
        setError("Could not fetch roadmaps.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      setAiError("Please enter a topic.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const generatedRoadmap = await generateRoadmapWithAi(aiTopic);
      // Navigate to the editor, passing the AI-generated data
      navigate("/editor/roadmaps/new", { state: { generatedRoadmap } });
    } catch (err) {
      setAiError("Failed to generate roadmap. Please try again.");
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center">Loading roadmaps...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Explore Roadmaps</h1>

      {/* AI Generator Input Bar - visible only if logged in */}
      {user && (
        <div className="ai-input-container">
          <form onSubmit={handleAiGenerate}>
            <div className="ai-input-group">
              <input
                type="text"
                className="ai-input-field"
                placeholder="Enter a skill you want to learn... (e.g., 'Advanced TypeScript')"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                disabled={aiLoading}
              />
              <Button
                type="submit"
                className="ai-generate-btn"
                disabled={aiLoading}>
                {aiLoading ? "Generating..." : "✨ Generate with AI"}
              </Button>
            </div>
            {aiError && <div className="text-danger mt-2">{aiError}</div>}
          </form>
        </div>
      )}

      <div className="row g-4">
        {roadmaps.map((roadmap) => (
          <div className="col-md-6 col-lg-4" key={roadmap.id}>
            <Link
              to={`/roadmaps/${roadmap.id}`}
              className="text-decoration-none">
              <Card>
                <h5 className="card-title">{roadmap.name}</h5>
                <div>
                  {roadmap.tags?.map((tag) => (
                    <span key={tag} className="badge bg-secondary me-1">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapList;
