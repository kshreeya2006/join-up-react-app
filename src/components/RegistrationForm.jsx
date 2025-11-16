import React, { useState, useContext } from "react";
import { AppContext } from "../App";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RegisterForm.css"; // create a CSS file later

export default function RegistrationForm() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // event data sent through navigation state
  const { state } = useLocation();
  const event = state?.event;

  // form state
  const [phone, setPhone] = useState("");
  const [teamSize, setTeamSize] = useState(event?.teamSize || 1);
  const [teamMembers, setTeamMembers] = useState([]);

  // Add team member field
  const addMember = () => {
    if (teamMembers.length < teamSize - 1) {
      setTeamMembers([...teamMembers, ""]);
    }
  };

  // Update specific team member name
  const updateMember = (index, value) => {
    const updated = [...teamMembers];
    updated[index] = value;
    setTeamMembers(updated);
  };

  // Submit registration
  const handleSubmit = async () => {
    if (!phone.trim()) {
      alert("Phone number is required");
      return;
    }

    try {
      const url = `${API}/registrations/new`;

      await axios.post(url, {
        userEmail: user.email,
        eventId: event._id,
        phone,
        teamSize,
        teamMembers,
      });

      alert("Registration Successful!");
      navigate("/events");
    } catch (error) {
      console.error("Registration failed:", error);
      alert("Registration failed!");
    }
  };

  if (!user) return <h2>Please log in to register.</h2>;
  if (!event) return <h2>No event selected.</h2>;

  return (
    <div className="reg-container">
      <h2>Register for {event.name}</h2>

      <label>Phone Number:</label>
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter your phone number"
      />

      <label>Team Size (max {event.teamSize}):</label>
      <input
        type="number"
        min="1"
        max={event.teamSize}
        value={teamSize}
        onChange={(e) => {
          setTeamSize(Number(e.target.value));
          setTeamMembers([]); // reset when size changed
        }}
      />

      <h4>Team Members (excluding you):</h4>
      {teamMembers.map((member, index) => (
        <input
          key={index}
          type="text"
          value={member}
          onChange={(e) => updateMember(index, e.target.value)}
          placeholder={`Member ${index + 2} Name`}
        />
      ))}

      {teamMembers.length < teamSize - 1 && (
        <button onClick={addMember}>Add Team Member</button>
      )}

      <br />
      <button className="submit-btn" onClick={handleSubmit}>
        Submit Registration
      </button>
    </div>
  );
}
