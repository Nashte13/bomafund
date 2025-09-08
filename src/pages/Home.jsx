import React from "react";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header fade-in">
        <h1 className="brand-title">Welcome to <span>BomaFund</span></h1>
        <p className="tagline">Manage group contributions effortlessly</p>
        <div className="cta-buttons">
          <a href="/login">
            <button className="primary-btn">Login</button>
          </a>
          <a href="/signup">
            <button className="primary-btn">Sign Up</button>
          </a>
        </div>
      </header>
    </div>
  );
}

export default Home;
