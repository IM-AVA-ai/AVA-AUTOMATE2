import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

export type UserTwilioCredentials = {
  accountSid: string;
  authToken: string;
  phoneNumber: string;
};

export const saveTwilioCredentials = async (
  userId: string,
  accountSid: string,
  authToken: string,
  phoneNumber: string
) => {
  try {
    await setDoc(doc(db, `users/${userId}/twilio`, 'credentials'), {
      accountSid,
      authToken,
      phoneNumber,
    });
  } catch (error) {
    console.error('Error saving Twilio credentials:', error);
    throw error;
  }
};

export const getTwilioCredentials = async (
  userId: string
): Promise<UserTwilioCredentials | null> => {
  try {
    const docSnap = await getDoc(doc(db, `users/${userId}/twilio`, 'credentials'));
    if (docSnap.exists()) {
      return docSnap.data() as UserTwilioCredentials;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting Twilio credentials:', error);
    return null;
  }
};
