import React, { useState, useEffect } from "react";
import { getProfile, updateProfile, changePassword } from "../services/api";
import { useToast } from "./Toast";
import "../App.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";
const UserProfile = ({ currentUser }) => {
  const { toasts, showToast } = useToast();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [editData, setEditData] = useState({ name: "", email: "" });
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await getProfile(currentUser.id);
      if (result.success) {
        setProfile(result.data);
        setEditData({ name: result.data.name, email: result.data.email });
      } else {
        showToast(result.message || "Failed to load profile", "error");
      }
    } catch (error) {
      showToast("Error loading profile: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editData.name.trim() || !editData.email.trim()) {
      showToast("Name and email cannot be empty", "error");
      return;
    }

    try {
      const result = await updateProfile(currentUser.id, {
        name: editData.name,
        email: editData.email
      });

      if (result.success) {
        showToast("Profile updated successfully", "success");
        setProfile(result.data);
        setEditModalOpen(false);
      } else {
        showToast(result.message || "Failed to update profile", "error");
      }
    } catch (error) {
      showToast("Error updating profile: " + error.message, "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.oldPassword || !passwordData.newPassword) {
      showToast("Please fill in all password fields", "error");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      const result = await changePassword(currentUser.id, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        showToast("Password changed successfully", "success");
        setPasswordModalOpen(false);
        setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        showToast(result.message || "Failed to change password", "error");
      }
    } catch (error) {
      showToast("Error changing password: " + error.message, "error");
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="user-profile-container">
      <h2>My Profile</h2>

      {profile && (
        <div className="profile-info">
          <div className="profile-field">
            <label>Name:</label>
            <p>{profile.name}</p>
          </div>
          <div className="profile-field">
            <label>Email:</label>
            <p>{profile.email}</p>
          </div>
          <div className="profile-field">
            <label>Role:</label>
            <p>{profile.role}</p>
          </div>
          <div className="profile-field">
            <label>Member Since:</label>
            <p>{new Date(profile.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="profile-actions">
            <button
              className="btn btn-primary"
              onClick={() => setEditModalOpen(true)}
            >
              Edit Profile
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => setPasswordModalOpen(true)}
            >
              Change Password
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form id="edit-form" onSubmit={handleEditSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={editData.email}
              onChange={handleEditChange}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditModalOpen(false)} className="btn-cancel">
            Cancel
          </Button>
          <Button type="submit" form="edit-form" variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <form id="password-form" onSubmit={handlePasswordSubmit} className="space-y-4">
            <TextField
              fullWidth
              label="Current Password"
              name="oldPassword"
              type="password"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              fullWidth
              label="New Password"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <TextField
              fullWidth
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPasswordModalOpen(false)} className="btn-cancel">
            Cancel
          </Button>
          <Button type="submit" form="password-form" variant="contained" color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.type === "success" && "✓ "}
            {toast.type === "error" && "✗ "}
            {toast.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserProfile;
