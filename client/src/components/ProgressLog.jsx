import React, { useEffect, useState } from "react";

function ProgressLog() {
    const [logs, setLogs] = useState([]);
    const [streak, setStreak] = useState(0);

    useEffect(() => {
        fetch('/logs')
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Failed to fetch logs");
            })
            .then((data) => {
                setLogs(data);
                setStreak(calculateStreak(data));
            })
            .catch((err) => console.error(err))
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
    <div className="max-w-3xl mx-auto p-4">
      {streakDates.length > 0 && (
        <div className="bg-white p-4 rounded shadow-md mb-6 text-center">
          <h2 className="text-xl font-bold text-green-700 mb-2">
            🔥 {streakDates.length}-Day Streak
          </h2>
          <div className="flex justify-center gap-1 flex-wrap">
            {streakDates.map((date, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm"
                title={date}
              >
                🔥
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Your Progress Logs
        </h3>
        {logs.length > 0 ? (
          <ul className="space-y-3">
            {logs.map((log, index) => (
              <li
                key={index}
                className="border-b pb-2 text-sm text-gray-700"
              >
                ✅ {new Date(log.date).toLocaleDateString()} – {log.note || "No note"}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No progress logs yet.</p>
        )}
      </div>
    </div>
  );
}

export default ProgressLog;