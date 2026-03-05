import React, { useState } from "react";
import { signup } from "../services/api";
import { TextField, Button, Typography, Box, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const SignupForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student"
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
      const result = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.role
      );
      alert(result.message);
      setFormData({ name: "", email: "", password: "", role: "student" });
      onSuccess(result.user);
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Box className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h5" component="h2" className="mb-4 text-center">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
              required
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="instructor">Instructor</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </>
  );
};

export default SignupForm;
