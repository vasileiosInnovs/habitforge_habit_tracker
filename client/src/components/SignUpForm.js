import React, {useState} from "react";

//create function onSignup to key in form
function SignupForm({ onSignup }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        image_url: '',
        bio: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })
            .then((r) => r.json())
            .then(onSignup)
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <input name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
            <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
            <input name="image_url" value={formData.image_url} onChange={handleChange} placeholder="Image URL" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} placeholder="Bio" />
            <button type="submit">Sign Up</button>
        </form>
    );
}

export default SignupForm;