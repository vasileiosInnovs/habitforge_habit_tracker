import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import JoinChallengeForm from "./components/JoinChallengeForm";
import ProgressLog from "./components/ProgressLog";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignUpForm";
import ChallengeForm from "./components/ChallengeForm";
import HabitForm from "./components/HabitForm";
import MyDay from "./components/MyDay";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    fetch("/logout", { method: "DELETE" }).then(() => setUser(null));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/check_session`, {
      credentials: "include",
    }
    ).then(res => {
      if (res.ok) return res.json();
      throw new Error("Not logged in");
    })
    .then((user) => {
      console.log("User from check_session:", user);
      setUser(user);
    })
    .catch((err) => {
      console.error("Session check failed:", err);
      setUser(null);
    });
  }, []);

  return (
    <>
      <NavBar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={user ? <Navigate to="/myday" /> : <LoginForm onLogin={handleLogin} />} />
        <Route path="/signup" element={<SignupForm onSignup={setUser} />} />
        <Route path="/habits" element={<HabitForm />} />


        <Route
          path="/myday"
          element={
            <ProtectedRoute user={user}>
              <MyDay />
            </ProtectedRoute>
          }
        />

        <Route
          path="/challenges"
          element={
            <ProtectedRoute user={user}>
              <ChallengeForm user={user}/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/logs"
          element={
            <ProtectedRoute user={user}>
              <ProgressLog />
            </ProtectedRoute>
          }
        />

        <Route
          path="/participations"
          element={
            <ProtectedRoute user={user}>
              <JoinChallengeForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
