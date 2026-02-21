import React, { useState } from "react";
import { createCourse } from "../services/api";

const CourseForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    courseName: "",
    duration: "",
    price: "",
    description: "",
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
      const result = await createCourse(formData);
      alert(result.message);
      setFormData({
        courseName: "",
        duration: "",
        price: "",
        description: "",
        vehicle: ""
      });
      onSuccess();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <h2>Add New Course</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="courseName"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="duration"
          placeholder="Duration (e.g., 30 days)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
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
        <button type="submit">Add Course</button>
      </form>
    </>
  );
};

export default CourseForm;
