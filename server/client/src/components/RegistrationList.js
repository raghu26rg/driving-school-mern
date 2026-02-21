import React, { useState } from "react";
import { deleteRegistration, getRegistrations } from "../services/api";
import EditRegistrationModal from "./EditRegistrationModal";

const RegistrationList = ({ registrations, onRefresh, itemsPerPage = 5 }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("");
  const [editingRegistration, setEditingRegistration] = useState(null);
  const [filteredData, setFilteredData] = useState(registrations);

  // Filter registrations
  const handleSearch = (value) => {
    setSearchTerm(value);
    filterRegistrations(value, vehicleFilter);
  };

  const handleVehicleFilter = (value) => {
    setVehicleFilter(value);
    filterRegistrations(searchTerm, value);
  };

  const filterRegistrations = (search, vehicle) => {
    let filtered = registrations;

    if (search) {
      filtered = filtered.filter(
        (reg) =>
          reg.name.toLowerCase().includes(search.toLowerCase()) ||
          reg.phone.includes(search)
      );
    }

    if (vehicle) {
      filtered = filtered.filter((reg) => reg.vehicle === vehicle);
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this registration?")) {
      try {
        await deleteRegistration(id);
        alert("Registration deleted successfully");
        onRefresh();
      } catch (error) {
        alert("Error deleting registration");
      }
    }
  };

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRegistrations = filteredData.slice(startIndex, endIndex);

  if (registrations.length === 0) {
    return <p>No registrations yet</p>;
  }

  return (
    <>
      <h2>All Registrations</h2>

      {/* Search and Filter */}
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
        />
        <select
          value={vehicleFilter}
          onChange={(e) => handleVehicleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Vehicles</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>
      </div>

      {/* Table */}
      <table className="registrations-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Vehicle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRegistrations.length > 0 ? (
            currentRegistrations.map((reg) => (
              <tr key={reg._id}>
                <td>{reg.name}</td>
                <td>{reg.phone}</td>
                <td>{reg.vehicle}</td>
                <td className="action-buttons">
                  <button
                    className="btn-edit"
                    onClick={() => setEditingRegistration(reg)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(reg._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No registrations found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingRegistration && (
        <EditRegistrationModal
          registration={editingRegistration}
          onClose={() => setEditingRegistration(null)}
          onSuccess={onRefresh}
        />
      )}
    </>
  );
};

export default RegistrationList;
