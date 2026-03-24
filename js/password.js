import { updateXP } from "./xp.js";
import { showSafetySteps } from "./adaptive.js";

const passwordInput = document.getElementById("passwordInput");
const strengthFill = document.getElementById("strengthFill");
const strengthText = document.getElementById("strengthText");
const crackTimeText = document.getElementById("crackTime");
const entropyScoreText = document.getElementById("entropyScore");
const feedbackList = document.getElementById("feedback");
const toggleView = document.getElementById("toggleView");
const simulateMFABtn = document.getElementById("simulateMFA");
const mfaPrompt = document.getElementById("mfaPrompt");
const verifyMFABtn = document.getElementById("verifyMFA");
const mfaCodeInput = document.getElementById("mfaCode");
const visualizer = document.getElementById("bruteForceVisualizer");

const startFatigueBtn = document.getElementById("startFatigue");
const fatigueModal = document.getElementById("fatigueModal");
const approveFatigueBtn = document.getElementById("approveFatigue");
const denyFatigueBtn = document.getElementById("denyFatigue");

let animationInterval;
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

toggleView.onclick = () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleView.innerText = "🔒";
    } else {
        passwordInput.type = "password";
        toggleView.innerText = "👁️";
    }
};

passwordInput.oninput = () => {
    const password = passwordInput.value;
    updateAnalysis(password);
    startBruteForceAnimation(password);
};

function startBruteForceAnimation(password) {
    clearInterval(animationInterval);
    if (!password) {
        visualizer.innerText = "";
        return;
    }

    animationInterval = setInterval(() => {
        let display = "";
        for (let i = 0; i < password.length; i++) {
            display += chars[Math.floor(Math.random() * chars.length)];
        }
        visualizer.innerText = display;
    }, 50);
}

function updateAnalysis(password) {
    if (!password) {
        strengthFill.style.width = "0%";
        strengthText.innerText = "Strength: Weak";
        crackTimeText.innerText = "⏱️ Time to crack: 0 seconds";
        entropyScoreText.innerText = "🔑 Entropy: 0 bits";
        feedbackList.innerHTML = "";
        return;
    }

    let entropy = 0;
    const poolSize = getPoolSize(password);
    entropy = Math.log2(Math.pow(poolSize, password.length));

    entropyScoreText.innerText = `🔑 Entropy: ${Math.round(entropy)} bits`;

    const strength = getStrength(entropy, password);
    updateStrengthMeter(strength);

    const crackTime = calculateCrackTime(password, poolSize);
    crackTimeText.innerText = `⏱️ Time to crack: ${formatTime(crackTime)}`;

    updateFeedback(password);
}

function getPoolSize(password) {
    let pool = 0;
    if (/[a-z]/.test(password)) pool += 26;
    if (/[A-Z]/.test(password)) pool += 26;
    if (/[0-9]/.test(password)) pool += 10;
    if (/[^a-zA-Z0-9]/.test(password)) pool += 32;
    return pool || 1;
}

function getStrength(entropy, password) {
    if (password.length < 8) return "Very Weak";
    if (entropy < 40) return "Weak";
    if (entropy < 60) return "Medium";
    if (entropy < 80) return "Strong";
    return "Very Strong";
}

function updateStrengthMeter(strength) {
    strengthText.innerText = `Strength: ${strength}`;
    let color = "red";
    let width = "20%";

    if (strength === "Weak") { width = "40%"; color = "orange"; }
    else if (strength === "Medium") { width = "60%"; color = "yellow"; }
    else if (strength === "Strong") { width = "80%"; color = "lightgreen"; }
    else if (strength === "Very Strong") { width = "100%"; color = "green"; }

    strengthFill.style.width = width;
    strengthFill.style.backgroundColor = color;
}

function calculateCrackTime(password, poolSize) {
    // 10 billion guesses per second (high-end GPU)
    const guessesPerSecond = 10000000000;
    const combinations = Math.pow(poolSize, password.length);
    return combinations / (2 * guessesPerSecond);
}

