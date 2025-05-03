// src/services/realtime-conversations.ts
import { getDatabase, ref, onChildAdded, push, off } from 'firebase/database';
import { app } from '@/firebase/config';

const db = getDatabase(app);

interface MessageData {
  [key: string]: any;
}

export const subscribeToRealtimeConversation = (
  conversationId: string,
  callback: (message: MessageData) => void
) => {
  const conversationRef = ref(db, `conversations/${conversationId}`);

  const listener = onChildAdded(conversationRef, (snapshot) => {
    const newMessage = snapshot.val() as MessageData;
    callback(newMessage);
  });

  return () => off(conversationRef, 'child_added', listener);
};

export const addRealtimeMessage = (
  conversationId: string,
  messageData: MessageData
) => {
  const conversationRef = ref(db, `conversations/${conversationId}`);
  push(conversationRef, messageData);
};