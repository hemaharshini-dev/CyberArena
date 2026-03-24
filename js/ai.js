import { updateXP } from "./xp.js";

// =======================
// VARIABLES
// =======================
let cluesFound = 0;
let maxClues = 2;
let score = 0;

// =======================
// SCENARIO POOL (randomised each play)
// =======================
const scenarioPool = [
  {
    text: "📹 CEO video call requesting an urgent ₹5,00,000 wire transfer before end of day. He says the board approved it but you must act now.",
    clues: [
      { label: "Tone",     message: "⚠️ Extreme urgency with no time to verify — classic pressure tactic used in deepfake fraud." },
      { label: "Language", message: "⚠️ Slightly robotic cadence and unnatural blinking pattern detected." },
      { label: "Context",  message: "⚠️ Wire transfers are never authorised via video call alone — this bypasses standard approval chains." },
      { label: "Identity", message: "⚠️ No secondary verification requested. Real executives follow dual-authorisation protocols." },
    ],
    correct: true,
    deepDive: "In 2024, a finance worker at a multinational firm was tricked into paying out $25 million after a deepfaked CFO appeared on a video call with other 'colleagues' — all AI-generated."
  },
  {
    text: "🎙️ Voicemail from your bank's fraud department. The caller sounds exactly like the agent you spoke to last week and asks you to call back on a new number to 'unfreeze' your account.",
    clues: [
      { label: "Tone",     message: "⚠️ Calm but insistent — voice cloning tools can replicate tone and pacing from as little as 3 seconds of audio." },
      { label: "Language", message: "⚠️ Uses your name and references a recent interaction — scraped from social media or a prior breach." },
      { label: "Context",  message: "⚠️ Legitimate banks never ask you to call a number left in a voicemail — always call the number on the back of your card." },
      { label: "Identity", message: "⚠️ The callback number is not the bank's official number — a key indicator of vishing with cloned voice." },
    ],
    correct: true,
    deepDive: "In 2023, a UK energy firm CEO was deceived by an AI voice clone of his parent company's CEO, transferring €220,000 to a fraudulent account in a single call."
  },
  {
    text: "📧 An email from your IT department with a video message embedded. The IT manager explains a new security policy and asks you to click 'Acknowledge' to confirm you've watched it.",
    clues: [
      { label: "Tone",     message: "✅ Professional and measured — no unusual urgency detected." },
      { label: "Language", message: "✅ Uses standard corporate language consistent with previous IT communications." },
      { label: "Context",  message: "✅ Policy acknowledgement via email is a standard IT compliance workflow." },
      { label: "Identity", message: "✅ Sender domain matches your organisation's official domain exactly." },
    ],
    correct: false,
    deepDive: "Not every video message is a deepfake. Legitimate IT communications follow predictable patterns — official domain, no financial requests, and verifiable through internal channels. The skill is knowing when to be suspicious."
  },
  {
    text: "📱 A WhatsApp video call from your friend abroad. They look and sound normal but ask you to urgently send them money via a new account because they lost their wallet.",
    clues: [
      { label: "Tone",     message: "⚠️ Distressed and rushed — emotional manipulation is a key component of real-time deepfake scams." },
      { label: "Language", message: "⚠️ Slightly off phrasing — deepfake audio models sometimes struggle with natural filler words and pauses." },
      { label: "Context",  message: "⚠️ Requests for money via a new account mid-call are a major red flag regardless of who appears on screen." },
      { label: "Identity", message: "⚠️ Ask a personal question only your real friend would know — deepfakes cannot answer from memory." },
    ],
    correct: true,
    deepDive: "Real-time deepfake video calls are now possible using consumer hardware. In 2024, multiple families reported receiving fake distress calls from 'relatives' generated live using face-swap tools."
  },
];

const scenario = scenarioPool[Math.floor(Math.random() * scenarioPool.length)];

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
  const correct = userChoice === scenario.correct;

  if (correct) {
    score += 10;
    updateXP(score);
  } else {
    score -= 10;
    updateXP(0);
  }

  const resultLabel = correct
    ? `<p style="color:lightgreen;">✅ [CORRECT] ${scenario.correct ? 'You correctly flagged this as AI-generated.' : 'You correctly identified this as legitimate.'}</p>`
    : `<p style="color:red;">❌ [WRONG] ${scenario.correct ? 'This was a deepfake — you should have flagged it.' : 'This was legitimate — not everything is a threat.'}</p>`;

  feedback.innerHTML = `
    ${resultLabel}
    <div class="deep-dive" style="text-align:left; margin-top:20px; padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
      <h3>📖 Cyber Deep Dive: AI & Deepfakes</h3>
      <p>AI is increasingly used by attackers to create highly realistic deepfakes of video, audio, and images.</p>
      <ul>
        <li><strong>Deepfake Video:</strong> Swapping faces or synthesizing entire movements in real time.</li>
        <li><strong>Voice Cloning:</strong> Mimicking someone's voice using as little as 3 seconds of audio.</li>
        <li><strong>Noise Injection Defence:</strong> Ask the speaker to turn sideways — deepfake models struggle with profile angles.</li>
      </ul>
      <p><em>Case:</em> ${scenario.deepDive}</p>
    </div>
    <div style="margin-top:15px; display:flex; gap:10px; flex-wrap:wrap;">
      <button class="primary-btn" onclick="location.reload()">🔁 Play Again</button>
      <button class="secondary-btn" onclick="goHome()">🏠 Back</button>
    </div>
  `;

  document.getElementById("decision").style.display = "none";
}

// =======================
// INIT
// =======================
loadScenario();

document.getElementById("flagBtn").onclick = () => makeDecision(true);
document.getElementById("trustBtn").onclick = () => makeDecision(false);
