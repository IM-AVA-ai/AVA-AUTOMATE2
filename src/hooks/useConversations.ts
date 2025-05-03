import { useAuth } from "@/firebase/auth-context";
import { useEffect, useState } from "react";

import { collection, query, where, getDocs, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";

export interface ConversationWithMessages {
  id: string;
    lead_id: string;
    created_at: any;
  messages: Message[];
}
interface Conversation {
    id: string;
}

interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: any;
}

function isCompleteMessage(message: any): message is Message {
  return (
    typeof message === 'object' &&
    message !== null &&
    'content' in message &&
    'role' in message &&
    'conversation_id' in message &&
    'created_at' in message
  );
}
function isNotUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

  
export function useConversations(leadId?: string) {
  const { user } = useAuth();
  const shouldFetch = !!user && !!leadId;

  const fetcher = async () => {
    if (!shouldFetch) return { conversations: [], total: 0 };

    const conversationsRef = collection(db, "conversations");
    const q = query(conversationsRef, where("lead_id", "==", leadId), orderBy("created_at", "desc"));
    const querySnapshot = await getDocs(q);

    const conversations = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (conversations && conversations.length > 0) {
      const conversationsWithMessages: ConversationWithMessages[] = [];

      for (const conversation of conversations) {
        const messagesRef = collection(db, `conversations/${conversation.id}/messages`);
        const q2 = query(messagesRef, orderBy("created_at", "asc"));
        const messagesQuerySnapshot = await getDocs(q2);

        const messages = messagesQuerySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const typedMessages = messages.filter(isCompleteMessage).map((message) => ({
          ...message,
          role: message.role === "user" ? "user" : "assistant",
        } as Message
          ));

        
        
        conversationsWithMessages.push({
          ...conversation as ConversationWithMessages,
          messages: typedMessages
        });
      }

      return {
        conversations: conversationsWithMessages,
        total: conversationsWithMessages.length
      };
    }
      
      return {
        conversations: [],
        total: 0
      };
  };

    const [data, setData] = useState<{ conversations: ConversationWithMessages[]; total: number } | null>({ conversations: [], total: 0 });
    const [error, setError] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const mutate = async () => {
      setIsLoading(true)
      setData(await fetcher());
    }

  useEffect(() => {
    if (!shouldFetch) return;

    const conversationsRef = collection(db, "conversations");
    const q = query(conversationsRef, where("lead_id", "==", leadId), orderBy("created_at", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
        mutate();
    });
    

    let unsubscribeMessages: (() => void)[] = [];
    (async () => {
      if (data) {
          for (const conversation of data.conversations) {
            const q2 = query(collection(db, `conversations/${conversation.id}/messages`), orderBy("created_at", "asc"));
            unsubscribeMessages.push(onSnapshot(q2, () => mutate()));
          }
      }
    })();    

    
    return () => {      
      unsubscribeMessages.forEach(unsubscribe => unsubscribe());
      unsubscribe();
    }
  }, [user, leadId]);

    useEffect(() => {
        mutate();
    }, [])

  return {
    conversations: data?.conversations || [],
    total: data?.total || 0,
    isLoading: isLoading,
    isError: error,
    mutate
  };
}
