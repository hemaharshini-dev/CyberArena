import { updateXP } from "./xp.js";
import { showSafetySteps, getAdaptiveContent } from "./adaptive.js";

// =======================
// VARIABLES
// =======================
let currentQuestion = 0;
let score = 0;

let timeLeft = 10;
let timerDuration = 10; // adaptive: overridden on init
let timer;

// =======================
// SCENARIOS
// =======================
const scenarios = [
  {
    sender: "support@bank-secure.com",
    actualSender: "scammer-bot-99@hack-hub.xyz",
    subject: "URGENT: Account Suspension",
    body: "Your account will be blocked. Click immediately to verify.",
    link: "http://secure-bank-login.xyz",
    options: ["Click link", "Verify sender", "Ignore"],
    correct: "Verify sender",
    explanation: "Suspicious domain + urgency = phishing.",
  },
  {
    sender: "lottery@winbig.com",
    actualSender: "unknown-origin@phish-tank.net",
    subject: "🎉 You Won ₹10,00,000!",
    body: "Share OTP to claim your prize.",
    link: "http://claim-prize-fast.xyz",
    options: ["Send OTP", "Ignore", "Reply"],
    correct: "Ignore",
    explanation: "No legit service asks OTP for rewards.",
  },
  {
    sender: "delivery@amaz0n.in",
    actualSender: "malicious-actor@fake-site.org",
    subject: "Package Delivery Failed",
    body: "Update your address using this link.",
    link: "http://amazon-delivery-update.xyz",
    options: ["Click link", "Check official app", "Ignore"],
    correct: "Check official app",
    explanation: "Fake domain (amaz0n ≠ amazon).",
  },
  {
    sender: "hr@job-offer.com",
    actualSender: "recruit-scam@job-portal.co",
    subject: "Immediate Job Offer",
    body: "Pay ₹500 to confirm your job.",
    link: "http://job-confirmation.xyz",
    options: ["Pay", "Ignore", "Verify company"],
    correct: "Verify company",
    explanation: "Legit jobs don’t ask money.",
  },
  {
    sender: "security@google-support.com",
    actualSender: "account-theft@google-fraud.com",
    subject: "Security Alert",
    body: "Unusual login detected. Click to secure account.",
    link: "http://google-secure-login.xyz",
    options: ["Click link", "Check Google account", "Ignore"],
    correct: "Check Google account",
    explanation: "Always verify via official site.",
  }
];

// AI-Generated Scenario Engine
const AI_SCENARIO_POOL = [
  { company: "PayPal", domain: "paypal-secure-verify.net", action: "verify your payment method" },
  { company: "Netflix", domain: "netflix-billing-update.org", action: "update your billing details" },
  { company: "Apple", domain: "apple-id-locked.com", action: "unlock your Apple ID" },
  { company: "Microsoft", domain: "microsoft-account-alert.xyz", action: "confirm your account" },
  { company: "Amazon", domain: "amazon-order-issue.info", action: "resolve a delivery problem" },
  { company: "Instagram", domain: "instagram-verify-account.net", action: "verify your identity" },
  { company: "DHL", domain: "dhl-customs-fee.xyz", action: "pay a customs clearance fee" },
  { company: "IRS", domain: "irs-tax-refund-claim.com", action: "claim your tax refund" }
];

const URGENCY_PHRASES = [
  "Your account will be permanently suspended in 24 hours.",
  "Unusual sign-in activity detected from an unknown device.",
  "Your payment failed. Immediate action required.",
  "We have placed a temporary hold on your account.",
  "Your subscription has been compromised. Act now."
];

function buildLocalAIScenario() {
  const pool = AI_SCENARIO_POOL;
  const pick = pool[Math.floor(Math.random() * pool.length)];
  const urgency = URGENCY_PHRASES[Math.floor(Math.random() * URGENCY_PHRASES.length)];
  const options = [["Click link", "Verify sender", "Ignore"], ["Click link", "Check official app", "Ignore"]];
  const opts = options[Math.floor(Math.random() * options.length)];
  return {
    sender: `security@${pick.domain}`,
    actualSender: `noreply@${pick.domain.replace(/\.(net|org|com|xyz|info)$/, '-fraud.xyz')}`,
    subject: `⚠️ Action Required: Your ${pick.company} Account`,
    body: `${urgency} Please ${pick.action} immediately to restore full access.`,
    link: `http://${pick.domain}/verify`,
    options: opts,
    correct: opts[1],
    explanation: `🤖 AI Scenario: Fake ${pick.company} domain. Real ${pick.company} emails come from @${pick.company.toLowerCase()}.com only.`,
    aiGenerated: true
  };
}

