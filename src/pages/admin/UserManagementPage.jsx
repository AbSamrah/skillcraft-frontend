import React, { useState, useEffect, useCallback } from "react";
import Button from "../../components/ui/Button";
import { getAllUsers, deleteUser, updateUser, addUser } from "../../api/users";
import { getAllRoles } from "../../api/roles";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

// --- Add User Modal Component ---
const AddUserModal = ({ show, handleClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "User",
  });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show) {
      const fetchRoles = async () => {
        try {
          const availableRoles = await getAllRoles();
          setRoles(availableRoles);
        } catch (err) {
          console.error("Failed to fetch roles:", err);
        }
      };
      fetchRoles();
      // Reset form when modal opens
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "User",
      });
      setError("");
    }
  }, [show]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await addUser(formData);
      onUserAdded(); // Refresh the user list
      handleClose(); // Close the modal
      MySwal.fire("Success!", "User has been created successfully.", "success");
    } catch (err) {
      setError(err.message || "Failed to create user.");
    } finally {
      setLoading(false);
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
            <h5 className="modal-title">Add New User</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  minLength="8"
                  onChange={handleChange}
                  required
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Adding..." : "Add User"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Edit User Modal Component ---
const EditUserModal = ({ show, handleClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({});
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && user) {
      const fetchRoles = async () => {
        try {
          const availableRoles = await getAllRoles();
          setRoles(availableRoles);
        } catch (err) {
          console.error("Failed to fetch roles:", err);
        }
      };
      fetchRoles();
      setFormData({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
      setError("");
    }
  }, [user, show]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await updateUser(formData.id, formData);
      onUserUpdated();
      handleClose();
      MySwal.fire("Success!", "User has been updated successfully.", "success");
    } catch (err) {
      setError(err.message || "Failed to update user.");
    } finally {
      setLoading(false);
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
              {error && <div className="alert alert-danger">{error}</div>}
              <div className="mb-3">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  value={formData.firstName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  value={formData.lastName || ""}
                  onChange={handleChange}
                  required
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
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleEdit = (user) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleDelete = (userId, userEmail) => {
    MySwal.fire({
      title: "Are you sure?",
      text: `You are about to delete the user: ${userEmail}. You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(userId)
          .then(() => {
            fetchUsers();
            MySwal.fire("Deleted!", "The user has been deleted.", "success");
          })
          .catch((error) => {
            console.error("Failed to delete user:", error);
            MySwal.fire("Error!", "Failed to delete the user.", "error");
          });
      }
    });
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
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            Add User
          </Button>
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
                        onClick={() => handleDelete(user.id, user.email)}
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
      <AddUserModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        onUserAdded={fetchUsers}
      />
    </>
  );
};

export default UserManagementPage;
