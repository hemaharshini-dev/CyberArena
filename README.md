# 🛡️ CyberArena: The Ultimate Cybersecurity Training Ground

🌐 **Live Demo:** [https://cyberarena-77a96.web.app](https://cyberarena-77a96.web.app)

**CyberArena** is an immersive, gamified web-based platform designed to transform users from digital novices into "Elite Guardians." Through high-stakes simulations, neon-drenched missions, and real-time threat detection, users learn to defend against the most sophisticated cyber attacks of the modern age.

---

## 🚀 Live Missions

Missions are grouped into three categories on the Hub:

### 🎭 Social Engineering
#### 1. 🕵️ Phishing Detective
*   **Adaptive Difficulty:** Timer adjusts based on your XP rank — 30s (Novice), 27s (Specialist), 25s (Elite Guardian). Difficulty badge shown in the AI label.
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
*   **XP Lock:** Requires 75 XP to unlock.

#### 4. 🧩 Malware Escape
*   **Incident Response:** Manage "System Health" during an active ransomware outbreak.
*   **Terminal Interface:** Type commands (`isolate-network`, `run-antivirus`, `restore-backup`, etc.) into a live console with a clearly separated Execute button.
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
*   **XP Lock:** Requires 50 XP to unlock.

#### 7. 🚨 Incident Response Simulator
*   **Branching Scenario Tree:** Navigate a realistic multi-step corporate breach — from a phishing email through credential theft, ransomware deployment, and regulatory reporting.
*   **Consequence Engine:** Every decision has an immediate consequence shown before the next scene loads. Wrong calls add to the Breach Damage meter.
*   **Breach Damage Meter:** A 0–100% damage bar tracks cumulative harm from poor decisions across the scenario.
*   **Progress Dots:** Visual step tracker shows good (green), bad (red), and current (cyan) decisions.
*   **Three Outcomes:** Full Breach (💀), Breach Contained with Damage (⚠️), or Zero Data Loss (🛡️) — each with a detailed summary and lesson.
*   **Safety Protocols:** 4 actionable incident response protocols shown at mission end.
*   **XP Lock:** Requires 100 XP to unlock.

### 🛠️ Tools & Knowledge
#### 8. ⚡ Daily Challenge
*   **One Question Per Day:** A single scenario-based question drawn from a 12-question pool (Phishing, Social Engineering, Password, Malware, Smishing, MFA, Dark Web, Quishing) — seeded deterministically so every player gets the same question each day.
*   **30-Second Timer:** Faster correct answers earn more XP (up to 30 XP; wrong answers earn 5 XP).
*   **Daily Leaderboard:** Top-10 scores for the current day stored in Firestore under `dailyScores/{dateKey}/players`.
*   **Already-Played State:** Shows a live countdown to the next challenge if you've already completed today's question.
*   **Explanation Panel:** After answering, the correct answer and a detailed explanation are revealed.

#### 9. 📱 Smishing Simulator
*   **Two-Column Layout:** Phone frame on the left, Scam/Safe drop bins and feedback on the right — everything visible without scrolling.
*   **Drag-and-Drop:** Drag SMS bubbles into "Scam" or "Safe" bins, or click the bins directly.
*   **Quishing (QR Phishing):** Some messages contain mock QR codes — click "🔍 Click to reveal hidden URL" to inspect the destination before deciding. Safe links show `https://`, scam links use `http://` or suspicious domains.
*   **Completion Screen:** Replaces the game layout entirely — shows score, grade, collapsible Deep Dive (FluBot 2021, USPS scam wave), and safety protocols. Title updates to "📱 Smishing Simulation Complete".

#### 10. 🧪 Mission Creator
*   **Custom Scenario Builder:** Fill in Sender, Subject, Body, and Link fields with a live email preview pane.
*   **Educational Breakdown:** After generating JSON, a "Why This Scenario Works" panel analyses your inputs and explains the red flags (spoofed sender, urgency language, suspicious TLDs).
*   **JSON Export:** Generate and copy a structured JSON payload to share custom phishing scenarios with others.
*   **XP Lock:** Requires 150 XP to unlock.

#### 11. 📖 Cyber-Wiki
*   **Knowledge Base:** Reference articles on Phishing, Smishing, Quishing, Ransomware, Social Engineering, MFA, and Cryptography — each in a consistent 4-part structure: Definition → Common Tactics/Key Concepts → How to Stay Safe → Real-World Cases.
*   **Interactive Tooltips:** Hover over key terms (e.g., SHA-256, Entropy, Pretexting) for inline definitions.
*   **Quick Navigation:** Jump-links to each section at the top of the page.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Retro-Cyberpunk aesthetic with CRT effects, scanlines, and neon animations). Fully responsive with mobile media queries (`<600px`, `601–900px`).
*   **Database & Auth:** **Firebase** (Firestore for XP/Leaderboard/Daily Scores and Firebase Auth for Email/Password + Google Sign-In).
*   **Audio Engine:** **Web Audio API** — procedurally generated success, error, and click sounds, plus three selectable ambient music tracks (Cyberpunk, Dark Ambient, Hacker Terminal) with reverb, arpeggios, kick/hihat rhythm, and LFO modulation.
*   **Logic:** Modular ES6+ JavaScript with clear single-responsibility module boundaries.
*   **AI Integration:** OpenRouter API (Mistral-7B) for live phishing scenario generation with a local fallback engine.
*   **Adaptive Learning:** `adaptive.js` engine delivers difficulty scaling (timer, extra steps) and actionable safety protocols based on user XP rank.

