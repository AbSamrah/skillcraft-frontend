import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { updateMilestone, getMilestoneById } from "../../api/milestones";
import { getAllSteps } from "../../api/steps";
import EditStepModal from "./EditStepModal";
import CreateStepModal from "./CreateStepModal";

const EditMilestoneModal = ({
  show,
  handleClose,
  milestone,
  onMilestoneUpdated,
}) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [availableSteps, setAvailableSteps] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showCreateStepModal, setShowCreateStepModal] = useState(false);
  const [showEditStepModal, setShowEditStepModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (milestone) {
        const allSteps = await getAllSteps();
        const milestoneDetails = await getMilestoneById(milestone.id);
        setFormData({
          name: milestoneDetails.name,
          description: milestoneDetails.description,
        });
        setSelectedSteps(milestoneDetails.steps || []);
        setAvailableSteps(
          allSteps.filter(
            (s) => !(milestoneDetails.steps || []).some((ms) => ms.id === s.id)
          )
        );
      }
    };
    if (show) loadData();
  }, [milestone, show]);

  const handleStepCreated = (newStep) =>
    setAvailableSteps((prev) => [...prev, newStep]);

  const handleStepUpdated = (updatedStep) => {
    const refreshData = async () => {
      const allSteps = await getAllSteps();
      const milestoneDetails = await getMilestoneById(milestone.id);
      setSelectedSteps(milestoneDetails.steps || []);
      setAvailableSteps(
        allSteps.filter(
          (s) => !(milestoneDetails.steps || []).some((ms) => ms.id === s.id)
        )
      );
    };
    refreshData();
  };

  const handleAddStep = (step) => {
    setSelectedSteps((prev) => [...prev, step]);
    setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));
  };
  const handleRemoveStep = (step) => {
    setAvailableSteps((prev) => [...prev, step]);
    setSelectedSteps((prev) => prev.filter((s) => s.id !== step.id));
  };
  const handleEditStep = (step) => {
    setEditingStep(step);
    setShowEditStepModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData, stepsIds: selectedSteps.map((s) => s.id) };
    const updatedMilestone = await updateMilestone(milestone.id, payload);
    onMilestoneUpdated(updatedMilestone);
    handleClose();
  };

  if (!show) return null;

  return (
    <>
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Milestone</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label>Milestone Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required></textarea>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6>Build Your Milestone</h6>
                  <Button
                    type="button"
                    variant="success"
                    onClick={() => setShowCreateStepModal(true)}>
                    + Create New Step
                  </Button>
                </div>
                <div className="row">
                  <div className="col-6">
                    <h6>Available Steps</h6>
                    <ul
                      className="list-group"
                      style={{ height: "200px", overflowY: "auto" }}>
                      {availableSteps.map((step) => (
                        <li
                          key={step.id}
                          className="list-group-item d-flex justify-content-between align-items-center">
                          {step.name}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleAddStep(step)}>
                            +
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-6">
                    <h6>Selected Steps</h6>
                    <ul
                      className="list-group"
                      style={{ height: "200px", overflowY: "auto" }}>
                      {selectedSteps.map((step) => (
                        <li
                          key={step.id}
                          className="list-group-item d-flex justify-content-between align-items-center">
                          <span>{step.name}</span>
                          <div>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => handleEditStep(step)}>
                              Edit
                            </Button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger ms-2"
                              onClick={() => handleRemoveStep(step)}>
                              -
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <Button type="button" variant="secondary" onClick={handleClose}>
                  Close
                </Button>
                <Button type="submit" variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <CreateStepModal
        show={showCreateStepModal}
        handleClose={() => setShowCreateStepModal(false)}
        onStepCreated={handleStepCreated}
      />
      <EditStepModal
        show={showEditStepModal}
        handleClose={() => setShowEditStepModal(false)}
        step={editingStep}
        onStepUpdated={handleStepUpdated}
      />
    </>
  );
};

export default EditMilestoneModal;
