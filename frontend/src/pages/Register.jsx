import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/Register.css";

function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      username: "",
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

      await API.post(
        "/auth/register",
        formData
      );

      alert(
        "Registration Successful"
      );

      navigate("/");

    } catch (error) {

      alert(
        error.response?.data
          ?.message ||
          "Registration Failed"
      );

    }

  };

  return (

    <div className="register-page">

      <div className="register-card">

        <div className="register-logo">
          📸 Snapzy
        </div>

        <p className="register-subtitle">
          Create your account and start sharing.
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <input
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            required
          />

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
            className="register-btn"
          >
            Create Account
          </button>

        </form>

        <div className="register-link">

          Already have an account?

          {" "}

          <Link to="/">
            Login
          </Link>

        </div>

      </div>

    </div>

  );
}

export default Register;