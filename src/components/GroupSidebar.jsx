import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './groupSidebar.css';

function GroupSidebar({ menuOpen, closeMenu }) {
  const { groupId } = useParams();

  return (
    <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={closeMenu}>❌</button>

      <Link to={`/group/${groupId}/members`} className="sidebar-link">Members</Link>
      <Link to={`/group/${groupId}/add-members`} className="sidebar-link">Add Members</Link>
      <Link to={`/group/${groupId}/contributions`} className="sidebar-link">Contributions</Link>
      <Link to={`/group/${groupId}/projects`} className="sidebar-link">Projects</Link>
      <Link to={`/group/${groupId}/communications`} className="sidebar-link">Messages</Link>
      <Link to="/dashboard" className="sidebar-link">Back to Dashboard</Link>
    </div>
  );
}

export default GroupSidebar;
