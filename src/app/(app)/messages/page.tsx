'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from '@/hooks/use-toast';

// Placeholder data types - replace with actual types from Firestore
interface Conversation {
  id: string; // Firestore document ID
  leadId: string;
  leadName: string;
  lastMessage: string;
  timestamp: Date; // Firestore Timestamp converted to Date
  unread?: boolean;
  avatar?: string; // Optional avatar URL
  campaignId?: string; // Optional link to campaign
}

interface Message {
  id: string; // Firestore document ID
  text: string;
  sender: 'user' | 'ai' | 'lead'; // 'user' is the app user, 'ai' is the bot, 'lead' is the contact
  timestamp: Date; // Firestore Timestamp converted to Date
  conversationId: string;
}

// Placeholder hooks - replace with actual Firestore interaction
const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Implement Firestore listener (onSnapshot) for the 'conversations' collection.
        // Order by timestamp descending.
        // Update conversations state in real-time.
        console.log("Setting up Firestore listener for conversations (placeholder)...");
        const timer = setTimeout(() => {
            setConversations([
                { id: 'conv1', leadId: 'lead1', leadName: 'John Solar', lastMessage: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), unread: true, avatar: 'https://picsum.photos/seed/john/40/40' },
                { id: 'conv2', leadId: 'lead2', leadName: 'Jane Roof', lastMessage: 'Not interested, please remove me.', timestamp: new Date(Date.now() - 86400000), avatar: 'https://picsum.photos/seed/jane/40/40' },
                { id: 'conv3', leadId: 'lead3', leadName: 'Bob General', lastMessage: 'Okay, thanks!', timestamp: new Date(Date.now() - 172800000), avatar: 'https://picsum.photos/seed/bob/40/40' },
                { id: 'conv4', leadId: 'lead4', leadName: 'Alice New', lastMessage: 'Can you call me tomorrow?', timestamp: new Date(Date.now() - 2 * 86400000), unread: true, avatar: 'https://picsum.photos/seed/alice/40/40' },
            ]);
            setLoading(false);
        }, 1000);

        // Cleanup listener on component unmount
        return () => {
            console.log("Cleaning up Firestore listener for conversations (placeholder)...");
            clearTimeout(timer);
            // unsubscribe(); // Actual Firestore unsubscribe function
        };
    }, []);

    // Function to mark a conversation as read (update Firestore)
    const markAsRead = async (conversationId: string) => {
        console.log(`Marking conversation ${conversationId} as read (placeholder)...`);
        // TODO: Update the 'unread' field in the specific conversation document in Firestore.
         setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: false } : c));
    };


    return { conversations, loading, markAsRead };
};

