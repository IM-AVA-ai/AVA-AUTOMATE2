// src/services/conversations.ts
import { getFirestore, collection, addDoc, doc, updateDoc, getDocs, query, where, onSnapshot, orderBy, limit, Timestamp, QueryConstraint, CollectionReference } from 'firebase/firestore';
import { app, db } from '@/firebase/config';
import { addRealtimeMessage } from './realtime-conversations';



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

export const getConversation = async (conversationRef: CollectionReference, ...queryConstraints: QueryConstraint[]): Promise<string | null> => {
  const q = query(conversationRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return null;
  }
  // Assuming there's only one conversation document
  return querySnapshot.docs[0].id;
}

export const createConversation = async (conversationRef: CollectionReference): Promise<string | null> => {
  try {
    const docRef = await addDoc(conversationRef, { createdAt: Timestamp.now() });
    return docRef.id;
  } catch (error: any) {
    console.error("Error creating new conversation: ", error);
    return null;
  }

}

export const addMessage = async (conversationId: string, messageData: MessageData) => {
  addRealtimeMessage(conversationId, messageData)
  try {
    const docRef = await addDoc(collection(db, `conversations/${conversationId}/messages`), messageData);

    return { id: docRef.id, ...messageData };
  } catch (error: any) {
    console.error("Error adding message: ", error);
    return null;
  }
};

export const getConversationHistory = async (conversationId: string, userId: string) => {
  try {
    const q = query(collection(db, `conversations/${conversationId}/messages`), where('userId', '==', userId), orderBy('timestamp', 'asc'));

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error: any) {
    console.error("Error getting conversation history: ", error);
    return [];
  }
};

export const updateMessageStatus = async (conversationId: string, messageId: string, status: string) => {
  try {
    const messageRef = doc(db, `conversations/${conversationId}/messages/${messageId}`);
    await updateDoc(messageRef, { status });
    return true;
  } catch (error: any) {
    console.error("Error updating message status: ", error);
    return false;
  }
};

export const subscribeToConversation = (conversationId: string, callback: (messages: any[]) => void) => {
  const q = query(collection(db, `conversations/${conversationId}/messages`), orderBy('timestamp', 'asc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(messages);
  }, (error) => {
    console.error("Error subscribing to conversation: ", error);
  });

  return unsubscribe;
};

export const getRecentConversations = async (userId: string): Promise<Conversation[]> => {
  console.log('Fetching recent conversations for userId:', userId); // Log userId
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
