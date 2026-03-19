# Implementation Plan

## Phase 1: Project Foundation

- [ ] 1.1 Initialise monorepo structure with separate packages for web frontend, backend API, and AI layer
- [ ] 1.2 Configure ESLint, Prettier, and TypeScript for all packages
- [ ] 1.3 Set up Docker Compose for local development (Node.js API, MongoDB, Redis)
- [ ] 1.4 Configure Firebase project and obtain credentials for Realtime Database
- [ ] 1.5 Set up CI pipeline (GitHub Actions) with lint, type-check, and test steps

## Phase 2: Auth Service

- [ ] 2.1 Implement user registration endpoint `POST /auth/register` with bcrypt password hashing
- [ ] 2.2 Implement login endpoint `POST /auth/login` returning RS256-signed JWT
- [ ] 2.3 Implement JWT middleware for protected routes (role-based: user / admin)
- [ ] 2.4 Implement refresh token flow with HttpOnly cookie storage
- [ ] 2.5 Implement SSO endpoint `POST /auth/sso` supporting OAuth 2.0
- [ ] 2.6 Add rate limiting (10 req/min per IP) on auth endpoints
- [ ] 2.7 Write unit tests for registration, login, duplicate email, and invalid credential cases

## Phase 3: Data Models and Progress Store

- [ ] 3.1 Define and create MongoDB collections: users, attempts, progress, gamification, organisations
- [ ] 3.2 Implement Progress Store service with read/write methods for attempt recording
- [ ] 3.3 Sync live user state (XP, streak, current scenario) to Firebase Realtime Database
- [ ] 3.4 Implement data replication configuration across two geographic regions
- [ ] 3.5 Write integration tests for Progress Store read/write consistency

## Phase 4: Scenario Engine

- [ ] 4.1 Define Scenario, Decision, and Outcome TypeScript interfaces and MongoDB schema
- [ ] 4.2 Implement `GET /scenarios/missions` and `GET /scenarios/missions/:id` endpoints
- [ ] 4.3 Implement `GET /scenarios/:id` endpoint with prerequisite enforcement
- [ ] 4.4 Implement `POST /scenarios/:id/decision` endpoint returning outcome and triggering feedback + gamification
- [ ] 4.5 Implement `GET /scenarios/resume/:userId` to return last incomplete scenario
- [ ] 4.6 Seed database with initial scenario content for all four missions across three difficulty levels
- [ ] 4.7 Write unit tests for prerequisite enforcement and decision evaluation logic

## Phase 5: Feedback Service

- [ ] 5.1 Define Feedback data model and MongoDB collection
- [ ] 5.2 Implement `GET /feedback/:outcomeId` endpoint with LRU in-memory cache
- [ ] 5.3 Implement `GET /feedback/:outcomeId/expanded` endpoint
- [ ] 5.4 Author initial feedback content for all seeded scenario outcomes (consequence, micro-learning, practical tip)
- [ ] 5.5 Write unit tests verifying feedback response time under 500ms and presence of all three required fields

## Phase 6: Adaptive Engine

- [ ] 6.1 Implement `POST /adaptive/record` to store attempt result and update rolling performance window
- [ ] 6.2 Implement difficulty promotion logic: correct rate > 80% over 3 consecutive → advance difficulty
- [ ] 6.3 Implement difficulty reinforcement logic: correct rate < 50% → queue same difficulty
- [ ] 6.4 Implement `GET /adaptive/next/:userId` returning next recommended scenario ID and difficulty
- [ ] 6.5 Implement `GET /adaptive/summary/:userId` returning weakness summary and refresher list
- [ ] 6.6 Write unit tests for promotion, reinforcement, and summary generation logic

## Phase 7: Gamification Service

- [ ] 7.1 Implement XP award endpoint `POST /gamification/award-xp` with difficulty-scaled values
- [ ] 7.2 Implement level calculation from cumulative XP using the progression table
- [ ] 7.3 Implement streak tracking: increment on daily activity, reset on missed day
- [ ] 7.4 Implement badge evaluation and award endpoint `POST /gamification/check-badges`
- [ ] 7.5 Implement `GET /gamification/profile/:userId` returning XP, level, streak, and badges
- [ ] 7.6 Implement `GET /gamification/leaderboard/:teamId` returning ranked users by XP
- [ ] 7.7 Write unit tests for XP accumulation consistency, streak reset, and badge idempotence

## Phase 8: AI Layer

- [ ] 8.1 Set up AI Layer service with LLM API integration (GPT-4o or equivalent)
- [ ] 8.2 Implement `POST /ai/generate/phishing` with structured prompt templates per difficulty level
- [ ] 8.3 Implement `POST /ai/generate/social-eng` with manipulation tactic variable prompts
- [ ] 8.4 Implement `POST /ai/generate/deepfake-text` for AI-crafted scam text generation
- [ ] 8.5 Implement content safety filter that screens generated content before storage
- [ ] 8.6 Implement async batch generation job for nightly scenario pool replenishment
- [ ] 8.7 Write integration tests verifying generation response time under 2 seconds and safety filter rejection of harmful content

