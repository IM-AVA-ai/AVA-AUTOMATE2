// Description: This file contains the function to send SMS messages.
import { app } from '@/firebase/config';

export const sendSMS = async (to: string, message: string): Promise<boolean> => {
  try {
    console.log(`Sending SMS to ${to}: ${message}`);
    return true;
  } catch (error) {
    console.error('Error sending SMS:', error);
    return false;
  }
};
