import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import { getAllRoadmaps, deleteRoadmap } from "../../api/roadmaps";
import { getAllMilestones, deleteMilestone } from "../../api/milestones";
import { getAllSteps, deleteStep } from "../../api/steps";
import { getAllQuizzes, deleteQuiz } from "../../api/quizzes";

import CreateStepModal from "../../components/editor/CreateStepModal";
import EditStepModal from "../../components/editor/EditStepModal";
import CreateMilestoneModal from "../../components/editor/CreateMilestoneModal";
import EditMilestoneModal from "../../components/editor/EditMilestoneModal";
import useDebounce from "../../hooks/useDebounce";
import {
  CreateQuizModal,
  EditQuizModal,
} from "../../components/quizzes/QuizModals";

const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const ContentDashboardPage = () => {
  const [activeTab, setActiveTab] = useState("roadmaps");
  const [data, setData] = useState({
    roadmaps: [],
    milestones: [],
    steps: [],
    quizzes: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    roadmaps: { name: "", pageNumber: 0, pageSize: 10 },
    milestones: { name: "", pageNumber: 0, pageSize: 10 },
    steps: { name: "", pageNumber: 0, pageSize: 10 },
    quizzes: { name: "", pageNumber: 0, pageSize: 10 },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [isLastPage, setIsLastPage] = useState({
    roadmaps: false,
    milestones: false,
    steps: false,
  });

  const [showCreateStep, setShowCreateStep] = useState(false);
  const [showEditStep, setShowEditStep] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [showCreateMilestone, setShowCreateMilestone] = useState(false);
  const [showEditMilestone, setShowEditMilestone] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [showEditQuiz, setShowEditQuiz] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [roadmapsRes, milestonesRes, stepsRes, quizzesRes] =
        await Promise.all([
          getAllRoadmaps(filters.roadmaps),
          getAllMilestones(filters.milestones),
          getAllSteps(filters.steps),
          getAllQuizzes(filters.quizzes),
        ]);

      setData({
        roadmaps: roadmapsRes,
        milestones: milestonesRes,
        steps: stepsRes,
        quizzes: quizzesRes,
      });

      setIsLastPage({
        roadmaps: roadmapsRes.length < filters.roadmaps.pageSize,
        milestones: milestonesRes.length < filters.milestones.pageSize,
        steps: stepsRes.length < filters.steps.pageSize,
        quizzes: quizzesRes.length < filters.quizzes.pageSize,
      });
    } catch (error) {
      setError("Failed to fetch content. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        name: debouncedSearchTerm,
        pageNumber: 0,
      },
    }));
  }, [debouncedSearchTerm, activeTab]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (direction) => {
    setFilters((prev) => ({
      ...prev,
      [activeTab]: {
        ...prev[activeTab],
        pageNumber: Math.max(0, prev[activeTab].pageNumber + direction),
      },
    }));
  };

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
    } else if (type === "step") {
      setEditingStep(item);
      setShowEditStep(true);
    } else if (type === "quiz") {
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
          <Button onClick={() => setShowCreateMilestone(true)}>
            Create New Milestone
          </Button>
        );
      case "steps":
        return (
          <Button onClick={() => setShowCreateStep(true)}>
            Create New Step
          </Button>
        );
      case "quizzes":
        return (
          <Button onClick={() => setShowCreateQuiz(true)}>
            Create New Quiz
          </Button>
        );
      default:
        return null;
    }
  };

  const renderSearchAndPagination = () => {
    if (!["roadmaps", "milestones", "steps", "quizzes"].includes(activeTab))
      return null;

    return (
      <div className="mb-4">
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={`Search ${activeTab} by name...`}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="d-flex justify-content-center align-items-center">
          <Button
            onClick={() => handlePageChange(-1)}
            disabled={filters[activeTab].pageNumber === 0 || loading}
            className="me-2">
            &larr; Previous
          </Button>
          <span className="mx-2">Page {filters[activeTab].pageNumber + 1}</span>
          <Button
            onClick={() => handlePageChange(1)}
            disabled={isLastPage[activeTab] || loading}
            className="ms-2">
            Next &rarr;
          </Button>
        </div>
      </div>
    );
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
          {data.roadmaps.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{truncateText(item.description, 100)}</td>
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
          {data.milestones.map((item) => (
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
          {data.steps.map((item) => (
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
          {data.quizzes.map((quiz) => (
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
            {renderSearchAndPagination()}
            {activeTab === "roadmaps" && renderRoadmaps()}
            {activeTab === "milestones" && renderMilestones()}
            {activeTab === "steps" && renderSteps()}
            {activeTab === "quizzes" && renderQuizzes()}
          </div>
        )}
      </div>

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
