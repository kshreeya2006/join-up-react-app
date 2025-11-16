import React, { useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Events.css";

export default function Events() {
  const { user, products: events, setProducts: setEvents } = useContext(AppContext);  
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const fetchEvents = async () => {
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await axios.get(`${API}/events/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleRegister = (event) => {
    navigate("/register", { state: { event } });
  };

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <div className="events-container">
      <h3>Welcome {user?.name || "Guest"}!</h3>
      <h4>Events List</h4>

      {isAdmin && (
        <button
          className="add-event-btn"
          onClick={() => navigate("/create-event")}
        >
          + Add Event
        </button>
      )}

      {events.length > 0 ? (
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

              <button
                className="register-btn"
                onClick={() => handleRegister(event)}
              >
                Register
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="error-message">No events available.</p>
      )}
    </div>
  );
}
