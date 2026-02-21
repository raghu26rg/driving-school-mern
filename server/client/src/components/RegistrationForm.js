import React, { useState } from "react";
import { registerStudent } from "../services/api";

const RegistrationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    vehicle: ""
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
      const result = await registerStudent(formData);
      alert(result);
      setFormData({ name: "", phone: "", vehicle: "" });
      onSuccess();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <h2>Student Registration</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={handleChange}
          value={formData.name}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Enter phone number"
          onChange={handleChange}
          value={formData.phone}
          required
        />
        <select
          name="vehicle"
          onChange={handleChange}
          value={formData.vehicle}
          required
        >
          <option value="">Select Vehicle</option>
          <option value="Car">Car</option>
          <option value="Bike">Bike</option>
          <option value="Truck">Truck</option>
        </select>
        <button type="submit">Register Now</button>
      </form>
    </>
  );
};

export default RegistrationForm;
