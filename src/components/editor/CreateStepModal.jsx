import React, { useState } from "react";
import Button from "../ui/Button";
import { createStep } from "../../api/steps";

const CreateStepModal = ({ show, handleClose, onStepCreated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0 });

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setDuration((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Assuming an 8-hour work day
      const totalMinutes =
        duration.days * 8 * 60 + duration.hours * 60 + duration.minutes;

      const payload = {
        name,
        description,
        durationInMinutes: totalMinutes,
      };
      const newStep = await createStep(payload);
      onStepCreated(newStep);

      // Reset form
      setName("");
      setDescription("");
      setDuration({ days: 0, hours: 0, minutes: 0 });
      handleClose();
    } catch (error) {
      console.error("Failed to create step:", error);
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create New Step</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label htmlFor="stepName" className="form-label">
                  Step Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="stepName"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="stepDescription" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="stepDescription"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Duration</label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control"
                    name="days"
                    value={duration.days}
                    onChange={handleDurationChange}
                  />
                  <span className="input-group-text">Days</span>
                  <input
                    type="number"
                    className="form-control"
                    name="hours"
                    value={duration.hours}
                    onChange={handleDurationChange}
                  />
                  <span className="input-group-text">Hours</span>
                  <input
                    type="number"
                    className="form-control"
                    name="minutes"
                    value={duration.minutes}
                    onChange={handleDurationChange}
                  />
                  <span className="input-group-text">Mins</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="primary">
                Create Step
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateStepModal;
