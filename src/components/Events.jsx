import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const { user, events, setEvents } = useContext(AppContext);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // ==========================
  // SAFE FETCH FUNCTION
  // ==========================
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = user?.token || localStorage.getItem("token");

      const res = await axios.get(`${API}/events/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Always convert backend response to array safely
      const safeEvents = Array.isArray(res.data) ? res.data : [];

      setEvents(safeEvents);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Unable to load events. Try again later.");
      setEvents([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  // Fetch on mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const isAdmin = user?.email === "admin@eventtracker.com";

  const handleRegister = (event) => {
    if (!user?.email) {
      alert("Please login first.");
      return;
    }

    navigate("/registration-form", { state: { event } });
  };

  // ==========================
  // SAFE UI CONDITIONS
  // ==========================
  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!Array.isArray(events) || events.length === 0)
    return (
      <div>
        {isAdmin && (
          <button
            className="add-event-btn"
            onClick={() => navigate("/create-event")}
          >
            + Add Event
          </button>
        )}
        <p>No events available.</p>
      </div>
    );

  // ==========================
  // MAIN UI
  // ==========================
  return (
    <div className="events-container">
      <h3>Welcome {user?.name || "Guest"}!</h3>

      {isAdmin && (
        <button
          className="add-event-btn"
          onClick={() => navigate("/create-event")}
        >
          + Add Event
        </button>
      )}

      <div className="events-list">
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <strong>{event.name || "Unnamed Event"}</strong>
            <p>📍 {event.venue || "Venue not specified"}</p>
            <p>📅 {event.date || "Date not specified"}</p>
            <p>🏆 Prize: {event.prize || "N/A"}</p>
            <p>💰 Registration: ₹{event.regAmount ?? "N/A"}</p>
            <p>👥 Max Team Size: {event.teamSize ?? "N/A"}</p>
            <p>📞 Organiser: {event.contact || "N/A"}</p>

            <button
              className="register-btn"
              onClick={() => handleRegister(event)}
            >
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
