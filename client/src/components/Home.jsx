import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-700">Welcome to HabitMaster</h1>
      <p className="text-lg text-gray-700 mb-6">
        Build better habits, take on challenges, and track your self-improvement journey — one step at a time.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <Link to="/signup">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl shadow">
            Get Started
          </button>
        </Link>
        <Link to="/login">
          <button className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-xl shadow">
            Log In
          </button>
        </Link>
      </div>

      <div className="mt-10">
        <p className="text-sm text-gray-500">
          Already tracking habits? <Link to="/habits" className="text-blue-600 underline">View Your Habits</Link>
        </p>
      </div>
    </div>
  );
}

export default Home;
