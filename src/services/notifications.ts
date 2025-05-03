// src/services/notifications.ts
// src/services/notifications.ts
import {
  addDoc,  
  collection,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/firebase/config';

export const sendNotification = async (userId: string, title: string, body: string) => {
  try {
    await addDoc(collection(db, `users/${userId}/notifications`), {
      title,
      body,
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
