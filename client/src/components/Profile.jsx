import React, { useEffect, useState } from "react";
import "./Profile.css";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch("/profile")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Not logged in");
      })
      .then((data) => setProfile(data))
      .catch((err) => console.error(err));
  }, []);

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={user.image_url}
          alt="Profile"
          className="profile-avatar"
        />
        <h2 className="profile-username">@{user.username}</h2>
        <p className="profile-email">{user.email}</p>
        <p className="profile-bio">"{user.bio || "You are your only limit."}"</p>

        <div className="motivational-section">
          <h4>🌱 Keep growing</h4>
          <p>You’ve already taken the first step. Show up again today.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;