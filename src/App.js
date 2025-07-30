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
import TakeQuizPage from "./pages/user/TakeQuizPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import RoadmapsListPage from "./pages/RoadmapsListPage";
import RoadmapPage from "./pages/user/RoadmapPage";
import ProfilePage from "./pages/user/ProfilePage";
import AdminDashboard from "./pages/admin/DashboardPage";
import UserManagement from "./pages/admin/UserManagementPage";
import EditorDashboard from "./pages/editor/ContentDashboardPage";
import RoadmapEditor from "./pages/editor/RoadmapEditorPage";
// A new component to handle the main dashboard redirection logic
const DashboardRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // Or a loading spinner

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "Admin":
      return <Navigate to="/admin/dashboard" replace />;
    case "Editor":
      return <Navigate to="/editor/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

function App() {
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

            {/* Main dashboard redirect */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* Protected Routes */}
            <Route
              path="/quizzes/:id"
              element={
                <PrivateRoute>
                  <TakeQuizPage />
                </PrivateRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <PrivateRoute allowedRoles={["User", "Admin", "Editor"]}>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <PrivateRoute allowedRoles={["Admin"]}>
                  <UserManagement />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor/dashboard"
              element={
                <PrivateRoute allowedRoles={["Editor", "Admin"]}>
                  <EditorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor/roadmaps/new"
              element={
                <PrivateRoute allowedRoles={["Editor", "Admin"]}>
                  <RoadmapEditor />
                </PrivateRoute>
              }
            />
            <Route
              path="/editor/roadmaps/edit/:id"
              element={
                <PrivateRoute allowedRoles={["Editor", "Admin"]}>
                  <RoadmapEditor />
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
