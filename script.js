// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

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
const db = getDatabase(app);

// ======================= Helmet 1 =========================

const ctx1 = document.getElementById('alcoholChart').getContext('2d');
let alcoholChart1;

if (ctx1) {
    alcoholChart1 = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Alcohol Level',
                data: [],
                borderColor: 'rgba(255, 99, 132, 1)',
                backgroundColor: 'rgba(255, 99, 132, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Timestamp' }},
                y: { title: { display: true, text: 'Alcohol Level' }, beginAtZero: true }
            }
        }
    });
} else {
    console.error("Could not get 2D context for alcoholChart");
}

const helmet1Ref = ref(db, "helmet_1");
onValue(helmet1Ref, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const status = data.helmet_status || "Unknown";
    const alcohol = data.alcohol_level || 0;
    const riderStatus = data.rider_status || "No status";

    console.log("Helmet 1 Status:", status, "Alcohol:", alcohol, "Timestamp:", data.timestamp); // Added alcohol to log
    document.getElementById("helmet1_status").innerText = status;
    document.getElementById("helmet1_alcohol").innerText = alcohol;
    document.getElementById("helmet1_rider").innerText = riderStatus;

    const statusBox1 = document.getElementById("status-box-1");
    if (statusBox1) {
        statusBox1.innerText = status;
        statusBox1.className = "status-box " + (status === "WORN" ? "worn" : "not-worn");
    } else {
        console.error("Could not find status-box-1 element");
    }

    // Corrected logic for updating Helmet 1 chart
    if (alcoholChart1 && typeof alcohol === 'number') {
        const timestamp = data.timestamp || new Date().toLocaleTimeString(); // Use timestamp if available, otherwise current time
        const maxPoints = 10;
        if (alcoholChart1.data.labels.length >= maxPoints) {
            alcoholChart1.data.labels.shift();
            alcoholChart1.data.datasets[0].data.shift();
        }
        alcoholChart1.data.labels.push(timestamp);
        alcoholChart1.data.datasets[0].data.push(alcohol);
        alcoholChart1.update();
    } else {
        console.warn("Chart 1 not updated:", { alcoholChart1, alcoholType: typeof alcohol, timestamp: data.timestamp });
    }
});

// ======================= Helmet 2 =========================

const ctx2 = document.getElementById('alcoholChart2').getContext('2d');
let alcoholChart2;

if (ctx2) {
    alcoholChart2 = new Chart(ctx2, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Alcohol Level',
                data: [],
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.1)',
                borderWidth: 2,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { title: { display: true, text: 'Rider Status' }},
                y: { title: { display: true, text: 'Alcohol Level' }, beginAtZero: true }
            }
        }
    });
} else {
    console.error("Could not get 2D context for alcoholChart2");
}

const helmet2Ref = ref(db, "helmet_2");
onValue(helmet2Ref, (snapshot) => {
    const data = snapshot.val();
    if (!data) return;

    const status = data.helmet_status || "Unknown";
    const alcohol = data.alcohol_level || 0;
    const riderStatus = data.rider_status || "No status";

    console.log("Helmet 2 Status:", status, "Alcohol:", alcohol, "Rider Status:", riderStatus);
    document.getElementById("helmet2_status").innerText = status;
    document.getElementById("helmet2_alcohol").innerText = alcohol;
    document.getElementById("helmet2_rider").innerText = riderStatus;

    const statusBox2 = document.getElementById("status-box-2");
    if (statusBox2) {
        statusBox2.innerText = status;
        statusBox2.className = "status-box " + (status === "WORN" ? "worn" : "not-worn");
    } else {
        console.error("Could not find status-box-2 element");
    }

    if (alcoholChart2 && riderStatus && typeof alcohol === 'number') {
        const maxPoints = 10;
        if (alcoholChart2.data.labels.length >= maxPoints) {
            alcoholChart2.data.labels.shift();
            alcoholChart2.data.datasets[0].data.shift();
        }
        alcoholChart2.data.labels.push(riderStatus);
        alcoholChart2.data.datasets[0].data.push(alcohol);
        alcoholChart2.update();
    } else {
        console.warn("Chart 2 not updated:", { alcoholChart2, riderStatus, alcoholType: typeof alcohol });
    }
});