import React, { useEffect, useContext, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const { user, products: events, setProducts: setEvents } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${API}/events/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    if (!user) {
      alert("Please login to register!");
      return;
    }
    navigate("/register", { state: { event } });
  };

  const isAdmin = user?.email === "admin@eventtracker.com";

  if (loading) return <p>Loading events...</p>;
  if (!events || events.length === 0) return <p>No events available.</p>;

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
            <strong>{event.name}</strong>
            <p>📍 {event.venue}</p>
            <p>📅 {event.date}</p>
            <p>🏆 Prize: {event.prize}</p>
            <p>💰 Registration: ₹{event.regAmount}</p>
            <p>👥 Max Team Size: {event.teamSize}</p>
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
