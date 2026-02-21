import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api";

const EnhancedDashboard = ({ registrations, attendanceList, courses, instructors }) => {
  const [stats, setStats] = useState({
    totalRegistrations: 0,
    totalAttendance: 0,
    totalCourses: 0,
    totalInstructors: 0,
    totalUsers: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Calculate additional metrics
  const attendanceRate = stats.totalAttendance > 0 
    ? ((stats.present / stats.totalAttendance) * 100).toFixed(1)
    : 0;

  const vehicleBreakdown = {};
  registrations.forEach(reg => {
    vehicleBreakdown[reg.vehicle] = (vehicleBreakdown[reg.vehicle] || 0) + 1;
  });

  const courseRevenue = courses.reduce((sum, course) => sum + (course.price || 0), 0);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Real-time school management analytics</p>
      </div>

      {/* Main Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h4>Total Students</h4>
            <p className="stat-value">{stats.totalRegistrations}</p>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h4>Present Today</h4>
            <p className="stat-value">{stats.present}</p>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">✗</div>
          <div className="stat-content">
            <h4>Absent Today</h4>
            <p className="stat-value">{stats.absent}</p>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h4>Courses</h4>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-icon">👨‍🏫</div>
          <div className="stat-content">
            <h4>Instructors</h4>
            <p className="stat-value">{stats.totalInstructors}</p>
          </div>
        </div>

        <div className="stat-card stat-cyan">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h4>Attendance %</h4>
            <p className="stat-value">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Row 1 */}
      <div className="metrics-row">
        <div className="metric-card">
          <h3>Vehicle Type Breakdown</h3>
          <div className="breakdown-list">
            {Object.entries(vehicleBreakdown).map(([vehicle, count]) => (
              <div key={vehicle} className="breakdown-item">
                <span>{vehicle}</span>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${(count / stats.totalRegistrations) * 100}%`,
                      backgroundColor: ['#667eea', '#764ba2', '#f093fb'][Object.keys(vehicleBreakdown).indexOf(vehicle) % 3]
                    }}
                  ></div>
                </div>
                <span className="count">{count} students</span>
              </div>
            ))}
          </div>
        </div>

        <div className="metric-card">
          <h3>📈 Financial Overview</h3>
          <div className="financial-stats">
            <div className="financial-item">
              <label>Total Course Revenue:</label>
              <p className="financial-value">₹{courseRevenue.toLocaleString()}</p>
            </div>
            <div className="financial-item">
              <label>Average Course Price:</label>
              <p className="financial-value">
                ₹{courses.length > 0 ? (courseRevenue / courses.length).toFixed(0) : 0}
              </p>
            </div>
            <div className="financial-item">
              <label>Course Count:</label>
              <p className="financial-value">{courses.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Trend */}
      <div className="metric-card" style={{ marginTop: "20px" }}>
        <h3>📊 Attendance Statistics</h3>
        <div className="stats-box">
          <div className="stat-row">
            <span>Total Attendance Records:</span>
            <strong>{stats.totalAttendance}</strong>
          </div>
          <div className="stat-row">
            <span>Present Count:</span>
            <strong style={{ color: "#4CAF50" }}>{stats.present}</strong>
          </div>
          <div className="stat-row">
            <span>Absent Count:</span>
            <strong style={{ color: "#f44336" }}>{stats.absent}</strong>
          </div>
          <div className="stat-row">
            <span>Attendance Rate:</span>
            <strong style={{ color: "#2196F3" }}>{attendanceRate}%</strong>
          </div>
        </div>
      </div>

      {/* Recent Activity Summary */}
      <div className="activity-section">
        <h3>📋 Quick Summary</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="label">Active Students</span>
            <span className="value">{stats.totalRegistrations}</span>
          </div>
          <div className="summary-item">
            <span className="label">Available Courses</span>
            <span className="value">{stats.totalCourses}</span>
          </div>
          <div className="summary-item">
            <span className="label">Teaching Staff</span>
            <span className="value">{stats.totalInstructors}</span>
          </div>
          <div className="summary-item">
            <span className="label">System Users</span>
            <span className="value">{stats.totalUsers}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDashboard;
