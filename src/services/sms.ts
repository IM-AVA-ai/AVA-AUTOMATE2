ts
import { app } from '@/firebase/config';
import { db } from '@/lib/firebase';

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    console.log(`Sending SMS to ${to}: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};