import { updateXP } from "./xp.js";

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
    if (window.currentQuery === "corp.com" && level === "Critical") {
        resultsBox.innerHTML += `<br/><span style="color:lightgreen;">✅ Correct! Plaintext passwords are a critical risk.</span>`;
        updateXP(20);
    } else if (window.currentQuery === "secure.net" && level === "Low") {
        resultsBox.innerHTML += `<br/><span style="color:lightgreen;">✅ Correct! Hashed passwords take time to crack, lower immediate risk.</span>`;
        updateXP(20);
    } else {
        resultsBox.innerHTML += `<br/><span style="color:red;">❌ Incorrect risk assessment.</span>`;
    }
    assessmentDiv.style.display = "none";
};
