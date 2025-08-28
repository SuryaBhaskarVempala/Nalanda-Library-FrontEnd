import React, { useContext, useState } from "react";
import "../styles/Login.css";
import { StoreContext } from "../context/Store";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { setUser } = useContext(StoreContext);

  const [errors, setErrors] = useState({});

  const validate = () => {
    let newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
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

  const loginCall = async (setUser) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        formData
      );

      console.log(response);
      setUser(response.data.user);
      alert("🎉 Login Successful!");
      localStorage.setItem("token", response.data.token);

      if (response.data.user.role === "Admin") {
        window.location.href = "/admin-home";
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message || "Something went wrong!");
      } else if (error.request) {
        alert("Server not responding. Try again later.");
      } else {
        alert(error.message);
      }
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      loginCall(setUser);
    }
    else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
       
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={formData.email}
              onChange={handleChange}
              autoComplete="off"
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
              autoComplete="new-password"
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="button"
            disabled={!formData.email || !formData.password}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
