import React, { useState } from "react";

const ReportsTab = ({ registrations, attendanceList, courses, instructors }) => {
  const [reportType, setReportType] = useState("registrations");
  const [filterText, setFilterText] = useState("");

  const exportToCSV = (data, filename, headers) => {
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    let csv = headers.join(",") + "\n";
    
    data.forEach(item => {
      const row = headers.map(header => {
        let value = item[header] || "";
        if (value instanceof Date) {
          value = value.toLocaleDateString();
        }
        if (typeof value === "string" && value.includes(",")) {
          value = `"${value}"`;
        }
        return value;
      });
      csv += row.join(",") + "\n";
    });

    const element = document.createElement("a");
    element.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(csv));
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateRegistrationReport = () => {
    const headers = ["name", "phone", "vehicle", "date"];
    exportToCSV(registrations, "registrations_report.csv", headers);
  };

  const generateAttendanceReport = () => {
    const headers = ["studentName", "instructorName", "date", "time", "status"];
    exportToCSV(attendanceList, "attendance_report.csv", headers);
  };

  const generateCoursesReport = () => {
    const headers = ["courseName", "vehicle", "duration", "price", "description"];
    exportToCSV(courses, "courses_report.csv", headers);
  };

  const generateInstructorsReport = () => {
    const headers = ["name", "email", "phone", "vehicle", "experience"];
    exportToCSV(instructors, "instructors_report.csv", headers);
  };

  const generateDetailedReport = () => {
    const totalReg = registrations.length;
    const totalAtt = attendanceList.length;
    const presentCount = attendanceList.filter(a => a.status === "Present").length;
    const absentCount = attendanceList.filter(a => a.status === "Absent").length;
    const attendanceRate = totalAtt > 0 ? ((presentCount / totalAtt) * 100).toFixed(2) : 0;

    let report = `NEHA MOTOR DRIVING SCHOOL - DETAILED REPORT\n`;
    report += `Generated: ${new Date().toLocaleString()}\n\n`;
    report += `==================== SUMMARY ====================\n`;
    report += `Total Registrations: ${totalReg}\n`;
    report += `Total Attendance Records: ${totalAtt}\n`;
    report += `Present Count: ${presentCount}\n`;
    report += `Absent Count: ${absentCount}\n`;
    report += `Attendance Rate: ${attendanceRate}%\n`;
    report += `Total Courses: ${courses.length}\n`;
    report += `Total Instructors: ${instructors.length}\n\n`;

    report += `==================== REGISTRATION BREAKDOWN ====================\n`;
    const vehicleBreakdown = {};
    registrations.forEach(reg => {
      vehicleBreakdown[reg.vehicle] = (vehicleBreakdown[reg.vehicle] || 0) + 1;
    });
    Object.entries(vehicleBreakdown).forEach(([vehicle, count]) => {
      report += `${vehicle}: ${count} students\n`;
    });

    report += `\n==================== COURSE DETAILS ====================\n`;
    courses.forEach(course => {
      report += `${course.courseName} (${course.vehicle}) - ₹${course.price} for ${course.duration}\n`;
    });

    report += `\n==================== INSTRUCTOR LIST ====================\n`;
    instructors.forEach(inst => {
      report += `${inst.name} - ${inst.email} - ${inst.phone} (${inst.vehicle})\n`;
    });

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(report)
    );
    element.setAttribute("download", "detailed_report.txt");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="reports-section">
      <h3>Reports & Data Export</h3>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Generate and export reports in CSV format for data analysis and record-keeping
      </p>

      <div className="reports-grid">
        <div className="report-card">
          <h4>📋 Registrations Report</h4>
          <p>Export all student registrations</p>
          <button
            onClick={generateRegistrationReport}
            className="btn-export"
            style={{ marginTop: "10px" }}
          >
            Download CSV ({registrations.length} records)
          </button>
        </div>

        <div className="report-card">
          <h4>✓ Attendance Report</h4>
          <p>Export attendance records</p>
          <button
            onClick={generateAttendanceReport}
            className="btn-export"
            style={{ marginTop: "10px" }}
          >
            Download CSV ({attendanceList.length} records)
          </button>
        </div>

        <div className="report-card">
          <h4>📚 Courses Report</h4>
          <p>Export course details</p>
          <button
            onClick={generateCoursesReport}
            className="btn-export"
            style={{ marginTop: "10px" }}
          >
            Download CSV ({courses.length} records)
          </button>
        </div>

        <div className="report-card">
          <h4>👨‍🏫 Instructors Report</h4>
          <p>Export instructor information</p>
          <button
            onClick={generateInstructorsReport}
            className="btn-export"
            style={{ marginTop: "10px" }}
          >
            Download CSV ({instructors.length} records)
          </button>
        </div>

        <div className="report-card" style={{ gridColumn: "1 / -1" }}>
          <h4>📊 Comprehensive Report</h4>
          <p>Generate a detailed summary report with breakdown by vehicle type and overall statistics</p>
          <button
            onClick={generateDetailedReport}
            className="btn-export"
            style={{ marginTop: "10px", backgroundColor: "#667eea" }}
          >
            Generate Detailed Report
          </button>
        </div>
      </div>

      <div className="report-info">
        <h4 style={{ marginTop: "30px" }}>Available Metrics</h4>
        <ul style={{ lineHeight: "1.8", color: "#555" }}>
          <li>✓ Total registrations by vehicle type</li>
          <li>✓ Attendance statistics (present/absent)</li>
          <li>✓ Course pricing and duration details</li>
          <li>✓ Instructor contact and specialization</li>
          <li>✓ Payment records and status</li>
          <li>✓ Student performance tracking</li>
        </ul>
      </div>
    </div>
  );
};

export default ReportsTab;