async function fetchAIScenario() {
  const apiKey = localStorage.getItem('openrouter_api_key');
  if (!apiKey) return null;
  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify({
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [{
          role: 'user',
          content: 'Generate a realistic phishing email scenario as JSON with fields: sender, actualSender, subject, body, link, options (array of 3 strings), correct (one of the options), explanation. Make it educational. Return ONLY valid JSON, no markdown.'
        }],
        max_tokens: 300
      })
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content?.trim();
    if (!text) return null;
    const scenario = JSON.parse(text);
    scenario.aiGenerated = true;
    return scenario;
  } catch {
    return null;
  }
}

async function generateDynamicScenario() {
  const aiScenario = await fetchAIScenario();
  return aiScenario || buildLocalAIScenario();
}

// =======================
// HIGHLIGHT TEXT
// =======================
function highlightText(text) {
  const suspiciousWords = ["URGENT", "immediately", "OTP", "Click"];

  suspiciousWords.forEach((word) => {
    const regex = new RegExp(word, "gi");
    text = text.replace(regex, `<span class="highlight">${word}</span>`);
  });

  return text;
}

// =======================
// LOAD QUESTION
// =======================
function loadQuestion() {
  document.getElementById("loginModal").style.display = "none";
  document.getElementById("headerDetails").style.display = "none";
  const q = scenarios[currentQuestion];

  // Progress text shows current question
  document.getElementById("progressText").innerText =
    `Question ${currentQuestion + 1}/${scenarios.length}`;

  // Progress bar stays at previous completed state until this one is answered
  document.getElementById("progressFill").style.width =
    (currentQuestion / scenarios.length) * 100 + "%";

  // Email content
  const senderEl = document.getElementById("sender");
  senderEl.innerText = q.sender;
  document.getElementById("actualSender").innerText = q.actualSender;
  document.getElementById("subject").innerText = q.subject;
  document.getElementById("emailBody").innerHTML = highlightText(q.body);

  // Show AI badge if this is an AI-generated scenario
  const aiLabel = document.getElementById('aiModeLabel');
  if (aiLabel) aiLabel.style.opacity = q.aiGenerated ? '1' : '0.3';

  senderEl.onclick = () => {
    const details = document.getElementById("headerDetails");
    details.style.display = details.style.display === "none" ? "block" : "none";
  };

  const linkEl = document.getElementById("emailLink");
  const previewEl = document.getElementById("urlPreview");

  // Display fake link text
  linkEl.innerText = "Click here";

  // Hover preview (real URL)
  linkEl.onmouseover = () => {
    previewEl.innerText = q.link;
  };

  linkEl.onmouseout = () => {
    previewEl.innerText = "";
  };

  // Fake login trap
  linkEl.onclick = () => {
    document.getElementById("loginModal").style.display = "flex";
  };

  // Options
  const optionsDiv = document.getElementById("options");
  optionsDiv.innerHTML = "";

  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.innerText = option;
    btn.className = "secondary-btn";
    btn.onclick = () => checkAnswer(option);
    optionsDiv.appendChild(btn);
  });

  document.getElementById("feedback").innerHTML = "";
  document.getElementById("nextBtn").style.display = "none";

  startTimer();
}

// =======================
// CHECK ANSWER
// =======================
function checkAnswer(selected) {
  clearInterval(timer);

  const q = scenarios[currentQuestion];
  const feedback = document.getElementById("feedback");

  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === q.correct) {
    score += 10;

    feedback.innerHTML = `
      <p style="color:lightgreen;">✅ Correct!</p>
      <p>${q.explanation}</p>
    `;
  } else {
    feedback.innerHTML = `
      <p style="color:red;">❌ Wrong!</p>
      <p>${q.explanation}</p>
    `;
  }

  // Update progress bar on answer
  document.getElementById("progressFill").style.width =
    ((currentQuestion + 1) / scenarios.length) * 100 + "%";

  document.getElementById("xpDisplay").innerText = `XP: ${score}`;
  document.getElementById("nextBtn").style.display = "block";
}

// =======================
// NEXT BUTTON
// =======================
document.getElementById("nextBtn").onclick = () => {
  currentQuestion++;

  if (currentQuestion < scenarios.length) {
    loadQuestion();
  } else {
    showResult();
  }
};

