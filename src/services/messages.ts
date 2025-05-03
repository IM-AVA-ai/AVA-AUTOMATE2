import {
  addDoc,
  collection,
  query,
  getDocs,
  QuerySnapshot,
  Timestamp,
  getDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getTwilioCredentials } from './users';
import twilio, { Twilio } from 'twilio';

export type MessageStatus = 'pending' | 'sent' | 'failed';
export interface Message {
  id: string;
  campaignId: string;
  message: string;
  createdAt: any;
  status: MessageStatus;
}

export const createMessage = async (
  userId: string,
  leadId: string,
  campaignId: string,
  message: string
): Promise<{ id: string; campaignId: string; message: string }> => {
  try {
    const docRef = await addDoc( 
      collection(db, `users/${userId}/leads/${leadId}/messages`),
      {
        campaignId,
        message,
        createdAt: Timestamp.now(),
      }
    );
    return { id: docRef.id, campaignId, message };
  } catch (error: any) {
    console.error('Error creating message:', error);
    throw error;
  }
};

export const getMessages = async (userId: string, leadId: string): Promise<Message[]> => {
  try {
    const q = query(collection(db, `users/${userId}/leads/${leadId}/messages`));
    const querySnapshot: QuerySnapshot = await getDocs(q);
    const messages: Message[] = [];

    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data(),
      } as Message);
    });
    return messages;
  } catch (error: any) {
    console.error('Error getting messages:', error);
    throw error;
  }
};

export const getLeadPhoneNumber = async (
  userId: string,
  leadId: string
): Promise<string | null> => {
  try {
    const leadDoc = await getDoc(doc(db, `users/${userId}/leads`, leadId));
    if (leadDoc.exists()) {
      return leadDoc.data().phone;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error('Error getting lead phone number:', error);
    return null;
  }
};

export const updateMessageStatus = async (
  userId: string,
  leadId: string,
  messageId: string,
  status: MessageStatus
): Promise<void> => {
  try {
    await updateDoc(
      doc(db, `users/${userId}/leads/${leadId}/messages`, messageId),
      { status }
    );
  } catch (error: any) {
    console.error('Error updating message status:', error);
    throw error;
  }
};

export const sendMessage = async (
  userId: string,
  leadId: string,
  messageId: string,
  message: string
): Promise<void> => {
  try {
    const phoneNumber = await getLeadPhoneNumber(userId, leadId);
    if (!phoneNumber) {
      throw new Error('Phone number not found for this lead');
    }
    const credentials = await getTwilioCredentials(userId);
    if (!credentials) {
      throw new Error('Twilio credentials not configured.');
    }
    const { accountSid, authToken, phoneNumber: twilioPhoneNumber } = credentials;
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      throw new Error('Invalid Twilio credentials.');
    }
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });
    await updateMessageStatus(userId, leadId, messageId, 'sent');
  } catch (error) {
    console.error('Error sending message:', error);
    await updateMessageStatus(userId, leadId, messageId, 'failed');
    throw error;
  }
};