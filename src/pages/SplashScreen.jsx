import React from "react";
import "./splash.css";

function SplashScreen({ fadingOut }) {
  return (
    <div className={`splash-container ${fadingOut ? "fade-out" : ""}`}>
      <h1 className="splash-title">BomaFund</h1>
      <div className="dots-loader">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}

export default SplashScreen;
