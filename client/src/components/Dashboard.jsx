import React, { useEffect, useState } from "react";

function MyDay() {
  const [habits, setHabits] = useState([]);
  const [streakDates, setStreakDates] = useState([]);
  const [quote, setQuote] = useState("");

  useEffect(() => {
    fetch("/habits").then(res => res.json()).then(data => setHabits(data));
    fetch("/logs").then(res => res.json()).then(data => setStreakDates(calculateStreakDates(data)));
    fetchRandomQuote();
  }, []);

}