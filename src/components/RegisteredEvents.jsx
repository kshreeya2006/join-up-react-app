import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import axios from "axios";
import "./RegisteredEvents.css";

export default function RegisteredEvents() {
  const [registrations, setRegistrations] = useState([]);
  const { user } = useContext(AppContext);
  const API = import.meta.env.VITE_API_URL;

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${API}/registrations/${user.email}`); // matches backend
      setRegistrations(res.data);
    } catch (error) {
      console.error("Error fetching registrations:", error);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchRegistrations();
    }
  }, [user]);

  return (
    <div className="reg-events-container">
      <h3>My Registered Events</h3>

      {registrations.length > 0 ? (
        <ol>
          {registrations.map((reg) => (
            <li key={reg._id} className="reg-event-card">
              <h4>{reg.eventId?.name}</h4>
              <p><strong>Event Date:</strong> {reg.eventId?.date}</p>
              <p><strong>Venue:</strong> {reg.eventId?.venue}</p>
              <p><strong>Prize:</strong> {reg.eventId?.prize}</p>
              <p><strong>Contact:</strong> {reg.eventId?.contact || "N/A"}</p>

              <p><strong>Your Phone:</strong> {reg.phone}</p>
              <p><strong>Team Size:</strong> {reg.teamSize}</p>

              {reg.teamMembers?.length > 0 && (
                <div>
                  <strong>Team Members:</strong>
                  <ul>
                    {reg.teamMembers.map((m, idx) => (
                      <li key={idx}>{m}</li>
                    ))}
                  </ul>
                </div>
              )}

              <p><strong>Registered On:</strong> {new Date(reg.registeredOn).toLocaleString()}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p>You haven't registered for any events yet.</p>
      )}
    </div>
  );
}
