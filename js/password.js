import { updateXP } from "./xp.js";

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
    alert("❌ CRITICAL ERROR: You approved a malicious MFA request! -50 XP");
    updateXP(-50);
    fatigueActive = false;
    fatigueModal.style.display = "none";
};

denyFatigueBtn.onclick = () => {
    if (fatigueCount < 3) {
        fatigueModal.style.display = "none";
        setTimeout(triggerFatiguePush, 1000); // Simulate rapid push
    } else {
        alert("✅ SUCCESS: You resisted the MFA Fatigue attack and reported it! +30 XP");
        updateXP(30);
        fatigueActive = false;
        fatigueModal.style.display = "none";
    }
};

window.onclick = (e) => {
    if (e.target === mfaPrompt) mfaPrompt.style.display = "none";
    if (e.target === fatigueModal) {
        // In a real fatigue attack, clicking away doesn't stop it!
        // So we just re-trigger it
        triggerFatiguePush();
    }
};
