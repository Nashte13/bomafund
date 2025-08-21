import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./editGroupInfo.css";

function EditGroupInfo({ user }) {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [formData, setFormData] = useState({ name: "", motto: "", mission: "" });
  const [message, setMessage] = useState("");

  // Fetch current group details
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/groups/${groupId}`);
        setGroup(res.data.group);
        setFormData({
          name: res.data.group.name || "",
          motto: res.data.group.motto || "",
          mission: res.data.group.mission || ""
        });
      } catch (err) {
        console.error("❌ Error fetching group:", err.response?.data || err.message);
      }
    };
    fetchGroup();
  }, [groupId]);

  // Handle change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle save
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/groups/${groupId}`, formData);
      setMessage("✅ Group info updated successfully! Redirecting...");
      setTimeout(() => navigate(`/group/${groupId}/info`), 2000);
    } catch (err) {
      console.error("❌ Error updating group:", err.response?.data || err.message);
      setMessage("❌ Failed to update group. Try again.");
    }
  };

  if (!group) return <p className="loading">Loading group data...</p>;

  // Restrict non-creators
  if (user.id !== group.creatorId) {
    return (
      <p className="loading">
        ❌ Only the group creator can edit group info.
      </p>
    );
  }

  return (
    <div className="edit-group-page">
      <h1>Edit Group Info</h1>
      <form className="edit-group-form" onSubmit={handleSubmit}>
        <label>
          Group Name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Motto
          <input
            type="text"
            name="motto"
            value={formData.motto}
            onChange={handleChange}
          />
        </label>

        <label>
          Mission
          <textarea
            name="mission"
            rows="4"
            value={formData.mission}
            onChange={handleChange}
          />
        </label>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate(`/group/${groupId}/info`)}>
            Cancel
          </button>
          <button type="submit" className="save-btn">Save Changes</button>
        </div>
      </form>

      {message && <p className="form-message">{message}</p>}
    </div>
  );
}

export default EditGroupInfo;
