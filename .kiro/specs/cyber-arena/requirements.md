# Requirements Document

## Introduction

CyberArena is a gamified cybersecurity training web and mobile application that trains users to recognise and respond to real-world cyber threats through scenario-based, decision-driven gameplay. The platform targets schools, colleges, and enterprises, addressing the fact that 90% of security incidents involve human error. It uses adaptive difficulty, gamification, and AI-generated threat scenarios to build lasting digital safety habits across four mission types: Phishing Detective, Social Engineering Simulator, AI-Crime Lab, and Malware Escape Room.

---

## Glossary

- **System**: The CyberArena application as a whole
- **Platform**: The web and mobile deployment of CyberArena
- **User**: A registered individual using CyberArena for training
- **Admin**: An organisation administrator managing users, teams, or classes
- **Scenario**: A single decision-driven simulation of a cyber threat
- **Mission**: A themed collection of Scenarios (e.g. Phishing Detective)
- **Scenario_Engine**: The backend service that selects, delivers, and evaluates Scenarios
- **Adaptive_Engine**: The backend service that adjusts difficulty based on User performance
- **AI_Layer**: The AI service that generates phishing samples, deepfake media, and difficulty parameters
- **Gamification_Service**: The service managing XP, levels, badges, streaks, and leaderboards
- **Progress_Store**: The data storage layer (Firebase / MongoDB) persisting User progress, metrics, and analytics
- **Feedback_Service**: The service that delivers immediate consequence feedback and micro-learning content after each decision
- **Accessibility_Service**: The service providing voice guidance, subtitles, contrast modes, and language localisation
- **Auth_Service**: The service handling user registration, authentication, and session management

---

## Requirements

### Requirement 1: User Registration and Authentication

**User Story:** As a new user, I want to register and log in securely, so that my progress and data are saved and protected.

#### Acceptance Criteria

1. THE Auth_Service SHALL allow a User to register using an email address and password.
2. WHEN a User submits registration credentials, THE Auth_Service SHALL validate that the email is correctly formatted and the password meets a minimum length of 8 characters.
3. IF a User submits a duplicate email address during registration, THEN THE Auth_Service SHALL return a descriptive error message without creating a duplicate account.
4. WHEN a registered User submits valid credentials, THE Auth_Service SHALL authenticate the User and issue a session token.
5. IF a User submits invalid credentials, THEN THE Auth_Service SHALL return an authentication failure message without revealing which field is incorrect.
6. WHEN a User session token expires after 24 hours of inactivity, THE Auth_Service SHALL require the User to re-authenticate.
7. WHERE an organisation SSO integration is configured, THE Auth_Service SHALL support single sign-on authentication for Users belonging to that organisation.

---

### Requirement 2: Mission and Scenario Navigation

**User Story:** As a user, I want to browse and select from four distinct missions, so that I can train on the specific threat type I want to improve.

#### Acceptance Criteria

1. THE System SHALL present Users with four missions: Phishing Detective, Social Engineering Simulator, AI-Crime Lab, and Malware Escape Room.
2. WHEN a User selects a Mission, THE Scenario_Engine SHALL load the first available Scenario for that Mission.
3. WHILE a User is progressing through a Mission, THE Scenario_Engine SHALL track the User's current position and allow resumption from the last incomplete Scenario.
4. IF a User has not completed prerequisite Scenarios for an advanced Scenario, THEN THE Scenario_Engine SHALL prevent access to that Scenario and display the prerequisite requirement.
5. WHEN a User completes all Scenarios in a Mission, THE Scenario_Engine SHALL mark the Mission as complete and notify the Gamification_Service.

---

### Requirement 3: Phishing Detective Mission

**User Story:** As a user, I want to analyse suspicious emails and make decisions about them, so that I can learn to identify phishing attacks in real life.

#### Acceptance Criteria

1. WHEN a User enters the Phishing Detective Mission, THE Scenario_Engine SHALL present a simulated email including sender address, subject line, email body, and embedded links.
2. THE Scenario_Engine SHALL provide the User with at least three decision options per Scenario: click a link, verify the sender, or report the email.
3. WHEN a User selects a decision, THE Feedback_Service SHALL immediately display the consequence of that decision and a micro-learning explanation covering email headers, URL inspection, and sender signals.
4. THE AI_Layer SHALL generate phishing email samples with realistic sender spoofing, urgency language, and malicious link patterns.
5. WHEN a User correctly identifies a phishing email, THE Gamification_Service SHALL award XP to the User.
6. IF a User clicks a simulated malicious link, THEN THE Feedback_Service SHALL display a simulated breach consequence and a practical tip on how to respond in real life.

---

### Requirement 4: Social Engineering Simulator Mission

**User Story:** As a user, I want to role-play social engineering scenarios involving calls and chats, so that I can learn to detect manipulation tactics.

#### Acceptance Criteria

