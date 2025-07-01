// components/JoinChallengeForm.js
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

function JoinChallengeForm() {
  const [challenges, setChallenges] = useState([]);
  const [joinedIds, setJoinedIds] = useState([]);
  const [participationMap, setParticipationMap] = useState({});

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/challenges`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setChallenges(data);
        const joined = data
          .filter(c => c.user_joined)
          .map(c => c.id);
        setJoinedIds(joined);
      });

    fetch(`${process.env.REACT_APP_API_URL}/participation`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        const map = {};
        data.forEach(p => {
          map[p.challenge_id] = p.id;
        });
        setParticipationMap(map);
      });
  }, []);

  const handleJoin = (challenge_id) => {
    fetch(`${process.env.REACT_APP_API_URL}/participation`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ challenge_id }),
    })
      .then((res) => {
        if (!res.ok) return res.json().then((data) => { throw new Error(data.error) });
        return res.json();
      })
      .then(() => {
        toast.success("Joined challenge!");
        setJoinedIds(prev => [...prev, challenge_id]);
      })
      .catch((err) => toast.error(err.message));
  };

  const handleLeave = (challenge_id) => {
    const participation_id = participationMap[challenge_id];
    if (!participation_id) return;

    fetch(`${process.env.REACT_APP_API_URL}/participation/${participation_id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to leave challenge");
        return res.json();
      })
      .then(() => {
        toast.success("Left challenge");
        setJoinedIds(prev => prev.filter(id => id !== challenge_id));
      })
      .catch((err) => toast.error(err.message));
  };

  return (
    <div className="join-challenges-container">
      <h2>💪 Join a Challenge</h2>
      <ul className="challenge-list">
        {challenges.map(ch => (
          <li key={ch.id} className="challenge-card">
            <h3>{ch.title}</h3>
            <p>{ch.description}</p>
            <p><strong>By:</strong> {ch.creator_name}</p>

            {joinedIds.includes(ch.id) ? (
              <button disabled className="joined-btn">Already Joined</button>
              
              // <button onClick={() => handleLeave(ch.id)} className="leave-btn">Leave</button>
            ) : (
              <button onClick={() => handleJoin(ch.id)} className="join-btn">Join</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default JoinChallengeForm;
