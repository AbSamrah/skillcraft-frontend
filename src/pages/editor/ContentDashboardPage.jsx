import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { getAllRoadmaps, deleteRoadmap } from "../../api/roadmaps";
import { getAllMilestones, deleteMilestone } from "../../api/milestones";
import { getAllSteps, deleteStep } from "../../api/steps";

// Import the new modals
import CreateStepModal from "../../components/editor/CreateStepModal";
import EditStepModal from "../../components/editor/EditStepModal";
import CreateMilestoneModal from "../../components/editor/CreateMilestoneModal";
import EditMilestoneModal from "../../components/editor/EditMilestoneModal";

const ContentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [roadmaps, setRoadmaps] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // State for modals
  const [showCreateStep, setShowCreateStep] = useState(false);
  const [showEditStep, setShowEditStep] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [showEditMilestone, setShowEditMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [roadmapsRes, milestonesRes, stepsRes] = await Promise.all([
        getAllRoadmaps(),
        getAllMilestones(),
        getAllSteps(),
      ]);
      setRoadmaps(roadmapsRes);
      setMilestones(milestonesRes);
      setSteps(stepsRes);
    } catch (error) {
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id, type) => {
    const confirmMessage = `Are you sure you want to delete this ${type}? This might affect existing roadmaps.`;
    if (window.confirm(confirmMessage)) {
      try {
        if (type === "roadmap") await deleteRoadmap(id);
        if (type === "milestone") await deleteMilestone(id);
        if (type === "step") await deleteStep(id);
        fetchData();
      } catch (error) {
        console.error(`Failed to delete ${type}:`, error);
      }
    }
  };

  const handleEdit = (item, type) => {
    if (type === "milestone") {
      setEditingMilestone(item);
      setShowEditMilestone(true);
    }
    if (type === "step") {
      setEditingStep(item);
      setShowEditStep(true);
    }
  };

  const handleCreate = () => {
    if (activeTab === "milestones") setShowCreateMilestone(true);
    if (activeTab === "steps") setShowCreateStep(true);
  };

  const renderContent = () => {
    if (loading) return <p className="text-center mt-4">Loading content...</p>;
    switch (activeTab) {
      case "roadmaps":
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Tags</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {roadmaps.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>{item.tags?.join(", ")}</td>
                    <td>
                      <Button
                        onClick={() =>
                          navigate(`/editor/roadmaps/edit/${item.id}`)
                        }
                        variant="outline-primary"
                        size="sm"
                        className="me-2">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id, "roadmap")}
                        variant="outline-danger"
                        size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "milestones":
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {milestones.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <Button
                        onClick={() => handleEdit(item, "milestone")}
                        variant="outline-primary"
                        size="sm"
                        className="me-2">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id, "milestone")}
                        variant="outline-danger"
                        size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      case "steps":
        return (
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <Button
                        onClick={() => handleEdit(item, "step")}
                        variant="outline-primary"
                        size="sm"
                        className="me-2">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id, "step")}
                        variant="outline-danger"
                        size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Content Dashboard</h1>
          {activeTab === "roadmaps" ? (
            <Link to="/editor/roadmaps/new">
              <Button variant="primary">Create New Roadmap</Button>
            </Link>
          ) : (
            <Button variant="primary" onClick={handleCreate}>
              Create New {activeTab.slice(0, -1)}
            </Button>
          )}
        </div>

        <ul className="nav nav-tabs mb-3">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "roadmaps" ? "active" : ""}`}
              onClick={() => setActiveTab("roadmaps")}>
              Roadmaps
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "milestones" ? "active" : ""
              }`}
              onClick={() => setActiveTab("milestones")}>
              Milestones
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "steps" ? "active" : ""}`}
              onClick={() => setActiveTab("steps")}>
              Steps
            </button>
          </li>
        </ul>
        <div className="card">{renderContent()}</div>
      </div>

      {/* Modals for creating and editing content */}
      <CreateStepModal
        show={showCreateStep}
        handleClose={() => setShowCreateStep(false)}
        onStepCreated={fetchData}
      />
      <EditStepModal
        show={showEditStep}
        handleClose={() => setShowEditStep(false)}
        step={editingStep}
        onStepUpdated={fetchData}
      />
      <CreateMilestoneModal
        show={showCreateMilestone}
        handleClose={() => setShowCreateMilestone(false)}
        onMilestoneCreated={fetchData}
      />
      <EditMilestoneModal
        show={showEditMilestone}
        handleClose={() => setShowEditMilestone(false)}
        milestone={editingMilestone}
        onMilestoneUpdated={fetchData}
      />
    </>
  );
};

export default ContentDashboardPage;
