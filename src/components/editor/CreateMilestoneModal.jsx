import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { createMilestone } from "../../api/milestones";
import { getAllSteps } from "../../api/steps";
import CreateStepModal from "./CreateStepModal"; // We need this for creating steps on the fly

const CreateMilestoneModal = ({ show, handleClose, onMilestoneCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [availableSteps, setAvailableSteps] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [showCreateStepModal, setShowCreateStepModal] = useState(false);

  // Fetch all available steps when the modal is opened
  useEffect(() => {
    if (show) {
      const fetchSteps = async () => {
        try {
          const steps = await getAllSteps();
          setAvailableSteps(steps);
        } catch (error) {
          console.error("Failed to fetch steps:", error);
        }
      };
      fetchSteps();
    }
  }, [show]);

  // When a new step is created in the child modal, add it to our list
  const handleStepCreated = (newStep) => {
    setAvailableSteps((prev) => [...prev, newStep]);
  };

  // Move a step from the "Available" list to the "Selected" list
  const handleAddStep = (step) => {
    setSelectedSteps((prev) => [...prev, step]);
    setAvailableSteps((prev) => prev.filter((s) => s.id !== step.id));
  };

  // Move a step from the "Selected" list back to the "Available" list
  const handleRemoveStep = (step) => {
    setAvailableSteps((prev) => [...prev, step]);
    setSelectedSteps((prev) => prev.filter((s) => s.id !== step.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        description,
        stepsIds: selectedSteps.map((s) => s.id),
      };
      const newMilestone = await createMilestone(payload);
      onMilestoneCreated(newMilestone);

      // Reset form state for the next time it opens
      setName("");
      setDescription("");
      setSelectedSteps([]);
      handleClose();
    } catch (error) {
      console.error("Failed to create milestone:", error);
    }
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
              <h5 className="modal-title">Create New Milestone</h5>
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label>Description</label>
                  <textarea
                    className="form-control"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
                    <h6>Selected Steps (in order)</h6>
                    <ul
                      className="list-group"
                      style={{ height: "200px", overflowY: "auto" }}>
                      {selectedSteps.map((step) => (
                        <li
                          key={step.id}
                          className="list-group-item d-flex justify-content-between align-items-center">
                          {step.name}
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleRemoveStep(step)}>
                            -
                          </button>
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
                  Create Milestone
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* The nested modal for creating steps */}
      <CreateStepModal
        show={showCreateStepModal}
        handleClose={() => setShowCreateStepModal(false)}
        onStepCreated={handleStepCreated}
      />
    </>
  );
};

export default CreateMilestoneModal;
