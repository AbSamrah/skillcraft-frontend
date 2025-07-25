import React from "react";
import RoadmapList from "../../components/roadmaps/RoadmapList";

const LearnerDashboardPage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">My Learning Dashboard</h1>
      <h3 className="mb-3">In Progress</h3>
      {/* Logic to show roadmaps the user has started */}
      <RoadmapList />
      <hr className="my-5" />
      <h3 className="mb-3">Explore New Roadmaps</h3>
      <RoadmapList />
    </div>
  );
};

export default LearnerDashboardPage;
