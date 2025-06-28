
import './App.css';
import React from "react";
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
  
  return (
  <Router>
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />

      <Route
        path="/myday"
        element={
          <ProtectedRoute>
            <MyDay />
          </ProtectedRoute>
        }
      />

      <Route
        path="/habits"
        element={
          <ProtectedRoute>
            <HabitForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/challenges"
        element={
          <ProtectedRoute>
            <ChallengeForm />
          </ProtectedRoute>
        }
      />

      <Route
        path="/logs"
        element={
          <ProtectedRoute>
            <ProgressLog />
          </ProtectedRoute>
        }
       />

      <Route
        path="/participations"
        element={
          <ProtectedRoute>
            <JoinChallengeForm />
          </ProtectedRoute>
        }
      />
      
    </Routes>
  </Router>
  );
}

export default App;