---

## 🕹️ Gameplay Mechanics

| Mechanic | Description |
| :--- | :--- |
| **XP & Leaderboard** | Earn XP for every successful mission and climb the global ranks (stored in Firestore). |
| **Daily XP Cap** | Each mission awards XP only once per calendar day — enforced server-side in Firestore. Replaying a mission after earning XP that day gives 0 XP, preventing spam farming. Resets at midnight. |
| **Rank System** | Novice (0 XP) → Specialist (100 XP) → Elite Guardian (500 XP), with a progress bar. |
| **Adaptive Difficulty** | Timer and scenario complexity scale with XP rank. Novice: 30s timer. Specialist: 27s + extra social engineering steps. Elite: 25s + extra steps. |
| **Achievements / Badges** | Unlock badges: 🔰 Rookie (0 XP), 🔍 Detective (50 XP), 🛡️ Shield (200 XP), 👑 Elite (500 XP). |
| **Mission Locks** | Dark Web (50 XP), AI Crime Lab (75 XP), Incident Response (100 XP), Mission Creator (150 XP). Locked missions show a 🔒 overlay with the required XP. |
| **🔔 Notification Bell** | When you earn enough XP to unlock a mission or feature, a red badge appears on the 🔔 bell icon in the top bar. Badge only lights up for genuinely new unlocks earned since your last visit — not on every page load. Mark all as read to clear it. |
| **Hard Mode** | Unlocked at 300 XP — all missions run at Elite difficulty. |
| **Mission Completion Tracker** | Profile page shows ✅/⬜ status for all 10 missions. |
| **Unlocks Panel** | Progress bars in the profile show how close you are to each locked mission/feature. |
| **Daily Challenge** | One question per day from a 12-scenario pool. Faster answers earn more XP. Daily leaderboard resets at midnight. |
| **System Health** | Visual health bar during Malware Escape; triggers glitch effects at low health. |
| **Trust Level** | Real-time gauge of psychological manipulation in Social Engineering. |
| **Breach Damage Meter** | Tracks cumulative damage from poor decisions in Incident Response. |
| **Safety Protocols** | Actionable, real-world security tips shown at mission end for all mission categories. |
| **Deep Dives** | Real-world case studies shown on mission completion screens (Phishing, Social, AI, Malware, Password, Dark Web, Smishing). |
| **Onboarding Tour** | 6-step guided tour on first login with spotlight overlay, progress dots, and skip/back/next controls. Replay anytime via the 🧭 Tour button. |
| **How to Play Guide** | Modal shown on first login with mission overview, key features, and pro tips. Accessible anytime via the 🎮 Guide button. |
| **👤 Profile Page** | Dedicated profile page (`profile.html`) with XP, rank, badges, mission tracker, unlocks progress, and global leaderboard — accessible via the 👤 Profile button in the top bar. |
| **Share Score** | Share your rank, XP, and missions completed via the Web Share API or clipboard copy. |
| **Activity Ticker** | Live scrolling feed on the Hub simulating global community activity. |
| **High Contrast Mode** | Accessibility toggle persisted via `localStorage`. |
| **⚙️ Settings Panel** | Gear icon (fixed, top-right) opens a panel with Font Size (Small/Medium/Large dropdown), Music Track selector, Volume slider, Mute button, and Music ON/OFF toggle. All settings persisted via `localStorage`. |
| **Music Tracks** | Three selectable ambient tracks: ⚡ Cyberpunk (120 BPM minor pentatonic arpeggio + kick/hihat + reverb), 🌑 Dark Ambient (slow evolving pads + sub-bass + occasional deep thuds), and 💻 Hacker Terminal (glitchy bleeps + low pulse). |
| **Audio Controls** | Volume slider, mute button, music toggle, and track selector — all inside the ⚙️ Settings panel. |
| **Breadcrumbs** | Auto-injected navigation trail on all mission pages. |
| **Personalized Greeting** | Hub shows "Hi, [name]!" using `displayName` for Google users or the part before `@` for email/password users. |
| **ARIA & Accessibility** | `aria-live`, `role="progressbar"`, `role="alert"`, `role="toolbar"`, `aria-label` attributes throughout. `focus-visible` styles and `prefers-reduced-motion` support in CSS. |

