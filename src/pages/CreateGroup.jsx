import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./createGroup.css";

function CreateGroup({ user }) {
  const [name, setName] = useState("");
  const [motto, setMotto] = useState("");
  const [mission, setMission] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name) {
      return alert("Group name is required.");
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("motto", motto);
      formData.append("mission", mission);
      formData.append("leaderId", String(user.id));

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await axios.post(
        "http://localhost:5000/api/groups",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Group created:", response.data);
      setSuccessMessage("🎉 Group created successfully! Redirecting...");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating group:", error);
      alert("Failed to create group.");
    }
  };

  return (
    <div className="create-group-container">
      <div className="create-group-card fade-in-up">
        {/* Card Header */}
        <div className="card-header">
          <h2>Create a New Group</h2>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="create-group-form">
          <label>Group Name</label>
          <input
            type="text"
            placeholder="Enter group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Group Motto</label>
          <input
            type="text"
            placeholder="Enter group motto"
            value={motto}
            onChange={(e) => setMotto(e.target.value)}
          />

          <label>Group Mission</label>
          <textarea
            placeholder="Enter group mission"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
          />

          <label>Profile Picture (optional)</label>
          <div className="file-upload">
            <input
              type="file"
              onChange={(e) => setProfilePicture(e.target.files[0])}
            />
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button type="submit" className="primary-btn">
              Create Group
            </button>
            <button
              type="button"
              className="ghost-btn"
              onClick={() => navigate("/dashboard")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateGroup;
