import React from "react";
import { Link } from "react-router-dom";
import '../styles/Home.css';

function Home() {
  return (

    <div className="home home-hero" >
      <div>
        <img
          src="https://cdn.pixabay.com/photo/2015/05/18/23/53/backpacker-772991_1280.jpg"
          alt="Self Improvement Visual"
          className="hero-image"
        />
      </div>
      <div className="home" >
        
        <h1 >
          Transform Your Life, One Habit at a Time
        </h1>
        <p>
          Join a growing community focused on mental clarity, discipline, and growth.
          Start challenges, track your progress, and become your best self — all in one place.
        </p>

        <div>
          <Link to={"/signup"}>
            <button>
              Start Your Journey
            </button>
          </Link>
          <Link to={"/login"}>
            <button>
              Already Have an Account
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Home;
