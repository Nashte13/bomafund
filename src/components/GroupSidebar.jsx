import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import "./groupSidebar.css"; // new global sidebar styles

function GroupSidebar() {
  const { groupId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Listen for window resize (to toggle mobile/tablet layout)
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`app-sidebar ${isOpen ? "open" : ""} ${isMobile ? "mobile" : "desktop"}`}>
      <div className="inner">
        {/* Header with Burger Button */}
        <header>
          <button
            type="button"
            className="sidebar-burger"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-symbols-outlined">
              {isOpen ? "close" : "menu"}
            </span>
          </button>
          <h2 className="sidebar-title">Group</h2>
        </header>

        {/* Navigation Links */}
        <nav>
          <Link to={`/group/${groupId}`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">home</span>
            <p>Home</p>
          </Link>

          <Link to={`/group/${groupId}/members`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">groups</span>
            <p>Members</p>
          </Link>

          <Link to={`/group/${groupId}/add-members`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">person_add</span>
            <p>Add Members</p>
          </Link>

          <Link to={`/group/${groupId}/contributions`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">payments</span>
            <p>Contributions</p>
          </Link>

          <Link to={`/group/${groupId}/projects`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">folder</span>
            <p>Projects</p>
          </Link>

          <Link to={`/group/${groupId}/communications`} onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">chat</span>
            <p>Messages</p>
          </Link>

          <Link to="/dashboard" onClick={() => setIsOpen(false)}>
            <span className="material-symbols-outlined">dashboard</span>
            <p>Dashboard</p>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default GroupSidebar;
