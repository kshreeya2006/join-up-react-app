import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./RegisterForm.css";

export default function RegistrationForm() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const event = state?.event;
  const API = import.meta.env.VITE_API_URL;

  const [phone, setPhone] = useState("");
  const [teamSize, setTeamSize] = useState(event?.teamSize || 1);
  const [teamMembers, setTeamMembers] = useState([]);

  const addMember = () => {
    if (teamMembers.length < (teamSize - 1)) {
      setTeamMembers([...teamMembers, ""]);
    }
  };

  const updateMember = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  const handleSubmit = async () => {
    if (!user) return alert("Please login first!");
    if (!event) return alert("No event selected!");
    if (!phone.trim()) return alert("Phone number is required!");

    try {
      await axios.post(`${API}/registrations/new`, {
        userEmail: user.email,
        eventId: event._id,
        phone,
        teamSize,
        teamMembers,
      });
      alert("Registration successful!");
      navigate("/events");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed!");
    }
  };

  if (!user) return <p>Please log in to register.</p>;
  if (!event) return <p>No event selected.</p>;

  return (
    <div className="reg-container">
      <h2>Register for {event.name}</h2>
      <label>Phone Number:</label>
      <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone" />

      <label>Team Size (max {event.teamSize}):</label>
      <input type="number" min="1" max={event.teamSize} value={teamSize} onChange={(e) => { setTeamSize(Number(e.target.value)); setTeamMembers([]); }} />

      <h4>Team Members (excluding you):</h4>
      {teamMembers.map((member, idx) => (
        <input key={idx} type="text" value={member} placeholder={`Member ${idx + 2}`} onChange={(e) => updateMember(idx, e.target.value)} />
      ))}

      {teamMembers.length < (teamSize - 1) && <button onClick={addMember}>Add Team Member</button>}
      <br />
      <button onClick={handleSubmit}>Submit Registration</button>
    </div>
  );
}
