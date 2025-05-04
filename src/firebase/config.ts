// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import getFirestore
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBh3HZGNsMwhJ2xnqeBQwIg_EBKLXH_s68",
  authDomain: "ava-automate2.firebaseapp.com",
  projectId: "ava-automate2",
  storageBucket: "ava-automate2.firebasestorage.app",
  messagingSenderId: "381160095911",
  appId: "1:381160095911:web:8cc9bdcd3adcee42b4db82",
  measurementId: "G-0FM6NXN4SB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); // Initialize Firestore

export { app, db }; // Export app and db
