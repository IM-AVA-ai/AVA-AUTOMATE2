// src/services/auth.ts
import { getAuth, signOut as firebaseSignOut } from 'firebase/auth';
import { app } from '@/firebase/config';
export const signOut = async () => {
  const auth = getAuth(app);
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    // Error handling should be done in the calling component
  }
};
