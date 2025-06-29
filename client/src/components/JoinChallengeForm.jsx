import React, { useState } from "react";

function JoinChallengeForm({ challengeId, onJoined }) {
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('https://habitforge-habit-tracker.onrender.com/participations', {
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