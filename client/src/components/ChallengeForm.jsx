import React, { useState } from "react";
import '../styles/Buttons.css';

function ChallengeForm({ onChallengeCreated }) {
    const [formData, setFormData] = useState({ title: '', description: '', start_date: '', end_date: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        
    }    

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify(formData)
        })
            .then((r) => r.json())
            .then(onChallengeCreated)
    };
    

        return (
            <form onSubmit={handleSubmit} className="form">
                <input name="title" type="text" value={formData.title} onChange={handleChange} placeholder="Challenge Title"  className=""/>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description"/>
                <input name="start_date" type="date" value={formData.start_date} onChange={handleChange}  className=""/>
                <input name="end_date" type="date" value={formData.end_date} onChange={handleChange}  className=""/>
                <button type="submit" className="">Add Challenge</button>
            </form>
        );
}

export default ChallengeForm;