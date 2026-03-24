# 🛡️ CyberArena: The Ultimate Cybersecurity Training Ground

**CyberArena** is an immersive, gamified web-based platform designed to transform users from digital novices into "Elite Guardians." Through high-stakes simulations, neon-drenched missions, and real-time threat detection, users learn to defend against the most sophisticated cyber attacks of the modern age.

---

## 🚀 Live Missions

Missions are grouped into three categories on the Hub:

### 🎭 Social Engineering
#### 1. 🕵️ Phishing Detective
*   **Adaptive Difficulty:** Timer adjusts based on your XP rank — 10s (Novice), 7s (Specialist), 5s (Elite Guardian). Difficulty badge shown in the AI label.
*   **Timed Scenarios:** Countdown per question across 5 curated + 1 AI-generated scenario.
*   **Header Inspection:** Click the sender address to reveal raw `Authentication-Results` and `X-Original-Sender` headers.
*   **Hover-to-Reveal:** Preview destination URLs to spot domain spoofing (e.g., `amaz0n.in` vs `amazon.in`).
*   **Credential Trap:** Clicking a phishing link opens a fake login modal — entering credentials costs XP.
*   **AI Scenario Engine:** Dynamically generates a new phishing scenario via the OpenRouter API (Mistral-7B) or falls back to a local engine if no API key is set. Set your key from the browser console: `setAIKey('your-key')`.
*   **Safety Protocols:** Actionable security tips shown at mission end.

#### 2. 🎭 Social Engineering Simulator
*   **Adaptive Difficulty:** Specialist/Elite players face extra manipulation steps (authority spoofing + urgency tactics) beyond the base flow.
*   **Chat-Based Flow:** Engage with a simulated attacker posing as "IT Support" through a multi-step conversation.
*   **Trust Meter:** A real-time gauge tracks psychological manipulation. Reaching 100 trust = breach; reaching 0 = victory.
*   **Typing Indicator:** Simulates realistic attacker response delays.
*   **Safety Protocols:** Actionable security tips and Deep Dive shown at mission end.

### 💻 Technical Defense
#### 3. 🤖 AI Crime Lab
*   **Deepfake Detection:** Analyze a "CEO Video Call" scenario requesting an urgent money transfer.
*   **Clue Investigation:** Select up to 2 anomalies (Tone, Language, Context, Identity) before rendering a verdict.
*   **Flag or Trust:** Decide if the content is AI-generated or legitimate.
*   **Deep Dive:** Real-world case study on the 2024 $25M deepfake CFO fraud shown on correct answer.

#### 4. 🧩 Malware Escape
*   **Incident Response:** Manage "System Health" during an active ransomware outbreak.
*   **Terminal Interface:** Type commands (`isolate-network`, `run-antivirus`, `restore-backup`, etc.) into a live console.
*   **Command History:** Use ↑/↓ arrow keys to navigate previous commands; Tab for auto-complete.
*   **Glitch Effect:** The UI visually degrades when System Health drops below 40.
*   **Safety Protocols:** Actionable security tips shown at mission end.

#### 5. 🛡️ Password Lab
*   **Strength Analysis:** Real-time entropy calculation and "Time to Crack" estimation (assuming 10B guesses/sec).
*   **Brute-Force Visualizer:** Animated character scrambler shows a simulated cracking attempt.
*   **MFA Simulation:** Experience a standard MFA code verification workflow.
*   **MFA Fatigue Attack:** Simulates rapid push notification bombardment — deny 3 times to win; approving costs -50 XP.
*   **Completion Screen:** Deep Dive (LinkedIn 2012 breach, Uber MFA fatigue 2022) and safety protocols shown at mission end.

