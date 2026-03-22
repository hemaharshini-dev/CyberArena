// 🧠 ADAPTIVE DIFFICULTY & SAFETY ENGINE
import { getUserData } from "./xp.js";

const safetyProtocols = {
    phishing: [
        "✅ Protocol 1: Hover before you hover. Inspect URLs for tiny typos.",
        "✅ Protocol 2: Check the 'Reply-To' header. Does it match the 'From' address?",
        "✅ Protocol 3: Urgency is a weapon. Slow down when an email demands immediate action."
    ],
    social: [
        "✅ Protocol 1: IT will never ask for your password over chat.",
        "✅ Protocol 2: Verify identity through a secondary, known channel.",
        "✅ Protocol 3: Be wary of over-familiarity from unknown 'colleagues'."
    ],
    ai: [
        "✅ Protocol 1: Look for 'artifacts'—blurring around the mouth or unnatural blinking.",
        "✅ Protocol 2: Ask a question only the real person would know.",
        "✅ Protocol 3: Use 'Noise Injection'—ask the speaker to turn their head sideways."
    ]
};

export async function getAdaptiveContent(category) {
    const userData = await getUserData();
    const xp = userData?.xp || 0;
    
    let difficulty = "Novice";
    if (xp > 100) difficulty = "Specialist";
    if (xp > 500) difficulty = "Elite Guardian";

    return {
        level: difficulty,
        protocol: safetyProtocols[category] || ["No protocols found."]
    };
}

export function showSafetySteps(category, containerId) {
    const container = document.getElementById(containerId);
    const protocols = safetyProtocols[category];
    
    const div = document.createElement("div");
    div.className = "protocol-card";
    div.innerHTML = `<h3>🛡️ Actionable Safety Steps</h3><ul>${protocols.map(p => `<li>${p}</li>`).join('')}</ul>`;
    
    container.appendChild(div);
}