const useMessages = (conversationId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }

        setLoading(true);
        // TODO: Implement Firestore listener (onSnapshot) for the 'messages' subcollection
        // within the selected 'conversation' document. Order by timestamp ascending.
        // Update messages state in real-time.
        console.log(`Setting up Firestore listener for messages in conversation ${conversationId} (placeholder)...`);

        const timer = setTimeout(() => {
             // Dummy data based on conversation ID
             if (conversationId === 'conv1') {
                 setMessages([
                    { id: 'm1', conversationId: 'conv1', text: 'Hi John, interested in saving on your energy bill with solar?', sender: 'ai', timestamp: new Date(Date.now() - 7200000) },
                    { id: 'm2', conversationId: 'conv1', text: 'Maybe, what\'s the cost?', sender: 'lead', timestamp: new Date(Date.now() - 5400000) },
                    { id: 'm3', conversationId: 'conv1', text: 'Costs vary, but we offer free consultations. Are you available tomorrow?', sender: 'ai', timestamp: new Date(Date.now() - 4800000) },
                    { id: 'm4', conversationId: 'conv1', text: 'Sounds interesting, tell me more.', sender: 'lead', timestamp: new Date(Date.now() - 3600000) },
                 ]);
             } else if (conversationId === 'conv2') {
                 setMessages([
                    { id: 'm5', conversationId: 'conv2', text: 'Hello Jane, following up on our roofing inspection offer.', sender: 'ai', timestamp: new Date(Date.now() - 90000000) },
                    { id: 'm6', conversationId: 'conv2', text: 'Not interested, please remove me.', sender: 'lead', timestamp: new Date(Date.now() - 86400000) },
                 ]);
             } else {
                 setMessages([]); // No messages for other convos in this example
             }
            setLoading(false);
        }, 500);


        // Cleanup listener on component unmount or when conversationId changes
        return () => {
            console.log(`Cleaning up Firestore listener for messages in conversation ${conversationId} (placeholder)...`);
            clearTimeout(timer);
            // unsubscribe(); // Actual Firestore unsubscribe function
        };
    }, [conversationId]);

     // Function to send a message (from the app user)
    const sendMessage = async (text: string) => {
        if (!conversationId || !text.trim()) return;

        console.log(`Sending message "${text}" to conversation ${conversationId} as 'user' (placeholder)...`);
        // TODO: Add the new message document to the 'messages' subcollection in Firestore.
        // TODO: Update the 'lastMessage' and 'timestamp' in the parent 'conversation' document.
        // Optionally, handle potential AI trigger/response logic here or server-side.

        // Optimistic update (add message locally immediately)
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`,
            conversationId: conversationId,
            text: text,
            sender: 'user', // Message sent by the app user
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, optimisticMessage]);

        try {
            // Simulate network request
            await new Promise(resolve => setTimeout(resolve, 500));
            // In a real scenario, you'd get the actual ID back from Firestore
            // and potentially update the optimistic message's ID.
             toast({ title: "Message Sent" });

            // TODO: Trigger AI response if applicable based on conversation state/rules
            // simulateAIResponse(conversationId, text);

        } catch (error) {
            console.error("Failed to send message:", error);
             toast({ title: "Failed to Send", description: "Could not send message.", variant: "destructive" });
             // Revert optimistic update if needed
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
    };

     // Simulate AI responding after user sends a message
     const simulateAIResponse = async (convId: string, userMessage: string) => {
         if (!convId) return;
         await new Promise(resolve => setTimeout(resolve, 1500)); // AI thinking time

         const aiReply: Message = {
             id: `ai-${Date.now()}`,
             conversationId: convId,
             text: `AI Response to: "${userMessage.substring(0, 20)}..."`,
             sender: 'ai',
             timestamp: new Date(),
         };
         // TODO: Add AI reply to Firestore
         setMessages(prev => [...prev, aiReply]);
         // TODO: Update conversation last message/timestamp in Firestore
         console.log(`AI responded in conversation ${convId} (placeholder)`);
     };


    return { messages, loading, sendMessage };
};


export default function MessagesPage() {
    const { conversations, loading: loadingConversations, markAsRead } = useConversations();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { messages, loading: loadingMessages, sendMessage } = useMessages(selectedConversationId);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUnread, setFilterUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null); // Ref for scrolling

    useEffect(() => {
        // Select first conversation if none is selected and list is loaded
        if (!selectedConversationId && !loadingConversations && conversations.length > 0) {
            const firstUnread = conversations.find(c => c.unread);
            setSelectedConversationId(firstUnread ? firstUnread.id : conversations[0].id);
        }
    }, [conversations, loadingConversations, selectedConversationId]);

     useEffect(() => {
        // Mark conversation as read when selected
        if (selectedConversationId) {
            const selectedConv = conversations.find(c => c.id === selectedConversationId);
            if (selectedConv?.unread) {
                markAsRead(selectedConversationId);
            }
        }
    }, [selectedConversationId, conversations, markAsRead]);

     // Scroll to bottom when messages load or new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(newMessage);
        setNewMessage('');
    };

    const filteredConversations = conversations.filter(conv =>
        conv.leadName.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!filterUnread || conv.unread)
    );

    const selectedConversation = conversations.find(c => c.id === selectedConversationId);

    return (
        <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col"> {/* Adjust height based on header/layout */}
            <h1 className="text-3xl font-bold mb-6">Messages</h1>
            <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border bg-card">
                <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
                    <div className="flex h-full flex-col">
                        <div className="p-4 border-b flex items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search conversations..."
                                    className="pl-8 w-full"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={loadingConversations}
                                />
                            </div>
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                     <Button variant="outline" size="icon" disabled={loadingConversations}>
                                         <Filter className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuCheckboxItem
                                        checked={filterUnread}
                                        onCheckedChange={setFilterUnread}
                                    >
                                        Unread
                                    </DropdownMenuCheckboxItem>
                                    {/* Add more filters later (e.g., by campaign, by agent) */}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <ScrollArea className="flex-1">
                            {loadingConversations ? (
                                <p className='text-center p-4 text-muted-foreground'>Loading conversations...</p>
                            ) : filteredConversations.length > 0 ? (
                                filteredConversations.map((conv) => (
                                    <Button
                                        key={conv.id}
                                        variant="ghost"
                                        className={`flex h-auto w-full items-center justify-start gap-3 rounded-none p-4 text-left ${selectedConversationId === conv.id ? 'bg-accent' : ''}`}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                    >
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={conv.avatar} alt={conv.leadName} data-ai-hint="person face" />
                                            <AvatarFallback>{conv.leadName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 overflow-hidden">
                                            <p className={`truncate ${conv.unread ? 'font-bold' : ''}`}>{conv.leadName}</p>
                                            <p className={`text-sm truncate ${conv.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{conv.lastMessage}</p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {conv.unread && <Badge className="h-5 mb-1">New</Badge>}
                                            <time className="text-xs text-muted-foreground self-start pt-1 whitespace-nowrap">
                                                {conv.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                            </time>
                                        </div>
                                    </Button>
                                ))
                            ) : (
                                <p className='text-center p-4 text-muted-foreground'>
                                    {searchTerm || filterUnread ? 'No matching conversations.' : 'No conversations found.'}
                                </p>
                            )}
                        </ScrollArea>
                    </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={75}>
                    {selectedConversation ? (
                        <div className="flex h-full flex-col">
                            <div className="flex items-center gap-3 border-b p-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.leadName} data-ai-hint="person face" />
                                    <AvatarFallback>{selectedConversation.leadName.substring(0, 2).toUpperCase()}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{selectedConversation.leadName}</p>
                                     {/* TODO: Add lead phone or link to lead details */}
                                     <p className="text-xs text-muted-foreground">Lead ID: {selectedConversation.leadId}</p>
                                </div>
                                {/* TODO: Add actions like 'Mark Unread', 'Assign Agent', 'View Lead Details' */}
                            </div>
                            <ScrollArea className="flex-1 p-4 space-y-4 bg-background/50">
                                {loadingMessages ? (
                                    <p className="text-center text-muted-foreground">Loading messages...</p>
                                ) : messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' || msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${msg.sender === 'user'
                                                        ? 'bg-primary text-primary-foreground'
                                                        : msg.sender === 'ai'
                                                        ? 'bg-secondary text-secondary-foreground' // Different style for AI
                                                        : 'bg-muted text-muted-foreground' // Lead's messages
                                                    }`}
                                            >
                                                <p>{msg.text}</p>
                                                <time className="text-xs opacity-70 block text-right mt-1">
                                                     {msg.sender === 'ai' && '(AI) '}
                                                    {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}

                                                </time>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-center text-muted-foreground">No messages in this conversation yet.</p>
                                )}
                                 <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                            </ScrollArea>
                            <div className="border-t p-4 bg-card">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <Input
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1"
                                        disabled={loadingMessages}
                                        autoComplete="off"
                                    />
                                    <Button type="submit" size="icon" disabled={loadingMessages || !newMessage.trim()}>
                                        <Send className="h-4 w-4" />
                                    </Button>
                                    {/* TODO: Add button to trigger AI response manually if needed */}
                                    {/* <Button variant="outline" size="sm" disabled>Ask AI</Button> */}
                                </form>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                            {loadingConversations ? 'Loading...' : 'Select a conversation to view messages'}
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}

// TODO: Implement robust Firestore listeners with error handling.
// TODO: Implement marking conversations as read/unread in Firestore.
// TODO: Implement sending messages (user and AI) to Firestore.
// TODO: Add pagination for conversations and messages if needed.
// TODO: Connect AI response generation logic.
