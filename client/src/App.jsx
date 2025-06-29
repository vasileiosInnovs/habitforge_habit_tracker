
import './App.css';
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from './components/ProtectedRoute';

import NavBar from './components/NavBar';
import JoinChallengeForm from "./components/JoinChallengeForm";
import ProgressLog from "./components/ProgressLog";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignUpForm";
import ChallengeForm from "./components/ChallengeForm";
import HabitForm from "./components/HabitForm"
import MyDay from "./components/MyDay";
import Home from "./components/Home";

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  }

  const handleLogout = () => {
    fetch("/logout", {method: "DELETE"}).then(() => setUser(null));
  };

  useEffect(() => {
    fetch('/check_session').then((res) => {
      if (res.ok) {
        res.json().then(setUser)
      }
    });
  }, [])
  
  return (
  <Router>
    <NavBar user={user} onLogout={handleLogout} />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={currentUser ? <MyDay user={currentUser} /> : <Navigate to="/login" />} />
      <Route path="/signup" element={<SignupForm onSignup={setCurrentUser} />} />

      <Route
        path="/myday"
        element={
          <ProtectedRoute user={user}>
            <MyDay />
          </ProtectedRoute>
        }
      />

      <Route
        path="/habits"
        element={
          <ProtectedRoute user={user}>
            <HabitForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute user={user}>
            <ChallengeForm />
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
        path="/logs"
        element={
          <ProtectedRoute user={user}>
            <ProgressLog />
          </ProtectedRoute>
        }
       />
      
    </Routes>
  </Router>
  );
}

export default App;
