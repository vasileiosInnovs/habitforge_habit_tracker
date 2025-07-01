import React, { useState } from "react";
import { toast } from "react-toastify";
import '../index.css'

function LoginForm({ onLogin }) {
    const [formData, setFormData] = useState({username: '', password: ''});

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify(formData)
        })
            .then(res => {
              if (!res.ok) throw new Error("Login failed");
              return res.json();
            })
            .then((user) => {
              onLogin(user);
              toast.success("Login successful!"); 
            })
            .catch((err) => {
              console.error("Login error:", err);
              toast.error("Login failed. Check your credentials."); 
            });
    };

    return (
      <div className="auth-container">
        <div className="form-header">
          <div className="login-container">
            <form onSubmit={handleSubmit} className="form">
              <h2>Login to Your Account</h2>
              <input
                name="username"
                className="form-input"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Username"
              />
              <input
                name="password"
                className="form-input"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
              <button type="submit" className="auth-button">Login</button>
            </form>
              
          </div>
        </div>
      </div>
    );
}

export default LoginForm;