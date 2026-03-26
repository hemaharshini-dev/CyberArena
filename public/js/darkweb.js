import { updateXP } from "./xp.js";
import { showSafetySteps } from "./adaptive.js";

const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchQuery");
const resultsBox = document.getElementById("results");
const assessmentDiv = document.getElementById("assessment");

const databases = {
    "corp.com": [
        { email: "admin@corp.com", password: "password123", hash: "plaintext" },
        { email: "ceo@corp.com", password: "admin", hash: "plaintext" },
        { email: "dev@corp.com", password: "dev", hash: "plaintext" }
    ],
    "secure.net": [
        { email: "user@secure.net", password: "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92", hash: "SHA-256" }
    ]
};

searchBtn.onclick = () => {
    const query = searchQuery.value.toLowerCase().trim();
    resultsBox.innerHTML = "Searching nodes...<br/>";

    setTimeout(() => {
        if (databases[query]) {
            resultsBox.innerHTML += `<span style="color:red;">[!] Breach Found for ${query}</span><br/><br/>`;
            databases[query].forEach(entry => {
                resultsBox.innerHTML += `Email: ${entry.email} | Pass: ${entry.password} | Type: ${entry.hash}<br/>`;
            });
            assessmentDiv.style.display = "block";
            window.currentQuery = query;
        } else {
            resultsBox.innerHTML += `<span style="color:lightgreen;">[+] No records found for ${query}.</span><br/>`;
            assessmentDiv.style.display = "none";
        }
    }, 1000);
};

window.submitAssessment = (level) => {
    let correct = false;

    if (window.currentQuery === "corp.com" && level === "Critical") {
        resultsBox.innerHTML += `<br/><span style="color:lightgreen;" role="alert">✅ [CORRECT] Plaintext passwords are a critical risk.</span>`;
        updateXP(20, 'darkweb');
        correct = true;
    } else if (window.currentQuery === "secure.net" && level === "Low") {
        resultsBox.innerHTML += `<br/><span style="color:lightgreen;" role="alert">✅ [CORRECT] Hashed passwords take time to crack, lower immediate risk.</span>`;
        updateXP(20, 'darkweb');
        correct = true;
    } else {
        resultsBox.innerHTML += `<br/><span style="color:red;" role="alert">❌ [WRONG] Incorrect risk assessment.</span>`;
    }

    assessmentDiv.style.display = "none";
    setTimeout(() => showCompletion(correct), 1200);
};

function showCompletion(correct) {
    const container = document.querySelector(".container");
    container.innerHTML = `
        <button class="back-btn" onclick="goHome()">← Back</button>
        <h2>🌐 Dark Web Market — Mission Complete</h2>
        <p style="color:${correct ? 'var(--neon-green)' : 'var(--neon-magenta)'};">
            ${correct ? '✅ [CORRECT] Threat correctly assessed! +20 XP' : '❌ [WRONG] Incorrect assessment. Review the protocols below.'}
        </p>

        <div class="deep-dive" style="text-align:left; margin-top:20px; padding:15px; background:rgba(0,0,0,0.3); border-radius:10px;">
            <h3>📖 Cyber Deep Dive: Data Breaches & the Dark Web</h3>
            <p>Stolen credentials are sold on dark web marketplaces within hours of a breach, enabling credential stuffing attacks at scale.</p>
            <ul>
                <li><strong>Adobe Breach (2013):</strong> 153 million user records leaked. Passwords were encrypted with 3DES but without salting, making them crackable in bulk. The breach exposed how weak encryption practices amplify damage.</li>
                <li><strong>Collection #1 (2019):</strong> A 773 million record dataset of emails and plaintext passwords was posted publicly — compiled from hundreds of prior breaches. Attackers used it for mass credential stuffing.</li>
                <li><strong>Plaintext vs. Hashed:</strong> Plaintext passwords are immediately usable. SHA-256 hashed passwords without salting can be cracked via rainbow tables. Properly salted bcrypt hashes are the current standard.</li>
            </ul>
            <p><em>Check your exposure:</em> Visit <strong>haveibeenpwned.com</strong> to see if your email appears in known breaches.</p>
        </div>

        <div id="safetyArea"></div>

        <div style="margin-top:20px; display:flex; gap:15px; flex-wrap:wrap;">
            <button class="primary-btn" onclick="location.reload()">🔁 Try Again</button>
            <button class="secondary-btn" onclick="goHome()">🏠 Back to Home</button>
        </div>
    `;
    showSafetySteps("darkweb", "safetyArea");
}
