// src/services/email-verification.ts
import { getAuth, sendEmailVerification as firebaseSendEmailVerification } from 'firebase/auth';
import { app } from '@/firebase/config';
import BasicToaster from '@/components/BasicToaster';

export const sendEmailVerification = async () => {
  const auth = getAuth(app);
  const user = auth.currentUser;

  if (user) {
    try {
      await firebaseSendEmailVerification(user);
      // Toast notification should be handled by the calling component
    } catch (error: any) {
      // Error handling and toast notification should be handled by the calling component
    }
  } else {
    // Toast notification should be handled by the calling component
  }
};
