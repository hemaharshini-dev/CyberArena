import { auth } from "./firebase.js";

import { signOut, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

async function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

async function googleLogin() {
  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
}

window.logout = async function () {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
};

// Wire up login page buttons if present
document.getElementById("loginBtn")?.addEventListener("click", login);
document.getElementById("registerBtn")?.addEventListener("click", register);
document.getElementById("googleBtn")?.addEventListener("click", googleLogin);

onAuthStateChanged(auth, (user) => {
  if (user) {
    const el = document.getElementById("userEmail");
    if (el) el.innerText = user.email;
  }
});
