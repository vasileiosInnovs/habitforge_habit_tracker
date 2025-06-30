import React, { useState, useEffect } from "react";
import "../styles/Forms.css";
import "../styles/Lists.css";

function HabitForm() {
  const [formData, setFormData] = useState({ name: "", frequency: "", description: "" });
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
    body: JSON.stringify({ ...formData, completed: false }),
  })
    .then((res) => res.json())
    .then((newHabit) => {
      setHabits([...habits, newHabit]);
      setFormData({ name: "", frequency: "", description: "" });
    });
};


  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then((res) => {
      if (res.ok) {
        setHabits(habits.filter((h) => h.id !== id));
      }
    });
  };

  const toggleCompletion = (habit) => {
    const updated = { ...habit, completed: !habit.completed };
    fetch(`${process.env.REACT_APP_API_URL}/habits/${habit.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ completed: updated.completed }),
    }).then((res) => {
      if (res.ok) {
        setHabits(habits.map((h) => (h.id === habit.id ? updated : h)));
      }
    });
  };

  return (
    <div className="habit-section">
      <h1 className="section-title">Your Habits</h1>

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
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
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
              <div>
                <button
                  className="mark-btn"
                  style={{ backgroundColor: habit.completed ? "#48bb78" : "#6ab04c" }}
                  onClick={() => toggleCompletion(habit)}
                >
                  {habit.completed ? "Completed" : "Mark Done"}
                </button>
                <button
                  className="mark-btn delete-btn"
                  onClick={() => handleDelete(habit.id)}
                >
                  Delete
                </button>
              </div>
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