import React, { useState } from "react";
import { deleteAttendance, updateAttendance } from "../services/api";

const AttendanceList = ({ attendanceList, onRefresh, isStudentView = false, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (attendance) => {
    setEditingId(attendance._id);
    setEditData(attendance);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateAttendance(editingId, editData);
      alert("Attendance updated successfully");
      setEditingId(null);
      onRefresh();
    } catch (error) {
      alert("Error updating attendance");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this record?")) {
      try {
        await deleteAttendance(id);
        alert("Attendance deleted");
        onRefresh();
      } catch (error) {
        alert("Error deleting record");
      }
    }
  };

  const totalPages = Math.ceil(attendanceList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAttendance = attendanceList.slice(startIndex, endIndex);

  if (attendanceList.length === 0) {
    return <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>
      {isStudentView ? "No attendance records yet" : "No attendance records"}
    </p>;
  }

  return (
    <>
      <h2>{isStudentView ? "Your Attendance" : "Attendance Records"}</h2>
      <table className="registrations-table">
        <thead>
          <tr>
            {!isStudentView && <th>Student Name</th>}
            <th>Instructor</th>
            <th>Date</th>
            <th>Time</th>
            <th>Status</th>
            {!isStudentView && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentAttendance.map((att) => (
            <tr key={att._id}>
              {!isStudentView && <td>{att.studentName}</td>}
              <td>{att.instructorName}</td>
              <td>{new Date(att.date).toLocaleDateString()}</td>
              <td>{att.time}</td>
              <td className={att.status === "Present" ? "present" : "absent"}>
                <span className={`status-badge status-${att.status.toLowerCase()}`}>
                  {att.status}
                </span>
              </td>
              {!isStudentView && (
                <td className="action-buttons">
                  <button className="btn-edit" onClick={() => handleEdit(att)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(att._id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {!isStudentView && editingId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Attendance</h2>
              <button
                className="close-btn"
                onClick={() => setEditingId(null)}
              >
                ×
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }}>
              <input
                type="text"
                name="studentName"
                value={editData.studentName}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="instructorName"
                value={editData.instructorName}
                onChange={handleEditChange}
              />
              <input
                type="date"
                name="date"
                value={editData.date?.split("T")[0]}
                onChange={handleEditChange}
              />
              <input
                type="time"
                name="time"
                value={editData.time}
                onChange={handleEditChange}
              />
              <select name="status" value={editData.status} onChange={handleEditChange}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">Save</button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="btn-cancel"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceList;
