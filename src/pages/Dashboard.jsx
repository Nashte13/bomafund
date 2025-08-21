import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./dashboard.css";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour > 12 && hour < 19) return "Good afternoon";
  return "Good evening";
};

const getEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour > 12) return "⛅";
  return "🌙";
};

function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Reusable fetch function
  const fetchGroups = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.id}/groups`
      );
      setGroups(response.data.groups);
      localStorage.setItem("groups", JSON.stringify(response.data.groups));
    } catch (error) {
      console.error("❌ Error fetching groups:", error);
    }
  }, [user]);

  // ✅ Fetch groups when Dashboard mounts or user changes
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, user]);

  // ✅ Re-fetch groups whenever user navigates back to /dashboard
  useEffect(() => {
    if (location.pathname === "/dashboard") {
      fetchGroups();
    }
  }, [location, fetchGroups]);

  return (
    <div className="dashboard-container">
      {/* Greeting */}
      <h1>
        {getGreeting()} {user.fullName} {getEmoji()}
      </h1>

      {/* ✅ Top Navbar (Desktop/Tablet) */}
      <nav className="dashboard-nav desktop-nav">
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/faq">FAQ</NavLink>
        <NavLink to="/notifications">Notifications</NavLink>
        <NavLink to="/profile" className="profile-link">
          Profile
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="nav-profile-pic"
          />
        </NavLink>
      </nav>

      {/* ✅ Hamburger Button (Mobile only) */}
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* ✅ Sidebar (Mobile only) */}
      <div className={`mobile-sidebar ${menuOpen ? "open" : ""}`}>
        <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
        <NavLink to="/faq" onClick={() => setMenuOpen(false)}>FAQ</NavLink>
        <NavLink to="/notifications" onClick={() => setMenuOpen(false)}>Notifications</NavLink>
        <NavLink
          to="/profile"
          className="profile-link"
          onClick={() => setMenuOpen(false)}
        >
          Profile
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="nav-profile-pic"
          />
        </NavLink>
      </div>

      {/* Overlay to close sidebar */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* ✅ Dashboard Content */}
      <div className="dashboard-content">
        <div>
          <h2>Your groups</h2>
          {groups.length === 0 ? (
            <p>You are not part of any group yet.</p>
          ) : (
            groups.map((group) => (
              <div key={group.id} className="group-overview">
                <h3>{group.name}</h3>
                <button onClick={() => navigate(`/group/${group.id}`)}>
                  View Group
                </button>
              </div>
            ))
          )}
        </div>

        <div className="create-group">
          <h2>Create a New Group</h2>
          <button onClick={() => navigate("/create-group")}>+ New Group</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
