# 🔧 CyberArena — Features To Add (Gap Analysis vs. project.md)

This file maps every requirement from `project.md` to the current implementation and lists what is missing or incomplete.

---

## 1. Adaptive Difficulty That Actually Adapts

**Requirement:** *"Gamified scenarios that adapt to user choices."*

**Current State:** `adaptive.js` reads the user's XP and returns a difficulty label (`Novice`, `Specialist`, `Elite Guardian`), but this label is never used to change scenario content, question count, time limits, or complexity in any mission.

**What to Add:**
- In `phishing.js`: reduce timer from 10s → 7s for Specialist, 5s for Elite. Swap in harder scenarios (more convincing sender domains, subtler urgency cues).
- In `malware.js`: add more steps and wrong-command penalties for higher ranks.
- In `social.js`: add more conversation steps and closer trust thresholds for higher ranks.
- In `smishing.js`: increase the ratio of convincing/borderline messages for higher ranks.

---

## 2. Missing Safety Protocols for 4 Missions

**Requirement:** *"Gain actionable safety measures to protect confidential information."*

**Current State:** `adaptive.js` only defines `safetyProtocols` for `phishing`, `social`, and `ai`. The missions `malware`, `password`, `darkweb`, and `smishing` have no Safety Protocol cards shown at mission end.

**What to Add** — add these categories to `adaptive.js`:

```js
malware: [
    "✅ Protocol 1: Always isolate an infected machine from the network immediately.",
    "✅ Protocol 2: Never pay a ransom — it funds attackers and recovery is not guaranteed.",
    "✅ Protocol 3: Maintain offline, encrypted backups tested regularly."
],
password: [
    "✅ Protocol 1: Use a password manager — never reuse passwords across sites.",
    "✅ Protocol 2: Enable MFA on every account that supports it.",
    "✅ Protocol 3: A passphrase (4+ random words) is stronger and easier to remember than a complex short password."
],
darkweb: [
    "✅ Protocol 1: Check haveibeenpwned.com regularly for your email in breach databases.",
    "✅ Protocol 2: Change passwords immediately if your domain appears in a breach.",
    "✅ Protocol 3: Plaintext password leaks require immediate credential rotation across all services."
],
smishing: [
    "✅ Protocol 1: Never click links in unsolicited SMS messages — go directly to the official app or website.",
    "✅ Protocol 2: Forward suspected smishing messages to 7726 (SPAM) to report to your carrier.",
    "✅ Protocol 3: Use a QR scanner that previews the URL before opening it."
]
```

Then call `showSafetySteps()` at the end of each of those mission JS files.

---

## 3. Missing Real-World Case Studies for 4 Missions

**Requirement:** *"Learn through real-world case studies."*

**Current State:** Post-mission "Cyber Deep Dive" sections exist only in `phishing.js`, `social.js`, `ai.js`, and `malware.js`. The missions `password.js`, `darkweb.js`, `smishing.js`, and `creator.js` show no case studies.

**What to Add:**
- **Password Lab** end screen: Add a Deep Dive on the 2012 LinkedIn breach (117M plaintext passwords leaked) and the 2019 Collection #1 data dump.
- **Dark Web Market** end screen: Add a Deep Dive on the 2013 Adobe breach (153M records, poorly encrypted passwords) and how breach data is sold on dark web markets.
- **Smishing Simulator** completion screen: Add a Deep Dive on FluBot (2021 Android smishing campaign) and the USPS/FedEx delivery scam waves.

---

## 4. Accessibility & Inclusivity Gaps

**Requirement:** *"Solutions supporting accessibility and inclusivity for persons with disabilities."*

**Current State:** Only a High Contrast mode toggle exists (persisted via `localStorage`). No other accessibility features are implemented.

**What to Add:**
- **Font Size Controls:** Add Small / Medium / Large text toggle in the audio control bar, persisted via `localStorage`.
- **Keyboard Navigation:** All mission option buttons should be focusable and triggerable via `Enter`/`Space`. The terminal in `malware.html` already supports this, but option buttons across other missions do not have explicit `tabindex` or focus styles.
- **Screen Reader Support:** Add `aria-label` attributes to icon-only buttons (🎵, 🔇, 👁️), `role="alert"` to feedback divs so results are announced, and `aria-live="polite"` to the trust/health bars.
- **Reduced Motion:** Respect `prefers-reduced-motion` media query — disable CRT scanline animations, glitch effects, and the brute-force visualizer scramble for users who have this set.
- **Colour-Blind Safe Feedback:** Correct/incorrect feedback currently relies solely on green/red colour. Add ✅/❌ icons (already partially done) and consider adding a text label like `[CORRECT]` / `[WRONG]` for full colour-blind support.

---

## 5. Mobile Responsiveness

**Requirement:** *"The outcome should be a usable application/game on either mobile or desktop."*

**Current State:** Most HTML pages lack a `<meta name="viewport">` tag. The smishing phone frame is hardcoded at `300px × 500px`. The mission hub button grid and leaderboard are not tested for small screens.

**What to Add:**
- Add `<meta name="viewport" content="width=device-width, initial-scale=1.0">` to every HTML page that is missing it.
- Make the smishing phone frame responsive: replace fixed `width: 300px; height: 500px` with `max-width: 320px; width: 90vw; height: 70vw; max-height: 520px`.
- Add CSS media queries in `style.css` for screens < 600px: stack the mission buttons vertically, reduce font sizes, and ensure the audio control bar doesn't overlap content.
- Test and fix the Mission Creator's two-column layout (form + preview pane) — it will overflow on mobile.

---

## 6. Smishing Simulator — No Score / Completion Summary

**Requirement:** *"Proper awareness or learning."*

**Current State:** The smishing simulator shows per-message feedback but has no final score screen, no XP summary, and no Deep Dive or Safety Protocol at the end — it just shows a plain "Simulation Complete!" message with a back button.

**What to Add:**
- Track a running score (correct / total) in `smishing.js`.
- On completion, render a result screen showing score, XP earned, a Deep Dive case study, and the smishing Safety Protocol card.

---

## 7. Dark Web Market — No Completion / Learning Summary

**Current State:** After a correct or incorrect risk assessment, the assessment panel hides and nothing else happens. There is no mission-end screen, no XP summary display, and no Deep Dive.

**What to Add:**
- After `submitAssessment()` resolves, render a completion card with XP earned, a real-world case study, and the darkweb Safety Protocol.

---

## 8. Mission Creator — No Educational Value on Completion

**Current State:** The Mission Creator generates JSON but provides zero educational feedback. It is a tool, not a learning experience.

**What to Add:**
- After JSON is generated, show a brief educational note explaining *why* each field (spoofed sender, urgent subject, misleading link) is a red flag — reinforcing learning through the act of building a phishing scenario.

---

## Summary Table

| # | Requirement | Status | Priority |
|---|---|---|---|
| 1 | Scenarios adapt to user skill level | ⚠️ Label only, no real adaptation | High |
| 2 | Safety protocols for all missions | ❌ Missing for 4 missions | High |
| 3 | Real-world case studies for all missions | ❌ Missing for 3 missions | Medium |
| 4 | Accessibility & inclusivity | ⚠️ High contrast only | High |
| 5 | Mobile responsiveness | ⚠️ Partial / broken on small screens | High |
| 6 | Smishing completion summary | ❌ Missing | Medium |
| 7 | Dark Web completion summary | ❌ Missing | Medium |
| 8 | Mission Creator educational feedback | ❌ Missing | Low |
