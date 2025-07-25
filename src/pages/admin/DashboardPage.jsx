import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";

const DashboardPage = () => {
  return (
    <div className="container py-5">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row">
        <div className="col-md-6 mb-4">
          <Card>
            <h5 className="card-title">User Management</h5>
            <p className="card-text">
              Add, edit, or remove users and manage their roles.
            </p>
            <Link to="/admin/users" className="btn btn-primary">
              Manage Users
            </Link>
          </Card>
        </div>
        <div className="col-md-6 mb-4">
          <Card>
            <h5 className="card-title">Content Management</h5>
            <p className="card-text">
              As an admin, you can also manage all roadmaps.
            </p>
            <Link to="/editor/dashboard" className="btn btn-secondary">
              Manage Content
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
