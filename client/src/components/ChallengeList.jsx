import React, { useEffect, useState } from "react";
import ChallengeForm from "./ChallengeForm";
import JoinChallengeForm from "./JoinChallengeForm";
import { toast } from "react-toastify";
import "../styles/Lists.css";

function ChallengeList({ user }) {
  const [challenges, setChallenges] = useState([]);
  const [joinedChallengeId, setJoinedChallengeId] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      credentials: "include"
    })
      .then((res) => res.json())
      .then(data => setChallenges(data))
      .catch((err) => console.error("Failed to load challenges", err));
  }, []);

  const handleChallengeCreated = (newChallenge) => {
    setChallenges(prev => [...prev, newChallenge]);
    toast.success("Challenge created!");
  };

  const handleJoin = (challengeId) => {
    setJoinedChallengeId(challengeId);
  };

  const handleJoined = () => {
    toast.success("You joined the challenge!");
    setJoinedChallengeId(null);
  };

  // ✅ Filter out challenges created by current user
  const otherChallenges = challenges.filter(c => c.user_id !== user?.id);

  return (
    <div className="challenge-list-container">
      <h2>All Challenges</h2>

      {/* Only show the form if user is logged in */}
      {user && <ChallengeForm onChallengeCreated={handleChallengeCreated} />}

      <div className="challenge-grid">
        {otherChallenges.map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <p><strong>Start:</strong> {challenge.start_date}</p>
            <p><strong>End:</strong> {challenge.end_date}</p>

            {joinedChallengeId === challenge.id ? (
              <JoinChallengeForm
                challengeId={challenge.id}
                onJoined={handleJoined}
              />
            ) : (
              <button
                onClick={() => handleJoin(challenge.id)}
                className="join-btn"
              >
                Join Challenge
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengeList;