---

## 📂 Project Structure

```text
CyberArena/
├── hub.html            # Mission Hub — missions only, top bar with Profile & Bell
├── profile.html        # Dedicated Profile page — XP, rank, badges, missions, unlocks, leaderboard
├── index.html          # Firebase Auth Portal (Google Sign-In)
├── phishing.html       # Phishing Detective Mission
├── social.html         # Social Engineering Simulator
├── ai.html             # AI Crime Lab (Deepfake Detection)
├── malware.html        # Malware Escape (Terminal Interface)
├── password.html       # Password Strength, Entropy & MFA Lab
├── darkweb.html        # Breach Search & Risk Assessment Simulator
├── smishing.html       # Mobile SMS & QR (Quishing) Simulator — two-column layout
├── incident.html       # Incident Response Simulator (branching scenario tree)
├── daily.html          # Daily Challenge (one question/day + daily leaderboard)
├── creator.html        # Custom Phishing Mission Builder
├── wiki.html           # Cyber-Wiki Knowledge Base
├── css/
│   └── style.css       # Neon-Cyberpunk UI Framework + mobile media queries + tour styles + settings panel
└── js/
    ├── firebase.js     # Firebase Config & Initialization
    ├── auth.js         # Auth boundary for the whole app — redirect, logout, XP-guard for locked missions
    ├── xp.js           # XP & Firestore Data Management (updateXP with daily cap, getUserData)
    ├── common.js       # Loader — sources music.js, sounds.js, breadcrumb.js, settings.js + navigation helpers
    ├── music.js        # Ambient music engine — 3 tracks (Cyberpunk, Dark Ambient, Hacker Terminal)
    ├── sounds.js       # UI sound effects (success, error, click) + global button click listener
    ├── breadcrumb.js   # Auto-injects navigation breadcrumb on mission pages
    ├── settings.js     # Settings panel UI, high-contrast, font size, mute, volume
    ├── audio.js        # Standalone Audio Module (ES6 export)
    ├── adaptive.js     # Adaptive Difficulty Engine — timerSeconds (30/27/25), extraSteps, safetyProtocols
    ├── tour.js         # 6-step Onboarding Tour — spotlight overlay, dots, localStorage persistence
    ├── unlocks.js      # Mission/Feature Lock System — XP thresholds, lock overlays, 🔔 notification bell
    ├── guard.js        # Mission Guard — redirects or blocks page if XP threshold not met
    ├── daily.js        # Daily Challenge Engine — seeded pool, Firestore score submission, leaderboard
    ├── phishing.js     # Phishing Detective Logic + AI Scenario Engine
    ├── social.js       # Social Engineering Chat Flow + adaptive hard steps
    ├── ai.js           # AI Crime Lab Logic
    ├── malware.js      # Malware Escape Terminal Logic
    ├── password.js     # Password Analysis, MFA & Fatigue Simulation + completion screen
    ├── darkweb.js      # Breach Database Search, Risk Assessment + completion screen
    ├── smishing.js     # SMS/QR Phishing Simulator — two-column layout, completion screen
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
    *   Ensure your Firestore security rules allow authenticated users to read and write their own document:
    ```
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    ```
3.  **Run Locally**
    *   Open `index.html` in any modern web browser. A local server (e.g., VS Code Live Server) is recommended for Firebase ES modules to load correctly.
4.  **Or visit the live hosted version directly at [https://cyberarena-77a96.web.app](https://cyberarena-77a96.web.app)**
5.  **(Optional) Enable Live AI Scenarios**
    *   Get a free API key from [OpenRouter](https://openrouter.ai).
    *   Open the Phishing Detective mission in your browser, press **F12** to open DevTools, and click the **Console** tab.
    *   Paste the following and press Enter — do **not** run this in a terminal:
    ```js
    setAIKey('your-openrouter-api-key')
    ```
    *   You'll see a confirmation alert. Reload the page — the AI label will show **AI Mode: Live API** in green.

---

## 🔑 localStorage Keys

| Key | Purpose |
| :--- | :--- |
| `cyberarena_tour_done` | Prevents onboarding tour from re-running after first completion |
| `cyberarena_guide_seen` | Prevents "How to Play" modal from re-showing after first view |
| `high-contrast` | High contrast mode toggle state |
| `muted` | Audio mute state |
| `volume` | Master volume level (0–1) |
| `musicOn` | Ambient music on/off state |
| `musicTrack` | Selected music track (`cyberpunk`, `dark`, or `hacker`) |
| `fontSize` | Font size class (`font-sm`, `font-md`, `font-lg`) |
| `settingsPanelOpen` | Whether the ⚙️ settings panel is open or closed |
| `openrouter_api_key` | OpenRouter API key for live AI phishing scenarios |
| `lastSeenXP` | XP value at last hub visit — used to detect genuinely new unlocks for the 🔔 bell |
| `seenUnlocks` | Array of unlock IDs already processed — prevents duplicate bell notifications |
| `unlockNotifications` | Array of unlock notification objects `{ id, label, description, read }` for the 🔔 bell |

---

## 🔒 XP Integrity

XP farming is prevented by a **per-mission daily cap** enforced server-side in Firestore:

- Each mission can award XP only **once per calendar day** per user.
- On completion, `updateXP()` writes `dailyXP.{missionId}_{YYYY-MM-DD} = true` to the user's Firestore document.
- On the next call for the same mission that day, the flag is detected before any write occurs and the function returns early.
- The key is date-scoped, so XP resets naturally at midnight with no cleanup job needed.
- Because the check happens against Firestore (not `localStorage`), it cannot be bypassed by clearing browser storage.

The Daily Challenge has its own separate replay protection via `dailyScores/{dateKey}/players` in Firestore.

---

## 🛡️ Security Education at its Best
CyberArena isn't just a game — it's a training ground for the digital age. By simulating the psychological and technical tactics of hackers, we empower users to become the strongest link in the security chain.

**Built for Hackathons, Designed for Learning.**
