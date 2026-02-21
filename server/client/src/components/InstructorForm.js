import React, { useState } from "react";
import { createInstructor } from "../services/api";

const InstructorForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    vehicle: "",
    experience: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createInstructor(formData);
      alert(result.message);
      setFormData({
        name: "",
        email: "",
        phone: "",
        vehicle: "",
        experience: ""
      });
      onSuccess();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <h2>Add New Instructor</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Instructor Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
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
        <input
          type="text"
          name="experience"
          placeholder="Experience (e.g., 5 years)"
          value={formData.experience}
          onChange={handleChange}
        />
        <button type="submit">Add Instructor</button>
      </form>
    </>
  );
};

export default InstructorForm;
