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
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch challenges");
        return res.json();
      })
      .then(setChallenges)
      .catch((err) => console.error("Failed to load challenges", err));
  }, []);

  const handleChallengeCreated = (newChallenge) => {
    setChallenges((prev) => [...prev, newChallenge]);
    toast.success("Challenge created!");
  };

  const handleJoin = (challengeId) => {
    setJoinedChallengeId(challengeId);
  };

  const handleJoined = () => {
    toast.success("You joined the challenge!");
    setJoinedChallengeId(null);
  };

  const yourChallenges = challenges.filter((c) => c.user_id === user?.id);
  const otherChallenges = challenges.filter((c) => c.user_id !== user?.id);

  return (
    <div className="challenge-list-container">
      <h2>Create a Challenge</h2>
      {user && <ChallengeForm onChallengeCreated={handleChallengeCreated} />}

      <h2>All Challenges</h2>
      <div className="challenge-grid">
        {challenges.length === 0 && (
          <p className="no-challenges">No challenges available yet.</p>
        )}

        {[...yourChallenges, ...otherChallenges].map((challenge) => (
          <div key={challenge.id} className="challenge-card">
            <h3>{challenge.title}</h3>
            <p>{challenge.description}</p>
            <p>
              <strong>Start:</strong>{" "}
              {new Date(challenge.start_date).toLocaleDateString()}
            </p>
            <p>
              <strong>End:</strong>{" "}
              {new Date(challenge.end_date).toLocaleDateString()}
            </p>

            {challenge.user_id !== user?.id &&
              (joinedChallengeId === challenge.id ? (
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
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChallengeList;