import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { getAllRoadmaps, generateRoadmapWithAi } from "../api/roadmaps";
import "../assets/styles/AiGenerator.css";
import useDebounce from "../hooks/useDebounce";

const RoadmapsListPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- NEW: State for search and pagination ---
  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 9; // You can adjust the page size here

  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const fetchRoadmaps = useCallback(async () => {
    setLoading(true);
    try {
      const filter = { name: debouncedSearchTerm, pageNumber, pageSize };
      const data = await getAllRoadmaps(filter);
      setRoadmaps(data);
      setIsLastPage(data.length < pageSize);
    } catch (err) {
      setError("Could not fetch roadmaps.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearchTerm, pageNumber]);

  useEffect(() => {
    fetchRoadmaps();
  }, [fetchRoadmaps]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPageNumber(0); // Reset to first page on new search
  };

  const handleAiGenerate = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) {
      setAiError("Please enter a topic.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const generatedRoadmap = await generateRoadmapWithAi(user.id, aiTopic);
      navigate(`/roadmaps/${generatedRoadmap.id}`);
    } catch (err) {
      setAiError(
        "Failed to generate roadmap. The AI may be busy or the topic too broad."
      );
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading && roadmaps.length === 0) {
    return <p className="text-center mt-5">Loading roadmaps...</p>;
  }

  if (error) {
    return <div className="alert alert-danger container mt-5">{error}</div>;
  }

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Explore Roadmaps</h1>

      {user && (
        <div className="ai-generator-container">
          {aiLoading && (
            <div className="generating-overlay">
              <div className="typing-effect">
                Crafting your learning path...
              </div>
            </div>
          )}
          <form onSubmit={handleAiGenerate}>
            <div className="ai-input-group">
              <input
                type="text"
                className="ai-input-field"
                placeholder="What skill do you want to master?"
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

      <div className="input-group mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search roadmaps by name..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      {loading && <p className="text-center">Searching...</p>}

      <div className="row g-4">
        {!loading && roadmaps.length === 0 && (
          <p className="text-center text-muted">No roadmaps found.</p>
        )}
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

      {/* --- NEW: Pagination Controls --- */}
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

export default RoadmapsListPage;
