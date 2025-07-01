import React, { useEffect, useState } from "react";
import '../index.css';
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import ChallengeForm from "./ChallengeForm";

function MyDay() {
  const [habits, setHabits] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allChallenges, setAllChallenges] = useState([]);
  const [createdChallenges, setCreatedChallenges] = useState([]);
  const [challengeStreaks, setChallengeStreaks] = useState({});

  const fetchChallengeLogs = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/logs`, {
        credentials: "include"
      });

      if (!res.ok) throw new Error("Failed to fetch logs");

      const data = await res.json();
      const streaks = {};

      joinedChallenges.forEach((ch) => {
        const logsForChallenge = data
          .filter((log) => log.challenge_id === ch.id)
          .map((log) => log.date);

        streaks[ch.id] = calculateStreak(logsForChallenge);
      });

      setChallengeStreaks(streaks);
    } catch (err) {
      console.error("Error loading challenge logs:", err);
    }
  };

  useEffect(async () => {
  const loadData = async () => {
    await fetchHabits();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load challenges");

      const data = await res.json();
      setJoinedChallenges(data);
    } catch (err) {
      console.error("Error loading challenges:", err);
      setJoinedChallenges([]);
    }

    try {
      const resCreated = await fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
        credentials: "include",
      });
      if (resCreated.ok) {
        const data = await resCreated.json();
        setCreatedChallenges(data);
      }
    } catch (err) {
      console.error("Error loading created challenges:", err);
    }

    setLoading(false);
  };

  loadData();
  await fetchChallengeLogs();

}, []);



  const fetchHabits = () => {
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
          const completedCount = data.filter(h => h.completed).length;
          setStreak(completedCount);
        } else {
          setHabits([]);
          setStreak(0);
        }
      })
    .catch((err) => {
      console.error("Error fetching habits:", err);
      setHabits([]);
      setStreak(0);
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleLeaveChallenge = async (participationId, challengeId) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/participation/${participationId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to leave challenge");
      }

      toast.success("Successfully left challenge!");
    
      setJoinedChallenges(prev => 
        prev.filter(ch => ch.participation_id !== participationId)
      );
      fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setJoinedChallenges(data));      
    } catch (err) {
      console.error("Failed to leave challenge:", err);
      toast.error(err.message);
    }
  };

const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const getDaysRemaining = (endDate) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getChallengeStatus = (challenge) => {
    const now = new Date();
    const start = new Date(challenge.start_date);
    const end = challenge.end_date ? new Date(challenge.end_date) : null;

    if (now < start) {
      return { status: 'upcoming', text: 'Upcoming', class: 'status-upcoming' };
    } else if (end && now > end) {
      return { status: 'completed', text: 'Completed', class: 'status-completed' };
    } else {
      return { status: 'active', text: 'Active', class: 'status-active' };
    }
  };

  const handleEditChallenge = (challenge) => {
  toast.info(`Edit challenge: ${challenge.title}`);
};
const handleJoinChallenge = async (challengeId) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/participation`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ challenge_id: challengeId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Failed to join");
    }

    toast.success("Joined the challenge!");
   
    const updated = await fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      credentials: "include",
    });
    const data = await updated.json();
    setJoinedChallenges(data);

  } catch (err) {
    toast.error(err.message);
  }
};
const handleLog = (habitId) => {
    fetch(`${process.env.REACT_APP_API_URL}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ habit_id: habitId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Log failed");
        return res.json();
      })
      .then(() => {
        fetchHabits();
      })
      .catch((err) => console.error("Error logging habit", err));
  };

const handleDeleteChallenge = async (challengeId) => {
  const confirmed = window.confirm("Are you sure you want to delete this challenge?");
  if (!confirmed) return;

  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/challenges/${challengeId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Failed to delete challenge");

    toast.success("Challenge deleted successfully!");
    setCreatedChallenges(prev => prev.filter(c => c.id !== challengeId));
  } catch (err) {
    console.error("Delete error:", err);
    toast.error("Error deleting challenge");
  }
};
function calculateStreak(logDates) {
  const dates = [...new Set(logDates.map(d => new Date(d).toDateString()))].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let current = new Date();

  for (let dateStr of dates) {
    const date = new Date(dateStr);
    if (current.toDateString() === date.toDateString()) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

  const activeChallenges = joinedChallenges.filter(c => getChallengeStatus(c).status === 'active');

  if (loading) {
    return (
      <div className="myday-container">
        <div className="loading">Loading your day...</div>
      </div>
    );
  }

  const handleLogChallengeProgress = async (challengeId) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/logs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ challenge_id: challengeId }),
      });

      if (!res.ok) throw new Error("Failed to log progress");

      toast.success("Progress logged!");
    } catch (err) {
      console.error("Log progress error:", err);
      toast.error("Could not log progress");
    }
  };

  return (
    <div className="myday-container">
      {activeChallenges.map((challenge) => {
        const daysRemaining = getDaysRemaining(challenge.end_date);

        return (
          <div key={challenge.id} className="challenge-card myday-challenge active">
            <div className="challenge-header">
              <h3>{challenge.title}</h3>
              <span className="status-badge active">Active</span>
            </div>

            <p className="challenge-description">{challenge.description}</p>

            <div className="challenge-meta">
              <p><strong>By:</strong> {challenge.creator_name}</p>
              {challenge.end_date && (
                <p><strong>Ends:</strong> {formatDate(challenge.end_date)}</p>
              )}
            </div>

            {daysRemaining !== null && (
              <div className="days-remaining">
                {daysRemaining > 0 ? (
                  <span className="days-left">
                    ⏰ {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
                  </span>
                ) : daysRemaining === 0 ? (
                  <span className="ending-today">🚨 Ending today!</span>
                ) : (
                  <span className="overdue">📅 Overdue</span>
                )}
              </div>
            )}

            <div className="challenge-streak-bar">
              {challengeStreaks[challenge.id] > 0 ? (
                Array(challengeStreaks[challenge.id])
                  .fill()
                  .map((_, index) => (
                    <span key={index} className="streak-flame">🔥</span>
                  ))
              ) : (
                <p className="no-streak">No streak yet</p>
              )}
            </div>

            <div className="challenge-actions">
              <button
                className="progress-btn"
                onClick={() => handleLogChallengeProgress(challenge.id)}
              >
                📊 Log Progress
              </button>
              {challenge.user_joined ? (
                <button
                  onClick={() => handleLeaveChallenge(challenge.participation_id, challenge.id)}
                  className="leave-btn secondary"
                >
                  Leave
                </button>
              ) : (
                <button
                  onClick={() => handleJoinChallenge(challenge.id)}
                  className="join-btn primary"
                >
                  Join
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default MyDay;
