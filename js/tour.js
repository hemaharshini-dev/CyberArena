// =============================================
// 🧭 CYBERARENA ONBOARDING TOUR
// =============================================

const TOUR_KEY = 'cyberarena_tour_done';

const steps = [
  {
    target: 'h1',
    title: '👋 Welcome to CyberArena!',
    text: 'This is your Mission Hub — the starting point for all cybersecurity training. Let\'s take a quick 30-second tour so you know exactly where everything is.',
    position: 'bottom',
  },
  {
    target: '.activity-ticker',
    title: '📡 Live Activity Ticker',
    text: 'This scrolling feed shows simulated global community activity — threats detected, missions completed, and leaderboard moves happening in real time.',
    position: 'bottom',
  },
  {
    target: '#tour-social',
    title: '🎭 Social Engineering Missions',
    text: 'Start here. These missions teach you to recognise phishing emails, resist manipulation from fake IT support, and spot smishing (SMS scams). Click any mission button to begin.',
    position: 'bottom',
  },
  {
    target: '#tour-technical',
    title: '💻 Technical Defense Missions',
    text: 'Hands-on technical simulations — detect AI deepfakes, respond to a live ransomware outbreak in a terminal, test password strength, and investigate dark web data breaches.',
    position: 'bottom',
  },
  {
    target: '#tour-tools',
    title: '🛠️ Tools & Knowledge',
    text: 'Build your own phishing scenario in the Mission Creator to train others, or visit the Cyber-Wiki for reference articles on every threat type covered in the app.',
    position: 'top',
  },
  {
    target: '.user-stats',
    title: '📊 Your Profile & XP',
    text: 'Every correct decision earns you XP. Your rank climbs from Novice → Specialist → Elite Guardian. Unlock achievement badges as you hit XP milestones.',
    position: 'top',
  },
  {
    target: '.leaderboard',
    title: '🏆 Global Leaderboard',
    text: 'The top 5 players by XP are shown here in real time. Complete missions, earn XP, and climb the ranks. You\'re all set — good luck, Guardian!',
    position: 'top',
  },
];

let currentStep = 0;

// ── DOM helpers ──────────────────────────────
function el(id) { return document.getElementById(id); }

function getTargetEl(selector) {
  return document.querySelector(selector);
}

// ── Build overlay ────────────────────────────
function buildOverlay() {
  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'tour-backdrop';

  // Spotlight cutout (positioned via JS)
  const spotlight = document.createElement('div');
  spotlight.id = 'tour-spotlight';

  // Tooltip card
  const card = document.createElement('div');
  card.id = 'tour-card';
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-modal', 'true');
  card.setAttribute('aria-label', 'Onboarding tour');
  card.innerHTML = `
    <div id="tour-step-counter"></div>
    <h3 id="tour-title"></h3>
    <p id="tour-text"></p>
    <div id="tour-actions">
      <button id="tour-skip" class="tour-btn-skip">Skip Tour</button>
      <div style="display:flex;gap:10px;">
        <button id="tour-prev" class="tour-btn-secondary">← Back</button>
        <button id="tour-next" class="tour-btn-primary">Next →</button>
      </div>
    </div>
    <div id="tour-dots"></div>
  `;

  document.body.appendChild(backdrop);
  document.body.appendChild(spotlight);
  document.body.appendChild(card);

  el('tour-skip').addEventListener('click', endTour);
  el('tour-prev').addEventListener('click', () => goToStep(currentStep - 1));
  el('tour-next').addEventListener('click', () => goToStep(currentStep + 1));
}

// ── Position spotlight around target element ─
function positionSpotlight(targetEl) {
  const rect = targetEl.getBoundingClientRect();
  const pad = 8;
  const spotlight = el('tour-spotlight');
  spotlight.style.top    = `${rect.top    + window.scrollY - pad}px`;
  spotlight.style.left   = `${rect.left   + window.scrollX - pad}px`;
  spotlight.style.width  = `${rect.width  + pad * 2}px`;
  spotlight.style.height = `${rect.height + pad * 2}px`;
}

// ── Position tooltip card relative to target ─
function positionCard(targetEl, position) {
  const rect = targetEl.getBoundingClientRect();
  const card = el('tour-card');
  const cardW = 320;
  const gap = 18;

  // Reset
  card.style.top = '';
  card.style.left = '';
  card.style.transform = '';

  let top, left;

  if (position === 'bottom') {
    top  = rect.bottom + window.scrollY + gap;
    left = rect.left   + window.scrollX + rect.width / 2 - cardW / 2;
  } else {
    top  = rect.top + window.scrollY - gap;
    left = rect.left + window.scrollX + rect.width / 2 - cardW / 2;
    card.style.transform = 'translateY(-100%)';
  }

  // Clamp horizontally so card never goes off-screen
  const maxLeft = window.innerWidth - cardW - 16;
  left = Math.max(16, Math.min(left, maxLeft));

  card.style.top  = `${top}px`;
  card.style.left = `${left}px`;
}

// ── Render a step ────────────────────────────
function goToStep(index) {
  if (index < 0) return;
  if (index >= steps.length) { endTour(); return; }

  currentStep = index;
  const step = steps[index];
  const targetEl = getTargetEl(step.target);

  if (!targetEl) { goToStep(index + 1); return; }

  // Scroll target into view
  targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Small delay to let scroll settle before measuring
  setTimeout(() => {
    positionSpotlight(targetEl);
    positionCard(targetEl, step.position);

    el('tour-title').textContent = step.title;
    el('tour-text').textContent  = step.text;
    el('tour-step-counter').textContent = `Step ${index + 1} of ${steps.length}`;

    // Dots
    const dots = el('tour-dots');
    dots.innerHTML = '';
    steps.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'tour-dot' + (i === index ? ' active' : '');
      dot.addEventListener('click', () => goToStep(i));
      dots.appendChild(dot);
    });

    // Back button visibility
    el('tour-prev').style.visibility = index === 0 ? 'hidden' : 'visible';

    // Last step: change Next to Finish
    el('tour-next').textContent = index === steps.length - 1 ? '✅ Finish' : 'Next →';

    // Highlight target
    document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
    targetEl.classList.add('tour-highlight');
  }, 300);
}

// ── End / cleanup ────────────────────────────
function endTour() {
  ['tour-backdrop', 'tour-spotlight', 'tour-card'].forEach(id => el(id)?.remove());
  document.querySelectorAll('.tour-highlight').forEach(e => e.classList.remove('tour-highlight'));
  localStorage.setItem(TOUR_KEY, '1');
}

// ── Public init ──────────────────────────────
export function initTour(force = false) {
  if (!force && localStorage.getItem(TOUR_KEY)) return;
  buildOverlay();
  goToStep(0);
}

// Expose for "Replay Tour" button
window.replayTour = () => initTour(true);
