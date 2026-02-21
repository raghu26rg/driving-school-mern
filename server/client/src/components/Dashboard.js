import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    registrations: 0,
    attendance: 0,
    courses: 0,
    instructors: 0,
    users: 0,
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
      console.log("Error fetching stats:", error);
    }
  };

  return (
    <>
      <h2>Dashboard Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>👥 Total Registrations</h3>
          <p className="stat-number">{stats.registrations}</p>
        </div>
        <div className="stat-card">
          <h3>✓ Attendance Records</h3>
          <p className="stat-number">{stats.attendance}</p>
        </div>
        <div className="stat-card">
          <h3>📚 Total Courses</h3>
          <p className="stat-number">{stats.courses}</p>
        </div>
        <div className="stat-card">
          <h3>👨‍🏫 Total Instructors</h3>
          <p className="stat-number">{stats.instructors}</p>
        </div>
        <div className="stat-card">
          <h3>👤 Total Users</h3>
          <p className="stat-number">{stats.users}</p>
        </div>
        <div className="stat-card present-card">
          <h3>✓ Present</h3>
          <p className="stat-number">{stats.present}</p>
        </div>
        <div className="stat-card absent-card">
          <h3>✗ Absent</h3>
          <p className="stat-number">{stats.absent}</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
