import { updateXP } from "./xp.js";

const phoneScreen = document.getElementById("phoneScreen");
const feedback = document.getElementById("feedback");

const messages = [
    { sender: "BankAlert", text: "Your account is locked. Verify at ", link: "http://secure-login-bank.com", isPhishing: true },
    { sender: "Mom", text: "Can you pick up milk on the way home?", link: "", isPhishing: false },
    { sender: "Delivery", text: "Package #8129 stuck. Pay customs fee here: ", link: "http://post-delivery-fee.info", isPhishing: true },
    {
        sender: "ParkingServices",
        text: "Scan the QR code below to pay your parking fine or your vehicle will be towed.",
        link: "",
        isPhishing: true,
        qrCode: {
            label: "parking-fine-pay.xyz/qr",
            warning: "QR codes in public spaces can redirect to malicious sites. Always verify the URL after scanning."
        }
    },
    {
        sender: "CityLibrary",
        text: "Scan the QR code to access your digital library card and borrow e-books.",
        link: "",
        isPhishing: false,
        qrCode: {
            label: "library.cityportal.gov/card",
            warning: null
        }
    },
    {
        sender: "WinPrize",
        text: "🎁 You've been selected! Scan QR to claim your ₹50,000 gift card. Offer expires in 10 mins!",
        link: "",
        isPhishing: true,
        qrCode: {
            label: "gift-claim-now.ru/prize?id=WIN50K",
            warning: "Urgency + foreign domain (.ru) + unsolicited prize = classic QR phishing (Quishing)."
        }
    }
];

let currentIndex = 0;

function renderQRCode(qr) {
    return `
        <div class="qr-container" id="qrContainer">
            <div class="qr-mock" onclick="revealQRUrl()" title="Tap to scan QR code">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="30" height="30" rx="3" stroke="#00f3ff" stroke-width="2" fill="none"/>
                    <rect x="8" y="8" width="18" height="18" rx="1" fill="#00f3ff" opacity="0.7"/>
                    <rect x="48" y="2" width="30" height="30" rx="3" stroke="#00f3ff" stroke-width="2" fill="none"/>
                    <rect x="54" y="8" width="18" height="18" rx="1" fill="#00f3ff" opacity="0.7"/>
                    <rect x="2" y="48" width="30" height="30" rx="3" stroke="#00f3ff" stroke-width="2" fill="none"/>
                    <rect x="8" y="54" width="18" height="18" rx="1" fill="#00f3ff" opacity="0.7"/>
                    <rect x="38" y="38" width="6" height="6" fill="#00f3ff"/>
                    <rect x="48" y="38" width="6" height="6" fill="#00f3ff"/>
                    <rect x="58" y="38" width="6" height="6" fill="#00f3ff"/>
                    <rect x="68" y="38" width="6" height="6" fill="#00f3ff"/>
                    <rect x="38" y="48" width="6" height="6" fill="#00f3ff"/>
                    <rect x="58" y="48" width="6" height="6" fill="#00f3ff"/>
                    <rect x="48" y="58" width="6" height="6" fill="#00f3ff"/>
                    <rect x="68" y="58" width="6" height="6" fill="#00f3ff"/>
                    <rect x="38" y="68" width="6" height="6" fill="#00f3ff"/>
                    <rect x="58" y="68" width="6" height="6" fill="#00f3ff"/>
                    <rect x="68" y="68" width="6" height="6" fill="#00f3ff"/>
                </svg>
                <div class="qr-tap-hint">📷 Tap to Scan</div>
            </div>
            <div class="qr-url-reveal" id="qrUrlReveal" style="display:none;">
                <span style="color:#f87171;font-size:11px;">🔗 Redirects to:</span><br>
                <code style="color:#fbbf24;font-size:10px;word-break:break-all;">${qr.label}</code>
            </div>
        </div>
    `;
}

window.revealQRUrl = () => {
    const reveal = document.getElementById('qrUrlReveal');
    if (reveal) reveal.style.display = 'block';
};

function loadMessage() {
    if (currentIndex >= messages.length) {
        feedback.innerHTML = `<h3>Simulation Complete!</h3><button class="primary-btn" onclick="goHome()">Back to Home</button>`;
        return;
    }

    const msg = messages[currentIndex];
    const qrHtml = msg.qrCode ? renderQRCode(msg.qrCode) : '';
    const linkHtml = msg.link ? `<span class="sms-link">${msg.link}</span>` : '';

    phoneScreen.innerHTML = `
        <div class="sms-bubble" id="smsBubble" draggable="true">
            <div class="sms-sender">${msg.sender}</div>
            <div>${msg.text} ${linkHtml}</div>
            ${qrHtml}
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
        const extra = msg.qrCode?.warning ? `<br><small style="color:#fbbf24;">💡 ${msg.qrCode.warning}</small>` : '';
        feedback.innerHTML = `<span style="color:lightgreen;">✅ Correct decision!</span>${extra}`;
        updateXP(10);
    } else {
        const hint = msg.qrCode ? ' (QR codes can hide malicious URLs — always verify before scanning!)' : '';
        feedback.innerHTML = `<span style="color:red;">❌ Incorrect. That was a ${msg.isPhishing ? 'scam' : 'safe message'}.${hint}</span>`;
    }
    
    currentIndex++;
    setTimeout(() => {
        feedback.innerHTML = "";
        loadMessage();
    }, 2500);
};

loadMessage();
