import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import './index.css';

const ProfileSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  bio: Yup.string().max(100, "Bio can't be more than 100 characters"),
  image_url: Yup.string().url("Must be a valid URL"),
});

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      credentials: "include",
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Unauthorized"))
      .then((data) => setProfile(data))
      .catch(console.error);
  }, []);

  const handleSave = (values, { setSubmitting }) => {
    fetch(`${process.env.REACT_APP_API_URL}/profile`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(values)
    })
      .then((res) => res.ok ? res.json() : Promise.reject("Update failed"))
      .then((updated) => {
        setProfile(updated);
        setIsEditing(false);
      })
      .catch((err) => alert(err))
      .finally(() => setSubmitting(false));
  };

  if (!profile) return <p>Loading profile...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <img
          src={profile.image_url || "/placeholder.png"}
          alt="Profile"
          className="profile-avatar"
        />

        {isEditing ? (
          <Formik
            initialValues={profile}
            validationSchema={ProfileSchema}
            onSubmit={handleSave}
          >
            {({ isSubmitting }) => (
              <Form className="profile-form">
                <label>Username</label>
                <Field name="username" className="profile-input" />
                <ErrorMessage name="username" component="div" className="profile-error" />

                <label>Email</label>
                <Field name="email" type="email" className="profile-input" />
                <ErrorMessage name="email" component="div" className="profile-error" />

                <label>Bio</label>
                <Field name="bio" as="textarea" className="profile-textarea" />
                <ErrorMessage name="bio" component="div" className="profile-error" />

                <label>Profile Image URL</label>
                <Field name="image_url" className="profile-input" />
                <ErrorMessage name="image_url" component="div" className="profile-error" />

                <button type="submit" disabled={isSubmitting} className="profile-btn">
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="profile-btn cancel">
                  Cancel
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <>
            <h2 className="profile-username">@{profile.username}</h2>
            <p className="profile-email">{profile.email}</p>
            <p className="profile-bio">"{profile.bio || "You are your only limit."}"</p>
            <button onClick={() => setIsEditing(true)} className="profile-btn">Edit Profile</button>
          </>
        )}

        <div className="motivational-section">
          <h4>🌱 Keep growing</h4>
          <p>You’ve already taken the first step. Show up again today.</p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
