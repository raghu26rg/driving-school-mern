import React, { useState } from "react";
import { updateRegistration } from "../services/api";

const EditRegistrationModal = ({ registration, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(registration);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await updateRegistration(registration._id, formData);
      alert(result.message);
      onSuccess();
      onClose();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Edit Registration</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <select
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
          >
            <option value="">Select Vehicle</option>
            <option value="Car">Car</option>
            <option value="Bike">Bike</option>
            <option value="Truck">Truck</option>
          </select>

          <div className="modal-buttons">
            <button type="submit" className="btn-save">Save Changes</button>
            <button type="button" onClick={onClose} className="btn-cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRegistrationModal;
