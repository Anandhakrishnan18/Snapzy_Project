import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const res =
        await API.post(
          "/auth/login",
          formData
        );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      navigate("/home");

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Login Failed"
      );

    }
  };

  return (

    <div className="login-page">

      <div className="login-card">

        <div className="login-logo">
          📸 Snapzy
        </div>

        <p className="login-subtitle">
          Share Moments. Connect People.
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="login-btn"
          >
            Sign In
          </button>

        </form>

        <div className="auth-link">

          Don't have an account?

          {" "}

          <Link to="/register">
            Register
          </Link>

        </div>

      </div>

    </div>

  );
}

export default Login;