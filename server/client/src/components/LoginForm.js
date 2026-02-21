import React, { useState } from "react";
import { login } from "../services/api";

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
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default LoginForm;
