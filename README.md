# 🛡️ CyberArena: The Ultimate Cybersecurity Training Ground

**CyberArena** is an immersive, gamified web-based platform designed to transform users from digital novices into "Elite Guardians." Through high-stakes simulations, neon-drenched missions, and real-time threat detection, users learn to defend against the most sophisticated cyber attacks of the modern age.

---

## 🚀 Live Missions

### 1. 🕵️ Phishing Detective
*   **Real-time Analysis:** Inspect headers, body text, and suspicious links.
*   **Hover-to-Reveal:** Preview destination URLs to spot domain spoofing (e.g., `amaz0n.in` vs `amazon.in`).
*   **Credential Traps:** Interactive login modals that simulate phishing site behavior.

### 2. 🎭 Social Engineering
*   **Human Firewall:** Engage with simulated attackers posing as "IT Support" or "Colleagues."
*   **Trust Meter Mechanics:** Balance trust and skepticism. Too much trust leads to a breach; healthy skepticism leads to victory.

### 3. 🤖 AI Crime Lab
*   **Deepfake Detection:** Analyze "CEO Video Calls" and voice clones for robotic phrasing or unnatural urgency.
*   **Investigation:** Select and verify specific anomalies (Tone, Language, Context) to reach a verdict.

### 4. 🧩 Malware Escape
*   **Incident Response:** Manage "System Health" during an active malware outbreak.
*   **Terminal Interface:** Use a live console to execute commands like `scan`, `isolate`, or `decrypt` to save the system.

### 5. 🛡️ Password Lab (New!)
*   **Strength Analysis:** Real-time entropy calculation and "Time to Crack" estimation.
*   **MFA Simulation:** Experience multi-factor authentication workflows and learn why they are critical.

### 6. 🌐 Dark Web Market (New!)
*   **Breach Database:** Search for compromised credentials from simulated corporate leaks.
*   **Risk Assessment:** Evaluate the severity of leaked data (Plaintext vs. Hashed) to determine threat levels.

### 7. 📱 Smishing Simulator (New!)
*   **Mobile Defense:** Identify malicious SMS messages (Smishing) within a realistic phone interface.

### 8. 🧪 Mission Creator (New!)
*   **Design Your Own:** Create custom phishing scenarios to train others and export them as JSON.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Retro-Cyberpunk aesthetic with CRT effects, scanlines, and neon animations).
*   **Database & Auth:** **Firebase** (Firestore for XP/Leaderboard and Firebase Auth for secure login).
*   **Audio Engine:** **Web Audio API** for an immersive, interactive soundscape (Success/Error/Click sounds).
*   **Logic:** Modular ES6+ JavaScript.
*   **Adaptive Learning:** Integrated "Safety Protocols" that provide actionable steps based on user progress.

---

## 🕹️ Gameplay Mechanics

| Mechanic | Description |
| :--- | :--- |
| **XP & Leaderboard** | Earn XP for every successful mission and climb the global ranks. |
| **System Health** | Visual representation of security status during active attacks. |
| **Trust Level** | Real-time gauge of psychological manipulation in social engineering. |
| **Safety Protocols** | Actionable, real-world security tips delivered through the "Adaptive Difficulty" engine. |

---

## 📂 Project Structure

```text
CyberArena/
├── index.html          # Mission Hub & Global Leaderboard
├── login.html          # Firebase-powered Auth Portal
├── phishing.html       # Phishing Mission
├── social.html         # Social Engineering Simulator
├── ai.html             # AI Crime Lab
├── malware.html        # Malware Escape (Terminal)
├── password.html       # Password Strength & MFA Lab
├── darkweb.html        # Breach Search Simulator
├── smishing.html       # Mobile SMS Simulator
├── creator.html        # Custom Mission Builder
├── css/
│   └── style.css       # Neon-Cyberpunk UI Framework
└── js/
    ├── firebase.js     # Firebase Config & Initialization
    ├── auth.js         # Authentication Logic (Google/Email)
    ├── xp.js           # XP & Firestore Data Management
    ├── common.js       # Shared Navigation & Audio System
    ├── adaptive.js     # Safety Protocols & Difficulty Engine
    ├── ... (Mission Logic Files)
```

---

## 🏁 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/CyberArena.git
    ```
2.  **Firebase Setup**
    *   The project is pre-configured with a demo Firebase project. To use your own, update `js/firebase.js` with your credentials.
3.  **Run Locally**
    *   Simply open `index.html` in any modern web browser. (Note: A local server like Live Server is recommended for Firebase modules).

---

## 🛡️ Security Education at its Best
CyberArena isn't just a game—it's a training ground for the digital age. By simulating the psychological and technical tactics of hackers, we empower users to become the strongest link in the security chain.

**Built for Hackathons, Designed for Learning.**
