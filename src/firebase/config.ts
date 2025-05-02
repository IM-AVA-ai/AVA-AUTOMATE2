// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

if (!firebaseApiKey && process.env.NODE_ENV !== 'production') {
  console.error(
    'Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing. Please set it in your environment variables (.env.local file for development).'
  );
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: firebaseApiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let functions: Functions;

if (!getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
    // Provide dummy/mock instances or rethrow error depending on desired behavior
    // For now, we'll rethrow to make the configuration error obvious
    throw new Error("Firebase initialization failed. Check configuration and API key.");
  }
} else {
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
}


export { app, auth, db, functions };
