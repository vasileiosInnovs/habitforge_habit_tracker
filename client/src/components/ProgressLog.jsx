import React, { useEffect, useState } from "react";
import "../styles/Lists.css";

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [streakDates, setStreakDates] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey((prev) => prev + 1);
    window.addEventListener("refreshLogs", handleRefresh);
    return () => window.removeEventListener("refreshLogs", handleRefresh);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/logs`, {
      credentials: "include",
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setLogs(data);
        setStreakDates(calculateStreakDates(data));
      });
  }, [refreshKey]);

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

  function groupLogsByType(logs) {
    const byHabit = {};
    const byChallenge = {};

    for (let log of logs) {
      if (log.habit_id) {
        const key = log.name || "Unnamed Habit";
        if (!byHabit[key]) byHabit[key] = [];
        byHabit[key].push(log);
      } else if (log.challenge_id) {
        const key = log.challenge_title || "Unnamed Challenge";
        if (!byChallenge[key]) byChallenge[key] = [];
        byChallenge[key].push(log);
      }
    }

    return { byHabit, byChallenge };
  }

  const grouped = groupLogsByType(logs);

  return (
    <div className="progress-log">
      <div className="refresh-logs">
        <button
          className="refresh-button"
          onClick={() => setRefreshKey((prev) => prev + 1)}
        >
          🔄 Refresh Logs
        </button>
      </div>

      {Object.entries(grouped.byHabit).map(([name, entries]) => (
        <div className="habit-log-block" key={name}>
          <h4>Habit: {name}</h4>
          <ul>
            {entries.map((log, i) => (
              <li
                key={i}
                className={`log-entry ${
                  log.completed ? "log-completed" : "log-pending"
                }`}
              >
                {log.completed ? "✅" : "❌"}{" "}
                {new Date(log.date).toLocaleDateString()} – {log.note || "No note"}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {Object.entries(grouped.byChallenge).map(([name, entries]) => (
        <div className="challenge-log-block" key={name}>
          <h4>Challenge: {name}</h4>
          <ul>
            {entries.map((log, i) => (
              <li
                key={i}
                className={`log-entry ${
                  log.completed ? "log-completed" : "log-pending"
                }`}
              >
                {log.completed ? "✅" : "❌"}{" "}
                {new Date(log.date).toLocaleDateString()} – {log.note || "No note"}
              </li>
            ))}
          </ul>
        </div>
      ))}

      {streakDates.length > 0 && (
        <div className="streak-display">
          <h2 className="streak-title">🔥 {streakDates.length}-Day Streak</h2>
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
    </div>
  );
}

export default ProgressLog;
