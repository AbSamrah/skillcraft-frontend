import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/ui/Button";
import {
  createRoadmap,
  getRoadmapById,
  updateRoadmap,
} from "../../api/roadmaps";
import { getAllMilestones } from "../../api/milestones";
import EditMilestoneModal from "../../components/editor/EditMilestoneModal";
import CreateMilestoneModal from "../../components/editor/CreateMilestoneModal";

const RoadmapEditorPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    salary: 0,
  });
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");

  const [availableMilestones, setAvailableMilestones] = useState([]);
  const [selectedMilestones, setSelectedMilestones] = useState([]);
  const [showCreateMilestoneModal, setShowCreateMilestoneModal] =
    useState(false);
  const [showEditMilestoneModal, setShowEditMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});

  const fetchAllMilestones = useCallback(async () => {
    try {
      return await getAllMilestones();
    } catch (err) {
      setError("Could not load milestones.");
      return [];
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allMilestonesData = await fetchAllMilestones();
      if (isEditMode) {
        try {
          const roadmapData = await getRoadmapById(id);
          setFormData({
            name: roadmapData.name,
            description: roadmapData.description,
            salary: roadmapData.salary || 0,
          });
          setTags(roadmapData.tags || []);

          const selected = roadmapData.milestones.map((m) => ({
            id: m.id,
            name: m.name,
          }));
          setSelectedMilestones(selected);
          setAvailableMilestones(
            allMilestonesData.filter(
              (m) => !roadmapData.milestones.some((sm) => sm.id === m.id)
            )
          );
        } catch (err) {
          setError("Could not load roadmap data for editing.");
        }
      } else {
        setAvailableMilestones(allMilestonesData);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, isEditMode, fetchAllMilestones]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (currentTag && !tags.includes(currentTag)) {
      setTags([...tags, currentTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleMilestoneCreated = (newMilestone) => {
    setAvailableMilestones((prev) => [...prev, newMilestone]);
  };

  const handleMilestoneUpdated = (updatedMilestone) => {
    const updated = { id: updatedMilestone.id, name: updatedMilestone.name };
    setSelectedMilestones((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
    setAvailableMilestones((prev) =>
      prev.map((m) => (m.id === updated.id ? updated : m))
    );
  };

  const handleAddMilestone = (milestone) => {
    setSelectedMilestones((prev) => [...prev, milestone]);
    setAvailableMilestones((prev) => prev.filter((m) => m.id !== milestone.id));
  };

  const handleRemoveMilestone = (milestone) => {
    setAvailableMilestones((prev) => [...prev, milestone]);
    setSelectedMilestones((prev) => prev.filter((m) => m.id !== milestone.id));
  };

  const handleEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setShowEditMilestoneModal(true);
  };

  const moveMilestone = (index, direction) => {
    const newOrder = [...selectedMilestones];
    const [movedItem] = newOrder.splice(index, 1);
    newOrder.splice(index + direction, 0, movedItem);
    setSelectedMilestones(newOrder);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const errors = {};
    if (formData.salary <= 0) {
      errors.salary = "Salary must be greater than zero.";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setError("");
    const payload = {
      ...formData,
      tags: tags,
      milestonesIds: selectedMilestones.map((m) => m.id),
      salary: parseFloat(formData.salary),
    };
    try {
      isEditMode
        ? await updateRoadmap(id, payload)
        : await createRoadmap(payload);
      navigate("/editor/dashboard");
    } catch (err) {
      setError(err.message || "An error occurred while saving the roadmap.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading Editor...</p>;

  return (
    <>
      <div className="container py-5">
        <h1>{isEditMode ? "Edit Roadmap" : "Create New Roadmap"}</h1>
        <form onSubmit={handleSubmit}>
          <div className="card p-3 mb-4">
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="mb-3">
              <label>Roadmap Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label>Description</label>
              <textarea
                className="form-control"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required></textarea>
            </div>

            <div className="mb-3">
              <label>Tags</label>
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddTag(e);
                  }}
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddTag}
                  className="ms-2">
                  Add
                </Button>
              </div>
              <div className="mt-2">
                {tags.map((tag) => (
                  <span key={tag} className="badge bg-primary me-2 p-2">
                    {tag}
                    <button
                      type="button"
                      className="btn-close btn-close-white ms-1"
                      style={{ fontSize: "0.65em" }}
                      onClick={() => handleRemoveTag(tag)}></button>
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="salary" className="form-label">
                Average Annual Salary (USD)
              </label>
              <input
                type="number"
                className={`form-control ${
                  formErrors.salary ? "is-invalid" : ""
                }`}
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h4>Build Your Roadmap</h4>
              <Button
                type="button"
                variant="success"
                onClick={() => setShowCreateMilestoneModal(true)}>
                + Create New Milestone
              </Button>
            </div>
            <div className="row">
              <div className="col-md-6">
                <h5>Available Milestones</h5>
                <ul
                  className="list-group"
                  style={{ height: "300px", overflowY: "auto" }}>
                  {availableMilestones.map((m) => (
                    <li
                      key={m.id}
                      className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{m.name}</span>
                      <div>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handleEditMilestone(m)}>
                          Edit
                        </Button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-primary ms-2"
                          onClick={() => handleAddMilestone(m)}>
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-md-6">
                <h5>Selected Milestones (in order)</h5>
                <ul
                  className="list-group"
                  style={{ height: "300px", overflowY: "auto" }}>
                  {selectedMilestones.map((m, index) => (
                    <li
                      key={m.id}
                      className="list-group-item d-flex justify-content-between align-items-center">
                      <span>{m.name}</span>
                      <div>
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() => moveMilestone(index, -1)}
                          disabled={index === 0}>
                          ↑
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() => moveMilestone(index, 1)}
                          disabled={index === selectedMilestones.length - 1}>
                          ↓
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleRemoveMilestone(m)}>
                          -
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <Button type="submit" variant="primary" size="lg">
              {isEditMode ? "Update Roadmap" : "Save Roadmap"}
            </Button>
          </div>
        </form>
      </div>
      <CreateMilestoneModal
        show={showCreateMilestoneModal}
        handleClose={() => setShowCreateMilestoneModal(false)}
        onMilestoneCreated={handleMilestoneCreated}
      />
      <EditMilestoneModal
        show={showEditMilestoneModal}
        handleClose={() => setShowEditMilestoneModal(false)}
        milestone={editingMilestone}
        onMilestoneUpdated={handleMilestoneUpdated}
      />
    </>
  );
};

export default RoadmapEditorPage;
