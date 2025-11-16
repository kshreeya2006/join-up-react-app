import React, { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./CreateEvent.css";

export default function CreateEvent() {
  const { user } = useContext(AppContext);
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  // redirect if not admin
  if (!user || user.email !== "admin@gmail.com") {
    return <h2>You are not authorized to create events.</h2>;
  }

  // form states
  const [form, setForm] = useState({
    eid: "",
    name: "",
    date: "",
    venue: "",
    prize: "",
    regAmount: "",
    teamSize: "",
    lastDate: "",
    organiserContact: "",
  });

  const updateField = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitEvent = async () => {
    try {
      const res = await axios.post(`${API}/events/new`, form);
      alert("Event Created Successfully!");
      navigate("/events");
    } catch (error) {
      console.error("Event creation failed:", error);
      alert("Failed to create event");
    }
  };

  return (
    <div className="event-create-container">
      <h2>Create New Event</h2>

      <div className="event-form">
        <label>Event ID (optional):</label>
        <input type="number" name="eid" value={form.eid} onChange={updateField} />

        <label>Event Name:</label>
        <input type="text" name="name" value={form.name} onChange={updateField} />

        <label>Date:</label>
        <input type="date" name="date" value={form.date} onChange={updateField} />

        <label>Venue:</label>
        <input type="text" name="venue" value={form.venue} onChange={updateField} />

        <label>Prize:</label>
        <input type="text" name="prize" value={form.prize} onChange={updateField} />

        <label>Registration Amount (₹):</label>
        <input
          type="number"
          name="regAmount"
          value={form.regAmount}
          onChange={updateField}
        />

        <label>Team Size:</label>
        <input
          type="number"
          name="teamSize"
          value={form.teamSize}
          onChange={updateField}
        />

        <label>Last Date to Register:</label>
        <input
          type="date"
          name="lastDate"
          value={form.lastDate}
          onChange={updateField}
        />

        <label>Organiser Contact No:</label>
        <input
          type="text"
          name="organiserContact"
          value={form.organiserContact}
          onChange={updateField}
          placeholder="Enter phone number"
        />

        <button className="create-btn" onClick={submitEvent}>
          Create Event
        </button>
      </div>
    </div>
  );
}
