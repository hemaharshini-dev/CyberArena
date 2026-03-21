// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// 🔥 PASTE YOUR CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyBWdDf4i1pkWUbNZ8QCbytwALF9kSQp-zw",
  authDomain: "cyberarena-77a96.firebaseapp.com",
  projectId: "cyberarena-77a96",
  storageBucket: "cyberarena-77a96.firebasestorage.app",
  messagingSenderId: "110478278628",
  appId: "1:110478278628:web:1e9352d225071dcd4151f1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
