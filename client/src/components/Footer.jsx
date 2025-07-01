import React from "react";
import { Link } from "react-router-dom"

import "../index.css";

function Footer() {
  return (
    <footer className="app-footer">
    <div className="footer-grid">
      <div className="footer-column">
        <h4><span className="sr-only">HabitForge - </span>Empowering Growth</h4>
        <p>Helping you build better habits, achieve personal growth, and live your best life — one step at a time.</p>
      </div>

      <div className="footer-column">
        <h5>Quick Links</h5>
        <ul>
          <li><Link to="/myday">My Day</Link></li>
          <li><Link to="/challenges">Challenges</Link></li>
          <li><Link to="/profile">Profile</Link></li>
          <li><Link to="/signup">Get Started</Link></li>
        </ul>
      </div>

      <div className="footer-column">
        <h5>Resources</h5>
        <ul>
          <li><a href="#">Blog</a></li>
          <li><a href="#">Success Stories</a></li>
          <li><a href="#">Community Forum</a></li>
          <li><a href="#">Help Center</a></li>
        </ul>
      </div>

      <div className="footer-column">
        <h5>Contact Us</h5>
        <p>Email: <a href="mailto:support@habitforge.app">support@habitforge.app</a></p>
        <p>Phone: +254 000 000000</p>
        <div className="social-icons">
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin-in"></i></a>
        </div>
      </div>
    </div>
    <p>
      <a href="#top" style={{ color: "#63b3ed", fontWeight: "bold" }}>
        Back to top ↑
      </a>
    </p>


    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} HabitForge. Built with intention and care.</p>
    </div>
</footer>
  );
}

export default Footer;