import React, { useEffect, useContext } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Logout.css";

export default function Logout() {
  const { setUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    setUser({ token: "0" }); 
    navigate("/login");
  }, [setUser, navigate]);

  return <div className="logout-container">Logging out...</div>;
}
