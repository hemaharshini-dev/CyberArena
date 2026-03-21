// =======================
// VARIABLES
// =======================
let currentQuestion = 0;
let score = 0;

let timeLeft = 10;
let timer;

// =======================
// SCENARIOS
// =======================
const scenarios = [
  {
    sender: "support@bank-secure.com",
    subject: "URGENT: Account Suspension",
    body: "Your account will be blocked. Click immediately to verify.",
    link: "http://secure-bank-login.xyz",
    options: ["Click link", "Verify sender", "Ignore"],
    correct: "Verify sender",
    explanation: "Suspicious domain + urgency = phishing.",
  },
  {
    sender: "lottery@winbig.com",
    subject: "🎉 You Won ₹10,00,000!",
    body: "Share OTP to claim your prize.",
    link: "http://claim-prize-fast.xyz",
    options: ["Send OTP", "Ignore", "Reply"],
    correct: "Ignore",
    explanation: "No legit service asks OTP for rewards.",
  },
  {
    sender: "delivery@amaz0n.in",
    subject: "Package Delivery Failed",
    body: "Update your address using this link.",
    link: "http://amazon-delivery-update.xyz",
    options: ["Click link", "Check official app", "Ignore"],
    correct: "Check official app",
    explanation: "Fake domain (amaz0n ≠ amazon).",
  },
  {
    sender: "hr@job-offer.com",
    subject: "Immediate Job Offer",
    body: "Pay ₹500 to confirm your job.",
    link: "http://job-confirmation.xyz",
    options: ["Pay", "Ignore", "Verify company"],
    correct: "Verify company",
    explanation: "Legit jobs don’t ask money.",
  },
  {
    sender: "security@google-support.com",
    subject: "Security Alert",
    body: "Unusual login detected. Click to secure account.",
    link: "http://google-secure-login.xyz",
    options: ["Click link", "Check Google account", "Ignore"],
    correct: "Check Google account",
    explanation: "Always verify via official site.",
  },
];

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
  const q = scenarios[currentQuestion];

  // Progress
  document.getElementById("progressText").innerText =
    `Question ${currentQuestion + 1}/${scenarios.length}`;

  document.getElementById("progressFill").style.width =
    ((currentQuestion + 1) / scenarios.length) * 100 + "%";

  // Email content
  document.getElementById("sender").innerText = q.sender;
  document.getElementById("subject").innerText = q.subject;
  document.getElementById("emailBody").innerHTML = highlightText(q.body);

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
function showResult() {
  let badge = "";

  if (score >= 40) badge = "🛡️ Scam Shield";
  else if (score >= 20) badge = "🔍 Phishing Detective";
  else badge = "⚠️ Rookie";

  document.body.innerHTML = `
  <div class="container">
    <h1>🎉 Mission Complete</h1>
    <h2>XP: ${score}</h2>
    <h3>${badge}</h3>

    <div style="margin-top:15px;">
      <button class="primary-btn" onclick="location.reload()">
        🔁 Play Again
      </button>

      <button class="secondary-btn" onclick="goHome()">
        🏠 Back to Home
      </button>
    </div>
  </div>
`;
}

// =======================
// TIMER
// =======================
function startTimer() {
  timeLeft = 10;

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

  document.getElementById("nextBtn").style.display = "block";
}

// =======================
// FAKE LOGIN TRAP
// =======================
function handleLogin() {
  clearInterval(timer);

  // Close modal
  document.getElementById("loginModal").style.display = "none";

  // Disable buttons
  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });

  // Show feedback like WRONG answer
  document.getElementById("feedback").innerHTML = `
    <p style="color:red;">❌ Wrong!</p>
    <p>🚨 You entered credentials into a phishing site.</p>
  `;

  score -= 10;

  document.getElementById("xpDisplay").innerText = `XP: ${score}`;
  document.getElementById("nextBtn").style.display = "block";
}

// =======================
// INIT
// =======================
loadQuestion();

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
