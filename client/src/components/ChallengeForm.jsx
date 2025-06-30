import React, { useState } from "react";
import '../styles/Buttons.css';

function ChallengeForm({ onChallengeCreated }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: "include",
      body: JSON.stringify(formData)
    })
      .then((r) => {
        if (!r.ok) throw new Error("Failed to create challenge");
        return r.json();
      })
      .then((newChallenge) => {
        onChallengeCreated(newChallenge);
        setFormData({ title: '', description: '', start_date: '', end_date: '' }); // reset form
      })
      .catch((err) => {
        alert("Could not create challenge. Make sure all required fields are filled.");
        console.error(err);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <input
        name="title"
        type="text"
        value={formData.title}
        onChange={handleChange}
        placeholder="Challenge Title"
        className="input"
        required
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
        className="input"
        required
      />
      <input
        name="start_date"
        type="date"
        value={formData.start_date}
        onChange={handleChange}
        className="input"
        required
      />
      <input
        name="end_date"
        type="date"
        value={formData.end_date}
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="submit-btn">Add Challenge</button>
    </form>
  );
}

export default ChallengeForm;
