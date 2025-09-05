import React, { useState } from "react";
import "./resetPassword.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    // 🔜 Later: call backend API with token to reset password
    setSuccess("✅ Password reset successfully! Redirecting to login...");

    setTimeout(() => {
      window.location.href = "/login";
    }, 2000);
  };

  return (
    <div className="reset-container">
      <div className="reset-form">
        <h1>Set a New Password</h1>
        <p className="sub-text">Enter your new password below.</p>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button type="submit">Reset Password</button>
        </form>

        <p className="back-link">
          Back to <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
