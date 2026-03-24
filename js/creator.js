const cSender = document.getElementById("cSender");
const cSubject = document.getElementById("cSubject");
const cBody = document.getElementById("cBody");
const cLink = document.getElementById("cLink");

const pSender = document.getElementById("pSender");
const pSubject = document.getElementById("pSubject");
const pBody = document.getElementById("pBody");
const pLink = document.getElementById("pLink");

function updatePreview() {
    pSender.innerText = cSender.value || "(Sender Email)";
    pSubject.innerText = cSubject.value || "(Subject)";
    pBody.innerText = cBody.value || "(Email Body)";
    pLink.innerText = cLink.value ? "Click here to resolve" : "(Link Text)";
}

cSender.oninput = updatePreview;
cSubject.oninput = updatePreview;
cBody.oninput = updatePreview;
cLink.oninput = updatePreview;

window.generateJSON = () => {
    const sender = cSender.value;
    const subject = cSubject.value;
    const body = cBody.value;
    const link = cLink.value;

    if(!sender || !subject || !body || !link) {
        alert("Please fill out all fields.");
        return;
    }

    const mission = {
        type: "phishing",
        scenario: {
            sender: sender,
            subject: subject,
            body: body,
            link: link,
            options: ["Click link", "Verify sender", "Ignore"],
            correct: "Verify sender",
            explanation: "Custom generated mission."
        }
    };

    const outputArea = document.getElementById("outputArea");
    const jsonOutput = document.getElementById("jsonOutput");

    jsonOutput.value = JSON.stringify(mission, null, 2);
    outputArea.style.display = "block";

    // Educational breakdown
    const existing = document.getElementById("eduBreakdown");
    if (existing) existing.remove();

    const redFlags = [];
    if (/@(?!.*\.(com|org|net|gov|edu)$)/.test(sender) || /[0-9]/.test(sender.split('@')[0])) {
        redFlags.push("<strong>Spoofed Sender:</strong> The sender domain looks suspicious or uses numbers to mimic a real brand.");
    } else {
        redFlags.push("<strong>Sender Field:</strong> Even legitimate-looking domains can be spoofed. Always check the raw headers.");
    }
    if (/urgent|immediate|suspend|verify|confirm|alert|action required/i.test(subject)) {
        redFlags.push("<strong>Urgent Subject Line:</strong> Words like 'URGENT', 'Suspend', or 'Action Required' are classic pressure tactics to bypass rational thinking.");
    }
    if (/click|verify|confirm|update|login|password/i.test(body)) {
        redFlags.push("<strong>Manipulative Body:</strong> The email body uses action-driving language to push the victim toward the malicious link.");
    }
    if (/http:\/\/|\.(xyz|info|ru|tk|ml|ga|cf)/.test(link)) {
        redFlags.push("<strong>Suspicious Link:</strong> HTTP (not HTTPS) or unusual TLDs (.xyz, .ru, .info) are strong indicators of a phishing site.");
    } else {
        redFlags.push("<strong>Link:</strong> Even HTTPS links can be malicious. The domain name itself must match the real organisation exactly.");
    }

    const breakdown = document.createElement("div");
    breakdown.id = "eduBreakdown";
    breakdown.style.cssText = "margin-top:20px; padding:15px; background:rgba(0,243,255,0.04); border-left:3px solid var(--neon-cyan); text-align:left;";
    breakdown.innerHTML = `
        <h3 style="color:var(--neon-cyan);">🎓 Why This Scenario Works</h3>
        <p style="font-size:12px; color:#9ca3af;">Understanding what makes your scenario convincing is the best way to learn to spot real attacks.</p>
        <ul style="font-size:13px; line-height:1.8;">${redFlags.map(f => `<li>${f}</li>`).join('')}</ul>
        <p style="font-size:12px; color:#9ca3af; margin-top:10px;">💡 Share this JSON with colleagues to run awareness drills — recognising these patterns in training makes them easier to spot in the wild.</p>
    `;
    outputArea.insertAdjacentElement('afterend', breakdown);
};

window.copyToClipboard = () => {
    const jsonOutput = document.getElementById("jsonOutput");
    jsonOutput.select();
    document.execCommand("copy");
    alert("Copied to clipboard! You can share this JSON with others.");
};
