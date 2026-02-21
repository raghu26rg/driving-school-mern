import React, { useState, useEffect } from "react";
import { getAttendanceByStudent, getDashboardStats } from "../services/api";

const StudentDashboard = ({ currentUser, attendanceList }) => {
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalAttendance: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    fetchStats();
  }, [attendanceList]);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Get student's own attendance
  const studentAttendance = attendanceList.filter(a => a.studentName === currentUser.name);
  const studentPresent = studentAttendance.filter(a => a.status === "Present").length;
  const studentAbsent = studentAttendance.filter(a => a.status === "Absent").length;
  const attendanceRate = studentAttendance.length > 0 
    ? ((studentPresent / studentAttendance.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="student-dashboard">
      <div className="welcome-section">
        <h2>👋 Welcome, {currentUser.name}!</h2>
        <p>Here's your learning progress and attendance overview</p>
      </div>

      {/* Student Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h4>Available Courses</h4>
            <p className="stat-value">{stats.totalCourses}</p>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h4>Total Present</h4>
            <p className="stat-value">{studentPresent}</p>
          </div>
        </div>

        <div className="stat-card stat-red">
          <div className="stat-icon">✗</div>
          <div className="stat-content">
            <h4>Total Absent</h4>
            <p className="stat-value">{studentAbsent}</p>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Attendance Rate</h4>
            <p className="stat-value">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="attendance-summary">
        <h3>📝 Recent Attendance</h3>
        {studentAttendance.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Instructor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {studentAttendance.slice(-5).reverse().map((att, idx) => (
                <tr key={idx}>
                  <td>{att.instructorName}</td>
                  <td>{new Date(att.date).toLocaleDateString()}</td>
                  <td>{att.time}</td>
                  <td>
                    <span className={`status-badge status-${att.status.toLowerCase()}`}>
                      {att.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
            No attendance records yet
          </p>
        )}
      </div>

      {/* Profile Card */}
      <div className="profile-card">
        <h3>👤 Your Profile</h3>
        <div className="profile-info">
          <div className="info-item">
            <label>Name:</label>
            <span>{currentUser.name}</span>
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{currentUser.email}</span>
          </div>
          <div className="info-item">
            <label>Role:</label>
            <span><strong>Student</strong></span>
          </div>
          <div className="info-item">
            <label>Class Sessions:</label>
            <span>{studentAttendance.length} sessions completed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
