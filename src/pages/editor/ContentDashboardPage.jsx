import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { getAllRoadmaps, deleteRoadmap } from "../../api/roadmaps";
import { getAllMilestones, deleteMilestone } from "../../api/milestones";
import { getAllSteps, deleteStep } from "../../api/steps";
import { getAllQuizzes, deleteQuiz } from "../../api/quizzes";

// Modals for Milestones and Steps
import CreateStepModal from "../../components/editor/CreateStepModal";
import EditStepModal from "../../components/editor/EditStepModal";
import CreateMilestoneModal from "../../components/editor/CreateMilestoneModal";
import EditMilestoneModal from "../../components/editor/EditMilestoneModal";

// **FIX:** Import the quiz modals from their new dedicated file.
import {
  CreateQuizModal,
  EditQuizModal,
} from "../../components/quizzes/QuizModals";

const ContentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [roadmaps, setRoadmaps] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [steps, setSteps] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // State for modals
  const [showCreateStep, setShowCreateStep] = useState(false);
  const [showEditStep, setShowEditStep] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [showEditMilestone, setShowEditMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // State for Quiz modals
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showEditQuiz, setShowEditQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [roadmapsRes, milestonesRes, stepsRes, quizzesRes] =
        await Promise.all([
          getAllRoadmaps(),
          getAllMilestones(),
          getAllSteps(),
          getAllQuizzes(),
        ]);
      setRoadmaps(roadmapsRes);
      setMilestones(milestonesRes);
      setSteps(stepsRes);
      setQuizzes(quizzesRes);
    } catch (error) {
      setError("Failed to fetch content. Please try again.");
      console.error("Failed to fetch content:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      try {
        switch (type) {
          case "roadmap":
            await deleteRoadmap(id);
            break;
          case "milestone":
            await deleteMilestone(id);
            break;
          case "step":
            await deleteStep(id);
            break;
          case "quiz":
            await deleteQuiz(id);
            break;
          default:
            return;
        }
        fetchData();
      } catch (err) {
        setError(`Failed to delete ${type}.`);
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
    if (type === "quiz") {
      setEditingQuiz(item);
      setShowEditQuiz(true);
    }
  };

  const getCreateButton = () => {
    switch (activeTab) {
      case "roadmaps":
        return (
          <Link to="/editor/roadmaps/new" className="btn btn-primary">
            Create New Roadmap
          </Link>
        );
      case "milestones":
        return (
          <Button
            onClick={() => setShowCreateMilestone(true)}
            className="btn btn-primary">
            Create New Milestone
          </Button>
        );
      case "steps":
        return (
          <Button
            onClick={() => setShowCreateStep(true)}
            className="btn btn-primary">
            Create New Step
          </Button>
        );
      case "quizzes":
        return (
          <Button
            onClick={() => setShowCreateQuiz(true)}
            className="btn btn-primary">
            Create New Quiz
          </Button>
        );
      default:
        return null;
    }
  };

  const renderRoadmaps = () => (
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
                  onClick={() => navigate(`/editor/roadmaps/edit/${item.id}`)}
                  className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete("roadmap", item.id)}
                  className="btn btn-sm btn-outline-danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderMilestones = () => (
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
                  className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete("milestone", item.id)}
                  className="btn btn-sm btn-outline-danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderSteps = () => (
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
                  className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete("step", item.id)}
                  className="btn btn-sm btn-outline-danger">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderQuizzes = () => (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Question</th>
            <th>Tag</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.id}>
              <td>{quiz.question}</td>
              <td>{quiz.tag}</td>
              <td>
                <Button
                  onClick={() => handleEdit(quiz, "quiz")}
                  className="btn btn-sm btn-outline-primary me-2">
                  Edit
                </Button>
                <Button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete("quiz", quiz.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Content Management</h1>
          {getCreateButton()}
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
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
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "quizzes" ? "active" : ""}`}
              onClick={() => setActiveTab("quizzes")}>
              Quizzes
            </button>
          </li>
        </ul>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="card p-3">
            {activeTab === "roadmaps" && renderRoadmaps()}
            {activeTab === "milestones" && renderMilestones()}
            {activeTab === "steps" && renderSteps()}
            {activeTab === "quizzes" && renderQuizzes()}
          </div>
        )}
      </div>

      {/* Modals for all content types */}
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

      <CreateQuizModal
        show={showCreateQuiz}
        handleClose={() => setShowCreateQuiz(false)}
        onQuizCreated={fetchData}
      />
      <EditQuizModal
        show={showEditQuiz}
        handleClose={() => {
          setShowEditQuiz(false);
          setEditingQuiz(null);
        }}
        quiz={editingQuiz}
        onQuizUpdated={fetchData}
      />
    </>
  );
};

export default ContentDashboardPage;
