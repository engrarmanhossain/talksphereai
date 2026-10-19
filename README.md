# 🎙️ TalkSphere AI — Your Intelligent English Speaking Partner

An interactive AI-powered English Speaking & Real-Time Correction Partner web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and the **Web Speech API** with **Google Registration / Login** and a dedicated **"Where Need to Improve"** learning analytics engine.

---

## ✨ Features

### 1. 🔐 Google Registration & Login
- **Sign In with Google**: Register and log in using your Google account to persist all your practicing sessions.
- **Account Sync**: Automatically saves your spoken turns, recorded mistakes, fluency ratings, and level progress per user account in browser storage.
- **Switch Accounts & Logout**: Multi-account support with instant profile switcher.

### 2. 🎯 "Where Need to Improve" Learning Analytics Dashboard
A dedicated diagnostic panel accessible directly from the header:
- **Mastery Breakdown**: Real-time percentage bars for **Overall Mastery**, **Grammar Mastery**, **Pronunciation Accuracy**, and **Vocabulary & Collocations**.
- **Top Weaknesses Catalog**: Identifies recurring mistakes (e.g., Irregular past tenses like *went/bought*, Third-person singular *doesn't*, Dependent prepositions like *depend on*, Dental fricative *TH* sounds, Silent letters in *comfortable/vegetable*).
- **Pitfall vs. Target Comparison**: Displays your exact spoken mistakes side-by-side with the correct phrasing.
- **Targeted Practice Drills**: Click **"Practice Drill"** on any weak spot to immediately launch a focused repetition exercise with voice similarity scoring and confetti celebration!

### 3. ⏸️ Conversation Pause & Resume Control
- **Pause Anytime**: Need to catch your breath, review whiteboard notes, or take a moment to think? Tap the **Pause** button on the floating dock or top header.
- **Standby Overlay**: Freezes the session timer, suspends microphone listening, stops ongoing tutor audio, and displays an elegant **"Session Paused"** overlay with a **"Resume Conversation"** button.
- **Audio Chimes**: Plays a gentle Web Audio pause/resume transition chime.

### 4. 🧑‍🏫 Realistic 1-on-1 Video Call Experience
- **Photorealistic Native English Tutors**:
  - **👩 Emma Watson-Smith**: Senior Oxford-certified English language coach.
  - **👨 Alex Harrison**: Cambridge-accredited communication specialist.
- **Interactive Audio Wave Aura**: Ambient soundwave lighting pulses dynamically when the tutor speaks.
- **Student Picture-in-Picture Webcam**: Turn on your camera with real-time Web Audio API voice volume decibel level bar.
- **Live Broadcast Subtitles**: Floating glassmorphic subtitles with instant mistake strike-through and green corrections.

### 4. 📈 Level-Wise System (Basic to Advanced)
- **🟢 Basic / Beginner (A1 - A2)**: Simple vocabulary, gentle pacing, foundational grammar corrections, and everyday topics (*Daily Casual Conversation*, *Cafe & Ordering Food*, *Self-Introduction & Hobbies*).
- **🟡 Intermediate (B1 - B2)**: Conversational idioms, storytelling in past tenses, modal verbs, and situational topics (*Travel & Airport Check-In*, *Job Interview Practice*, *Weekend Storytelling*).
- **🟣 Advanced (C1 - C2)**: Complex lexical resource, debate, style, and tone nuances (*IELTS / TOEFL Speaking Exam Part 3*, *Business Strategy & Negotiation*, *AI & Deep Philosophy*).

### 5. 🧠 Dual Engine (Works Offline + Gemini API Option)
- **Built-in Smart Linguistic Engine**: Works **100% offline out-of-the-box** without any configuration or API key.
- **Google Gemini API Support**: Click the 🔑 **Key** icon in the header to connect a free Gemini API key (from Google AI Studio) to unlock deep dynamic open-ended conversations.

---

## 🚀 Getting Started

The app is live at:
```bash
http://localhost:5173/
```

To run manually:
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Build for production
npm run build
```
