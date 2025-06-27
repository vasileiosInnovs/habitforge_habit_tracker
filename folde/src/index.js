import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from '../../client/src/components/N';
import JoinChallengeForm from "../../client/src/components/JoinChallengeForm";
import ProgressLog from "../../client/src/components/ProgressLog";
import LoginForm from "../../client/src/components/HabitForm";
import SignupForm from "../../client/src/components/SignUpForm";
import ChallengeForm from "../../client/src/components/ChallengeForm";
import MyDay from "../../client/src/components/MyDay";
import Home from "../../client/src/components/Home";

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