// =======================
// RESULT
// =======================
async function showResult() {
  let badge = "";

  if (score >= 40) badge = "🛡️ Scam Shield";
  else if (score >= 20) badge = "🔍 Phishing Detective";
  else badge = "⚠️ Rookie";

  const xpAwarded = await updateXP(score, 'phishing');

  document.body.innerHTML = `
  <div class="container" id="resultContainer">
    <h1>🎉 Mission Complete</h1>
    <h2>XP: ${xpAwarded ? score : 0} ${!xpAwarded ? '<small style="color:#9ca3af;font-size:13px;">(already earned — Practice Mode)</small>' : ''}</h2>
    <h3>${badge}</h3>

    <div class="deep-dive" style="text-align:left; margin-top:20px; padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
      <h3>📖 Cyber Deep Dive: Phishing</h3>
      <p>Phishing is a type of social engineering where attackers masquerade as a trusted entity to steal data.</p>
      <ul>
        <li><strong>Smishing:</strong> Phishing via SMS.</li>
        <li><strong>Vishing:</strong> Phishing via voice calls.</li>
        <li><strong>Spear Phishing:</strong> Targeted attacks on specific individuals.</li>
      </ul>
      <p><em>Real-world Case:</em> The 2020 Twitter hack used social engineering to gain access to internal administrative tools.</p>
    </div>

    <div id="safetyArea"></div>

    <div style="margin-top:15px;">
      ${xpAwarded ? '<button class="primary-btn" onclick="location.reload()">🔁 Play Again</button>' : '<p style="color:#9ca3af;font-size:13px;">🔒 XP already earned for this mission. Replay anytime for practice — no XP awarded.</p>'}
      <button class="secondary-btn" onclick="goHome()">🏠 Back to Home</button>
    </div>
  </div>
`;
  showSafetySteps("phishing", "safetyArea");
}

// =======================
// TIMER
// =======================
function startTimer() {
  timeLeft = timerDuration;

  document.getElementById("timer").innerText = `⏱️ Time Left: ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;

    document.getElementById("timer").innerText = `⏱️ Time Left: ${timeLeft}s`;

    if (timeLeft === 0) {
      clearInterval(timer);
      autoFail();
    }
  }, 1000);
}

// =======================
// AUTO FAIL
// =======================
function autoFail() {
  const q = scenarios[currentQuestion];

  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });

  document.getElementById("feedback").innerHTML = `
    <p style="color:red;">⏱️ Time's up!</p>
    <p>${q.explanation}</p>
  `;

  // Update progress bar
  document.getElementById("progressFill").style.width =
    ((currentQuestion + 1) / scenarios.length) * 100 + "%";

  document.getElementById("nextBtn").style.display = "block";
}

// =======================
// FAKE LOGIN TRAP
// =======================
function handleLogin() {
  clearInterval(timer);
  document.getElementById("loginModal").style.display = "none";

  // "You've been phished" full-screen flash
  const overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(255,0,0,0.85);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;animation:phishFlash 0.3s ease-out;';
  overlay.innerHTML = `
    <div style="font-family:var(--font-cyber);color:#fff;text-align:center;">
      <div style="font-size:64px;margin-bottom:10px;">🎣</div>
      <div style="font-size:28px;font-weight:bold;letter-spacing:3px;">YOU'VE BEEN PHISHED</div>
      <div style="font-size:13px;margin-top:12px;color:rgba(255,255,255,0.8);font-family:var(--font-main);">Your credentials were just stolen. -10 XP</div>
    </div>
  `;
  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
    document.querySelectorAll("#options button").forEach(btn => btn.disabled = true);
    document.getElementById("feedback").innerHTML = `
      <p style="color:red;">❌ [WRONG]</p>
      <p>🚨 You entered credentials into a phishing site. Attackers now have your password.</p>
    `;
    score -= 10;
    document.getElementById("progressFill").style.width = ((currentQuestion + 1) / scenarios.length) * 100 + "%";
    document.getElementById("xpDisplay").innerText = `XP: ${score}`;
    document.getElementById("nextBtn").style.display = "block";
  }, 1800);
}

// =======================
// INIT
// =======================
async function init() {
  const adaptive = await getAdaptiveContent('phishing');
  timerDuration = adaptive.timerSeconds;
  timeLeft = timerDuration;

  const aiScenario = await generateDynamicScenario();
  scenarios.push(aiScenario);

  const aiLabel = document.getElementById('aiModeLabel');
  if (aiLabel) {
    const usedAPI = !!localStorage.getItem('openrouter_api_key');
    aiLabel.innerHTML = usedAPI
      ? `🤖 <span style="color:var(--neon-green);">AI Mode: Live API</span>`
      : `🤖 <span style="color:#fbbf24;">AI Mode: Local Engine</span>`;
    aiLabel.innerHTML += ` &nbsp;|&nbsp; <span style="color:var(--neon-cyan);">🎯 ${adaptive.level}</span>`;
    aiLabel.style.display = 'block';
  }

  loadQuestion();
}

init();

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
  loginBtn.onclick = handleLogin;
}

window.onclick = function (e) {
  const modal = document.getElementById("loginModal");
  if (e.target === modal) {
    modal.style.display = "none";
  }
};

// Allow setting API key from console: setAIKey('your-key')
window.setAIKey = (key) => { localStorage.setItem('openrouter_api_key', key); alert('API key saved. Reload to use live AI scenarios.'); };
