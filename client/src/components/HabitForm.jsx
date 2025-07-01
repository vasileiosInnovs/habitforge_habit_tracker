import React, { useState, useEffect } from "react";
import '../index.css';
import { toast } from "react-toastify";

function HabitForm() {
  const [formData, setFormData] = useState({
     name: "",
  description: "",
  frequency: "",
  completed: false
  });
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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "completed" ? value === "true" : value,
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const url = `${process.env.REACT_APP_API_URL}/habits${
    isEditing ? `/${editingHabitId}` : ""
  }`;
  const method = isEditing ? "PATCH" : "POST";

  const payload = {
    ...formData,
    completed: formData.completed,
  };

  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  })
    .then(async (res) => {
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("API Error Response:", data);
        throw new Error(data.error || "Failed to save habit");
      }
      return data;
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

      setFormData({
        name: "",
        frequency: "",
        description: "",
        completed: false,
      });
    })
    .catch((err) => {
      toast.error(err.message);
      console.error("Habit save failed:", err);
    });
};

  const handleEdit = (habit) => {
    setIsEditing(true);
    setEditingHabitId(habit.id);
    setFormData({
      name: habit.name,
      frequency: habit.frequency,
      description: habit.description,
      completed: habit.completed,
    });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingHabitId(null);
    setFormData({
      name: "",
      frequency: "",
      description: "",
      completed: false,
    });
  };

  const handleDelete = (id) => {
    fetch(`${process.env.REACT_APP_API_URL}/habits/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete habit");
        setHabits((prev) => prev.filter((h) => h.id !== id));
        toast.success("Habit deleted.");
      })
      .catch((err) => {
        toast.error("Could not delete habit.");
        console.error("Delete error:", err);
      });
  };

  const toggleCompletion = (habit) => {
    const updatedCompleted = !habit.completed;

     fetch(`${process.env.REACT_APP_API_URL}/habits/${habit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: habit.name,
          description: habit.description,
          frequency: habit.frequency,
          completed: updatedCompleted
        })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update habit status");
        return res.json();
      })
      .then((updatedHabit) => {
        setHabits((prev) =>
          prev.map((h) => (h.id === habit.id ? updatedHabit : h))
        );
        toast.success(
          updatedHabit.completed ? "Marked as complete!" : "Marked as incomplete"
        );
      })
      .catch((err) => {
        console.error("Toggle failed:", err);
        toast.error("Could not update habit");
      });
  };

  return (
    <div className="habit-section">
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
        <input
          type="hidden"
          name="completed"
          value={formData.completed}
        />

        <div className="form-buttons">
          {isEditing && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="cancel-btn"
            >
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
            <li
              key={habit.id}
              className={`habit-card ${
                habit.completed ? "completed" : ""
              }`}
            >
              <div className="habit-info">
                <h3>{habit.name}</h3>
                <p>Frequency: {habit.frequency}</p>
                <p>{habit.description}</p>
              </div>
              <div className="habit-buttons">
                <button
                  className="mark-btn"
                  style={{
                    backgroundColor: habit.completed ? "#48bb78" : "#6ab04c",
                  }}
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
