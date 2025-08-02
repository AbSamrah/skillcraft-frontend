import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getRoadmapById } from "../../api/roadmaps";
import {
  addRoadmapToProfile,
  removeRoadmapFromProfile,
  getFinishedSteps,
  finishSteps,
  unfinishSteps,
  checkRoadmapInProfile,
} from "../../api/profile";
import useAuth from "../../hooks/useAuth";
import Button from "../ui/Button";
import "../../assets/styles/RoadmapDetail.css";

const formatDuration = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return "0m";
  const minutesInHour = 60;
  const hoursInDay = 8;
  const daysInWeek = 5;
  const weeksInMonth = 4;
  const monthsInYear = 12;

  const totalHours = totalMinutes / minutesInHour;
  const totalDays = totalHours / hoursInDay;
  const totalWeeks = totalDays / daysInWeek;
  const totalMonths = totalWeeks / weeksInMonth;
  const totalYears = totalMonths / monthsInYear;

  if (totalYears >= 1) {
    const years = Math.floor(totalYears);
    const months = Math.round((totalYears - years) * monthsInYear);
    return `${years}y ${months > 0 ? `${months}mo` : ""}`.trim();
  }
  if (totalMonths >= 1) {
    const months = Math.floor(totalMonths);
    const weeks = Math.round((totalMonths - months) * weeksInMonth);
    return `${months}mo ${weeks > 0 ? `${weeks}w` : ""}`.trim();
  }
  if (totalWeeks >= 1) {
    const weeks = Math.floor(totalWeeks);
    const days = Math.round((totalWeeks - weeks) * daysInWeek);
    return `${weeks}w ${days > 0 ? `${days}d` : ""}`.trim();
  }
  if (totalDays >= 1) {
    const days = Math.floor(totalDays);
    const hours = Math.round((totalDays - days) * hoursInDay);
    return `${days}d ${hours > 0 ? `${hours}h` : ""}`.trim();
  }
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * minutesInHour);
  return `${hours > 0 ? `${hours}h` : ""} ${
    minutes > 0 ? `${minutes}m` : ""
  }`.trim();
};

const formatSalary = (salary) => {
  if (!salary || salary <= 0) return "";
  return `$${salary.toLocaleString("en-US")}/yr`;
};

