import React, { useState } from "react";
import '../styles/Forms.css'

function LoginForm({ onLogin }) {
    const [formData, setFormData] = useState({username: '', password: ''});

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://habitforge-habit-tracker.onrender.com/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify(formData)
        })
            .then((r) => r.json())
            .then(onLogin)
    };

    return (
        <div className="login-container">
          <form onSubmit={handleSubmit} className="form">
            <h2>Login to Your Account</h2>
            <input
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Username"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
            />
            <button type="submit">Login</button>
          </form>
          
        </div>
    );
}

export default LoginForm;