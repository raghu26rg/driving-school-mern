import React, { useState, useEffect } from "react";
import { getDashboardStats } from "../services/api";

const InstructorDashboard = ({ currentUser, attendanceList, students }) => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSessions: 0,
    present: 0,
    absent: 0
  });

  useEffect(() => {
    fetchStats();
  }, [attendanceList]);

  const fetchStats = async () => {
    try {
      const data = await getDashboardStats();
      const instructorAttendance = attendanceList.filter(a => a.instructorName === currentUser.name);
      const presentCount = instructorAttendance.filter(a => a.status === "Present").length;
      const absentCount = instructorAttendance.filter(a => a.status === "Absent").length;
      
      setStats({
        totalStudents: students.length,
        totalSessions: instructorAttendance.length,
        present: presentCount,
        absent: absentCount
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  // Get instructor's students from attendance
  const instructorAttendance = attendanceList.filter(a => a.instructorName === currentUser.name);
  const uniqueStudents = [...new Set(instructorAttendance.map(a => a.studentName))];
  const attendanceRate = instructorAttendance.length > 0 
    ? ((stats.present / instructorAttendance.length) * 100).toFixed(1)
    : 0;

  return (
    <div className="instructor-dashboard">
      <div className="welcome-section">
        <h2>👨‍🏫 Welcome, Instructor {currentUser.name}!</h2>
        <p>Manage your classes, students, and track attendance</p>
      </div>

      {/* Instructor Stats */}
      <div className="stats-grid">
        <div className="stat-card stat-blue">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h4>Total Students</h4>
            <p className="stat-value">{uniqueStudents.length}</p>
          </div>
        </div>

        <div className="stat-card stat-green">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <h4>Sessions Conducted</h4>
            <p className="stat-value">{stats.totalSessions}</p>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h4>Attendance Rate</h4>
            <p className="stat-value">{attendanceRate}%</p>
          </div>
        </div>

        <div className="stat-card stat-orange">
          <div className="stat-icon">⏰</div>
          <div className="stat-content">
            <h4>Classes Today</h4>
            <p className="stat-value">-</p>
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div className="class-summary">
        <h3>📚 Class Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <label>Present Today</label>
            <p className="value" style={{ color: "#4CAF50" }}>{stats.present}</p>
          </div>
          <div className="summary-card">
            <label>Absent Today</label>
            <p className="value" style={{ color: "#f44336" }}>{stats.absent}</p>
          </div>
          <div className="summary-card">
            <label>Total Classes</label>
            <p className="value">{stats.totalSessions}</p>
          </div>
          <div className="summary-card">
            <label>Average Attendance</label>
            <p className="value">{attendanceRate}%</p>
          </div>
        </div>
      </div>

      {/* Students List */}
      <div className="students-section">
        <h3>👨‍🎓 Your Students</h3>
        {uniqueStudents.length > 0 ? (
          <table className="table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Sessions</th>
                <th>Attendance %</th>
                <th>Last Session</th>
              </tr>
            </thead>
            <tbody>
              {uniqueStudents.map((student, idx) => {
                const studentSessions = instructorAttendance.filter(a => a.studentName === student);
                const studentPresent = studentSessions.filter(a => a.status === "Present").length;
                const studentAttRate = studentSessions.length > 0 
                  ? ((studentPresent / studentSessions.length) * 100).toFixed(0)
                  : 0;
                const lastSession = studentSessions[studentSessions.length - 1];

                return (
                  <tr key={idx}>
                    <td>{student}</td>
                    <td>{studentSessions.length}</td>
                    <td>
                      <span style={{ 
                        color: studentAttRate >= 80 ? '#4CAF50' : studentAttRate >= 60 ? '#ff9800' : '#f44336'
                      }}>
                        {studentAttRate}%
                      </span>
                    </td>
                    <td>{lastSession ? new Date(lastSession.date).toLocaleDateString() : '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "#999", textAlign: "center", padding: "20px" }}>
            No students assigned yet
          </p>
        )}
      </div>

      {/* Instructor Profile */}
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
            <span><strong>Instructor</strong></span>
          </div>
          <div className="info-item">
            <label>Students Under You:</label>
            <span>{uniqueStudents.length} active students</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;