## Phase 9: Admin Service

- [ ] 9.1 Implement `POST /admin/teams` and `POST /admin/teams/:id/users` endpoints (admin role required)
- [ ] 9.2 Implement `POST /admin/teams/:id/missions` for mandatory mission assignment with user notification
- [ ] 9.3 Implement `GET /admin/teams/:id/report` returning aggregated team performance metrics
- [ ] 9.4 Implement `GET /admin/teams/:id/export` returning CSV of team performance report
- [ ] 9.5 Write unit tests for team creation, user association, and report aggregation

## Phase 10: React Web Frontend — Core

- [ ] 10.1 Scaffold React + TypeScript app with React Router and Tailwind CSS
- [ ] 10.2 Implement authentication pages: Register, Login, SSO redirect
- [ ] 10.3 Implement Home page with mission selection dashboard
- [ ] 10.4 Implement Mission page with ScenarioCard component rendering scenario content by type
- [ ] 10.5 Implement FeedbackPanel component displaying consequence, micro-learning, and practical tip
- [ ] 10.6 Implement Profile page showing XP, level, streak, and badge grid
- [ ] 10.7 Implement Leaderboard page for team rankings
- [ ] 10.8 Implement Admin dashboard page with team management and report export

## Phase 11: Mission-Specific UI Components

- [ ] 11.1 Build PhishingEmailViewer component rendering simulated email with headers, body, and link inspector
- [ ] 11.2 Build ConversationPlayer component for Social Engineering chat and call transcript scenarios
- [ ] 11.3 Build MediaAnalyser component for AI-Crime Lab image and audio sample display with cue annotation
- [ ] 11.4 Build IncidentResponseBoard component for Malware Escape Room drag-and-drop step sequencing
- [ ] 11.5 Write component tests for each mission-specific UI component

## Phase 12: Accessibility

- [ ] 12.1 Integrate Web Speech API for voice narration of scenario text, toggled via AccessibilityBar
- [ ] 12.2 Implement subtitle display for all audio/video scenario content
- [ ] 12.3 Implement high-contrast CSS theme toggled via user preference, validated against WCAG 2.1 AA contrast ratios
- [ ] 12.4 Implement simplified reading mode that swaps scenario text to the `simplified` content variant
- [ ] 12.5 Integrate i18next with translation files for English, Spanish, French, Hindi, and Mandarin
- [ ] 12.6 Implement language selector in AccessibilityBar persisting preference to user profile

## Phase 13: State Management and API Integration

- [ ] 13.1 Implement `useScenario` hook for scenario fetch, decision submission, and outcome handling
- [ ] 13.2 Implement `useAdaptive` hook for fetching next recommended scenario
- [ ] 13.3 Implement `useGamification` hook for real-time XP, level, and badge state via Firebase
- [ ] 13.4 Implement global auth context with JWT storage and refresh logic
- [ ] 13.5 Add API error boundary and user-friendly error display for service failures

## Phase 14: Performance and Scalability

- [ ] 14.1 Add Redis caching layer for feedback responses and scenario content
- [ ] 14.2 Configure horizontal scaling for the Express API (PM2 cluster or Kubernetes deployment)
- [ ] 14.3 Implement load testing suite targeting 10,000 concurrent users (k6 or Artillery)
- [ ] 14.4 Configure MongoDB indexes on attempts (userId, scenarioId, timestamp) and progress collections
- [ ] 14.5 Set up uptime monitoring and alerting (target 99.5% uptime)

## Phase 15: Testing and Quality Assurance

- [ ] 15.1 Write end-to-end tests covering the full scenario execution flow for each mission type (Playwright)
- [ ] 15.2 Write property-based tests for adaptive engine monotonicity and XP accumulation consistency
- [ ] 15.3 Write security tests: JWT validation, rate limiting, admin role enforcement, and SQL/NoSQL injection
- [ ] 15.4 Conduct accessibility audit using axe-core automated checks across all pages
- [ ] 15.5 Perform cross-browser testing on Chrome, Firefox, Safari, and Edge

## Phase 16: Deployment

- [ ] 16.1 Configure production environment variables and secrets management
- [ ] 16.2 Set up cloud deployment (e.g. AWS ECS or GCP Cloud Run) with auto-scaling
- [ ] 16.3 Configure CDN for static frontend assets
- [ ] 16.4 Set up multi-region MongoDB Atlas cluster and Firebase project
- [ ] 16.5 Configure HTTPS, HSTS, and security headers on the API gateway
- [ ] 16.6 Write deployment runbook and environment setup documentation
