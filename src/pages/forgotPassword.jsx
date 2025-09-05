import React, { useState } from "react";
import "./forgotPassword.css";

function ForgotPassword() {
  const [emailOrPhone, setEmailOrPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // 🔜 Later: call backend API to send reset link
    console.log("Request password reset for:", emailOrPhone);
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h1>Reset your Password</h1>
        <p className="sub-text">
          Enter your email or phone number, and we’ll send you a reset link.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
          <button type="submit">Send Reset Link</button>
        </form>
        <p className="back-link">
          Remembered your password? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
