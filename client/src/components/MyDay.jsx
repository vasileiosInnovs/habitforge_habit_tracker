import React, { useEffect, useState } from "react";

function MyDay() {
  const [habits, setHabits] = useState([]);
   const [streak, setStreak] = useState(0);

  useEffect(() => {
      fetch("/habits")
        .then((res) => res.json())
        .then((data) => setHabits(data))
        .catch((err) => console.error("Failed to fetch habits", err));
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
    <div>
      <h1>🌞 My Day</h1>

      <p>
        {streak} habit{streak !== 1 ? 's' : ''} completed today 🎉
      </p>

      <div>
        <h2>🔥 Streak</h2>
        <div>
          {Array(streak)
            .fill()
            .map((_, index) => (
              <span key={index}>🔥</span>
            ))}
          {streak === 0 && <p>No streak yet. Let’s get started!</p>}
        </div>
      </div>

      <div>
        <h2> Today’s Habits</h2>
        {habits.length === 0 ? (
          <p>You have no habits for today.</p>
        ) : (
          <ul>
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
              >
                <div>
                  <h3>{habit.name}</h3>
                  <p >{habit.description}</p>
                </div>
                <button
                  onClick={() => handleLog(habit.id)}
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