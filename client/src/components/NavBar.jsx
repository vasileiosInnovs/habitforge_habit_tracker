import React from "react";
import { NavLink } from "react-router-dom";

function NavBar() {
    return (
        <nav className="bg-green-700 text-white p-4 shadow-md">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">HabitForge</h1>
                    <div className="">
                        <NavLink to="/" className="hover:underline">Home</NavLink>
                        <NavLink to="/myday" className="hover:underline">My Day</NavLink>
                        <NavLink to="/habits" className="hover:underline">Habits</NavLink>
                        <NavLink to="/challenges" className="hover:underline">Challenges</NavLink>
                        <NavLink to="/logs" className="hover:underline">Progress Logs</NavLink>
                        <NavLink to="/login" className="hover:underline">Login</NavLink>
                        <NavLink to="/signup" className="hover:underline">Sign Up</NavLink>
                    </div>
            </div>

        </nav>
    )
}

export default NavBar;