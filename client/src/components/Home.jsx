import React from "react";
import { Link } from "react-router-dom";
import '../index.css';

function Home() {
  return (
     <div className="home-hero">
      <div className="background-overlay"></div>
      <div className="floating-element floating-1"></div>
      <div className="floating-element floating-2"></div>
      <div className="floating-element floating-3"></div>

    <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="title-transform">Transform Your Life</span>
            <span className="title-your-life">One Habit at a Time</span>
            <span className="title-subtitle">Consistency Builds Greatness</span>
          </h1>

          <p className="hero-description">
            Join a growing community focused on <span className="highlight highlight-purple">clarity</span>, <span className="highlight highlight-pink">discipline</span>, and <span className="highlight highlight-blue">growth</span>.
            Start challenges, track your progress, and become your best self — all in one place.
          </p>

          <div className="cta-buttons">
            <Link to="/signup">
              <button className="btn btn-primary">
                <span className="btn-text">Start Your Journey</span>
              </button>
            </Link>
            <Link to="/login">
              <button className="btn btn-secondary">
                <span className="btn-text">Already Have an Account?</span>
              </button>
            </Link>
          </div>
        </div>

        <div className="hero-image-container">
          <div className="hero-image-wrapper">
            <img
              src="https://cdn.pixabay.com/photo/2015/05/18/23/53/backpacker-772991_1280.jpg"
              alt="Self Improvement Visual"
              className="hero-image"
            />
          </div>
        </div>
      </div>

       <div className="bottom-gradient"></div>
    </div>
  );
}

export default Home;
