import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const { user, products: events, setProducts: setEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch events safely
  const fetchEvents = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${API}/events/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure res.data is always an array
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to fetch events. Please try again later.");
      setEvents([]); // fallback to empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    if (!user?.email) {
      alert("Please login to register!");
      return;
    }
    navigate("/register", { state: { event } });
  };

  const isAdmin = user?.email === "admin@eventtracker.com";

  if (loading) return <p>Loading events...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!Array.isArray(events) || events.length === 0) return <p>No events available.</p>;

  return (
    <div className="events-container">
      <h3>Welcome {user?.name || "Guest"}!</h3>

      {isAdmin && (
        <button className="add-event-btn" onClick={() => navigate("/create-event")}>
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

            <button className="register-btn" onClick={() => handleRegister(event)}>
              Register
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
