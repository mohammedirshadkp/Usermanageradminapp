import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate input fields
  const validateForm = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Enter a valid email";
    }
    if (!password.trim()) {
      errors.password = "Password is required";
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    try {
      const { data } = await axios.post("http://localhost:3000/api/auth/login", {
        email,
        password,
      });
  
      if (data.success) {
        toast.success("Login successful!");
        sessionStorage.setItem("authToken", data.token);
        fetchUserDetails(data.token);
  
        setTimeout(() => {
          navigate("/");  // Adding delay to ensure sessionStorage update
        }, 500);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  // Fetch user details
  const fetchUserDetails = async (token) => {
    try {
      const { data } = await axios.get("http://localhost:3000/api/auth/get-userDetails", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        console.log("Fetching user details...");
        
        // Add lastLoginTime update logic here
        const updatedUser = { ...data.user, lastLoginTime: new Date().toISOString() };
        
        // Set updated user data with lastLoginTime in sessionStorage
        sessionStorage.setItem("userData", JSON.stringify({ isLoggedIn: true, userData: updatedUser }));
        
        // Optionally send the updated user back to the server (if you want to persist the lastLoginTime in the database)
        await axios.post("http://localhost:3000/api/auth/update-user", { 
          token,
          lastLoginTime: updatedUser.lastLoginTime,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <button type="submit" className="login-btn">Login</button>
      </form>

      <p style={{ textAlign: "center" }}>
        Don't have an account?{" "}
        <Link to="/signup" className="toggle-link">
          Sign Up
        </Link>
      </p>
    </div>
  );
};

export default Login;
