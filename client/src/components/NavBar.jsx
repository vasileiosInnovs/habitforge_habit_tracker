import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import '../styles/NavBar.css'

function NavBar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <h1 className="navbar-logo">HabitForge</h1>
                <button className="hamburger" onClick={() => setMenuOpen(prev => !prev)} aria-label="Toggle menu">
                  ☰
                </button>
                <div className={`nav-links ${menuOpen ? "open" : ""}`}>
                    <NavLink to="/" onClick={() => setMenuOpen(false)}>Home</NavLink>
                    {user && <NavLink to="/myday" onClick={() => setMenuOpen(false)}>My Day</NavLink>}
                    {user && <NavLink to="/habits" onClick={() => setMenuOpen(false)}>Habits</NavLink>}
                    {user && <NavLink to="/challenges" onClick={() => setMenuOpen(false)}>Challenges</NavLink>}
                    {user && <NavLink to="/logs" onClick={() => setMenuOpen(false)}>Progress Logs</NavLink>}

                    {user ? (
                        <div className="auth-buttons">
                            <span className="user-greeting">{user.username}</span>
                            <button className='logout-btn' onClick={onLogout}>Logout</button>
                        </div>
                        ) : (
                        <>
                            {!user && <NavLink to="/login" onClick={() => setMenuOpen(false)}>Login</NavLink>}
                            {!user && <NavLink to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</NavLink>}
                        </>
                        )}
                </div>
            </div>

        </nav>
    )
}

export default NavBar;