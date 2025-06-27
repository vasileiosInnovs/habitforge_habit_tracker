import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (

    <div className="min-h-screen bg-gradient-to-b from-[#fefcea] to-[#f1da36] flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-4">Welcome back, {username} 👋</h1>
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
          Transform Your Life, One Habit at a Time
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Join a growing community focused on mental clarity, discipline, and growth.
          Start challenges, track your progress, and become your best self — all in one place.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg transition-all duration-200">
              Start Your Journey
            </button>
          </Link>
          <Link to="/login">
            <button className="border border-green-600 text-green-700 hover:bg-green-50 px-6 py-3 rounded-full shadow-lg transition-all duration-200">
              Already Have an Account
            </button>
          </Link>
        </div>

        <div className="mt-10 text-gray-600 text-sm">
          <p>
            Want to explore habits? <Link to="/habits" className="text-green-700 underline">View Habit Library</Link>
          </p>
        </div>
      </div>

      <div className="mt-12">
        <img
          src="https://cdn.pixabay.com/photo/2017/08/06/09/59/mountain-2581045_960_720.jpg"
          alt="Self Improvement Visual"
          className="w-full max-w-lg rounded-2xl shadow-xl"
        />
      </div>
    </div>
  );
}

export default Home;
