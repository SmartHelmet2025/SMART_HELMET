import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDvkL43aaX6u97kDZvPJrTfYnsc-PJTxgQ",
  authDomain: "fir-pit-552c4.firebaseapp.com",
  databaseURL: "https://fir-pit-552c4-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fir-pit-552c4",
  storageBucket: "fir-pit-552c4.appspot.com",
  messagingSenderId: "177480187812",
  appId: "1:177480187812:web:397010de9e9cc7c9778b31"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Chart setup
const ctx1 = document.getElementById('alcoholChart').getContext('2d');
const ctx2 = document.getElementById('alcoholChart2').getContext('2d');

const alcoholChart1 = new Chart(ctx1, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Alcohol Level', data: [], borderColor: 'red', backgroundColor: 'rgba(255,0,0,0.1)', tension: 0.3 }] },
  options: {
    responsive: true,
    scales: { x: { title: { display: true, text: 'Timestamp' } }, y: { beginAtZero: true } }
  }
});

const alcoholChart2 = new Chart(ctx2, {
  type: 'line',
  data: { labels: [], datasets: [{ label: 'Alcohol Level', data: [], borderColor: 'blue', backgroundColor: 'rgba(0,0,255,0.1)', tension: 0.3 }] },
  options: {
    responsive: true,
    scales: { x: { title: { display: true, text: 'Rider Status' } }, y: { beginAtZero: true } }
  }
});

// Sign in anonymously then read data
signInAnonymously(auth)
  .then(() => {
    console.log("Signed in anonymously");

    // Helmet 1
    const helmet1Ref = ref(db, "helmet_1");
    onValue(helmet1Ref, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status = data.helmet_status || "Unknown";
      const alcohol = data.alcohol_level || 0;
      const riderStatus = data.rider_status || "No status";
      const timestamp = data.timestamp || new Date().toLocaleTimeString();

      document.getElementById("helmet1_status").innerText = status;
      document.getElementById("helmet1_alcohol").innerText = alcohol;
      document.getElementById("helmet1_rider").innerText = riderStatus;

      const statusBox1 = document.getElementById("status-box-1");
      statusBox1.innerText = status;
      statusBox1.className = "status-box " + (status === "WORN" ? "worn" : "not-worn");

      if (alcoholChart1.data.labels.length >= 10) {
        alcoholChart1.data.labels.shift();
        alcoholChart1.data.datasets[0].data.shift();
      }
      alcoholChart1.data.labels.push(timestamp);
      alcoholChart1.data.datasets[0].data.push(alcohol);
      alcoholChart1.update();
    });

    // Helmet 2
    const helmet2Ref = ref(db, "helmet_2");
    onValue(helmet2Ref, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const status = data.helmet_status || "Unknown";
      const alcohol = data.alcohol_level || 0;
      const riderStatus = data.rider_status || "No status";

      document.getElementById("helmet2_status").innerText = status;
      document.getElementById("helmet2_alcohol").innerText = alcohol;
      document.getElementById("helmet2_rider").innerText = riderStatus;

      const statusBox2 = document.getElementById("status-box-2");
      statusBox2.innerText = status;
      statusBox2.className = "status-box " + (status === "WORN" ? "worn" : "not-worn");

      if (alcoholChart2.data.labels.length >= 10) {
        alcoholChart2.data.labels.shift();
        alcoholChart2.data.datasets[0].data.shift();
      }
      alcoholChart2.data.labels.push(riderStatus);
      alcoholChart2.data.datasets[0].data.push(alcohol);
      alcoholChart2.update();
    });
  })
  .catch((error) => {
    console.error("Anonymous login failed:", error.code, error.message);
  });