1. WHEN a User enters the Social Engineering Simulator Mission, THE Scenario_Engine SHALL present a simulated conversation scenario via text chat or scripted call transcript.
2. THE Scenario_Engine SHALL include manipulation tactics in Scenarios such as authority impersonation, urgency, fear, and reciprocity.
3. WHEN a User selects a response during a conversation Scenario, THE Feedback_Service SHALL display the consequence and explain the manipulation tactic used.
4. THE Scenario_Engine SHALL present at least two branching decision points per Social Engineering Scenario.
5. WHEN a User successfully identifies and refuses a manipulation attempt, THE Gamification_Service SHALL award XP to the User.

---

### Requirement 5: AI-Crime Lab Mission

**User Story:** As a user, I want to analyse AI-generated media and messages, so that I can learn to detect deepfakes, voice cloning, and AI-crafted scams.

#### Acceptance Criteria

1. WHEN a User enters the AI-Crime Lab Mission, THE Scenario_Engine SHALL present AI-generated media samples including images, audio clips, or text messages for analysis.
2. THE AI_Layer SHALL generate deepfake image samples and AI-crafted phishing text with detectable inconsistencies for training purposes.
3. THE Scenario_Engine SHALL prompt the User to identify specific cues such as visual artefacts, unnatural audio patterns, or suspicious language patterns.
4. WHEN a User correctly identifies an AI-generated threat, THE Feedback_Service SHALL explain the verification skills used, including metadata checking and source confirmation.
5. WHEN a User correctly identifies an AI-generated threat, THE Gamification_Service SHALL award XP to the User.
6. IF a User fails to identify an AI-generated threat, THEN THE Feedback_Service SHALL display the missed cues and provide a response playbook covering escalation, evidence preservation, and stakeholder notification.

---

### Requirement 6: Malware Escape Room Mission

**User Story:** As a user, I want to respond to a simulated malware attack step by step, so that I can learn the correct incident response sequence.

#### Acceptance Criteria

1. WHEN a User enters the Malware Escape Room Mission, THE Scenario_Engine SHALL present a simulated active malware incident with a set of prioritised response actions.
2. THE Scenario_Engine SHALL require the User to sequence response steps including containment, prioritisation, and system restoration within the Scenario.
3. WHEN a User selects an incorrect response sequence, THE Feedback_Service SHALL display the consequence of the incorrect order and explain the correct incident response procedure.
4. WHEN a User completes the Malware Escape Room Scenario with the correct response sequence, THE Gamification_Service SHALL award XP and mark the Scenario as complete.
5. THE Scenario_Engine SHALL include at least three distinct malware incident types across the Malware Escape Room Mission.

---

### Requirement 7: Immediate Feedback and Micro-Learning

**User Story:** As a user, I want to receive instant feedback after every decision, so that I understand the consequences and learn the correct behaviour immediately.

#### Acceptance Criteria

1. WHEN a User submits a decision in any Scenario, THE Feedback_Service SHALL display feedback within 500 milliseconds.
2. THE Feedback_Service SHALL include in every feedback response: the consequence of the decision, a micro-learning explanation of the relevant concept, and a practical real-life tip.
3. THE Feedback_Service SHALL present micro-learning content in a format no longer than 100 words per explanation to maintain brevity.
4. WHEN a User requests more detail on a feedback topic, THE Feedback_Service SHALL provide an expanded explanation without leaving the current Scenario context.

---

### Requirement 8: Adaptive Difficulty Engine

**User Story:** As a user, I want the difficulty of scenarios to adjust based on my performance, so that I am always appropriately challenged and reinforced on weak areas.

#### Acceptance Criteria

1. THE Adaptive_Engine SHALL track each User's correct and incorrect decision rate per Scenario type.
2. WHEN a User fails a Scenario, THE Adaptive_Engine SHALL queue additional Scenarios of the same type and difficulty level for that User.
3. WHEN a User achieves a correct decision rate above 80% across three consecutive Scenarios of the same type, THE Adaptive_Engine SHALL increase the difficulty level for subsequent Scenarios of that type.
4. THE Adaptive_Engine SHALL maintain a minimum of three difficulty levels per Mission: beginner, intermediate, and advanced.
5. WHEN the Adaptive_Engine adjusts a User's difficulty level, THE Progress_Store SHALL record the adjustment with a timestamp.
6. THE Adaptive_Engine SHALL generate personalised feedback summaries identifying the User's weakest Scenario types and recommending refresher Scenarios.

---

### Requirement 9: Gamification and Progression

**User Story:** As a user, I want to earn XP, badges, and maintain streaks, so that I stay motivated to continue training.

#### Acceptance Criteria

