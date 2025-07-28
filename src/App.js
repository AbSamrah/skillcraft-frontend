import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import PrivateRoute from "./components/common/PrivateRoute";
import useAuth from "./hooks/useAuth";

// Import Pages
import QuizzesPage from "./pages/QuizzesPage";
import TakeQuizPage from "./pages/user/TakeQuizPage"; // Import the new page
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoadmapsListPage from "./pages/RoadmapsListPage";
import RoadmapPage from "./pages/user/RoadmapPage";
import ProfilePage from "./pages/user/ProfilePage";

// Role-specific pages
import AdminDashboard from "./pages/admin/DashboardPage";
import UserManagement from "./pages/admin/UserManagementPage";
import EditorDashboard from "./pages/editor/ContentDashboardPage";
import RoadmapEditor from "./pages/editor/RoadmapEditorPage";
import LearnerDashboard from "./pages/user/LearnerDashboardPage";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
        <Header />
        <main className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/roadmaps" element={<RoadmapsListPage />} />
            <Route path="/roadmaps/:id" element={<RoadmapPage />} />
            <Route path="/quizzes" element={<QuizzesPage />} />

            {/* Add the new route for taking a specific quiz */}
            <Route
              path="/quizzes/:id"
              element={
                <PrivateRoute>
                  <TakeQuizPage />
                </PrivateRoute>
              }
            />

            {/* Main dashboard route that redirects based on role */}
            <Route
              path="/dashboard"
              element={
                !user ? (
                  <Navigate to="/login" />
                ) : user.role === "Admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : user.role === "Editor" ? (
                  <Navigate to="/editor/dashboard" />
                ) : (
                  <LearnerDashboard />
                )
              }
            />
            {/* User Routes */}
            <Route
              element={
                <PrivateRoute allowedRoles={["User", "Admin", "Editor"]} />
              }>
              <Route path="/learner-dashboard" element={<LearnerDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={["Admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
            </Route>
            {/* Editor Routes */}
            <Route
              element={<PrivateRoute allowedRoles={["Editor", "Admin"]} />}>
              <Route path="/editor/dashboard" element={<EditorDashboard />} />
              <Route path="/editor/roadmaps/new" element={<RoadmapEditor />} />
              <Route
                path="/editor/roadmaps/edit/:id"
                element={<RoadmapEditor />}
              />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
