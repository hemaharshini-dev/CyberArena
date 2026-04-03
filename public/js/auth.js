import { auth } from "./firebase.js";
import { signOut, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { guardMission } from "./guard.js";

const path = window.location.pathname.split('/').pop() || 'index.html';
const isLoginPage = path === 'index.html' || path === '';
const guardedMissions = { 'ai.html': 'ai', 'darkweb.html': 'darkweb' };

function showError(msg) {
  const el = document.getElementById("auth-error");
  if (el) el.textContent = msg;
}

async function googleLogin() {
  const btn = document.getElementById("googleBtn");
  if (btn) btn.disabled = true;
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
    window.location.href = "hub.html";
  } catch (err) {
    showError(err.code === "auth/popup-closed-by-user" ? "Sign-in cancelled." : "Google sign-in failed. Please try again.");
    if (btn) btn.disabled = false;
  }
}

window.logout = async function () {
  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (err) {
    console.error(err);
  }
};

document.getElementById("googleBtn")?.addEventListener("click", googleLogin);

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    if (!isLoginPage) window.location.href = "index.html";
    return;
  }
  if (isLoginPage) {
    window.location.href = "hub.html";
    return;
  }
  const el = document.getElementById("userEmail");
  if (el) el.innerText = `Hi, ${user.displayName || user.email.split('@')[0]}!`;

  const missionId = guardedMissions[path];
  if (missionId) await guardMission(missionId);
});
