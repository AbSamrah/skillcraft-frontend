import React, { useState, useEffect } from "react";
import Button from "../../components/ui/Button";
import { getAllUsers, deleteUser, updateUser } from "../../api/users";
import { getAllRoles } from "../../api/roles";

const EditUserModal = ({ show, handleClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({ role: "" });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    if (show && user) {
      const fetchRoles = async () => {
        const availableRoles = await getAllRoles();
        setRoles(availableRoles);
      };
      fetchRoles();
      setFormData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      });
    }
  }, [user, show]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData.id, formData);
      onUserUpdated();
      handleClose();
    } catch (error) {
      console.error("Failed to update user:", error);
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
            <h5 className="modal-title">
              Edit User: {user.firstName} {user.lastName}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.email}
                  disabled
                />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">
                  Role
                </label>
                <select
                  className="form-select"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
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

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error("Failed to delete user:", error);
        alert("Could not delete user.");
      }
    }
  };

  const handleUserUpdated = () => {
    fetchUsers();
  };

  if (loading) return <p className="text-center mt-5">Loading users...</p>;

  return (
    <>
      <div className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>User Management</h1>
          <Button variant="primary">Add User</Button>
        </div>
        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          user.role === "Admin"
                            ? "danger"
                            : user.role === "Editor"
                            ? "warning"
                            : "secondary"
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="outline-primary"
                        size="sm"
                        className="me-2">
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(user.id)}
                        variant="outline-danger"
                        size="sm">
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <EditUserModal
        show={showEditModal}
        handleClose={() => setShowEditModal(false)}
        user={editingUser}
        onUserUpdated={handleUserUpdated}
      />
    </>
  );
};

export default UserManagementPage;
