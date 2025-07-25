import React from "react";
import RoadmapList from "../components/roadmaps/RoadmapList";

const RoadmapsListPage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">All Roadmaps</h1>
        <p className="lead text-muted">
          Browse our collection of learning paths to find your next skill.
        </p>
      </div>
      <RoadmapList />
    </div>
  );
};

export default RoadmapsListPage;
