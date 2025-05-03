// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore"; // Import getFirestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBZAJIZxBNJWgwRYfEwA9W2WSdGbOgUznU",
  authDomain: "ava-automate.firebaseapp.com",
  databaseURL: "https://ava-automate-default-rtdb.firebaseio.com",
  projectId: "ava-automate",
  storageBucket: "ava-automate.firebasestorage.app",
  messagingSenderId: "793843621161",
  appId: "1:793843621161:web:cbbb7525971361d45aeb38"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { app, db }; // Export the app and database instances
