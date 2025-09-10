import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GroupSidebar from "../components/GroupSidebar";
import "./groupHome.css";

function GroupHome() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/groups/${groupId}`
        );
        setGroup(response.data?.group ?? null);
      } catch (error) {
        console.error(
          "❌ Error fetching group details:",
          error.response?.data || error.message
        );
        setGroup(null);
      }
    };

    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Currency formatter (KES)
  const formatKES = (amount) =>
    new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
    }).format(amount || 0);

  // Loading state
  if (!group) {
    return (
      <div className="group-home-layout">
        <div className="loader-wrap">
          <div className="loader-card">
            <div className="loader-spinner" />
            <h2 className="loader-title">Loading group...</h2>
            <div className="pulsing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback initial
  const initial = group?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  // Stats
  const membersCount = group?.members?.length ?? 0;
  const contributionsAmount =
    typeof group?.totalContributions === "number"
      ? group.totalContributions
      : group?.contributionsAmount ?? 0;

  return (
    <div className="group-home-layout">
      {/* Sidebar */}
      <GroupSidebar
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        groupName={group.name}
      />

      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          className={`mobile-hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      )}

      {/* Main Content */}
      <main className="group-home-container">
        {/* Header */}
        <div className="group-info-card group-header fade-in-up">
          <div className="card-strip" aria-hidden="true" />

          <div className="group-meta">
            <h1 className="group-title">
              Welcome to <span className="group-name">{group.name}</span>
            </h1>
            <p className="muted-line">
              <strong>Motto:</strong> {group.motto || "No motto set"}
            </p>
            <p className="muted-line">
              <strong>Mission:</strong> {group.mission || "No mission set"}
            </p>

            <div className="header-cta">
              <button
                className="ghost-btn"
                onClick={() => navigate(`/group/${groupId}/info`)}
              >
                <span className="material-symbols-outlined">info</span>
                Group Info
              </button>
              <button
                className="primary-btn"
                onClick={() => navigate(`/group/${groupId}/contributions`)}
              >
                <span className="material-symbols-outlined">payments</span>
                View Contributions
              </button>
            </div>
          </div>

          {/* Logo / fallback */}
          {group.profilePicture ? (
            <img
              src={group.profilePicture}
              alt={`${group.name} logo`}
              className="group-logo animated-logo"
            />
          ) : (
            <div
              className="group-logo-fallback animated-logo"
              aria-label="Group logo"
            >
              {initial}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="group-overview-section">
          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/members`)}
            role="button"
            tabIndex={0}
          >
            <div className="overview-icon">
              <span className="material-symbols-outlined">groups</span>
            </div>
            <h3>Members</h3>
            <p className="stat-number">{membersCount}</p>
            <p className="stat-muted">Tap to view Members</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/contributions`)}
            role="button"
            tabIndex={0}
          >
            <div className="overview-icon">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <h3>Contributions</h3>
            <p className="stat-number">{formatKES(contributionsAmount)}</p>
            <p className="stat-muted">Overview of funds</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/projects`)}
            role="button"
            tabIndex={0}
          >
            <div className="overview-icon">
              <span className="material-symbols-outlined">folder</span>
            </div>
            <h3>Projects</h3>
            <p className="stat-number">{group.projects?.length ?? 0}</p>
            <p className="stat-muted">Track group projects</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/communications`)}
            role="button"
            tabIndex={0}
          >
            <div className="overview-icon">
              <span className="material-symbols-outlined">chat</span>
            </div>
            <h3>Messages</h3>
            <p className="stat-number">{group.unreadMessages ?? 0}</p>
            <p className="stat-muted">Open chat & announcements</p>
          </div>
        </div>

        {/* Footer CTA + Footer */}
        <div className="more-actions">
          <button className="ghost-btn" onClick={() => navigate("/dashboard")}>
            <span className="material-symbols-outlined">dashboard</span>
            Back to Dashboard
          </button>
        </div>

        <footer className="group-home-footer">
          <p>© {new Date().getFullYear()} BomaFund. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

export default GroupHome;
