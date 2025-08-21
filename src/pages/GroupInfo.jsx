import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GroupSidebar from "../components/GroupSidebar";
import "./groupInfo.css";

function GroupInfo({ user }) {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroup(res.data.group);
      } catch (err) {
        console.error("❌ Error fetching group info:", err);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleExitGroup = async () => {
    alert("You are no longer a member of this Group. Redirecting to Dashboard...");
    setTimeout(() => navigate("/dashboard"), 2000);
  };

  if (!group) {
    return <p className="group-info-page-loading">Loading group info...</p>;
  }

  const isLeader = user && group.creatorId === user.id;

  return (
    <div className="group-info-page-layout">
      {/* Sidebar */}
      <GroupSidebar 
        menuOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        groupName={group.name} 
      />

      {/* Main content */}
      <main className="group-info-page-container">
        <div className="group-info-page-card">
          {/* Group Logo */}
          <div className="group-info-page-logo-holder">
            {group.profilePicture ? (
              <img 
                src={group.profilePicture} 
                alt="Group Logo" 
                className="group-info-page-logo" 
              />
            ) : (
              <div className="group-info-page-logo-placeholder">
                {group.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Group Details */}
          <h1>{group.name}</h1>
          <p><strong>Motto:</strong> {group.motto || "No motto set"}</p>
          <p><strong>Mission:</strong> {group.mission || "No mission set"}</p>

          {/* Buttons */}
          <div className="group-info-page-actions">
            {isLeader && (
              <button 
                className="group-info-page-edit-btn"
                onClick={() => navigate(`/group/${groupId}/edit-info`)}
              >
                Edit Group Info
              </button>
            )}
            <button 
              className="group-info-page-exit-btn" 
              onClick={handleExitGroup}
            >
              Exit Group
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GroupInfo;
