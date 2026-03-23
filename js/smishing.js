import { updateXP } from "./xp.js";

const phoneScreen = document.getElementById("phoneScreen");
const feedback = document.getElementById("feedback");

const messages = [
    { sender: "BankAlert", text: "Your account is locked. Verify at ", link: "http://secure-login-bank.com", isPhishing: true },
    { sender: "Mom", text: "Can you pick up milk on the way home?", link: "", isPhishing: false },
    { sender: "Delivery", text: "Package #8129 stuck. Pay customs fee here: ", link: "http://post-delivery-fee.info", isPhishing: true }
];

let currentIndex = 0;

function loadMessage() {
    if (currentIndex >= messages.length) {
        feedback.innerHTML = `<h3>Simulation Complete!</h3><button class="primary-btn" onclick="goHome()">Back to Home</button>`;
        return;
    }

    const msg = messages[currentIndex];
    phoneScreen.innerHTML = `
        <div class="sms-bubble" id="smsBubble" draggable="true">
            <div class="sms-sender">${msg.sender}</div>
            <div>${msg.text} <span class="sms-link">${msg.link}</span></div>
        </div>
        <div style="margin-top:auto;">
            <button class="primary-btn" onclick="handleDecision(true)" style="width:100%; margin-bottom:10px; background:#f87171; color:white;">🚨 Flag as Scam</button>
            <button class="secondary-btn" onclick="handleDecision(false)" style="width:100%;">Mark Safe</button>
        </div>
    `;

    const bubble = document.getElementById('smsBubble');
    bubble.addEventListener('dragstart', (e) => {
        bubble.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });
    bubble.addEventListener('dragend', () => bubble.classList.remove('dragging'));
}

window.handleDrop = (flaggedAsScam) => handleDecision(flaggedAsScam);

window.handleDecision = (flaggedAsScam) => {
    const msg = messages[currentIndex];
    if (flaggedAsScam === msg.isPhishing) {
        feedback.innerHTML = `<span style="color:lightgreen;">✅ Correct decision!</span>`;
        updateXP(10);
    } else {
        feedback.innerHTML = `<span style="color:red;">❌ Incorrect. That was a ${msg.isPhishing ? 'scam' : 'safe message'}.</span>`;
    }
    
    currentIndex++;
    setTimeout(() => {
        feedback.innerHTML = "";
        loadMessage();
    }, 1500);
};

loadMessage();
