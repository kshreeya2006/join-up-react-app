import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../App";
import axios from "axios";
import "./RegisteredEvents.css";

export default function RegisteredEvents() {
  const [registrations, setRegistrations] = useState([]);
  const { user } = useContext(AppContext);
  const API = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRegs = async () => {
      if (!user?.email) return;
      try {
        const res = await axios.get(`${API}/registrations/user/${user.email}`);
        setRegistrations(res.data || []);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setRegistrations([]);
      }
    };
    fetchRegs();
  }, [user]);

  if (!user) return <p>Please login to see your registrations.</p>;

  if (!registrations || registrations.length === 0) return <p>You haven't registered for any events yet.</p>;

  return (
    <div className="reg-events-container">
      <h3>My Registered Events</h3>
      <ol>
        {registrations.map((reg) => (
          <li key={reg._id} className="reg-event-card">
            <h4>{reg.eventName || "Unknown Event"}</h4>
            <p><strong>Event ID:</strong> {reg.eventId}</p>
            <p><strong>Your Phone:</strong> {reg.phone}</p>
            <p><strong>Team Size:</strong> {reg.teamSize}</p>
            {reg.teamMembers?.length > 0 && (
              <ul>{reg.teamMembers.map((m, idx) => <li key={idx}>{m}</li>)}</ul>
            )}
            <p><strong>Registered On:</strong> {new Date(reg.registeredOn).toLocaleString()}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
