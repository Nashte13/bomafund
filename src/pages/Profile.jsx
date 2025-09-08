import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSave = () => {
    setIsEditing(false);
    localStorage.setItem("user", JSON.stringify(user));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(URL.createObjectURL(file));
    }
  };

  if (!user) {
    return <h2 className="loading">Loading user details...</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card fade-in-up">
        {/* Header strip */}
        <div className="profile-header">
          <button className="back-btn" onClick={() => navigate("/dashboard")}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="profile-title">Your Profile</h1>
        </div>

        {/* Profile Picture */}
        <div className="profile-pic-container">
          <img
            src={profilePic || "/default-avatar.png"}
            alt="Profile"
            className="profile-pic"
          />
          <label className="change-photo-btn">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </label>
        </div>

        {/* Profile Form */}
        <div className="profile-form">
          <div className="form-group">
            <label>Full Name</label>
            {isEditing ? (
              <input
                type="text"
                value={user.fullName || ""}
                onChange={(e) =>
                  setUser({ ...user, fullName: e.target.value })
                }
              />
            ) : (
              <p className="readonly">{user.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            {isEditing ? (
              <input
                type="text"
                value={user.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
              />
            ) : (
              <p className="readonly">{user.email}</p>
            )}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            {isEditing ? (
              <input
                type="text"
                value={user.phoneNumber || ""}
                onChange={(e) =>
                  setUser({ ...user, phoneNumber: e.target.value })
                }
              />
            ) : (
              <p className="readonly">{user.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="primary-btn" onClick={handleSave}>
                Save Changes
              </button>
              <button className="ghost-btn" onClick={handleCancel}>
                Cancel
              </button>
            </>
          ) : (
            <button
              className="primary-btn"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
