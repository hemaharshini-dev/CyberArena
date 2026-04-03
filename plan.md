# CyberArena → Top Frontend Project: Improvement Plan

---

## Phase 1 — Code Quality & Architecture (Foundation)

### 1.1 — Eliminate the `common.js` god file
- Split into `music.js`, `settings.js`, `breadcrumb.js`, `sounds.js` — each with a single responsibility
- `common.js` is currently ~350 lines doing 5 unrelated things; this is the biggest maintainability debt

### 1.2 — Fix the `showResult()` anti-pattern in phishing.js
- `document.body.innerHTML = ...` nukes the DOM, kills all event listeners, and breaks the audio engine
- Replace with a hidden result `<div>` that gets shown/hidden — same pattern used in other missions

### 1.3 — Standardize module boundaries
- `common.js` is loaded as a plain `<script>` (not a module) but `xp.js`, `adaptive.js` etc. are ES modules — this mixed loading is fragile
- Convert `common.js` to a proper ES module or keep it classic but stop mixing the two patterns per page

---

## Phase 2 — UX & Polish (Visible Impact)

### 2.1 — Add page transitions
- Currently `window.location.href = type + ".html"` is an instant hard navigation
- Add a CSS fade-out on mission launch (100ms) — one class + one timeout, massive perceived quality boost

### 2.2 — Persist mission state across refresh
- If a user refreshes mid-mission, all progress is lost
- Store `currentQuestion`, `score`, `timerLeft` in `sessionStorage` and restore on load

### 2.3 — Add a loading/skeleton state to the Hub
- The hub already has skeleton CSS defined but it's not wired up
- Show skeletons while `getUserData()` resolves, then swap in real XP/rank data

### 2.4 — Keyboard navigation for all missions
- Options buttons are clickable but not keyboard-accessible (no `Enter`/`Space` shortcut, no focus trap in modals)
- Add `keydown` listeners and proper focus management to the login modal and tour card

---

## Phase 3 — Performance (Technical Credibility)

### 3.1 — Lazy-load mission JS
- All mission scripts load on every page even when not needed
- Each mission HTML should only load its own JS — audit and remove cross-page script leaks

### 3.2 — Add a Service Worker for offline support
- A PWA-ready service worker caching the shell (HTML/CSS/common JS) would make this deployable as an installable app — a huge differentiator for a portfolio project
- Firebase Hosting already supports this; just needs a `sw.js` + manifest

### 3.3 — Debounce the password strength analyzer
- `password.js` recalculates entropy on every `keyup` — wrap in a 150ms debounce

---

## Phase 4 — New Features (Wow Factor)

### 4.1 — Replay / Review mode
- After mission completion, let users replay only the questions they got wrong
- Requires storing wrong answers in `sessionStorage` — minimal code, high educational value

### 4.2 — XP history timeline on Profile
- Firestore already stores XP as a running total; add a `xpHistory: arrayUnion({ts, delta, mission})` write in `updateXP()`
- Render as a sparkline chart on `profile.html` using Canvas API (no library needed)

### 4.3 — Share card image generation
- The share button exists but only copies text
- Use Canvas API to generate a shareable rank card image (rank, XP, badge) — `canvas.toBlob()` → Web Share API with `files`

### 4.4 — Add a 3rd music track: "Hacker Terminal"
- The code for this already exists in `common.js` (`startHackerTerminal()`) but it's not exposed in the Settings panel track selector — just add the `<option>` to the dropdown

---

## Phase 5 — Portfolio Presentation (Meta)

### 5.1 — Add a `CONTRIBUTING.md` and `ARCHITECTURE.md`
- Explains the module system, adaptive engine, and Firebase data model
- Signals professional project hygiene to anyone reviewing the repo

### 5.2 — Add Firestore security rules to the repo
- Currently the rules live only in the Firebase console — add a `firestore.rules` file so the security posture is auditable and version-controlled

### 5.3 — Add a `lighthouse.md` with scores
- Run Lighthouse on the live URL, document the scores, and add a badge to the README
- Performance, Accessibility, Best Practices, SEO scores are a concrete signal of quality

### 5.4 — Add Open Graph meta tags to `hub.html` and `index.html`
- `og:title`, `og:description`, `og:image` — makes the link preview look professional when shared on LinkedIn/Twitter

---

## Priority Order

| Priority | Task | Effort | Impact |
|---|---|---|---|
| 1 | 4.4 — Expose Hacker Terminal track in Settings | 5 min | Free win (code already exists) |
| 2 | 2.1 — Page transitions | 30 min | High visual polish |
| 3 | 2.4 — Keyboard navigation & focus traps | 1 hr | Accessibility + credibility |
| 4 | 1.2 — Fix `showResult()` DOM nuke | 1 hr | Code correctness |
| 5 | 3.2 — Service Worker / PWA | 2 hr | Major differentiator |
| 6 | 1.1 — Split `common.js` | 3 hr | Long-term maintainability |
| 7 | 4.2 — XP history timeline on Profile | 2 hr | Profile page wow factor |
| 8 | 5.x — Portfolio docs (CONTRIBUTING, ARCHITECTURE, Lighthouse, OG tags) | 1 hr | Repo professionalism |
