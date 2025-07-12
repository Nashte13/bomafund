import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import GroupHome from "./pages/GroupHome";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import Members from "./pages/Members";
import AddMembers from "./pages/AddMembers";
import Contributions from "./pages/Contributions";
import UpdateContributions from "./pages/UpdateContributions";
import Projects from "./pages/Projects";
import Communications from "./pages/Communications";
import UpdateProject from "./updateProject";
import "./App.css";

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <Dashboard user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId"
          element={
            <ProtectedRoute user={user}>
              <GroupHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/members"
          element={
            <ProtectedRoute user={user}>
              <Members />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/add-members"
          element={
            <ProtectedRoute user={user}>
              <AddMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/contributions"
          element={
            <ProtectedRoute user={user}>
              <Contributions user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/update-contributions"
          element={
            <ProtectedRoute user={user}>
              <UpdateContributions user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/projects"
          element={
            <ProtectedRoute user={user}>
              <Projects user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/communications"
          element={
            <ProtectedRoute user={user}>
              <Communications user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/update-project"
          element={
            <ProtectedRoute user={user}>
              <UpdateProject user={user} />
            </ProtectedRoute>
          }
        /> 

        {/* Fallback Route */}
        <Route
          path="*"
          element={
            <div className="not-found">
              <h2>Page Not Found</h2>
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
