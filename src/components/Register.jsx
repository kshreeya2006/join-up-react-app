import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const API = import.meta.env.VITE_API_URL;

export default function Register() {
  const { setUser } = useContext(AppContext);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      setMsg("Error: All fields are required.");
      return;
    }

    try {
      const res = await axios.post(`${API}/users/register`, newUser);
      setMsg("Registered successfully!");
      setUser(res.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      setMsg("Error: Could not register. Try again.");
    }
  };

  const isError = msg.toLowerCase().includes("error") || msg.toLowerCase().includes("fail");

  return (
    <div className="register-container">
      <h3>Register</h3>
      {msg && (
        <p className={isError ? "register-msg-error" : "register-msg-success"}>
          {msg}
        </p>
      )}

      <input
        className="register-input"
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />

      <input
        className="register-input"
        type="email"
        placeholder="Email address"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />

      <input
        className="register-input"
        type="password"
        placeholder="Password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />

      <input
        className="register-input"
        type="text"
        placeholder="Department"
        value={newUser.department}
        onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
      />

      <button className="register-button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