#### 6. 🌐 Dark Web Market
*   **Breach Database Search:** Query simulated corporate leaks by domain (e.g., `corp.com`, `secure.net`).
*   **Risk Assessment:** Evaluate the severity of leaked data (Plaintext vs. SHA-256 Hashed) to determine threat level and earn XP.
*   **Completion Screen:** Deep Dive (Adobe 2013 breach, Collection #1 2019) and safety protocols shown at mission end.

### 🛠️ Tools & Knowledge
#### 7. 📱 Smishing Simulator
*   **Mobile Interface:** Identify malicious SMS messages within a realistic phone frame.
*   **Drag-and-Drop:** Drag SMS bubbles into "Scam" or "Safe" bins, or use the on-screen buttons.
*   **Quishing (QR Phishing):** Some messages contain mock QR codes — tap to reveal the hidden malicious URL before deciding.
*   **Completion Screen:** Score summary, grade, Deep Dive (FluBot 2021, USPS scam wave) and safety protocols shown at mission end.

#### 8. 🧪 Mission Creator
*   **Custom Scenario Builder:** Fill in Sender, Subject, Body, and Link fields with a live email preview pane.
*   **Educational Breakdown:** After generating JSON, a "Why This Scenario Works" panel analyses your inputs and explains the red flags (spoofed sender, urgency language, suspicious TLDs).
*   **JSON Export:** Generate and copy a structured JSON payload to share custom phishing scenarios with others.

#### 9. 📖 Cyber-Wiki
*   **Knowledge Base:** Reference articles on Phishing, Smishing, Quishing, Ransomware, Social Engineering, MFA, and Cryptography — each in a consistent 4-part structure: Definition → Common Tactics/Key Concepts → How to Stay Safe → Real-World Cases.
*   **Interactive Tooltips:** Hover over key terms (e.g., SHA-256, Entropy, Pretexting) for inline definitions.
*   **Quick Navigation:** Jump-links to each section at the top of the page.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Retro-Cyberpunk aesthetic with CRT effects, scanlines, and neon animations). Fully responsive with mobile media queries (`<600px`, `601–900px`).
*   **Database & Auth:** **Firebase** (Firestore for XP/Leaderboard and Firebase Auth for Email/Password + Google Sign-In).
*   **Audio Engine:** **Web Audio API** for an immersive soundscape — procedurally generated success, error, and click sounds, plus a full ambient cyberpunk music engine with bass drone, mid pad, and rhythmic pulse.
*   **Logic:** Modular ES6+ JavaScript.
*   **AI Integration:** OpenRouter API (Mistral-7B) for live phishing scenario generation with a local fallback engine.
*   **Adaptive Learning:** `adaptive.js` engine delivers difficulty scaling (timer, extra steps) and actionable safety protocols based on user XP rank.

---

## 🕹️ Gameplay Mechanics

| Mechanic | Description |
| :--- | :--- |
| **XP & Leaderboard** | Earn XP for every successful mission and climb the global top-5 ranks (stored in Firestore). |
| **Rank System** | Novice (0 XP) → Specialist (100 XP) → Elite Guardian (500 XP), with a progress bar. |
| **Adaptive Difficulty** | Timer and scenario complexity scale with XP rank. Novice: 10s timer. Specialist: 7s + extra social engineering steps. Elite: 5s + extra steps. |
| **Achievements / Badges** | Unlock badges: 🔰 Rookie (0 XP), 🔍 Detective (50 XP), 🛡️ Shield (200 XP), 👑 Elite (500 XP). |
| **System Health** | Visual health bar during Malware Escape; triggers glitch effects at low health. |
| **Trust Level** | Real-time gauge of psychological manipulation in Social Engineering. |
| **Safety Protocols** | Actionable, real-world security tips shown at mission end for all 7 mission categories. |
| **Deep Dives** | Real-world case studies shown on mission completion screens (Phishing, Social, AI, Malware, Password, Dark Web, Smishing). |
| **Onboarding Tour** | 7-step guided tour on first login with spotlight overlay, progress dots, and skip/back/next controls. Replay anytime via the 🧭 Tour button. |
| **Activity Ticker** | Live scrolling feed on the Hub simulating global community activity. |
| **High Contrast Mode** | Accessibility toggle persisted via `localStorage`. |
| **Font Size Controls** | A/A/A buttons in the audio bar to switch between small, medium, and large text. Persisted via `localStorage`. |
| **Audio Controls** | Persistent volume slider, mute button, and ambient music toggle (bottom-right corner, all pages). |
| **Breadcrumbs** | Auto-injected navigation trail on all mission pages. |
| **ARIA & Accessibility** | `aria-live`, `role="progressbar"`, `role="alert"`, `role="toolbar"`, `aria-label` attributes throughout. `focus-visible` styles and `prefers-reduced-motion` support in CSS. |

