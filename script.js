// =======================
// START MISSION
// =======================
function startMission(type) {
  localStorage.setItem("mission", type);
  window.location.href = "game.html";
}

function goHome() {
  window.location.href = "index.html";
}
// =======================
// GLOBAL VARIABLES
// =======================
const mission = localStorage.getItem("mission");

let currentQuestion = 0;
let score = 0;

let timeLeft = 10;
let timer;

let scenarios = [];

// =======================
// SCENARIOS BASED ON MISSION
// =======================
if (mission === "phishing") {
  scenarios = [
    {
      sender: "support@bank-secure.com",
      subject: "URGENT: Account Suspension",
      body: "Click immediately to verify your account.",
      options: ["Click", "Verify sender", "Ignore"],
      correct: "Verify sender",
      explanation: "Suspicious domain + urgency = phishing.",
    },
  ];
} else if (mission === "social") {
  scenarios = [
    {
      sender: "Unknown Caller",
      subject: "Fake IT Support Call",
      body: "I’m from IT, tell me your password to fix issue.",
      options: ["Share password", "Refuse", "Ask details"],
      correct: "Refuse",
      explanation: "Never share passwords, even with 'IT'.",
    },
  ];
} else if (mission === "ai") {
  scenarios = [
    {
      sender: "AI Video",
      subject: "CEO asking urgent transfer",
      body: "Deepfake video asking for money transfer.",
      options: ["Transfer", "Verify via call", "Ignore"],
      correct: "Verify via call",
      explanation: "Always verify unusual requests.",
    },
  ];
} else if (mission === "malware") {
  scenarios = [
    {
      sender: "System Alert",
      subject: "Virus detected!",
      body: "Download this tool to remove virus.",
      options: ["Download", "Ignore", "Use trusted antivirus"],
      correct: "Use trusted antivirus",
      explanation: "Unknown tools may be malware.",
    },
  ];
}

// =======================
// LOAD QUESTION
// =======================
function loadQuestion() {
  if (!mission) {
    document.body.innerHTML = `
    <div class="container">
      <h2>⚠️ No mission selected</h2>
      <p>Please choose a mission first</p>
      <button onclick="goHome()">Go to Missions</button>
    </div>
  `;
    return;
  }
  if (scenarios.length === 0) {
    document.body.innerHTML = "<h2>No scenarios found 😢</h2>";
    return;
  }

  document.getElementById("missionTitle").innerText =
    mission.toUpperCase() + " MISSION";

  const total = scenarios.length;
  const current = currentQuestion + 1;

  document.getElementById("progressText").innerText =
    `Question ${current}/${total}`;

  const percent = (current / total) * 100;
  document.getElementById("progressFill").style.width = percent + "%";

  const q = scenarios[currentQuestion];

  document.getElementById("sender").innerText = q.sender;
  document.getElementById("subject").innerText = q.subject;
  document.getElementById("emailBody").innerText = q.body;

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
  const feedbackDiv = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");

  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });

  if (selected === q.correct) {
    feedbackDiv.innerHTML = `
      <p style="color:lightgreen;">✅ Correct!</p>
      <p>${q.explanation}</p>
    `;
    score += 10;
  } else {
    feedbackDiv.innerHTML = `
      <p style="color:red;">❌ Wrong!</p>
      <p>${q.explanation}</p>
    `;
  }

  nextBtn.style.display = "block";

  const xpEl = document.getElementById("xpDisplay");
  if (xpEl) xpEl.innerText = `XP: ${score}`;
}

// =======================
// NEXT BUTTON (SAFE)
// =======================
const nextBtnEl = document.getElementById("nextBtn");

if (nextBtnEl) {
  nextBtnEl.onclick = () => {
    currentQuestion++;

    document.getElementById("feedback").innerHTML = "";
    nextBtnEl.style.display = "none";

    if (currentQuestion < scenarios.length) {
      loadQuestion();
    } else {
      showResult();
    }
  };
}

// =======================
// RESULT SCREEN
// =======================
function showResult() {
  let badge = "";
  let message = "";

  if (score >= 30) {
    badge = "🛡️ Scam Shield";
    message = "You can spot scams like a pro!";
  } else if (score >= 20) {
    badge = "🔍 Phishing Detective";
    message = "Good job! Stay sharp.";
  } else {
    badge = "⚠️ Cyber Rookie";
    message = "You need more training!";
  }

  document.body.innerHTML = `
    <div class="container">
      <h1>🎉 Mission Complete</h1>
      <h2>XP: ${score}</h2>
      <h3>${badge}</h3>
      <p>${message}</p>
      <button onclick="location.reload()">Play Again</button>
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
  const feedbackDiv = document.getElementById("feedback");
  const nextBtn = document.getElementById("nextBtn");

  document.querySelectorAll("#options button").forEach((btn) => {
    btn.disabled = true;
  });

  feedbackDiv.innerHTML = `
    <p style="color:red;">⏱️ Time's up!</p>
    <p>${q.explanation}</p>
  `;

  nextBtn.style.display = "block";
}

// =======================
// LOAD GAME ONLY ON GAME PAGE
// =======================
if (window.location.pathname.includes("game.html")) {
  loadQuestion();
}
