import React, { useEffect, useState } from "react";

function MyDay() {
  const [habits, setHabits] = useState([]);
  const [streakDates, setStreakDates] = useState([]);

  useEffect(() => {
    fetch("/habits").then(res => res.json()).then(data => setHabits(data));
    fetch("/logs").then(res => res.json()).then(data => setStreakDates(calculateStreakDates(data)));
    fetchRandomQuote();
  }, []);

useEffect(() => {
    fetch("/habits")
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .catch((err) => console.error("Failed to fetch habits", err));
  }, []);

  const handleLog = (habitId) => {
    fetch(`/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-4">🌞 My Day</h1>

      <div className="mb-6 text-center">
        <h2 className="text-xl font-semibold mb-2">🔥 Streak</h2>
        <div className="flex justify-center gap-2 text-2xl">
          {Array(streak)
            .fill()
            .map((_, index) => (
              <span key={index}>🔥</span>
            ))}
          {streak === 0 && <p>No streak yet. Let’s get started!</p>}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4"> Today’s Habits</h2>
        {habits.length === 0 ? (
          <p className="text-gray-500">You have no habits for today.</p>
        ) : (
          <ul className="space-y-3">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
              >
                <div>
                  <h3 className="text-lg font-medium">{habit.name}</h3>
                  <p className="text-sm text-gray-600">{habit.description}</p>
                </div>
                <button
                  onClick={() => handleLog(habit.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
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