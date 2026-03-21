import { auth } from "./firebase.js";

import { signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};

// REGISTER
window.register = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Registered successfully!");
  } catch (err) {
    alert(err.message);
  }
};

window.googleLogin = async function () {
  const provider = new GoogleAuthProvider();

  try {
    await signInWithPopup(auth, provider);
    alert("Google login successful!");
    window.location.href = "index.html";
  } catch (err) {
    alert(err.message);
  }
};

window.logout = async function () {
  try {
    await signOut(auth);
    alert("Logged out!");
    window.location.href = "login.html";
  } catch (err) {
    alert(err.message);
  }
};

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (user) {
    const el = document.getElementById("userEmail");
    if (el) el.innerText = user.email;
  }
});
