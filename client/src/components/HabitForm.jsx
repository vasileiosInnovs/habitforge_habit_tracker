import React, { useState, useEffect } from "react";
import "../styles/Forms.css";
import "../styles/Lists.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function HabitForm() {
  const [formData, setFormData] = useState({ name: "", frequency: "", description: "" });
  const [habits, setHabits] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/habits`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch habits");
        return res.json();
      })
      .then(setHabits)
      .catch((err) => console.error("Failed to load habits:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const url = `${process.env.REACT_APP_API_URL}/habits${isEditing ? `/${editingHabitId}` : ""}`;
  const method = isEditing ? "PATCH" : "POST";

  const payload = isEditing
    ? formData
    : { ...formData, completed: false };

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Failed to save habit");
      return res.json();
    })
    .then((updatedHabit) => {
      if (isEditing) {
        setHabits((prev) =>
          prev.map((h) => (h.id === editingHabitId ? updatedHabit : h))
        );
        toast.success("Habit updated!");
        setIsEditing(false);
        setEditingHabitId(null);
      } else {
        setHabits((prev) => [...prev, updatedHabit]);
        toast.success("Habit added!");
      }
      setFormData({ name: "", frequency: "", description: "" });
    })

    .catch((err) => console.error("Habit save failed:", err));
};


  const handleEdit = (habit) => {
    setIsEditing(true);
    setEditingHabitId(habit.id);
    setFormData({
      name: habit.name,
      frequency: habit.frequency,
      description: habit.description,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingHabitId(null);
    setFormData({ name: "", frequency: "", description: "" });
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
      <h1 className="section-title">{isEditing ? "Edit Habit" : "Your Habits"}</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Habit Name"
          required
        />
        <input
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          placeholder="e.g. Daily, Weekly"
          required
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />

        <div className="form-buttons">
          {isEditing && (
            <button type="button" onClick={handleCancelEdit} className="cancel-btn">
              Cancel
            </button>
          )}
          <button type="submit" className="submit-btn">
            {isEditing ? "Update Habit" : "Add Habit"}
          </button>
        </div>
      </form>

      {habits.length > 0 ? (
        <ul className="habit-list">
          {habits.map((habit) => (
            <li key={habit.id} className="habit-card">
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>Frequency: {habit.frequency}</p>
                <p>{habit.description}</p>
              </div>
              <div className="habit-buttons">
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
                <button
                  className="mark-btn edit-btn"
                  onClick={() => handleEdit(habit)}
                >
                  Edit
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
