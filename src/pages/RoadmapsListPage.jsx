import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Button from "../components/ui/Button";
import { getAllRoadmaps, generateRoadmapWithAi } from "../api/roadmaps";
import RoadmapList from "../components/roadmaps/RoadmapList"; // Import the RoadmapList component
import "../assets/styles/AiGenerator.css";
import useDebounce from "../hooks/useDebounce";

const RoadmapsListPage = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const pageSize = 9;

  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [aiTopic, setAiTopic] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const { user } = useAuth();
  const navigate = useNavigate();

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
    setPageNumber(0);
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
      const generatedRoadmap = await generateRoadmapWithAi({ topic: aiTopic });
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

      {!loading && error && <div className="alert alert-danger">{error}</div>}
      {!loading && !error && <RoadmapList roadmaps={roadmaps} />}

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
