import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (

    <div className="home" >
      <div className="home" >
        
        <h1 >
          Transform Your Life, One Habit at a Time
        </h1>
        <p>
          Join a growing community focused on mental clarity, discipline, and growth.
          Start challenges, track your progress, and become your best self — all in one place.
        </p>

        <div>
          <Link to="/signup">
            <button>
              Start Your Journey
            </button>
          </Link>
          <Link to="/login">
            <button>
              Already Have an Account
            </button>
          </Link>
        </div>

        <div>
          <p>
            Want to explore habits? <Link to="/habits">View Habit Library</Link>
          </p>
        </div>
      </div>

      <div>
        <img
          src="https://cdn.pixabay.com/photo/2017/08/06/09/59/mountain-2581045_960_720.jpg"
          alt="Self Improvement Visual"
          className="hero-image"
        />
      </div>
    </div>
  );
}

export default Home;
