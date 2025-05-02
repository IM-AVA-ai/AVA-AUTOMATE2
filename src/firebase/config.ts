// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp, getApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getFunctions, Functions } from 'firebase/functions';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

// Throw a clearer error during development if the key is missing
// In production, it might fail more silently or be configured differently.
if (!firebaseApiKey && process.env.NODE_ENV === 'development') {
  throw new Error(
    'Firebase API Key (NEXT_PUBLIC_FIREBASE_API_KEY) is missing or invalid. Please check your .env or .env.local file and ensure it is correctly set for your Firebase project.'
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
    // Check if all necessary config values are present before initializing
    if (
      !firebaseConfig.apiKey ||
      !firebaseConfig.authDomain ||
      !firebaseConfig.projectId
    ) {
       if (process.env.NODE_ENV === 'development') {
          throw new Error(
            'Firebase configuration is incomplete. Ensure NEXT_PUBLIC_FIREBASE_API_KEY, NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN, and NEXT_PUBLIC_FIREBASE_PROJECT_ID are set in your environment variables (.env or .env.local).'
          );
       } else {
         // In production, log an error but don't crash the build/server if possible
         console.error("Firebase configuration is incomplete. Some Firebase services may not work.");
         // Assign dummy/mock objects or handle appropriately for production robustness if needed
       }
    }
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    functions = getFunctions(app);
     console.log('Firebase initialized successfully.');
  } catch (error: any) {
    console.error("Failed to initialize Firebase:", error.message);
    // Ensure the error is thrown during development to halt execution
     if (process.env.NODE_ENV === 'development') {
        throw new Error(`Firebase initialization failed: ${error.message}. Please check your Firebase configuration in .env / .env.local and ensure the values match your Firebase project settings.`);
     }
     // In production, avoid throwing to prevent crashing the server, but log the critical error
     console.error("CRITICAL: Firebase failed to initialize in production. Authentication and Firestore will not work.");
     // Assign dummy/mock instances if necessary for graceful degradation
     // @ts-ignore - Assigning dummy for resilience, acknowledge potential type issues
     app = app || {};
     // @ts-ignore
     auth = auth || {};
     // @ts-ignore
     db = db || {};
     // @ts-ignore
     functions = functions || {};
  }
} else {
  app = getApp(); // Use getApp() to retrieve the existing app instance
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
}


export { app, auth, db, functions };
