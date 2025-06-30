
```markdown
# 🌱 Self-Improvement Habit Tracker

A full-stack web application that empowers users to build better habits, join challenges, and track their progress — all in a beautiful and responsive UI.

---

## 🚀 Features

- 🔒 Secure user authentication (signup, login, logout)
- 🧠 Track daily habits with streaks
- 🎯 Create and join self-improvement challenges
- ✍️ Log progress and view history
- 🧑 Personalized profile and bio
- 📱 Mobile-friendly responsive design
- ✅ Toast notifications for key actions
- 🔄 Persistent session using cookies

---

## 🛠 Tech Stack

**Frontend:**
- React
- React Router
- React Toastify
- Formik + Yup (for form validation)
- Custom CSS (mobile-first design)

**Backend:**
- Flask (Python)
- Flask-SQLAlchemy
- Flask-Login
- PostgreSQL (production) / SQLite (development)

---

## 📂 Project Structure

```

client/                 # React frontend
├── components/         # Reusable UI components
├── styles/             # Custom CSS files
├── App.js              # App routes & main layout
└── index.js            # Entry point

server/                 # Flask backend
├── models/          # SQLAlchemy models
├── controllers/        # Flask route blueprints
├── app.py              # Application factory
└── config.py           # Configuration

````

---

## 🧪 Setup Instructions

### 📦 Backend (Flask API)

1. **Create & activate virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate
````

2. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

3. **Run migrations & seed (optional):**

   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   python seed.py
   ```

4. **Start the server:**

   ```bash
   flask run
   ```

---

### 💻 Frontend (React App)

1. **Navigate to the client folder:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create a `.env` file:**

   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the frontend server:**

   ```bash
   npm start
   ```

---

## 🌐 Deployment Notes

* For deployment, you can use **Render** (backend) + **Netlify/Vercel** (frontend).
* Make sure to update `REACT_APP_API_URL` in production.

---

## ✨ Future Improvements

* 📈 Progress charts & analytics (Recharts)
* 🧩 Social features (follow others, comment on challenges)
* 🗓 Calendar view for streaks
* 📥 Email reminders

---

## 👨‍💻 Author

Built with passion by \ Hagee R 💪
Contributions and suggestions welcome!

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).

```