import React, { useEffect, useState } from "react";
import "../styles/Lists.css";

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [streakDates, setStreakDates] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/logs`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to fetch logs");
      })
      .then((data) => {
        setLogs(data);
        setStreakDates(calculateStreakDates(data));
      })
      .catch((err) => console.error(err));
  }, []);

  function calculateStreakDates(logs) {
    const loggedDates = new Set(
      logs.map((log) => new Date(log.date).toDateString())
    );

    const streak = [];
    const today = new Date();

    for (let i = 0; i < 100; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toDateString();

      if (loggedDates.has(dateStr)) {
        streak.unshift(dateStr);
      } else {
        break;
      }
    }

    return streak;
  }

    function groupLogsByHabit(logs) {
    const map = {};
    for (let log of logs) {
      const habitName = log.name || "Unknown Habit";
      if (!map[habitName]) map[habitName] = [];
      map[habitName].push(log);
    }
    return map;
  }


  return (
    <div className="progress-log">
      {streakDates.length > 0 && (
        <div className="streak-display">
          <h2 className="streak-title">
            🔥 {streakDates.length}-Day Streak
          </h2>
          <div className="streak-icons">
            {streakDates.map((date, index) => (
              <div key={index} className="streak-dot" title={date}>
                🔥
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mood-selector">
        <h2 className="section-title">😌 Mood Today</h2>
        <div className="emoji-options">
          {["😄", "🙂", "😐", "😟", "😩"].map((emoji) => (
            <button key={emoji} className="emoji-button">
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="log-section">
        <h3 className="section-title">Your Progress Logs</h3>
        {logs.length > 0 ? (
          <ul className="log-list">
                    {Object.entries(groupLogsByHabit(logs)).map(([habit, entries]) => (
          <div key={habit} className="habit-log-block">
            <h4>{habit}</h4>
            <ul className="log-list">
              {entries.map((log, i) => (
                <li key={i}>
                  ✅ {new Date(log.date).toLocaleDateString()} – {log.note || "No note"}
                </li>
              ))}
            </ul>
          </div>
        ))}
          </ul>
        ) : (
          <p className="no-logs">No progress logs yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProgressLog;