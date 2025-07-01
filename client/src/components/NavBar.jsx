import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import '../index.css';

function NavBar({ user, onLogout }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate(); 

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/logout`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          onLogout();
          navigate("/"); 
        } else {
          console.error("Logout failed");
        }
      })
      .catch((err) => console.error("Logout error:", err));
  };



    return (
        <nav className="navbar">
            <div className="navbar-container-left">
              <div className="navbar-logo">
                  <img src="https://img.freepik.com/premium-vector/habit-icon-vector-image-can-be-used-lifestyles_120816-219924.jpg" alt="Change yourself" class="logo-image" />
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
                    <button className="logout-btn" onClick={handleLogout}>Logout</button>
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