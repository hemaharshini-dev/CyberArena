// =======================
// VARIABLES
// =======================
let cluesFound = 0;
let maxClues = 2;
let score = 0;

// =======================
// SCENARIO
// =======================
const scenario = {
  text: "📹 CEO video asking for urgent ₹5,00,000 transfer immediately.",

  clues: [
    {
      label: "Tone",
      message: "⚠️ Too urgent → common scam tactic.",
    },
    {
      label: "Language",
      message: "⚠️ Robotic / unnatural phrasing.",
    },
    {
      label: "Context",
      message: "⚠️ Unusual financial request.",
    },
    {
      label: "Identity",
      message: "⚠️ No proper verification.",
    },
  ],

  correct: true, // fake
};

// =======================
// LOAD SCENARIO
// =======================
function loadScenario() {
  document.getElementById("scenarioText").innerText = scenario.text;

  const cluesDiv = document.getElementById("clues");
  cluesDiv.innerHTML = "";

  scenario.clues.forEach((clue, index) => {
    const btn = document.createElement("button");
    btn.innerText = clue.label;

    btn.onclick = () => investigate(btn, clue);

    cluesDiv.appendChild(btn);
  });
}

// =======================
// INVESTIGATION
// =======================
function investigate(btn, clue) {
  if (btn.classList.contains("found")) return;

  if (cluesFound >= maxClues) {
    document.getElementById("feedback").innerHTML =
      "⚠️ You can only select 2 clues!";
    return;
  }

  btn.classList.add("found");

  cluesFound++;
  score += 5;

  document.getElementById("feedback").innerHTML = clue.message;

  // Show decision after 1+ clues
  if (cluesFound >= 1) {
    document.getElementById("decision").style.display = "block";
  }
}

// =======================
// DECISION
// =======================
function makeDecision(userChoice) {
  const feedback = document.getElementById("feedback");

  if (userChoice === scenario.correct) {
    score += 10;

    feedback.innerHTML = `
      <p style="color:lightgreen;">✅ Correct!</p>
      <p>You identified an AI-generated scam.</p>
      <p>Score: ${score}</p>

      <button class="primary-btn" onclick="location.reload()">Play Again</button>
      <button class="secondary-btn" onclick="goHome()">Back</button>
    `;
  } else {
    score -= 10;

    feedback.innerHTML = `
      <p style="color:red;">❌ Wrong!</p>
      <p>You trusted a malicious AI-generated request.</p>
      <p>Score: ${score}</p>

      <button class="primary-btn" onclick="location.reload()">Try Again</button>
      <button class="secondary-btn" onclick="goHome()">Back</button>
    `;
  }

  document.getElementById("decision").style.display = "none";
}

// =======================
// INIT
// =======================
loadScenario();
