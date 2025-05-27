// forgot-password.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDvkL43aaX6u97kDZvPJrTfYnsc-PJTxgQ",
  authDomain: "fir-pit-552c4.firebaseapp.com",
  databaseURL: "https://fir-pit-552c4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-pit-552c4",
  storageBucket: "fir-pit-552c4.firebasestorage.app",
  messagingSenderId: "177480187812",
  appId: "1:177480187812:web:397010de9e9cc7c9778b31"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("reset-email").value;

  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset email sent. Please check your inbox.");
  } catch (error) {
    alert("Error: " + error.message);
  }
});
