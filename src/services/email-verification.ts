// src/services/email-verification.ts
import { getAuth, sendEmailVerification as firebaseSendEmailVerification } from 'firebase/auth';
import { app } from '@/firebase/config';
import { BasicToaster } from '@/components/BasicToaster';

export const sendEmailVerification = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    try {
      await firebaseSendEmailVerification(user);
      BasicToaster({ type: 'success', message: 'Verification email sent. Please check your inbox.' });
    } catch (error: any) {
      BasicToaster({ type: 'error', message: error.message });
    }
  } else {
    BasicToaster({ type: 'error', message: 'No user is currently logged in.' });
  }
};