// 🧠 ADAPTIVE DIFFICULTY & SAFETY ENGINE
import { getUserData } from "./xp.js";

const safetyProtocols = {
    phishing: [
        "✅ Protocol 1: Hover before you click. Inspect URLs for tiny typos like 'amaz0n' or 'paypa1'.",
        "✅ Protocol 2: Check the 'Reply-To' header. Does it match the 'From' address?",
        "✅ Protocol 3: Urgency is a weapon. Slow down when an email demands immediate action."
    ],
    social: [
        "✅ Protocol 1: IT will never ask for your password over chat or phone.",
        "✅ Protocol 2: Verify identity through a secondary, known channel before acting.",
        "✅ Protocol 3: Be wary of over-familiarity from unknown 'colleagues'."
    ],
    ai: [
        "✅ Protocol 1: Look for 'artifacts' — blurring around the mouth or unnatural blinking.",
        "✅ Protocol 2: Ask a question only the real person would know.",
        "✅ Protocol 3: Use 'Noise Injection' — ask the speaker to turn their head sideways."
    ],
    malware: [
        "✅ Protocol 1: Always isolate an infected machine from the network immediately to stop lateral spread.",
        "✅ Protocol 2: Never pay a ransom — it funds attackers and recovery is not guaranteed.",
        "✅ Protocol 3: Maintain offline, encrypted backups and test them regularly."
    ],
    password: [
        "✅ Protocol 1: Use a password manager — never reuse passwords across different sites.",
        "✅ Protocol 2: Enable MFA on every account that supports it.",
        "✅ Protocol 3: A passphrase of 4+ random words is stronger and easier to remember than a short complex password."
    ],
    darkweb: [
        "✅ Protocol 1: Check haveibeenpwned.com regularly to see if your email appears in breach databases.",
        "✅ Protocol 2: Change passwords immediately if your domain appears in a breach.",
        "✅ Protocol 3: Plaintext password leaks require immediate credential rotation across all services."
    ],
    smishing: [
        "✅ Protocol 1: Never click links in unsolicited SMS messages — go directly to the official app or website.",
        "✅ Protocol 2: Forward suspected smishing messages to 7726 (SPAM) to report to your carrier.",
        "✅ Protocol 3: Use a QR scanner that previews the destination URL before opening it."
    ]
};

// Returns difficulty level and timer seconds based on user XP
export async function getAdaptiveContent(category) {
    const userData = await getUserData();
    const xp = userData?.xp || 0;

    let difficulty = "Novice";
    let timerSeconds = 10;
    let extraSteps = false;

    if (xp >= 500) {
        difficulty = "Elite Guardian";
        timerSeconds = 5;
        extraSteps = true;
    } else if (xp >= 100) {
        difficulty = "Specialist";
        timerSeconds = 7;
        extraSteps = true;
    }

    return {
        level: difficulty,
        timerSeconds,
        extraSteps,
        protocol: safetyProtocols[category] || ["No protocols found."]
    };
}

export function showSafetySteps(category, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const protocols = safetyProtocols[category];
    if (!protocols) return;

    const div = document.createElement("div");
    div.className = "protocol-card";
    div.setAttribute("role", "region");
    div.setAttribute("aria-label", "Safety Protocols");
    div.innerHTML = `<h3>🛡️ Actionable Safety Steps</h3><ul>${protocols.map(p => `<li>${p}</li>`).join('')}</ul>`;

    container.appendChild(div);
}
