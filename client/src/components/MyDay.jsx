import React, { useEffect, useState } from "react";

function MyDay() {
  const [habits, setHabits] = useState([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
      fetch(`${process.env.REACT_APP_API_URL}/habits`, {
        method: "GET",
        credentials: "include",
      })
        .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setHabits(data);
        } else {
          setHabits([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching habits:", err);
        setHabits([]);
      });
  }, []);

  const handleLog = (habitId) => {
    fetch(`${process.env.REACT_APP_API_URL}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ habit_id: habitId }),
    })
      .then((res) => {
        if (res.ok) {
          setStreak((prev) => prev + 1);
        }
      })
      .catch((err) => console.error("Error logging habit", err));
  };

  return (
    <div className="myday">
      <h1>🌞 My Day</h1>

      <p className="habit-summary">
        {streak} habit{streak !== 1 ? 's' : ''} completed today 🎉
      </p>

      <div className="streak-container">
        <h2>🔥 Streak</h2>
        <div className="streak">
          {Array(streak)
            .fill()
            .map((_, index) => (
              <span key={index}>🔥</span>
            ))}
          {streak === 0 && <p>No streak yet. Let’s get started!</p>}
        </div>
      </div>

      <div className="habits-section">
        <h2> Today’s Habits</h2>
        {habits.length === 0 ? (
          <p className="no-habits">You have no habits for today.</p>
        ) : (
          <ul className="habit-list">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
              >
                <div className="habit-info">
                  <h3>{habit.name}</h3>
                  <p >{habit.description}</p>
                </div>
                <button
                   className="mark-btn" onClick={() => handleLog(habit.id)}
                >
                  Mark as Done
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default MyDay;