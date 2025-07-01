import React, { useEffect, useState } from "react";
import '../index.css';

import { toast } from "react-toastify";

function MyDay() {
  const [habits, setHabits] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadData = async () => {
    await fetchHabits();

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/myday/challenges`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to load challenges");

      const data = await res.json();
      setJoinedChallenges(data);
    } catch (err) {
      console.error("Error loading challenges:", err);
      setJoinedChallenges([]);
    }

    setLoading(false);
  };

  loadData();
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

  const handleLeaveChallenge = async (challengeId) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/challenges/${challengeId}/participate`,
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
        prev.filter(challenge => challenge.id !== challengeId)
      );
      
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

  const activeChallenges = joinedChallenges.filter(c => getChallengeStatus(c).status === 'active');

  if (loading) {
    return (
      <div className="myday-container">
        <div className="loading">Loading your day...</div>
      </div>
    );
  }

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

  return (
    <div className="myday-container">
      <h1 className="myday-title">🌞 Welcome to Your Day</h1>

      <div className="daily-summary">
        <div className="summary-card">
          <h3>{streak}</h3>
          <p>Habits Completed</p>
        </div>
        <div className="summary-card">
          <h3>{activeChallenges.length}</h3>
          <p>Active Challenges</p>
        </div>
        <div className="summary-card">
          <h3>{habits.length + activeChallenges.length}</h3>
          <p>Total Goals</p>
        </div>
      </div>

      <div className="streak-display">
        <h2>🔥 Today's Progress</h2>
        <div className="streak-bar">
          {streak > 0 ? (
            Array(streak)
              .fill()
              .map((_, index) => (
                <span key={index} className="streak-flame">
                  🔥
                </span>
              ))
          ) : (
            <p>No habits completed yet. Let's get started!</p>
          )}
        </div>
      </div>

      <div className="habits-section">
        <h2>📝 Today’s Habits</h2>
        {habits.length === 0 ? (
          <p className="no-habits">You have no habits for today.</p>
        ) : (
          <ul className="habit-list">
            {habits.map((habit) => (
              <li key={habit.id} className="habit-card">
                <div className="habit-text">
                  <h3>{habit.name}</h3>
                  <p>{habit.description}</p>
                </div>
                {habit.completed ? (
                  <button className="log-button completed" disabled>
                    Completed
                  </button>
                ) : (
                  <button
                    className="log-button"
                    onClick={() => handleLog(habit.id)}
                  >
                    Mark as Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {activeChallenges.length > 0 && (
        <div className="challenges-section">
          <h2>🏆 Active Challenges</h2>
          <div className="challenges-grid">
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

                  <div className="challenge-actions">
                    <button className="progress-btn">
                      📊 Log Progress
                    </button>
                    <button 
                      onClick={() => handleLeaveChallenge(challenge.id)}
                      className="leave-btn secondary"
                    >
                      Leave
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {joinedChallenges.length > activeChallenges.length && (
        <div className="view-all-challenges">
          <p>You have {joinedChallenges.length - activeChallenges.length} more challenge{joinedChallenges.length - activeChallenges.length !== 1 ? 's' : ''}</p>
          <a href="/challenges" className="view-all-btn">
            View All Challenges
          </a>
        </div>
      )}

      <div className="quick-actions">
        <h2>🚀 Quick Actions</h2>
        <div className="action-buttons">
          <NavLink to="/habits" className="action-btn">
            ➕ Add New Habit
          </NavLink>
          <NavLink to="/challenges" className="action-btn">
            🔍 Find Challenges
          </NavLink>
        </div>
      </div>
    </div>
  );
}

export default MyDay;
