import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const PrivateRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  // If the authentication state is still loading, don't render anything yet.
  // This prevents a flicker on page refresh.
  if (loading) {
    return null; // Or you could return a loading spinner component
  }

  // If the user is not authenticated, redirect them to the login page.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If the route requires specific roles and the user's role is not in the list,
  // redirect them to their default dashboard.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If all checks pass, render the child route's component using <Outlet />.
  return <Outlet />;
};

export default PrivateRoute;
