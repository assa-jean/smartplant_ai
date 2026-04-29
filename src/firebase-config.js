// src/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

 const firebaseConfig = {
    apiKey: "AIzaSyDwbUk7gP1tuSPJoqmmhsSQS6mlVjVM5Xs",
    authDomain: "smartplant-ai.firebaseapp.com",
    projectId: "smartplant-ai",
    storageBucket: "smartplant-ai.firebasestorage.app",
    messagingSenderId: "89891616480",
    appId: "1:89891616480:web:9ef7ea5c4c3512664c4285",
    measurementId: "G-KK7MXTVM7N"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);