const RoadmapDetail = () => {
  const { id: roadmapId } = useParams();
  const { user } = useAuth();

  const [roadmap, setRoadmap] = useState(null);
  const [isInProfile, setIsInProfile] = useState(false);
  const [finishedSteps, setFinishedSteps] = useState(new Set());
  const [selectedSteps, setSelectedSteps] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      const roadmapData = await getRoadmapById(roadmapId);
      setRoadmap(roadmapData);

      if (user && user.role === "User") {
        const [inProfile, finishedStepsData] = await Promise.all([
          checkRoadmapInProfile(user.id, roadmapId),
          getFinishedSteps(user.id, roadmapId),
        ]);

        setIsInProfile(inProfile);
        const finishedSet = new Set(finishedStepsData);
        setFinishedSteps(finishedSet);
        setSelectedSteps(new Set(finishedSet));
      }
    } catch (error) {
      console.error("Failed to fetch roadmap data:", error);
    } finally {
      setLoading(false);
    }
  }, [roadmapId, user]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleProfileToggle = async () => {
    if (!user) return;
    const action = isInProfile ? removeRoadmapFromProfile : addRoadmapToProfile;
    try {
      await action(user.id, roadmapId);
      setIsInProfile(!isInProfile);
      alert(
        `Roadmap ${isInProfile ? "removed from" : "added to"} your profile!`
      );
    } catch (error) {
      console.error("Failed to toggle roadmap in profile:", error);
    }
  };

  const handleStepSelectionChange = (stepId) => {
    const newSelection = new Set(selectedSteps);
    if (newSelection.has(stepId)) {
      newSelection.delete(stepId);
    } else {
      newSelection.add(stepId);
    }
    setSelectedSteps(newSelection);
  };

  const handleUpdateFinishedSteps = async () => {
    if (!user) return;
    const stepsToFinish = [...selectedSteps].filter(
      (x) => !finishedSteps.has(x)
    );
    const stepsToUnfinish = [...finishedSteps].filter(
      (x) => !selectedSteps.has(x)
    );

    try {
      await Promise.all([
        stepsToFinish.length > 0 && finishSteps(user.id, stepsToFinish),
        stepsToUnfinish.length > 0 && unfinishSteps(user.id, stepsToUnfinish),
      ]);
      setFinishedSteps(selectedSteps);
      alert("Your progress has been updated!");
    } catch (error) {
      console.error("Failed to update progress:", error);
      alert("There was an error updating your progress.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading Roadmap...</p>;
  if (!roadmap) return <p className="text-center mt-5">Roadmap not found.</p>;

  const allSteps = roadmap.milestones?.flatMap((m) => m.steps) || [];
  const totalDuration = allSteps.reduce(
    (acc, step) => acc + step.durationInMinutes,
    0
  );
  const completedDuration = allSteps
    .filter((step) => selectedSteps.has(step.id))
    .reduce((acc, step) => acc + step.durationInMinutes, 0);
  const remainingDuration = totalDuration - completedDuration;
  const progressPercentage =
    totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  return (
    <div className="container py-5">
      <div className="roadmap-details-card mb-4">
        <h1 className="roadmap-title">{roadmap.name}</h1>
        <p className="roadmap-description">{roadmap.description}</p>
        <div className="tags-container mt-2 mb-3">
          {roadmap.tags?.map((tag) => (
            <span key={tag} className="badge bg-primary me-1 fs-6">
              {tag}
            </span>
          ))}
        </div>
        <div className="metrics-container">
          <div className="metric-item">
            <span className="metric-label">Total Duration</span>
            <span className="metric-value duration-metric">
              {formatDuration(totalDuration)}
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-label">Average Salary</span>
            <span className="metric-value salary-metric">
              {formatSalary(roadmap.salary)}
            </span>
          </div>
        </div>
      </div>

      {user && user.role === "User" && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Button
                onClick={handleProfileToggle}
                variant={isInProfile ? "danger" : "success"}>
                {isInProfile ? "Remove from My Profile" : "Add to My Profile"}
              </Button>
              <Button onClick={handleUpdateFinishedSteps}>
                Update My Progress
              </Button>
            </div>
            <div className="progress mb-3" style={{ height: "25px" }}>
              <div
                className="progress-bar"
                style={{ width: `${progressPercentage}%` }}>
                {Math.round(progressPercentage)}%
              </div>
            </div>
            <div className="d-flex justify-content-between text-center">
              <div>
                <strong>Total Time:</strong> {formatDuration(totalDuration)}
              </div>
              <div>
                <strong>Completed:</strong> {formatDuration(completedDuration)}
              </div>
              <div>
                <strong>Remaining:</strong> {formatDuration(remainingDuration)}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="timeline">
        {roadmap.milestones?.map((milestone, index) => (
          <div
            key={milestone.id}
            className={`timeline-container ${
              index % 2 === 0 ? "left" : "right"
            }`}>
            <div className="timeline-content">
              <h2>{milestone.name}</h2>
              <p>{milestone.description}</p>
              <ul className="list-group list-group-flush">
                {milestone.steps?.map((step) => (
                  <li
                    key={step.id}
                    className="list-group-item bg-transparent border-0 ps-0 d-flex justify-content-between align-items-center">
                    <div>
                      <input
                        className="form-check-input me-2"
                        type="checkbox"
                        id={`step-${step.id}`}
                        checked={selectedSteps.has(step.id)}
                        onChange={() => handleStepSelectionChange(step.id)}
                        // FIX: Disable checkboxes for non-User roles
                        disabled={!user || user.role !== "User"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`step-${step.id}`}>
                        {step.name}
                      </label>
                    </div>
                    <small className="text-muted">
                      {formatDuration(step.durationInMinutes)}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapDetail;
