import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

function Login({ setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate form
    const validationErrors = {};
    if (!email) validationErrors.email = 'Email is required';
    if (!password) validationErrors.password = 'Password is required';
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password,
      });

      // save the user data in the state or context
      setUser(response.data.user);
      window.location.href = './dashboard';
    } catch (error) {
      setErrors({ login: error.response?.data?.message || 'Login failed.' });
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login to BomaFund</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email or Phone Number"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <p className="error">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <p className="error">{errors.password}</p>}

          <button type="submit">Login</button>

          {/* Forgot Password link */}
          <p className="forgot-link">
            <a href="/forgot-password">Forgot Password?</a>
          </p>
        </form>
        <p className="signup-text">
          Don’t have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
