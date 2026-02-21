import React, { useState } from "react";
import { deleteInstructor, updateInstructor } from "../services/api";

const InstructorList = ({ instructors, onRefresh, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const handleEdit = (instructor) => {
    setEditingId(instructor._id);
    setEditData(instructor);
  };

  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveEdit = async () => {
    try {
      await updateInstructor(editingId, editData);
      alert("Instructor updated successfully");
      setEditingId(null);
      onRefresh();
    } catch (error) {
      alert("Error updating instructor");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this instructor?")) {
      try {
        await deleteInstructor(id);
        alert("Instructor deleted");
        onRefresh();
      } catch (error) {
        alert("Error deleting instructor");
      }
    }
  };

  const totalPages = Math.ceil(instructors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInstructors = instructors.slice(startIndex, endIndex);

  if (instructors.length === 0) {
    return <p>No instructors yet</p>;
  }

  return (
    <>
      <h2>All Instructors</h2>
      <table className="registrations-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Experience</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentInstructors.map((instructor) => (
            <tr key={instructor._id}>
              <td>{instructor.name}</td>
              <td>{instructor.email}</td>
              <td>{instructor.phone}</td>
              <td>{instructor.vehicle}</td>
              <td>{instructor.experience}</td>
              <td className="action-buttons">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(instructor)}
                >
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(instructor._id)}
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
              <h2>Edit Instructor</h2>
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
                name="name"
                value={editData.name}
                onChange={handleEditChange}
              />
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleEditChange}
              />
              <select name="vehicle" value={editData.vehicle} onChange={handleEditChange}>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
              </select>
              <input
                type="text"
                name="experience"
                value={editData.experience}
                onChange={handleEditChange}
              />
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

export default InstructorList;
