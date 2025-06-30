import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../styles/NavBar.css';

function NavBar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    console.log("NavBar user prop:", user);

    return (
        <nav className="navbar">
            <div className="navbar-container-left">
              <div className="navbar-logo">
                  <img src="data:image/png;base64,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" alt="Mountain" class="logo-image" />
                  <span>HabitForge</span>
              </div>
            </div>
            <div className="navbar-container-right">
              <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu">
                  ☰
                </button>
                <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                {!user && (
                  <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                )}

                {user && (
                  <>
                    <NavLink to="/myday" onClick={() => setMenuOpen(false)}>My Day</NavLink>
                    <NavLink to="/habits" onClick={() => setMenuOpen(false)}>Habits</NavLink>
                    <NavLink to="/challenges" onClick={() => setMenuOpen(false)}>Challenges</NavLink>
                    <NavLink to="/logs" onClick={() => setMenuOpen(false)}>Progress Logs</NavLink>
                
                    <div className="nav-profile">
                      <NavLink to="/profile" onClick={() => setMenuOpen(false)} className="nav-profile">
                        <img
                          src={user.image_url || "/placeholder.png"}
                          alt="profile"
                          className="nav-profile-img"
                        />
                        <span>{user.username}</span>
                      </NavLink>
                    </div>
                  </>
                )}
                {user ? (
                  <div className="auth-buttons">
                    <button className="logout-btn" onClick={onLogout}>Logout</button>
                  </div>
                ) : (
                  <>
                    <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>
                    <NavLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>
                  </>
                )}
                </div>
            </div>
        </nav>
    )
}

export default NavBar;