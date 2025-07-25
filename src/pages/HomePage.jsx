import React from "react";
import RoadmapList from "../components/roadmaps/RoadmapList";

const HomePage = () => {
  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold">Chart Your Path to Mastery</h1>
        <p className="lead text-muted">
          Explore our community-driven roadmaps to learn new skills and advance
          your career.
        </p>
      </div>
      <RoadmapList />
    </div>
  );
};

export default HomePage;
