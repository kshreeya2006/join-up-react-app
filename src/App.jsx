import { useState, createContext } from "react";
import "./App.css";
import Events from "./components/Events";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import Header from "./components/Header";
import Footer from "./components/Footer";
import RegisteredEvents from "./components/RegisteredEvents";
import CreateEvent from "./components/CreateEvent";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export const AppContext = createContext();

function App() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [events, setEvents] = useState([]);

  return (
    <AppContext.Provider
      value={{ 
        users, setUsers, 
        user, setUser, 
        events, setEvents 
      }}
    >
      <BrowserRouter>
        <Header />
        <Routes>
          <Route index element={<Events />} />
          <Route path="/" element={<Events />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/registered-events" element={<RegisteredEvents />} />
          <Route path="/registration-form" element={<RegistrationForm />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AppContext.Provider>
  );
}

export default App;
