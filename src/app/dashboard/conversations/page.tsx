'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardBody, Input, Button, Avatar, ScrollShadow } from '@heroui/react'; // Imported from new conversations page
import { Icon } from '@iconify/react'; // Imported from new conversations page
import { Search, Send, Filter, User, Bot } from 'lucide-react'; // Keep existing icons
import { addToast } from "@heroui/toast"; // Keep existing toast


// Keep existing placeholder data types
interface Conversation {
    id: string;
    leadId: string;
    leadName: string;
    lastMessage: string;
    timestamp: Date;
    unread?: boolean;
    avatar?: string;
    campaignId?: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai' | 'lead';
    timestamp: Date;
    conversationId: string;
}


const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("Setting up Firestore listener for conversations (placeholder)...");
        // Keep your existing data fetching logic here
        const timer = setTimeout(() => {
             setConversations([
                { id: 'conv1', leadId: 'lead1', leadName: 'John Solar', lastMessage: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), unread: true, avatar: 'https://picsum.photos/seed/john/40/40' },
                { id: 'conv2', leadId: 'lead2', leadName: 'Jane Roof', lastMessage: 'Not interested, please remove me.', timestamp: new Date(Date.now() - 86400000), avatar: 'https://picsum.photos/seed/jane/40/40' },
                { id: 'conv3', leadId: 'lead3', leadName: 'Bob General', lastMessage: 'Okay, thanks!', timestamp: new Date(Date.now() - 172800000), unread: true, avatar: 'https://picsum.photos/seed/bob/40/40' },
                { id: 'conv4', leadId: 'lead4', leadName: 'Alice New', lastMessage: 'Can you call me tomorrow?', timestamp: new Date(Date.now() - 2 * 86400000), unread: true, avatar: 'https://picsum.photos/seed/alice/40/40' },
            ]);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    const markAsRead = async (conversationId: string) => {
        console.log(`Marking conversation ${conversationId} as read (placeholder)...`);
        setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, unread: false } : c));
    };

    return { conversations, loading, markAsRead };
};

