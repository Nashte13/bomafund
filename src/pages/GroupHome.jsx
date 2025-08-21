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
        setGroup(response.data.group);
      } catch (error) {
        console.error(
          "❌ Error fetching group details:",
          error.response?.data || error.message
        );
      }
    };
    fetchGroup();
  }, [groupId]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!group) {
    return <p className="loading">Loading group details...</p>;
  }

  // First letter fallback for logo
  const initial = group?.name?.trim()?.charAt(0)?.toUpperCase() || "G";

  return (
    <div className="group-home-layout">
      {/* ✅ Sidebar controlled from here */}
      <GroupSidebar
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        groupName={group.name}
      />

      {/* ✅ Mobile Hamburger Button */}
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

      {/* ✅ Main Content */}
      <main className="group-home-container">
        {/* Header block with details left, logo right (mobile stacks) */}
        <div className="group-info-card group-header">
          <div className="group-meta">
            <h1>Welcome to {group.name}</h1>
            <p>
              <strong>Motto:</strong> {group.motto || "No motto set"}
            </p>
            <p>
              <strong>Mission:</strong> {group.mission || "No mission set"}
            </p>
          </div>

          {/* Logo or fallback initial */}
          {group.profilePicture ? (
            <img
              src={group.profilePicture}
              alt={`${group.name} logo`}
              className="group-logo"
            />
          ) : (
            <div className="group-logo-fallback" aria-label="Group logo">
              {initial}
            </div>
          )}
        </div>

        {/* Quick Stats Overview */}
        <div className="group-overview-section">
          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/members`)}
          >
            <h3>👥 Members</h3>
            <p>{group.members?.length || 0}</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/contributions`)}
          >
            <h3>💰 Contributions</h3>
            <p>KES 0</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/projects`)}
          >
            <h3>📂 Projects</h3>
            <p>0</p>
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/communications`)}
          >
            <h3>💬 Messages</h3>
            <p>0</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GroupHome;
