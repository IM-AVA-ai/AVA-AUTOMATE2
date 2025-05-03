// src/services/conversations.ts
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, query, where, onSnapshot, orderBy, limit, Timestamp } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { BasicToaster } from '@/components/BasicToaster';
import { addRealtimeMessage } from './realtime-conversations';
import { db } from '@/lib/firebase';


interface MessageData {
  [key: string]: any;
}

export interface Conversation {
  id: string;
  leadId: string;
  lastMessage: string;
  createdAt: Timestamp;
  [key: string]: any;
}

export const addMessage = async (conversationId: string, messageData: MessageData) => {
  addRealtimeMessage(conversationId, messageData)
  try {
    const docRef = await addDoc(collection(db, `conversations/${conversationId}/messages`), messageData);

    return { id: docRef.id, ...messageData };
  } catch (error: any) {
    BasicToaster({ type: 'error', message: error.message });
    return null;
  }
};

export const getConversationHistory = async (conversationId: string, userId: string) => {
  try {
    const q = query(collection(db, `conversations/${conversationId}/messages`), where('userId', '==', userId), orderBy('timestamp', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    BasicToaster({ type: 'error', message: error.message });
    return [];
  }
};

export const updateMessageStatus = async (conversationId: string, messageId: string, status: string) => {
  try {
    await updateDoc(doc(db, `conversations/${conversationId}/messages`, messageId), { status });
    return true;
  } catch (error: any) {
    BasicToaster({ type: 'error', message: error.message });
    return false;
  }
};

export const subscribeToConversation = (conversationId: string, callback: (messages: any[]) => void) => {
  const q = query(collection(db, `conversations/${conversationId}/messages`), orderBy('timestamp', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (error) => {
    BasicToaster({ type: 'error', message: error.message });
  });

  return unsubscribe;
};

export const getRecentConversations = async (userId: string): Promise<Conversation[]> => {
  try {
    const q = query(
      collection(db, `users/${userId}/conversations`),
      orderBy('createdAt', 'desc'),
      limit(3)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Conversation[];
  } catch (error: any) {
    console.error('Error getting recent conversations:', error);
    return [];
  }
};