function formatTime(seconds) {
    if (seconds < 1) return "Instantly";
    if (seconds < 60) return `${Math.round(seconds)} seconds`;
    if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
    if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
    if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
    if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`;
    return "Centuries";
}

function updateFeedback(password) {
    feedbackList.innerHTML = "";
    const issues = [];

    if (password.length < 12) issues.push("⚠️ Too short (try 12+ characters)");
    if (!/[A-Z]/.test(password)) issues.push("⚠️ Add uppercase letters");
    if (!/[0-9]/.test(password)) issues.push("⚠️ Add numbers");
    if (!/[^a-zA-Z0-9]/.test(password)) issues.push("⚠️ Add special characters");
    if (/password|123|qwerty/i.test(password)) issues.push("🚨 Common pattern detected!");

    issues.forEach(issue => {
        const div = document.createElement("div");
        div.innerText = issue;
        div.style.color = issue.startsWith("🚨") ? "red" : "orange";
        feedbackList.appendChild(div);
    });
}

// MFA SIMULATION
simulateMFABtn.onclick = () => {
    mfaPrompt.style.display = "flex";
    const code = Math.floor(100000 + Math.random() * 900000);
    console.log(`SIMULATED SMS: Your code is ${code}`);
    alert(`(SIMULATED SMS) Your MFA code is: ${code}`);
    verifyMFABtn.dataset.code = code;
};

verifyMFABtn.onclick = () => {
    const entered = mfaCodeInput.value;
    const actual = verifyMFABtn.dataset.code;

    if (entered === actual) {
        alert("✅ MFA Verified! 10 XP Gained.");
        updateXP(10);
        mfaPrompt.style.display = "none";
    } else {
        alert("❌ Wrong code. Try again.");
    }
};

// MFA FATIGUE SCENARIO
let fatigueCount = 0;
let fatigueActive = false;

startFatigueBtn.onclick = () => {
    fatigueActive = true;
    fatigueCount = 0;
    triggerFatiguePush();
};

function triggerFatiguePush() {
    if (!fatigueActive) return;
    
    fatigueModal.style.display = "flex";
    fatigueCount++;
}

approveFatigueBtn.onclick = () => {
    updateXP(-50);
    fatigueActive = false;
    fatigueModal.style.display = "none";
    showPasswordCompletion(false);
};

denyFatigueBtn.onclick = () => {
    if (fatigueCount < 3) {
        fatigueModal.style.display = "none";
        setTimeout(triggerFatiguePush, 1000);
    } else {
        updateXP(30);
        fatigueActive = false;
        fatigueModal.style.display = "none";
        showPasswordCompletion(true);
    }
};

function showPasswordCompletion(resistedFatigue) {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <button class="back-btn" onclick="goHome()">← Back</button>
        <h2>🛡️ Password Lab — Mission Complete</h2>
        <p style="color:${resistedFatigue ? 'var(--neon-green)' : 'var(--neon-magenta)'}">
            ${resistedFatigue
                ? '✅ [SUCCESS] You resisted the MFA Fatigue attack! +30 XP'
                : '❌ [FAILED] You approved a malicious MFA request. -50 XP'}
        </p>

        <div class="deep-dive" style="text-align:left; margin-top:20px; padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
            <h3>📖 Cyber Deep Dive: Password Security & MFA</h3>
            <p>Weak passwords and MFA fatigue are two of the most exploited attack vectors in modern breaches.</p>
            <ul>
                <li><strong>LinkedIn Breach (2012):</strong> 117 million passwords leaked as unsalted SHA-1 hashes. Within days, the majority were cracked using rainbow tables — demonstrating why hashing alone is insufficient.</li>
                <li><strong>Collection #1 (2019):</strong> 773 million email/password combos compiled from hundreds of breaches were posted publicly, enabling mass credential stuffing attacks.</li>
                <li><strong>MFA Fatigue (Uber, 2022):</strong> An attacker bombarded an employee with MFA push notifications until they approved one out of frustration — bypassing MFA entirely without stealing the code.</li>
                <li><strong>Best Practice:</strong> Use a password manager, enable phishing-resistant MFA (hardware keys or passkeys), and never approve unexpected MFA prompts.</li>
            </ul>
        </div>

        <div id="safetyArea"></div>

        <div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;">
            <button class="primary-btn" onclick="location.reload()">🔁 Try Again</button>
            <button class="secondary-btn" onclick="goHome()">🏠 Back to Home</button>
        </div>
    `;
    showSafetySteps("password", "safetyArea");
}

window.onclick = (e) => {
    if (e.target === mfaPrompt) mfaPrompt.style.display = "none";
    if (e.target === fatigueModal) {
        // In a real fatigue attack, clicking away doesn't stop it!
        // So we just re-trigger it
        triggerFatiguePush();
    }
};
