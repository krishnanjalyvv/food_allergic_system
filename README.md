# 🍽️ SafeBite
### AI Powered Food Allergic System

An intelligent web application that helps users identify food allergens from food images using **Google Gemini AI**, providing personalized allergen warnings based on the user's medical profile.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Flask](https://img.shields.io/badge/Flask-Python-000000?logo=flask)](https://flask.palletsprojects.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini-4285F4?logo=google)](https://ai.google.dev/)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render)](https://render.com/)

</div>

---

# 📖 Overview

Food allergies affect millions of people worldwide and accidental exposure to allergens can cause serious health risks.

**SafeBite** is an AI-powered web application that enables users to analyze food images, identify ingredients, detect potential allergens, and receive personalized safety recommendations using **Google Gemini AI**.

The system also allows users to maintain a medical profile, upload medical reports, and interact with an AI assistant for food-related guidance.

---

# ✨ Features

- 🤖 AI-powered food image analysis using Google Gemini
- 📷 capture food images
- 🥗 Ingredient detection
- ⚠️ Hidden allergen identification
- 👤 User registration and login
- 🩺 Personalized medical profile
- 📄 Medical report (PDF) upload
- 💬 AI chatbot for food safety queries
- ☁️ Fully deployed frontend and backend
- 📱 Responsive user interface
- 🥗 Dietary Preferences


---

# 🛠️ Tech Stack

## Frontend

- Next.js 15
- React
- Tailwind CSS
- Lucide React

## Backend

- Python
- Flask
- Flask-CORS
- SQLite

## AI Technologies

- Google Gemini API
- Image Recognition
- Natural Language Processing (NLP)

## Deployment

- Vercel (Frontend)
- Render (Backend)
- GitHub

---

# 🏗️ Project Architecture

```
                User
                  │
                  ▼
        Next.js Frontend (Vercel)
                  │
        REST API Requests
                  │
                  ▼
        Flask Backend (Render)
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
 Google Gemini API      SQLite Database
        │
        ▼
 AI Analysis & Response
```

---

# 📂 Project Structure

```
food_allergic_system
│
├── client/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── server/
│   ├── server.py
│   ├── chat.py
│   ├── requirements.txt
│   └── users.db
│
├── README.md
└── .gitignore
```

---

# 🚀 Live Demo

## Frontend

https://food-allergic-system.vercel.app

## Backend API

https://food-allergic-system.onrender.com

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/krishnanjalyvv/food_allergic_system.git
cd food_allergic_system
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Runs at:

```
http://localhost:3000
```

---

## Backend Setup

```bash
cd server

python -m venv .venv

# Windows
.venv\Scripts\activate

# Linux / macOS
source .venv/bin/activate

pip install -r requirements.txt

python server.py
```

Runs at:

```
http://localhost:5000
```

---

# 🔑 Environment Variables

Create a `.env` file inside the `server` directory.

```
GEMINI_API_KEY=YOUR_API_KEY
```

---

# 🔗 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | User login |
| POST | `/predict` | Analyze food image |
| POST | `/talk` | AI Chat |
| POST | `/profile` | Save medical profile |
| POST | `/upload_medical_report` | Upload medical report |

---

# 🔄 Application Workflow

1. User registers and logs into the application.
2. User creates a medical profile and allergy preferences.
3. User uploads or captures a food image.
4. Google Gemini analyzes the image.
5. Ingredients are identified.
6. Potential allergens are detected.
7. The system compares results with the user's allergy profile.
8. Personalized warnings and recommendations are displayed.
9. Users can ask additional questions using the AI chatbot.

---

# 📸 Screenshots


## Login Page

```
```
<img width="1920" height="1080" alt="Screenshot (104)" src="https://github.com/user-attachments/assets/1f0a45bf-92c0-4df4-bf39-91383631a085" />

```

## Registration Page

```
```
<img width="1920" height="1080" alt="Screenshot (103)" src="https://github.com/user-attachments/assets/cc9dc8ca-3950-4834-ac25-eda54984e2ba" />


```

## Medical Profile

```
```
<img width="1920" height="1080" alt="Screenshot (106)" src="https://github.com/user-attachments/assets/79dc0c11-ef4c-41de-935d-a16f9a997706" />

```

## AI Food Detection

```
```
<img width="1920" height="1080" alt="Screenshot (112)" src="https://github.com/user-attachments/assets/c3aed61f-5b63-40d6-bd80-d98d256fdde6" />

```

## Chatbot

```

```
<img width="1920" height="1080" alt="Screenshot (115)" src="https://github.com/user-attachments/assets/92b18e00-58b3-4bc1-b604-4e98d6473d2f" />

---

# 🌟 Future Enhancements

- 📱 Android & iOS Application
- 🌍 Multi-language Support
- 🛒 Barcode Scanner
- 🎤 Voice Assistant
- ☁️ Cloud Database Integration
- 🍽️ Personalized Meal Recommendation System
- 📊 Nutrition Analysis Dashboard

---

# 👨‍💻 Contributors

- **Krishnanjaly V V**
- **Arsha V A**
- **Anett Benny**
- **Dhiya Shaju K**
- **Sruthy Sunil**
- **Laxmitha**

---

# 🤝 Acknowledgements

- Google Gemini API
- Flask
- Next.js
- React
- Tailwind CSS
- Render
- Vercel
- GitHub

---

# 📜 License

This project was developed as part of a **B.Tech Computer Science & Engineering Mini Project** for educational and academic purposes.

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a Star!

Made with ❤️ using AI & Web Technologies

</div>
 
