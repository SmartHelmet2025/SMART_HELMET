// Import Firebase Authentication modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// LOGIN (for login.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = document.getElementById("login-email").value;
        const password = document.getElementById("login-password").value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user.emailVerified) {
                window.location.href = "index.html";
            } else {
                alert("Please verify your email before logging in.");
            }
        } catch (error) {
            alert("Login failed: " + error.message);
        }
    });
}

// SIGNUP WITH EMAIL/PASSWORD (for signup.html)
const signupEmailPasswordForm = document.getElementById("signup-email-password-form");
if (signupEmailPasswordForm) {
    signupEmailPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("signup-name").value;
        const email = document.getElementById("signup-email").value;
        const password = document.getElementById("signup-password").value;
        const confirmPassword = document.getElementById("signup-confirm-password").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await sendEmailVerification(user);
            alert("You will receive a verification email.");

            // Store additional user information in the database
            await set(ref(db, 'users/' + user.uid), {
                name: name,
                email: email
            });

            window.location.href = "login.html"; // Redirect to login after successful signup
        } catch (error) {
            alert("Sign-up failed: " + error.message);
        }
    });
}

// Redirect if already logged in (this will run on both login and signup pages)
onAuthStateChanged(auth, (user) => {
    if (user && user.emailVerified) {
        // If already logged in and verified, redirect to index.html
        const path = window.location.pathname;
        const isLoginPage = path.includes('login.html');
        const isSignupPage = path.includes('signup.html');

        if (isLoginPage || isSignupPage) {
            window.location.href = "index.html";
        }
    }
});