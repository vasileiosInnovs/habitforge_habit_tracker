import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from './components/N';
import JoinChallengeForm from "./components/JoinChallengeForm";
import ProgressLog from "./components/ProgressLog";
import LoginForm from "./components/HabitForm";
import SignupForm from "./components/SignUpForm";
import ChallengeForm from "./components/ChallengeForm";
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
                <Route path="/habits" element={<HabitForm />} />
                <Route path="/challenges" element={<ChallengeForm />} />
                <Route path="/myday" element={<MyDay />} />
                <Route path="/participations" element={<JoinChallengeForm />} />
                <Route path="/logs" element={<ProgressLog />} />
            </Routes>
        </Router>
    );
}