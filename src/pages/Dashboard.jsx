import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import "./dashboard.css";
import { useNavigate, NavLink, useLocation } from "react-router-dom";

const APP_NAME = "BomaFund";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour >= 12 && hour < 19) return "Good afternoon";
  return "Good evening";
};

const getEmoji = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour >= 12 && hour < 19) return "⛅";
  return "🌙";
};

function Dashboard({ user }) {
  const [groups, setGroups] = useState([]);
  const [query, setQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Fetch groups
  const fetchGroups = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/users/${user.id}/groups`
      );
      setGroups(response.data.groups || []);
      localStorage.setItem("groups", JSON.stringify(response.data.groups || []));
    } catch (error) {
      console.error("❌ Error fetching groups:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups, user]);

  useEffect(() => {
    if (location.pathname === "/dashboard") {
      fetchGroups();
    }
  }, [location, fetchGroups]);

  const filtered = groups.filter((g) =>
    (g.name || "").toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <div className="dashboard-wrap">
      {/* Brand strip */}
      <div className="brand-bar">
        <img
          src="/logo/funding.png"
          alt="App Logo"
          className="brand-logo"
        />
        <span className="brand-name">{APP_NAME}</span>
      </div>

      {/* Sticky Navbar (desktop/tablet) */}
      <nav className="dashboard-nav">
        <div className="nav-left">
          <NavLink to="/dashboard" end>Home</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/notifications">Notifications</NavLink>
          <NavLink to="/settings">Settings</NavLink>
        </div>

        <button
          className="nav-avatar-btn"
          onClick={() => navigate("/profile")}
          aria-label="Open Profile"
          title="Profile"
        >
          <img
            src="/default-avatar.png"
            alt="Profile"
            className="nav-profile-pic"
          />
        </button>
      </nav>

      {/* === Mobile Hamburger + Sidebar === */}
      <button
        className={`menu-button ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle menu"
      >
        <span className="hamburger"></span>
      </button>

      <div className={`mobile-sidebar ${sidebarOpen ? "open" : ""}`}>
        <NavLink to="/dashboard" end onClick={() => setSidebarOpen(false)}>Home</NavLink>
        <NavLink to="/about" onClick={() => setSidebarOpen(false)}>About</NavLink>
        <NavLink to="/faq" onClick={() => setSidebarOpen(false)}>FAQ</NavLink>
        <NavLink to="/notifications" onClick={() => setSidebarOpen(false)}>Notifications</NavLink>
        <NavLink to="/settings" onClick={() => setSidebarOpen(false)}>Settings</NavLink>
        <NavLink to="/profile" onClick={() => setSidebarOpen(false)}>Profile</NavLink>
      </div>

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Content container */}
      <main className="dashboard-container">
        <header className="dash-header fade-in-up">
          <div className="greeting">
            <h1>
              {getGreeting()} {user?.fullName} {getEmoji()}
            </h1>
            <p className="subtle">Here’s a quick snapshot of your contribution groups.</p>
          </div>

          <div className="header-actions">
            <div className="searchbar">
              <span className="material-symbols-outlined">search</span>
              <input
                type="text"
                placeholder="Search your groups…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              className="primary-btn"
              onClick={() => navigate("/create-group")}
            >
              <span className="material-symbols-outlined">add</span>
              Create Group
            </button>
          </div>
        </header>

        {/* Groups */}
        <section className="groups-section">
          <div className="section-title fade-in-up">
            <h2>Groups you are in</h2>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state fade-in-up">
              <div className="empty-emoji">🫶</div>
              <h3>No groups found</h3>
              <p>Got a contribution group and want to manage it? Create a Group.</p>
              <button
                className="primary-btn"
                onClick={() => navigate("/create-group")}
              >
                <span className="material-symbols-outlined">group_add</span>
                Create a Group
              </button>
            </div>
          ) : (
            <div className="groups-grid">
              {filtered.map((group, idx) => (
                <article
                  key={group.id}
                  className="group-card"
                  style={{ animationDelay: `${0.06 * (idx + 1)}s` }}
                >
                  <div className="group-card-top">
                    <div className="group-avatar">
                      {group.profilePicture ? (
                        <img src={group.profilePicture} alt={`${group.name} logo`} />
                      ) : (
                        <span>{(group.name || "G").trim().charAt(0).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="group-title">
                      <h3 title={group.name}>{group.name}</h3>
                      <p className="muted">{group.motto ? group.motto : "No motto set"}</p>
                    </div>
                  </div>

                  <div className="group-card-actions">
                    <button className="ghost-btn" onClick={() => navigate(`/group/${group.id}`)}>
                      <span className="material-symbols-outlined">visibility</span> View
                    </button>
                    <button className="ghost-btn" onClick={() => navigate(`/group/${group.id}/info`)}>
                      <span className="material-symbols-outlined">info</span> Info
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
