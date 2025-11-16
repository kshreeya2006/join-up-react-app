import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const { user, products: events, setProducts: setEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fetch events from backend
  const fetchEvents = async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${API}/events/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setErrorMsg("Failed to fetch events. Please try again later.");
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [user]); // refetch if user changes

  // Handle registration click
  const handleRegister = (event) => {
    if (!user?.email) {
      alert("Please login to register!");
      return;
    }
    navigate("/register", { state: { event } });
  };

  // Admin check
  const isAdmin = user?.email === "admin@eventtracker.com";

  if (loading) return <p>Loading events...</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (!Array.isArray(events) || events.length === 0) return <p>No events available.</p>;

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
            <p>📍 {event.venue || "N/A"}</p>
            <p>📅 {event.date || "TBD"}</p>
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
