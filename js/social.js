import { updateXP } from "./xp.js";
import { showSafetySteps } from "./adaptive.js";

let trust = 50;
let step = 0;

const chatBox = document.getElementById("chatBox");
const optionsDiv = document.getElementById("options");

// SCENARIO FLOW
const flow = [
  {
    bot: "Hi, I’m from IT support.",
    options: [
      { text: "Okay, what happened?", trust: +10 },
      { text: "Show ID first", trust: -15 },
      { text: "Ignore", trust: -5 },
    ],
  },
  {
    bot: "We detected suspicious login activity.",
    options: [
      { text: "Oh no, what should I do?", trust: +10 },
      { text: "I’ll check myself", trust: -15 },
    ],
  },
  {
    bot: "I need your password to secure your account.",
    options: [
      { text: "Here it is", trust: +40 },
      { text: "No, I won’t share it", trust: -30 },
    ],
  },
];

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "message " + type;
  div.innerText = text;
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping(callback) {
  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerText = "Typing...";
  chatBox.appendChild(typing);

  setTimeout(() => {
    chatBox.removeChild(typing);
    callback();
  }, 1000);
}

function loadStep() {
  if (step >= flow.length) return endGame();

  showTyping(() => {
    addMessage(flow[step].bot, "bot");
    showOptions(flow[step].options);
  });
}

function showOptions(options) {
  optionsDiv.innerHTML = "";

  options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.innerText = opt.text;
    btn.className = "secondary-btn";
    btn.onclick = () => selectOption(opt);

    optionsDiv.appendChild(btn);
  });
}

function selectOption(opt) {
  addMessage(opt.text, "user");

  trust += opt.trust;

  updateTrust();

  step++;

  optionsDiv.innerHTML = "";

  if (trust >= 100) return lose();
  if (trust <= 0) return win();

  setTimeout(loadStep, 800);
}

function updateTrust() {
  document.getElementById("trustText").innerText = `Trust Level: ${trust}`;

  document.getElementById("trustBar").style.width = trust + "%";
}

function win() {
  updateXP(20);
  chatBox.innerHTML += `
    <p style='color:lightgreen;'>✅ You resisted the attack!</p>
    
    <div class="deep-dive" style="text-align:left; margin-top:20px; padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
      <h3>📖 Cyber Deep Dive: Social Engineering</h3>
      <p>Social engineering is the psychological manipulation of people into performing actions or divulging confidential information.</p>
      <ul>
        <li><strong>Pretexting:</strong> Creating a fabricated scenario to steal info.</li>
        <li><strong>Baiting:</strong> Promising a reward to lure victims.</li>
        <li><strong>Quid Pro Quo:</strong> Offering a service in exchange for info.</li>
      </ul>
      <p><em>Real-world Case:</em> The 2022 Uber breach started with a MFA fatigue attack on an employee.</p>
    </div>

    <div id="safetyArea"></div>

    <button class="primary-btn" onclick="location.reload()">Play Again</button>
    <button class="secondary-btn" onclick="goHome()">Back to Missions</button>
  `;
  showSafetySteps("social", "safetyArea");
  optionsDiv.innerHTML = "";
}

function lose() {
  chatBox.innerHTML += `
    <p style='color:red;'>🚨 You were manipulated!</p>
    <button class="primary-btn" onclick="location.reload()">Try Again</button>
    <button class="secondary-btn" onclick="goHome()">Back to Missions</button>
  `;
  optionsDiv.innerHTML = "";
}

function endGame() {
  win();
}

loadStep();
