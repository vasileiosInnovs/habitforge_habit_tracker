import React, { useState } from "react";
import '../index.css';

function JoinChallengeForm({ challengeId, onJoined }) {
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_API_URL}/participations`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: "include",
            body: JSON.stringify({ challenge_id: challengeId, reason_for_joining: note, personal_goal:note })
        })
            .then((r) => r.json())
            .then(onJoined)
    };

    return (
        <form onSubmit={handleSubmit} className="" >
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why are you joining?" />
            <button type="submit" className="" >Join Challenge</button>
        </form>
    );
}

export default JoinChallengeForm;