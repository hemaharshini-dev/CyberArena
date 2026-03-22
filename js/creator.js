window.generateJSON = () => {
    const sender = document.getElementById("cSender").value;
    const subject = document.getElementById("cSubject").value;
    const body = document.getElementById("cBody").value;
    const link = document.getElementById("cLink").value;

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
