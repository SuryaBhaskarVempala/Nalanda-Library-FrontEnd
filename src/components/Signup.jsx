import React, { useContext, useState } from "react";
import "../styles/Signup.css";
import axios from "axios";
import { StoreContext } from "../context/Store";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { setUser } = useContext(StoreContext);

  const validate = () => {
    let newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = "Name must contain only letters and spaces";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const signupCall = async (setUser) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/signup`, formData);
      console.log(response);
      setUser(response.data.user);
      alert("🎉 Signup Successful!");
      console.log(response.data.token);
      localStorage.setItem("token", response.data.token);

      if (response.data.user.role == 'Admin') {
        window.location.href = "/admin-home";
      }
      else {
        window.location.href = "/";
      }
    }
    catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        alert("Server not responding. Try again later.");
      } else {
        alert(error.message);
      }
    }

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      signupCall(setUser);
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>


          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>


          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="button"
            disabled={!formData.name || !formData.email || !formData.password}
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