const useMessages = (conversationId: string | null) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }
        setLoading(true);
        console.log(`Setting up Firestore listener for messages in conversation ${conversationId} (placeholder)...`);
        // Keep your existing message fetching logic here
         const timer = setTimeout(() => {
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
            } else { setMessages([]); }
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [conversationId]);

    const sendMessage = async (text: string) => {
        if (!conversationId || !text.trim()) return;
        console.log(`Sending message "${text}" to conversation ${conversationId} as 'user' (placeholder)...`);
        // Keep your existing message sending logic here (Twilio/SMS/AI)
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`, conversationId: conversationId, text: text,
            sender: 'user', timestamp: new Date(),
        };
        setMessages(prev => [...prev, optimisticMessage]);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            addToast({ title: "Message Sent" });
            // simulateAIResponse(conversationId, text); // Optional AI reply simulation
        } catch (error) {
            console.error("Failed to send message:", error);
            addToast({ title: "Failed to Send", description: "Could not send message.", variant: "flat" /* TODO: Apply destructive styling if needed */ });
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
    };

    return { messages, loading, sendMessage };
};


export default function ConversationsPage() { // Changed component name to match imported file
    const { conversations, loading: loadingConversations, markAsRead } = useConversations();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const { messages, loading: loadingMessages, sendMessage } = useMessages(selectedConversationId);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterUnread, setFilterUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

    useEffect(() => {
        if (!selectedConversationId && !loadingConversations && conversations.length > 0) {
            const firstUnread = conversations.find(c => c.unread);
            setSelectedConversationId(firstUnread ? firstUnread.id : conversations[0].id);
        }
    }, [conversations, loadingConversations, selectedConversationId]);

    useEffect(() => {
        if (selectedConversationId) {
            const selectedConv = conversations.find(c => c.id === selectedConversationId);
            if (selectedConv?.unread) markAsRead(selectedConversationId);
        }
    }, [selectedConversationId, conversations, markAsRead]);

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

    // Helper to get avatar fallback text
    const getAvatarFallback = (name: string) => name.substring(0, 2).toUpperCase();

    return (
        <div className="p-8 h-[calc(100vh-4rem)]"> {/* Use styling from imported file */}
            <div className="flex h-full gap-6"> {/* Use styling from imported file */}
                {/* Recent Conversations List */}
                <Card className="w-80 bg-black/40 border border-white/5"> {/* Use Card from imported file */}
                    <CardBody className="p-0 h-full"> {/* Use CardBody from imported file */}
                        <div className="p-4 border-b border-white/5">
                            <Input
                                placeholder="Search by name or agent..."
                                startContent={<Icon icon="lucide:search" className="text-white/40" />}
                                className="!bg-black/40 border-white/10 hover:border-white/20 focus:border-purple-500/50"
                                classNames={{
                                    input: "text-white/90 placeholder:text-white/40",
                                    inputWrapper: "bg-black/40 hover:bg-black/60 transition-colors"
                                }}
                                value={searchTerm} // Bind to existing state
                                onChange={(e) => setSearchTerm(e.target.value)} // Bind to existing state
                            />
                        </div>
                        <ScrollShadow className="h-[calc(100vh-12rem)]"> {/* Use ScrollShadow from imported file */}
                            {loadingConversations ? ( // Use existing loading state
                                <p className='text-center p-4 text-gray-500 dark:text-gray-400'>Loading conversations...</p>
                            ) : filteredConversations.length > 0 ? ( // Use existing filtered conversations
                                filteredConversations.map((conv) => (
                                    <button
                                        key={conv.id}
                                        className={`flex w-full items-center gap-3 p-4 text-left border-b border-white/5 transition-colors ${selectedConversationId === conv.id ? 'bg-white/10' : 'hover:bg-white/5' // Use styling from imported file
                                            }`}
                                        onClick={() => setSelectedConversationId(conv.id)} // Use existing state setter
                                    >
                                        <Avatar src={conv.avatar} className="w-10 h-10" /> {/* Use Avatar from imported file */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-white/90 font-medium truncate">{conv.leadName}</h4> {/* Use leadName from existing data */}
                                                <span className="text-xs text-white/40">{conv.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span> {/* Use timestamp from existing data */}
                                            </div>
                                            <p className="text-sm text-white/60 truncate mt-1">
                                                {conv.lastMessage} {/* Use lastMessage from existing data */}
                                            </p>
                                            {/* Removed score display */}
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <p className='text-center p-4 text-gray-500 dark:text-gray-400'>
                                    {searchTerm || filterUnread ? 'No matching conversations.' : 'No conversations found.'}
                                </p>
                            )}
                        </ScrollShadow>
                    </CardBody>
                </Card>

                {/* Chat Area */}
                <Card className="flex-1 bg-black/40 border border-white/5"> {/* Use Card from imported file */}
                    <CardBody className="p-0 h-full flex flex-col"> {/* Use CardBody from imported file */}
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/5 flex items-center gap-4">
                            <Avatar
                                src={selectedConversation?.avatar || "https://img.heroui.chat/image/avatar?w=40&h=40&u=1"} // Use avatar from selected conversation
                                className="w-10 h-10"
                            />
                            <div>
                                <h3 className="text-white/90 font-medium">{selectedConversation?.leadName || 'Select a conversation'}</h3>
                                {/* Optionally display more info here, e.g. leadId */}
                                {/* <p className="text-white/50 text-sm">{selectedConversation?.leadId}</p> */}
                                {selectedConversation?.campaignId && (
                                    <p className="text-xs text-purple-300 mt-1">
                                        Campaign: {selectedConversation.campaignId}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <ScrollShadow className="flex-1 p-4 space-y-4 overflow-y-auto"> {/* Use ScrollShadow from imported file */}
                            {loadingMessages ? ( // Use existing loading state
                                <p className="text-center text-gray-500 dark:text-gray-400">Loading messages...</p>
                            ) : messages.length > 0 ? ( // Use existing messages
                                messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} // Use sender from existing data
                                    >
                                        <div className="flex gap-3 max-w-[80%]">
                                            {message.sender !== 'user' && ( // Only show avatar for non-user messages
                                                <Avatar
                                                    src={selectedConversation?.avatar || "https://img.heroui.chat/image/avatar?w=32&h=32&u=1"} // Use avatar from selected conversation
                                                    className="w-8 h-8"
                                                />
                                            )}
                                            <div>
                                                <div
                                                    className={`p-3 rounded-2xl ${
                                                        message.sender === 'user'
                                                            ? 'bg-gradient-to-br from-purple-500/30 to-purple-600/30 border border-purple-500/20 shadow-[0_4px_20px_-4px_rgba(147,51,234,0.2)] backdrop-blur-sm text-white/80'
                                                            : 'bg-gradient-to-br from-white/10 to-white/5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.2)] backdrop-blur-sm text-white/70'
                                                    }`} // Use styling from imported file
                                                >
                                                    {message.text} {/* Use text from existing data */}
                                                </div>
                                                <p className={`text-xs text-white/40 mt-1 ${
                                                    message.sender === 'user' ? 'text-right' : 'text-left'
                                                }`}>
                                                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {/* Use timestamp from existing data */}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-400">No messages in this conversation yet.</p>
                            )}
                            <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                        </ScrollShadow>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/5 flex gap-2">
                            <Input
                                placeholder="Type a message..."
                                value={newMessage} // Bind to existing state
                                onChange={(e) => setNewMessage(e.target.value)} // Bind to existing state setter
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)} // Bind to existing send handler
                                className="!bg-black/40 border-purple-500/30 hover:border-purple-500/50 focus:border-purple-500/70" // Use styling from imported file
                                classNames={{
                                    input: "text-white/90 placeholder:text-white/40",
                                    inputWrapper: "bg-black/40 hover:bg-black/60 transition-colors"
                                }}
                                endContent={
                                    <Button
                                        isIconOnly
                                        className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30" // Use styling from imported file
                                        onPress={() => handleSendMessage(null as any)} // Call handleSendMessage directly (adjusting event type)
                                        disabled={loadingMessages || !newMessage.trim()} // Use existing loading state and input check
                                    >
                                        <Icon icon="lucide:send" /> {/* Use Icon from imported file */}
                                    </Button>
                                }
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
}
