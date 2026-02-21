import React, { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const AnalyticsDashboard = ({ registrations, attendance, payments, courses }) => {
  // Prepare attendance trend data (group by date)
  const attendanceTrendData = useMemo(() => {
    const grouped = {};
    attendance.forEach(a => {
      const date = new Date(a.date).toLocaleDateString();
      if (!grouped[date]) {
        grouped[date] = { date, total: 0, present: 0, absent: 0 };
      }
      grouped[date].total += 1;
      if (a.status === "Present") grouped[date].present += 1;
      if (a.status === "Absent") grouped[date].absent += 1;
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(-30);
  }, [attendance]);

  // Prepare vehicle distribution data
  const vehicleData = useMemo(() => {
    const grouped = {};
    registrations.forEach(r => {
      grouped[r.vehicle] = (grouped[r.vehicle] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [registrations]);

  // Prepare payment status data
  const paymentStatusData = useMemo(() => {
    const grouped = {};
    payments.forEach(p => {
      grouped[p.paymentStatus] = (grouped[p.paymentStatus] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [payments]);

  // Prepare course popularity data
  const courseData = useMemo(() => {
    const courseEnrollments = {};
    registrations.forEach(r => {
      courseEnrollments["All Courses"] = (courseEnrollments["All Courses"] || 0) + 1;
    });
    courses.forEach(c => {
      courseEnrollments[c.courseName] = (courseEnrollments[c.courseName] || 0) + 1;
    });
    return Object.entries(courseEnrollments).map(([name, value]) => ({ name, value }));
  }, [registrations, courses]);

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  return (
    <div className="analytics-dashboard">
      <h2>📊 Analytics Dashboard</h2>

      <div className="charts-grid">
        {/* Attendance Trend Chart */}
        <div className="chart-container">
          <h3>Attendance Trend (Last 30 Days)</h3>
          {attendanceTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={attendanceTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="present" stroke="#10B981" strokeWidth={2} name="Present" />
                <Line type="monotone" dataKey="absent" stroke="#EF4444" strokeWidth={2} name="Absent" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No attendance data available</p>
          )}
        </div>

        {/* Vehicle Distribution Chart */}
        <div className="chart-container">
          <h3>Registration by Vehicle Type</h3>
          {vehicleData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No registration data available</p>
          )}
        </div>

        {/* Payment Status Chart */}
        <div className="chart-container">
          <h3>Payment Status Distribution</h3>
          {paymentStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No payment data available</p>
          )}
        </div>

        {/* Course Popularity Chart */}
        <div className="chart-container">
          <h3>Course Popularity</h3>
          {courseData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={courseData}
                margin={{ top: 20, right: 30, left: 0, bottom: 100 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p>No course data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
