import React, { useState } from "react";

function LoginForm({onLogin}) {
    const [formData, setFormData] = useState({username: '', password: ''});

    const handlesubmit = (e) => {
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
        <form onSubmit={handlesubmit} className="form">
            <input name="username" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value})} placeholder="Username"  className=""/>
            <input name="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Password"  className=""/>
            <button type="submit" className="">Login</button>
        </form>
    );
}


export default LoginForm