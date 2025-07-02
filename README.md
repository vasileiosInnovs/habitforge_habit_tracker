
# 🌱 HabitForge: Your Self-Improvement Habit Tracker

A full-stack web app designed to help you build better habits, join challenges, and stay on track — all through a beautifully responsive and intuitive interface.

---


## 🚀 Features

- 🔒 Secure user authentication (signup, login, logout)
- 🧠 Habit tracking with daily streaks
- 🎯 Create and join self-improvement challenges
- ✍️ Log your progress and view history
- 🧑 Personalized user profiles and bios
- 📱 Mobile-first, responsive design
- ✅ Toast notifications for key user actions
- 🔄 Persistent sessions via cookies
  

---


## 🛠 Tech Stack

**Frontend:**
- React
- React Router
- React Toastify
- Formik + Yup (form validation)
- Custom CSS (mobile-first design)

**Backend:**
- Flask (Python)
- Flask-SQLAlchemy
- Flask-Login
- PostgreSQL (production) / SQLite (development)

---

## 📁 Project Structure

```

client/                 # React frontend
├── components/         # Reusable UI components
├── styles/             # Custom CSS stylesheets
├── App.js              # App layout and routing
└── index.js            # Entry point

server/                 # Flask backend
├── models/             # SQLAlchemy models
├── controllers/        # Flask route blueprints
├── app.py              # Application factory
└── config.py           # App configuration
```


---

## 🧪 Getting Started

### 📦 Backend (Flask API)

1. **Create and activate a virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Set up the database:**

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

4. *(Optional)* **Seed the database:**

   ```bash
   python seed.py
   ```

5. **Run the server:**

   ```bash
   flask run
   ```

---

### 💻 Frontend (React App)

1. **Navigate to the client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file with your backend URL:**

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the frontend server:**

   ```bash
   npm start
   ```

---

## 🌍 Deployment

Explore the live app here:
👉 [habitforge.onrender.com](https://habitforge.onrender.com)

---

## 🔭 Future Enhancements

* 📊 Progress charts and analytics (using Recharts)
* 🤝 Social features: follow users, comment on challenges
* 🗓 Calendar view to visualize streaks
* 📧 Email reminders and notifications

---

## 👨‍💻 Author

Built with passion by **Hagee R** 💪
Feedback and contributions are always welcome!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

```

Let me know if you’d like to add badges (e.g. GitHub stars, deployment status), screenshots, or GIF demos for extra polish!
```
