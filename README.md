# 🛡️ CyberArena: Gamified Cybersecurity Excellence

**CyberArena** is an immersive, interactive web-based educational platform designed to train users in identifying and mitigating modern cybersecurity threats. Through high-stakes simulations and gamified missions, users evolve from rookies to "Scam Shields" by mastering incident response and threat detection.

---

## 🚀 Live Features

### 1. 🕵️ Phishing Detective
*   **Real-time Email Analysis:** Inspect headers, body text, and suspicious links.
*   **Hover-to-Reveal:** Preview actual destination URLs to spot domain spoofing (e.g., `amaz0n.in` vs `amazon.in`).
*   **Credential Traps:** Interactive login modals that simulate real-world phishing site behavior.
*   **XP System:** Earn points and badges based on detection accuracy and speed.

### 2. 🎭 Social Engineering (Human Firewall)
*   **Interactive Chat Simulation:** Engage with a simulated attacker posing as "IT Support."
*   **Trust Meter Mechanics:** A dynamic "Trust Level" bar. Too much trust leads to a security breach; healthy skepticism leads to victory.
*   **Typing Indicators:** Real-time feedback for a realistic conversational experience.

### 3. 🤖 AI Crime Lab
*   **Deepfake Detection:** Analyze "CEO Video Calls" and voice clones for robotic phrasing or unnatural urgency.
*   **Clue Investigation:** Select and verify specific anomalies (Tone, Language, Context) before making a final verdict.

### 4. 🧩 Malware Escape
*   **Incident Response Simulation:** Manage a "System Health" bar during an active malware outbreak.
*   **Critical Decision Path:** Choose between disconnecting the network, running antivirus, or (dangerously) paying the ransom.
*   **Live Log Terminal:** A real-time console that tracks every action and its impact on the system.

---

## 🛠️ Tech Stack

*   **Frontend:** HTML5, CSS3 (Custom Vanilla CSS with Glassmorphism)
*   **Logic:** Pure JavaScript (ES6+)
*   **Design:** Modern Dark-Tech aesthetic with CSS animations, gradients, and responsive layouts.
*   **Architecture:** Modular mission-based structure for easy scalability.

---

## 🕹️ Gameplay Mechanics

| Mechanic | Description |
| :--- | :--- |
| **XP & Badges** | Rewards for correct identification and fast response times. |
| **Time Pressure** | Integrated timers force quick decision-making under stress. |
| **Dynamic Feedback** | Immediate explanations for every correct or incorrect choice to ensure learning. |
| **Health/Trust Bars** | Visual representations of security status and psychological manipulation. |

---

## 📂 Project Structure

```text
CyberArena/
├── index.html          # Main Hub / Mission Selector
├── phishing.html       # Phishing Mission UI
├── social.html         # Social Engineering UI
├── ai.html             # AI Crime Lab UI
├── malware.html        # Malware Escape UI
├── css/
│   └── style.css       # Unified Global Styles & Animations
└── js/
    ├── common.js       # Shared logic (Navigation, etc.)
    ├── phishing.js     # Phishing engine & scenarios
    ├── social.js       # Chat engine & trust logic
    ├── ai.js           # Investigation logic
    └── malware.js      # Incident response & health system
```

---

## 🏁 Getting Started

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/your-username/CyberArena.git
    ```
2.  **Run Locally**
    *   No dependencies required! Simply open `index.html` in any modern web browser.
3.  **Start a Mission**
    *   Choose your path from the CyberArena Hub and start securing the digital world.

---

## 🛡️ Security Education at its Best
CyberArena isn't just a game—it's a training ground for the digital age. By simulating the psychological and technical tactics of hackers, we empower users to become the strongest link in the security chain.

**Built for Hackathons, Designed for Learning.**
