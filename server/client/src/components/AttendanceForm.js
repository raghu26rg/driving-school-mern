import React, { useState } from "react";
import { markAttendance } from "../services/api";

const AttendanceForm = ({ onSuccess }) => {
  const [attendanceData, setAttendanceData] = useState({
    studentName: "",
    instructorName: "",
    date: "",
    time: "",
    status: "Present"
  });

  const handleChange = (e) => {
    setAttendanceData({
      ...attendanceData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await markAttendance(attendanceData);
      alert(result);
      setAttendanceData({
        studentName: "",
        instructorName: "",
        date: "",
        time: "",
        status: "Present"
      });
      onSuccess();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <h2>Mark Attendance</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="studentName"
          placeholder="Student Name"
          onChange={handleChange}
          value={attendanceData.studentName}
          required
        />
        <input
          type="text"
          name="instructorName"
          placeholder="Instructor Name"
          onChange={handleChange}
          value={attendanceData.instructorName}
          required
        />
        <input
          type="date"
          name="date"
          onChange={handleChange}
          value={attendanceData.date}
          required
        />
        <input
          type="time"
          name="time"
          onChange={handleChange}
          value={attendanceData.time}
          required
        />
        <select
          name="status"
          onChange={handleChange}
          value={attendanceData.status}
        >
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
        </select>
        <button type="submit">Mark Attendance</button>
      </form>
    </>
  );
};

export default AttendanceForm;
