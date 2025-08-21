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

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

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

  if (!group) {
    return <p className="loading">Loading group info...</p>;
  }

  const isLeader = user && group.creatorId === user.id;

  // --- Handlers ---
  const handleEditGroupInfo = () => {
    if (!isLeader) {
      alert("❌ Only the Group creator can edit the group info.");
      return;
    }
    navigate(`/group/${groupId}/edit-info`);
  };

  const confirmExitGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${groupId}/members/${user.id}`
      );
      alert("You are no longer a member of this Group. Redirecting to Dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      console.error("❌ Error exiting group:", err);
      alert("Failed to exit group. Please try again.");
    }
  };

  const confirmDeleteGroup = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/groups/${groupId}`);
      alert("✅ Group has been deleted. Redirecting to Dashboard...");
      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Error deleting group:", err);
      alert("Failed to delete group. Please try again.");
    }
  };

  return (
    <div className="group-info-layout">
      {/* Sidebar */}
      <GroupSidebar 
        menuOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
        groupName={group.name} 
      />

      {/* Main content */}
      <main className="group-info-container">
        <div className="group-info-cardx">
          {/* Group Logo */}
          <div className="group-logo-holderx">
            {group.profilePicture ? (
              <img src={group.profilePicture} alt="Group Logo" className="group-logox" />
            ) : (
              <div className="group-logo-placeholderx">
                {group.name?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Group Details */}
          <h1>{group.name}</h1>
          <p><strong>Motto:</strong> {group.motto || "No motto set"}</p>
          <p><strong>Mission:</strong> {group.mission || "No mission set"}</p>

          {/* Buttons */}
          <div className="group-info-actionsx">
            <button className="edit-btn" onClick={handleEditGroupInfo}>
              Edit Group Info
            </button>

            <button className="exit-btn" onClick={() => setShowExitModal(true)}>
              Exit Group
            </button>

            {isLeader && (
              <button 
                className="delete-btn" 
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Group
              </button>
            )}
          </div>
        </div>
      </main>

      {/* --- Exit Confirmation Modal --- */}
      {showExitModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>🚪 Leave Group</h3>
            <p>Are you sure you want to exit <strong>{group.name}</strong>?</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowExitModal(false)}>
                Cancel
              </button>
              <button className="confirm-exit-btn" onClick={confirmExitGroup}>
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>⚠️ Confirm Delete</h3>
            <p>Are you sure you want to delete <strong>{group.name}</strong>?<br/>This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
              <button className="confirm-delete-btn" onClick={confirmDeleteGroup}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;
