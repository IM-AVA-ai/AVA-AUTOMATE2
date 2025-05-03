import {
  collection,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export type Chat = {
  userId: string;
  leadId: string;
  messages: string[];
};

export const createChat = async (userId: string, leadId: string, message: string) => {
  try {
    const docRef = await addDoc(collection(db, 'chats'), {
      userId,
      leadId,
      messages: [message],
      createdAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating chat:', error);
    return null;
  }
};