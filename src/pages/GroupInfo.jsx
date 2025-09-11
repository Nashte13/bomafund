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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Modals
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  // Toast
  const [toast, setToast] = useState({ message: "", type: "" });

  // resize listener
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // fetch group
  useEffect(() => {
    let mounted = true;
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        if (!mounted) return;
        setGroup(res.data.group);
      } catch (err) {
        console.error("❌ Error fetching group info:", err);
      }
    };
    fetchGroup();
    return () => {
      mounted = false;
    };
  }, [groupId]);

  if (!group) {
    return <p className="group-info-loading">Loading group info...</p>;
  }

  const isLeader = user && group.leaderId === user.id;

  // Toast helper
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3200);
  };

  // handlers
  const handleEditGroupInfo = () => {
    if (!isLeader) {
      showToast("Only the group leader can edit the group info.", "error");
      return;
    }
    navigate(`/group/${groupId}/edit-info`);
  };

  const confirmExitGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${groupId}/members/${user.id}`
      );
      showToast("You have left this group.", "success");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      console.error("❌ Error exiting group:", err);
      showToast("Failed to exit group. Try again.", "error");
    }
  };

  const confirmDeleteGroup = async () => {
    try {
      await axios.delete(
        `http://localhost:5000/api/groups/${groupId}/delete/${user.id}`
      );
      showToast("Group deleted successfully.", "success");
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err) {
      console.error("❌ Error deleting group:", err);
      showToast("Failed to delete group. Try again.", "error");
    }
  };

  // fallback logo initial
  const initial = (group.name || "G").trim().charAt(0).toUpperCase();

  return (
    <div className="group-info-layout">
      {/* Sidebar */}
      <GroupSidebar
        menuOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        groupName={group.name}
      />

      {/* Mobile hamburger */}
      {isMobile && (
        <button
          className={`mobile-hamburger-info ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="material-symbols-outlined">
            {menuOpen ? "close" : "menu"}
          </span>
        </button>
      )}

      {/* Main content */}
      <main className="group-info-container">
        <section className="group-info-card1">
          <div className="group-info-card-strip" aria-hidden="true" />

          <div className="group-info-top">
            <div className="group-info-logo-holder">
              {group.profilePicture ? (
                <img
                  src={group.profilePicture}
                  alt={`${group.name} logo`}
                  className="group-info-logo"
                />
              ) : (
                <div className="group-info-logo-placeholder">{initial}</div>
              )}
            </div>

            <div className="group-info-details">
              <h1 className="group-info-name">{group.name}</h1>
              <p className="group-info-meta">
                <strong>Motto:</strong> {group.motto || "No motto set"}
              </p>
              <p className="group-info-meta">
                <strong>Mission:</strong> {group.mission || "No mission set"}
              </p>
            </div>
          </div>

          {/* action buttons */}
          <div className="group-info-actions">
            <button className="primary-btn" onClick={handleEditGroupInfo}>
              <span className="material-symbols-outlined">edit</span>
              Edit Group Info
            </button>

            <button
              className="ghost-btn warning"
              onClick={() => setShowExitModal(true)}
            >
              <span className="material-symbols-outlined">exit_to_app</span>
              Exit Group
            </button>

            {isLeader && (
              <button
                className="ghost-btn danger"
                onClick={() => setShowDeleteModal(true)}
              >
                <span className="material-symbols-outlined">delete_forever</span>
                Delete Group
              </button>
            )}
          </div>
        </section>

        <footer className="group-info-footer">
          <p>© {new Date().getFullYear()} BomaFund — All rights reserved.</p>
        </footer>
      </main>

      {/* Exit Modal */}
      {showExitModal && (
        <div
          className="group-info-modal-overlay"
          onClick={() => setShowExitModal(false)}
        >
          <div
            className="group-info-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="group-info-modal-strip" />
            <h3>Leave Group</h3>
            <p>
              Are you sure you want to leave <strong>{group.name}</strong>?
            </p>
            <div className="group-info-modal-actions">
              <button
                className="ghost-btn"
                onClick={() => setShowExitModal(false)}
              >
                Cancel
              </button>
              <button
                className="primary-btn warning"
                onClick={confirmExitGroup}
              >
                Yes, Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div
          className="group-info-modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="group-info-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="group-info-modal-strip danger" />
            <h3>Confirm Delete</h3>
            <p>
              Delete <strong>{group.name}</strong>? This action cannot be undone.
            </p>
            <div className="group-info-modal-actions">
              <button
                className="ghost-btn"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="primary-btn danger"
                onClick={confirmDeleteGroup}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast.message && (
        <div className={`group-info-toast ${toast.type}`}>
          <span className="material-symbols-outlined toast-icon">
            {toast.type === "error" ? "error_outline" : "check_circle"}
          </span>
          <div className="toast-text">{toast.message}</div>
        </div>
      )}
    </div>
  );
}

export default GroupInfo;
