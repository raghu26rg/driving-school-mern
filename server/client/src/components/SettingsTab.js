import React, { useState, useEffect } from "react";
import { getUsers } from "../services/api";

const SettingsTab = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [settings, setSettings] = useState({
    schoolName: "Neha Motor Driving School",
    schoolPhone: "1234567890",
    schoolEmail: "contact@nehadrivingschool.com",
    address: "123 Motor Street, City",
    theme: "light"
  });
  const [editingSettings, setEditingSettings] = useState(false);

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
      loadSettings();
    }
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem("schoolSettings");
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  };

  const handleSettingChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const saveSettings = () => {
    localStorage.setItem("schoolSettings", JSON.stringify(settings));
    alert("Settings saved successfully!");
    setEditingSettings(false);
  };

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="settings-section">
        <div className="access-denied">
          <h3>🔒 Access Denied</h3>
          <p>Only administrators can access settings and user management.</p>
          <p>Your role: <strong>{currentUser?.role}</strong></p>
        </div>
      </div>
    );
  }

  return (
    <div className="settings-section">
      <h2>⚙️ Settings & Administration</h2>

      {/* School Settings */}
      <div className="settings-card">
        <h3>🏢 School Information</h3>
        
        {editingSettings ? (
          <div className="settings-form">
            <div className="form-group">
              <label>School Name</label>
              <input
                type="text"
                name="schoolName"
                value={settings.schoolName}
                onChange={handleSettingChange}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="text"
                name="schoolPhone"
                value={settings.schoolPhone}
                onChange={handleSettingChange}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="schoolEmail"
                value={settings.schoolEmail}
                onChange={handleSettingChange}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <textarea
                name="address"
                value={settings.address}
                onChange={handleSettingChange}
                rows="3"
              ></textarea>
            </div>
            <div className="button-group">
              <button onClick={saveSettings} className="btn-save">Save Changes</button>
              <button 
                onClick={() => setEditingSettings(false)} 
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="settings-display">
            <div className="setting-item">
              <label>School Name:</label>
              <span>{settings.schoolName}</span>
            </div>
            <div className="setting-item">
              <label>Phone:</label>
              <span>{settings.schoolPhone}</span>
            </div>
            <div className="setting-item">
              <label>Email:</label>
              <span>{settings.schoolEmail}</span>
            </div>
            <div className="setting-item">
              <label>Address:</label>
              <span>{settings.address}</span>
            </div>
            <button 
              onClick={() => setEditingSettings(true)} 
              className="btn-edit"
              style={{ marginTop: "15px" }}
            >
              Edit Settings
            </button>
          </div>
        )}
      </div>

      {/* User Management */}
      <div className="settings-card">
        <h3>👥 User Management</h3>
        <div className="users-list">
          <div className="user-stats">
            <div className="user-stat">
              <span>Total Users:</span>
              <strong>{users.length}</strong>
            </div>
            <div className="user-stat">
              <span>Admins:</span>
              <strong>{users.filter(u => u.role === "admin").length}</strong>
            </div>
            <div className="user-stat">
              <span>Instructors:</span>
              <strong>{users.filter(u => u.role === "instructor").length}</strong>
            </div>
            <div className="user-stat">
              <span>Students:</span>
              <strong>{users.filter(u => u.role === "student").length}</strong>
            </div>
          </div>

          <table className="table" style={{ marginTop: "20px" }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Application Settings */}
      <div className="settings-card">
        <h3>⚙️ Application Settings</h3>
        <div className="app-settings">
          <div className="setting-item">
            <label>Theme</label>
            <select 
              name="theme" 
              value={settings.theme}
              onChange={handleSettingChange}
              disabled={!editingSettings}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div className="setting-item">
            <label>Items Per Page</label>
            <input 
              type="number" 
              placeholder="5" 
              disabled
              className="setting-input"
            />
          </div>
          <div className="setting-item">
            <label>Auto-save Interval</label>
            <input 
              type="number" 
              placeholder="30 seconds"
              disabled
              className="setting-input"
            />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="settings-card">
        <h3>ℹ️ System Information</h3>
        <div className="system-info">
          <div className="info-item">
            <span>Application Version:</span>
            <strong>1.0.0-Pro</strong>
          </div>
          <div className="info-item">
            <span>Last Updated:</span>
            <strong>{new Date().toLocaleDateString()}</strong>
          </div>
          <div className="info-item">
            <span>Database Status:</span>
            <strong style={{ color: "#4CAF50" }}>Connected ✓</strong>
          </div>
          <div className="info-item">
            <span>Current User:</span>
            <strong>{currentUser.name}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;
