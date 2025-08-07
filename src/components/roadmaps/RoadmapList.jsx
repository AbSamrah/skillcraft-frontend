import React from "react";
import { Link } from "react-router-dom";
import Card from "../ui/Card";
import Button from "../ui/Button";

// The component now accepts `roadmaps` as a prop.
const RoadmapList = ({ roadmaps }) => {
  // Removed the local state (useState) and data fetching (useEffect).

  // A check for empty or undefined roadmaps array can be useful.
  if (!roadmaps || roadmaps.length === 0) {
    return <p className="text-center">No roadmaps found.</p>;
  }

  return (
    // The container div was removed to prevent double-nesting inside the parent page.
    <div className="row g-4">
      {roadmaps.map((roadmap) => (
        <div className="col-md-6 col-lg-4" key={roadmap.id}>
          <Card className="h-100">
            <div className="card-body d-flex flex-column">
              <h5 className="card-title">{roadmap.name}</h5>
              <div className="mb-2">
                {roadmap.tags?.slice(0, 3).map((tag, index) => (
                  <span key={index} className="badge bg-secondary me-1">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto">
                <Link to={`/roadmaps/${roadmap.id}`}>
                  <Button>View Roadmap</Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RoadmapList;
