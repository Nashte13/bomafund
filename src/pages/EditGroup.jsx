import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import GroupSidebar from "../components/GroupSidebar";
import "./editGroup.css";

function EditGroup({ user }) {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    motto: "",
    mission: "",
    profilePicture: "",
  });

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroup(res.data.group);
        setForm({
          name: res.data.group.name || "",
          motto: res.data.group.motto || "",
          mission: res.data.group.mission || "",
          profilePicture: res.data.group.profilePicture || "",
        });
      } catch (err) {
        console.error("Error fetching group:", err);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}`, form);
      alert("✅ Group updated successfully");
      navigate(`/group/${groupId}`);
    } catch (err) {
      console.error("Error updating group:", err);
      alert("❌ Failed to update group");
    }
  };

  if (!group) return <p>Loading...</p>;

  // Restrict access to leader only
  if (user?.id !== group.leaderId) {
    return (
      <div className="edit-group-container">
        <h2>🚫 Access Denied</h2>
        <p>Only the group creator can edit group details.</p>
      </div>
    );
  }

  return (
    <div className="edit-group-container">
      <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
      <GroupSidebar menuOpen={menuOpen} closeMenu={() => setMenuOpen(false)} />

      <h1>Edit Group</h1>

      <form className="edit-group-form" onSubmit={handleSubmit}>
        <label>Group Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} />

        <label>Motto</label>
        <input type="text" name="motto" value={form.motto} onChange={handleChange} />

        <label>Mission</label>
        <textarea name="mission" value={form.mission} onChange={handleChange}></textarea>

        <label>Profile Picture URL</label>
        <input type="text" name="profilePicture" value={form.profilePicture} onChange={handleChange} />

        <button type="submit" className="save-btn">Save Changes</button>
      </form>
    </div>
  );
}

export default EditGroup;