1. THE Gamification_Service SHALL award XP to a User upon successful completion of each Scenario, with XP values scaled by difficulty level.
2. THE Gamification_Service SHALL calculate a User's level based on cumulative XP using a defined progression table.
3. WHEN a User completes Scenarios on consecutive calendar days, THE Gamification_Service SHALL increment the User's streak counter.
4. IF a User does not complete a Scenario on a given calendar day, THEN THE Gamification_Service SHALL reset the User's streak counter to zero.
5. THE Gamification_Service SHALL award badges to Users upon meeting defined criteria, including "Scam Shield" for completing the Social Engineering Mission and "Phishing Pro" for completing the Phishing Detective Mission.
6. WHERE a leaderboard is enabled by an Admin, THE Gamification_Service SHALL display a ranked list of Users within the same team or class by cumulative XP.
7. THE Progress_Store SHALL persist all XP, level, streak, and badge data per User.

---

### Requirement 10: User Progress Tracking and Analytics

**User Story:** As a user and as an admin, I want to view detailed progress reports, so that I can measure improvement and identify areas needing attention.

#### Acceptance Criteria

1. THE Progress_Store SHALL record each User's Scenario attempts, decisions made, outcomes, and timestamps.
2. WHEN a User views their profile dashboard, THE System SHALL display cumulative XP, current level, active streak, earned badges, and Mission completion status.
3. WHEN an Admin views the organisation dashboard, THE System SHALL display aggregated performance metrics for all Users within the organisation, including average scores per Mission type.
4. THE System SHALL generate a per-User performance report showing correct decision rate per Scenario type and improvement trend over time.
5. IF a User's correct decision rate for a Scenario type falls below 50% over the last 10 attempts, THEN THE System SHALL surface a refresher recommendation to the User.

---

### Requirement 11: AI Layer — Scenario Content Generation

**User Story:** As a platform operator, I want the AI layer to generate realistic and varied threat scenarios, so that users are exposed to current and diverse attack patterns.

#### Acceptance Criteria

1. THE AI_Layer SHALL generate phishing email samples with variable sender domains, subject lines, urgency levels, and embedded link patterns.
2. THE AI_Layer SHALL generate deepfake image samples with detectable visual artefacts at each difficulty level.
3. THE AI_Layer SHALL generate AI-crafted social engineering text with variable manipulation tactics and urgency levels.
4. WHEN the Adaptive_Engine requests a Scenario at a specified difficulty level, THE AI_Layer SHALL return a generated Scenario within 2 seconds.
5. THE AI_Layer SHALL ensure that generated Scenarios at beginner difficulty contain at least two clearly detectable threat indicators.
6. THE AI_Layer SHALL ensure that generated Scenarios at advanced difficulty contain subtle threat indicators requiring multi-step analysis.

---

### Requirement 12: Accessibility

**User Story:** As a user with accessibility needs, I want the platform to support assistive features, so that I can train effectively regardless of ability or language.

#### Acceptance Criteria

1. THE Accessibility_Service SHALL provide audio narration for all Scenario text content when voice guidance is enabled by the User.
2. THE Accessibility_Service SHALL display subtitles for all audio and video content within Scenarios.
3. THE System SHALL provide a high-contrast UI mode that meets WCAG 2.1 AA contrast ratio requirements.
4. THE Accessibility_Service SHALL support a simplified reading mode that reduces sentence complexity and removes decorative content.
5. WHERE a regional language is configured by the User, THE Accessibility_Service SHALL render all UI text, Scenario content, and feedback in that language.
6. THE System SHALL support a minimum of five regional languages at launch.

---

### Requirement 13: Organisation and Team Management

**User Story:** As an admin, I want to manage users and teams within my organisation, so that I can assign training and monitor group progress.

#### Acceptance Criteria

1. THE Auth_Service SHALL allow an Admin to create and manage a team or class group within the organisation.
2. WHEN an Admin adds a User to a team, THE System SHALL associate that User's progress data with the team for aggregated reporting.
3. THE System SHALL allow an Admin to assign specific Missions to a team, making those Missions mandatory for all Users in the team.
4. WHEN a mandatory Mission is assigned to a team, THE System SHALL notify each User in the team of the new assignment.
5. THE System SHALL allow an Admin to export team performance reports in CSV format.

---

### Requirement 14: Platform Performance and Scalability

**User Story:** As a platform operator, I want the system to perform reliably under load, so that users have a consistent training experience at scale.

#### Acceptance Criteria

1. THE System SHALL support a minimum of 10,000 concurrent Users without degradation in Scenario load time.
2. WHEN a User requests a Scenario, THE Scenario_Engine SHALL deliver the Scenario content within 2 seconds under normal load conditions.
3. THE System SHALL maintain 99.5% uptime measured on a rolling 30-day basis.
4. IF the Scenario_Engine experiences a service failure, THEN THE System SHALL display a user-friendly error message and preserve the User's current progress.
5. THE Progress_Store SHALL replicate User data across a minimum of two geographic regions to ensure durability.
