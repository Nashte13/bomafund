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

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroup(response.data.group);
      } catch (error) {
        console.error("❌ Error fetching group details:", error.response?.data || error.message);
      }
    };
    fetchGroup();
  }, [groupId]);

  if (!group) {
    return <p className="loading">Loading group details...</p>;
  }

  return (
    <div className="group-home-container">
      {/* Sidebar Toggle Button */}
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

      {/* Group Info */}
      <div className="group-info-wrapper">
        <div className="group-info-card">
          <img
            src={group.profilePicture || "/default-group.png"}
            alt="Group logo"
            className="group-logo"
          />
          <h1>Welcome to {group.name}</h1>
          <p>
            <strong>Motto:</strong> {group.motto || "No motto set"}
          </p>
          <p>
            <strong>Mission:</strong> {group.mission || "No mission set"}
          </p>
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
            <p>KES 0</p> {/* Placeholder until DB integration */}
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/projects`)}
          >
            <h3>📂 Projects</h3>
            <p>0</p> {/* Placeholder */}
          </div>

          <div
            className="overview-card"
            onClick={() => navigate(`/group/${groupId}/communications`)}
          >
            <h3>💬 Messages</h3>
            <p>0</p> {/* Placeholder */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupHome;
