import React, { useState } from "react";
import { login } from "../services/api";
import { TextField, Button, Typography, Box } from "@mui/material";

const LoginForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
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
      const result = await login(formData.email, formData.password);
      if (result.message === "Login Successful") {
        alert("Login Successful!");
        localStorage.setItem("user", JSON.stringify(result.user));
        setFormData({ email: "", password: "" });
        onSuccess(result.user);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <>
      <Box className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <Typography variant="h5" component="h2" className="mb-4 text-center">
          Login
        </Typography>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            Login
          </Button>
        </form>
      </Box>
    </>
  );
};

export default LoginForm;
