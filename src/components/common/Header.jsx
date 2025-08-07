import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";

const Header = () => {
  const { user, logout, energy } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getDashboardLink = () => {
    if (!user) return null;
    if (user.role === "Admin") return "/admin/dashboard";
    if (user.role === "Editor") return "/editor/dashboard";
    return null;
  };

  const dashboardLink = getDashboardLink();

  return (
    <header className="bg-light shadow-sm">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            SkillCraft
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/roadmaps">
                  Roadmaps
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/quizzes">
                  Quizzes
                </Link>
              </li>
            </ul>
            <div className="d-flex align-items-center">
              <button
                className="btn btn-outline-secondary me-2"
                onClick={toggleTheme}>
                {theme === "light" ? "🌙" : "☀️"}
              </button>
              {user ? (
                <>
                  {user.role === "User" && energy !== null && (
                    <li className="nav-item">
                      <span className="nav-link pe-none">
                        <span className="badge bg-primary">
                          ⚡ {energy} Energy
                        </span>
                      </span>
                    </li>
                  )}
                  <div className="dropdown">
                    <button
                      className="btn btn-primary dropdown-toggle"
                      type="button"
                      id="userMenuButton"
                      data-bs-toggle="dropdown"
                      aria-expanded="false">
                      Welcome, {user.firstName} {user.lastName}
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="userMenuButton">
                      {dashboardLink && (
                        <li>
                          <Link className="dropdown-item" to={dashboardLink}>
                            My Dashboard
                          </Link>
                        </li>
                      )}
                      {user.role === "User" && (
                        <li>
                          <Link className="dropdown-item" to="/profile">
                            My Profile
                          </Link>
                        </li>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-outline-primary me-2">
                    Login
                  </Link>
                  <Link to="/signup" className="btn btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
