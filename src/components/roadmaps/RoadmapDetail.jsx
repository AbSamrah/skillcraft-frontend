import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getRoadmapById } from "../../api/roadmaps";
import "../../assets/styles/RoadmapDetail.css";

const formatDuration = (totalMinutes) => {
  if (!totalMinutes || totalMinutes <= 0) return "";
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

// Helper function to format salary
const formatSalary = (salary) => {
  if (!salary || salary <= 0) return "";
  return `$${salary.toLocaleString("en-US")}/yr`;
};

const RoadmapDetail = () => {
  const { id } = useParams();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const data = await getRoadmapById(id);
        setRoadmap(data);
      } catch (error) {
        console.error("Failed to fetch roadmap details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading Roadmap...</p>;
  if (!roadmap) return <p className="text-center mt-5">Roadmap not found.</p>;

  const totalDuration = formatDuration(roadmap.durationInMinutes);
  const averageSalary = formatSalary(roadmap.salary);

  return (
    <div className="container py-5">
      <div className="roadmap-details-card mb-5">
        <h1 className="roadmap-title">{roadmap.name}</h1>
        <p className="roadmap-description">{roadmap.description}</p>
        <div className="tags-container mb-3">
          {roadmap.tags?.map((tag) => (
            <span key={tag} className="badge bg-primary me-1 fs-6">
              {tag}
            </span>
          ))}
        </div>
        <hr />
        <div className="metrics-container">
          {totalDuration && (
            <div className="metric-item">
              <span className="metric-label">Total Duration</span>
              <span className="metric-value duration-metric">
                {totalDuration}
              </span>
            </div>
          )}
          {averageSalary && (
            <div className="metric-item">
              <span className="metric-label">Average Salary</span>
              <span className="metric-value salary-metric">
                {averageSalary}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="timeline">
        {roadmap.milestones?.map((milestone, index) => {
          const milestoneDuration = formatDuration(milestone.durationInMinutes);
          return (
            <div
              key={milestone.id}
              className={`timeline-container ${
                index % 2 === 0 ? "left" : "right"
              }`}>
              <div className="timeline-content">
                <div className="d-flex justify-content-between align-items-center">
                  <h2>{milestone.name}</h2>
                  {milestoneDuration && (
                    <span className="badge bg-secondary">
                      {milestoneDuration}
                    </span>
                  )}
                </div>
                <p>{milestone.description}</p>
                <hr />
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
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapDetail;
