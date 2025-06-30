import React, { useState, useEffect } from "react";
import "../styles/forms.css";
import "../styles/Lists.css";

function HabitForm() {
  const [formData, setFormData] = useState({ name: "", frequency: "" });
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then(setHabits)
      .catch((err) => console.error("Failed to load habits:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((newHabit) => {
        setHabits([...habits, newHabit]);
        setFormData({ name: "", frequency: "" });
      });
  };

  return (
    <div className="myday">
      <h1>Your Habits</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Habit Name"
        />
        <input
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          placeholder="e.g. Daily, Weekly"
        />
        <button type="submit">Add Habit</button>
      </form>

      {habits.length > 0 ? (
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-card">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>Frequency: {habit.frequency}</p>
              </div>
              <button className="mark-btn">Mark Done</button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-habits">You have not added any habits yet.</p>
      )}
    </div>
  );
}

export default HabitForm;