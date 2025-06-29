import React, { useEffect, useState } from "react";

function ProgressLog() {
  const [logs, setLogs] = useState([]);
  const [streakDates, setStreakDates] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/logs`)
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

  return (
    <div className="">
      {streakDates.length > 0 && (
        <div className="">
          <h2 className="">
            🔥 {streakDates.length}-Day Streak
          </h2>
          <div className="">
            {streakDates.map((date, index) => (
              <div
                key={index}
                className=""
                title={date}
              >
                🔥
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="">
        <h2 className="">😌 Mood Today</h2>
        <div className="">
          {['😄','🙂','😐','😟','😩'].map((emoji) => (
            <button key={emoji} className="" >{emoji}</button>
          ))}
        </div>
      </div>

      <div className="">
        <h3 className="">
          Your Progress Logs
        </h3>
        {logs.length > 0 ? (
          <ul className="">
            {logs.map((log, index) => (
              <li
                key={index}
                className=""
              >
                ✅ {new Date(log.date).toLocaleDateString()} – {log.note || "No note"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="">No progress logs yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProgressLog;
