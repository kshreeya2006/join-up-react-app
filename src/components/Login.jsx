import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API = import.meta.env.VITE_API_URL;

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [msg, setMsg] = useState("");
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();


  const handleSubmit = async () => {
  try {
    const res = await axios.post(`${API}/users/login`, credentials);

    if (!res.data || res.data.message === "Invalid user or password") {
      setMsg("Invalid email or password.");
      return;
    }

    setUser({
      name: res.data.name,
      email: res.data.email,
      token: "1", 
    });

    setMsg("Welcome " + res.data.name);
    navigate("/");
  } catch (err) {
    console.error("Login error:", err);
    setMsg("Server error. Try again later.");
  }
};


  const goToRegister = () => navigate("/register");

  const isError = msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("error");

  return (
    <div className="login-container">
      <h3>Login</h3>
      {msg && (
        <p className={isError ? "login-msg-error" : "login-msg-success"}>
          {msg}
        </p>
      )}
      <p>
        <input
          className="login-input"
          type="email"
          placeholder="Email address"
          value={credentials.email}
          onChange={(e) =>
            setCredentials({ ...credentials, email: e.target.value })
          }
        />
      </p>
      <p>
        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) =>
            setCredentials({ ...credentials, password: e.target.value })
          }
        />
      </p>
      <button className="login-button" onClick={handleSubmit}>
        Submit
      </button>
      <button className="login-button-alt" onClick={goToRegister}>
        Create Account
      </button>
    </div>
  );
}
