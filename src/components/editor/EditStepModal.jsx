import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import { updateStep } from "../../api/steps";

const EditStepModal = ({ show, handleClose, step, onStepUpdated }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState({ days: 0, hours: 0, minutes: 0 });
  const [error, setError] = useState("");

  useEffect(() => {
    if (step) {
      setName(step.name);
      setDescription(step.description);

      // Deconstruct total minutes into days, hours, and minutes for the form
      const totalMinutes = step.durationInMinutes || 0;
      const minutesInHour = 60;
      const hoursInDay = 8; // Assuming 8-hour work day

      const totalHours = totalMinutes / minutesInHour;
      const days = Math.floor(totalHours / hoursInDay);
      const remainingHours = totalHours % hoursInDay;
      const hours = Math.floor(remainingHours);
      const minutes = Math.round((remainingHours - hours) * minutesInHour);

      setDuration({ days, hours, minutes });
    }
  }, [step]);

  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    setDuration((prev) => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    const totalMinutes =
      duration.days * 8 * 60 + duration.hours * 60 + duration.minutes;

    if (totalMinutes <= 0) {
      setError("Duration must be greater than zero.");
      return;
    }

    try {
      const payload = { name, description, durationInMinutes: totalMinutes };
      const updatedStep = await updateStep(step.id, payload);
      onStepUpdated(updatedStep);
      handleClose();
    } catch (error) {
      console.error("Failed to update step:", error);
      setError("Failed to update step. Please try again.");
    }
  };

  if (!show || !step) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Edit Step</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>Step Name</label>
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
                <small className="form-text text-muted">
                  Assumes an 8-hour study day.
                </small>
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
  );
};

export default EditStepModal;
