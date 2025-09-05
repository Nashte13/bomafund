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
import EditGroup from "./pages/EditGroup";
import CreateGroup from "./pages/CreateGroup";
import EditGroupInfo from "./pages/EditGroupInfo";
import GroupInfo from "./pages/GroupInfo";
import ForgotPassword from "./pages/forgotPassword";
import ResetPassword from "./pages/resetPassword";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null;
  });

  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  // Splash timer
   useEffect(() => {
    const timer1 = setTimeout(() => setFadingOut(true), 2000); // start fade at 2s
    const timer2 = setTimeout(() => setLoading(false), 2800); // fully remove at 2.8s
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (loading) {
    return <SplashScreen fadingOut={fadingOut} />;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

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
        <Route
          path="/group/:groupId/edit-group"
          element={
            <ProtectedRoute user={user}>
              <EditGroup user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-group"
          element={
            <ProtectedRoute user={user}>
              <CreateGroup user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/info"
          element={
            <ProtectedRoute user={user}>
              <GroupInfo user={user} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/group/:groupId/edit-info"
          element={
            <ProtectedRoute user={user}>
              <EditGroupInfo user={user} />
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
