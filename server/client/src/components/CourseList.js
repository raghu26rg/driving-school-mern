import React, { useState } from "react";
import { deleteCourse, updateCourse } from "../services/api";

const CourseList = ({ courses, onRefresh, isStudentView = false, isInstructorView = false, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (course) => {
    setEditingId(course._id);
    setEditData(course);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateCourse(editingId, editData);
      alert("Course updated successfully");
      setEditingId(null);
      onRefresh();
    } catch (error) {
      alert("Error updating course");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this course?")) {
      try {
        await deleteCourse(id);
        alert("Course deleted");
        onRefresh();
      } catch (error) {
        alert("Error deleting course");
      }
    }
  };

  const totalPages = Math.ceil(courses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCourses = courses.slice(startIndex, endIndex);

  if (courses.length === 0) {
    return <p>No courses available</p>;
  }

  // Student/Instructor View - Card Display
  if (isStudentView || isInstructorView) {
    return (
      <div className="course-view">
        <h3>📚 Available Courses</h3>
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course._id} className="course-card">
              <div className="course-header">
                <h4>{course.courseName}</h4>
                <span className="price">₹{course.price}</span>
              </div>
              <div className="course-details">
                <div className="detail-row">
                  <span className="label">🚗 Vehicle:</span>
                  <span className="value">{course.vehicle}</span>
                </div>
                <div className="detail-row">
                  <span className="label">⏱️ Duration:</span>
                  <span className="value">{course.duration}</span>
                </div>
                <div className="detail-row">
                  <span className="label">📝 Description:</span>
                  <span className="value">{course.description || "No description"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Admin View - Full Management
  return (
    <>
      <h2>📚 All Courses</h2>
      <table className="registrations-table">
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Vehicle</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCourses.map((course) => (
            <tr key={course._id}>
              <td>{course.courseName}</td>
              <td>{course.vehicle}</td>
              <td>{course.duration}</td>
              <td>₹{course.price}</td>
              <td>{course.description}</td>
              <td className="action-buttons">
                <button className="btn-edit" onClick={() => handleEdit(course)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(course._id)}
                >
                  Delete
                </button>
              </td>
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

      {editingId && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Course</h2>
              <button className="close-btn" onClick={() => setEditingId(null)}>
                ×
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveEdit();
              }}
            >
              <input
                type="text"
                name="courseName"
                value={editData.courseName}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="duration"
                value={editData.duration}
                onChange={handleEditChange}
              />
              <input
                type="number"
                name="price"
                value={editData.price}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="description"
                value={editData.description}
                onChange={handleEditChange}
              />
              <select name="vehicle" value={editData.vehicle} onChange={handleEditChange}>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
              </select>
              <div className="modal-buttons">
                <button type="submit" className="btn-save">
                  Save
                </button>
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

export default CourseList;
