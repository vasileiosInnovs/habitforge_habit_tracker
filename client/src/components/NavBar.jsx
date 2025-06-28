import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <nav>
            <div>
                <h1>HabitForge</h1>
                    <div>
                        <NavLink to="/" className="links">Home</NavLink>
                        <NavLink to="/myday" className="links">My Day</NavLink>
                        <NavLink to="/habits" className="links">Habits</NavLink>
                        <NavLink to="/challenges" className="links">Challenges</NavLink>
                        <NavLink to="/logs" className="links">Progress Logs</NavLink>
                        <NavLink to="/login" className="links">Login</NavLink>
                        <NavLink to="/signup" className="links">Sign Up</NavLink>
                    </div>
            </div>

        </nav>
    )
}

export default NavBar;