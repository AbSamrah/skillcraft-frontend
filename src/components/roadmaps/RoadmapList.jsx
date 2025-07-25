import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { getAllRoadmaps } from "../../api/roadmaps";

const RoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return <div className="text-center">Loading roadmaps...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="row g-4">
      {roadmaps.map((roadmap) => (
        <div className="col-md-6 col-lg-4" key={roadmap.id}>
          <Link to={`/roadmaps/${roadmap.id}`} className="text-decoration-none">
            <Card>
              <h5 className="card-title">{roadmap.name}</h5>
              <p className="card-text">{roadmap.description}</p>
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
  );
};

export default RoadmapList;
