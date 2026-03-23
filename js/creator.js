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
};

window.copyToClipboard = () => {
    const jsonOutput = document.getElementById("jsonOutput");
    jsonOutput.select();
    document.execCommand("copy");
    alert("Copied to clipboard! You can share this JSON with others.");
};
