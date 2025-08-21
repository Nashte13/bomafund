import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./groupSidebar.css";

function GroupSidebar({ menuOpen, onClose, groupName }) {
  const { groupId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Sync state with parent (GroupHome toggle)
  useEffect(() => {
    setIsOpen(menuOpen);
  }, [menuOpen]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (typeof onClose === "function") onClose();
  };

  return (
    <aside
      className={`app-sidebar ${isOpen ? "open" : ""} ${
        isMobile ? "mobile" : "desktop"
      }`}
    >
      <div className="inner">
        {/* Header */}
        <header>
          <button
            type="button"
            className="sidebar-burger"
            onClick={() =>
              isMobile ? handleClose() : setIsOpen((prev) => !prev)
            }
          >
            <span className="material-symbols-outlined">
              {isOpen ? "close" : "menu"}
            </span>
          </button>

          {/* ✅ Show Group name when expanded (desktop/tablet only) */}
          {isOpen && !isMobile && (
            <h2 className="sidebar-title">{groupName || "Group"}</h2>
          )}
        </header>

        {/* Navigation */}
        <nav>
          <Link to={`/group/${groupId}`} onClick={handleClose} title="Home">
            <span className="material-symbols-outlined">home</span>
            <p>Home</p>
          </Link>

          <Link
            to={`/group/${groupId}/members`}
            onClick={handleClose}
            title="Members"
          >
            <span className="material-symbols-outlined">groups</span>
            <p>Members</p>
          </Link>

          <Link
            to={`/group/${groupId}/contributions`}
            onClick={handleClose}
            title="Contributions"
          >
            <span className="material-symbols-outlined">payments</span>
            <p>Contributions</p>
          </Link>

          <Link
            to={`/group/${groupId}/projects`}
            onClick={handleClose}
            title="Projects"
          >
            <span className="material-symbols-outlined">folder</span>
            <p>Projects</p>
          </Link>

          <Link
            to={`/group/${groupId}/communications`}
            onClick={handleClose}
            title="Messages"
          >
            <span className="material-symbols-outlined">chat</span>
            <p>Messages</p>
          </Link>

          <Link
            to={`/group/${groupId}/info`}
            onClick={handleClose}
            title="Group Info"
          >
            <span className="material-symbols-outlined">info</span>
            <p>Group Info</p>
          </Link>

          <Link to="/dashboard" onClick={handleClose} title="Dashboard">
            <span className="material-symbols-outlined">dashboard</span>
            <p>Dashboard</p>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default GroupSidebar;
