import React, { useState } from "react";

function JoinChallengeForm({ challengeId, onJoined }) {
    const [note, setNote] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('/participations', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ challenge_id: challengeId, reason_for_joining: note, personal_goal:note })
        })
            .then((r) => r.json())
            .then(onJoined)
    };

    return (
        <form onSubmit={handleSubmit} className="form">
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Why are you joining?" />
            <button type="submit">Join Challenge</button>
        </form>
    );
}

export default JoinChallengeForm;