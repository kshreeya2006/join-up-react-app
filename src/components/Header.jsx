import React, { useContext } from "react";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import "./Header.css";

export default function Header() {
  const { user } = useContext(AppContext);

  const isAdmin = user?.email === "admin@gmail.com";

  return (
    <header>
      <h1>Event Tracker App</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/events">Events</Link>
        <Link to="/registered-events">Registered Events</Link>

        {isAdmin && <Link to="/create-event">+ Add Event</Link>}

        {user?.token === "1" ? (
          <Link to="/logout">Logout</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <hr />
    </header>
  );
}