---

## 📂 Project Structure

```text
CyberArena/
├── index.html          # Mission Hub, User Profile, Achievements & Global Leaderboard
├── login.html          # Firebase Auth Portal (Email/Password + Google)
├── phishing.html       # Phishing Detective Mission
├── social.html         # Social Engineering Simulator
├── ai.html             # AI Crime Lab (Deepfake Detection)
├── malware.html        # Malware Escape (Terminal Interface)
├── password.html       # Password Strength, Entropy & MFA Lab
├── darkweb.html        # Breach Search & Risk Assessment Simulator
├── smishing.html       # Mobile SMS & QR (Quishing) Simulator
├── creator.html        # Custom Phishing Mission Builder
├── wiki.html           # Cyber-Wiki Knowledge Base
├── css/
│   └── style.css       # Neon-Cyberpunk UI Framework + mobile media queries + tour styles
└── js/
    ├── firebase.js     # Firebase Config & Initialization
    ├── auth.js         # Authentication Logic — addEventListener-based (no inline onclick)
    ├── xp.js           # XP & Firestore Data Management (updateXP, getUserData)
    ├── common.js       # Shared Navigation, Breadcrumbs, High Contrast, Font Size & Audio System
    ├── audio.js        # Standalone Audio Module (ES6 export)
    ├── adaptive.js     # Adaptive Difficulty Engine — timerSeconds, extraSteps, safetyProtocols
    ├── tour.js         # 7-step Onboarding Tour — spotlight overlay, dots, localStorage persistence
    ├── phishing.js     # Phishing Detective Logic + AI Scenario Engine
    ├── social.js       # Social Engineering Chat Flow + adaptive hard steps
    ├── ai.js           # AI Crime Lab Logic
    ├── malware.js      # Malware Escape Terminal Logic
    ├── password.js     # Password Analysis, MFA & Fatigue Simulation + completion screen
    ├── darkweb.js      # Breach Database Search, Risk Assessment + completion screen
    ├── smishing.js     # SMS/QR Phishing Simulator Logic + completion screen
    └── creator.js      # Custom Mission Builder, JSON Export & educational breakdown
```

---

## 🏁 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/CyberArena.git
    ```
2.  **Firebase Setup**
    *   The project is pre-configured with a demo Firebase project (`cyberarena-77a96`). To use your own, update `js/firebase.js` with your project credentials.
3.  **Run Locally**
    *   Open `index.html` in any modern web browser. A local server (e.g., VS Code Live Server) is recommended for Firebase ES modules to load correctly.
4.  **(Optional) Enable Live AI Scenarios**
    *   Get a free API key from [OpenRouter](https://openrouter.ai) and run this in the browser console on the Phishing mission:
    ```js
    setAIKey('your-openrouter-api-key')
    ```

---

## 🔑 localStorage Keys

| Key | Purpose |
| :--- | :--- |
| `cyberarena_tour_done` | Prevents onboarding tour from re-running after first completion |
| `high-contrast` | High contrast mode toggle state |
| `muted` | Audio mute state |
| `volume` | Master volume level (0–1) |
| `musicOn` | Ambient music on/off state |
| `fontSize` | Font size class (`font-sm`, `font-md`, `font-lg`) |
| `openrouter_api_key` | OpenRouter API key for live AI phishing scenarios |

---

## 🛡️ Security Education at its Best
CyberArena isn't just a game — it's a training ground for the digital age. By simulating the psychological and technical tactics of hackers, we empower users to become the strongest link in the security chain.

**Built for Hackathons, Designed for Learning.**
