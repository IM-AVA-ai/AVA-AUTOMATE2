'use client';

import React, { useState, useEffect, useRef } from 'react';
// Removed Resizable components
import { Search, Send, Filter, User, Bot } from 'lucide-react'; // Added User, Bot icons
import { useToast } from "@src/landing-page(s)/components/ui/use-toast";


// Placeholder data types
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

// Placeholder hooks
const useConversations = () => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
    const { toast } = useToast();

    useEffect(() => {
        if (!conversationId) {
            setMessages([]);
            return;
        }
        setLoading(true);
        console.log(`Setting up Firestore listener for messages in conversation ${conversationId} (placeholder)...`);
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
        const optimisticMessage: Message = {
            id: `temp-${Date.now()}`, conversationId: conversationId, text: text,
            sender: 'user', timestamp: new Date(),
        };
        setMessages(prev => [...prev, optimisticMessage]);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            toast({ title: "Message Sent" });
            // simulateAIResponse(conversationId, text); // Optional AI reply simulation
        } catch (error) {
            console.error("Failed to send message:", error);
             toast({ title: "Failed to Send", description: "Could not send message.", variant: "destructive" });
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        }
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
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false); // State for filter dropdown

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
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] bg-white dark:bg-gray-900"> {/* Adjust height based on header/layout */}
            <h1 className="text-3xl font-bold mb-6 px-4 pt-4 text-gray-900 dark:text-white">Messages</h1>
            <div className="flex flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-700">
                {/* Conversation List Panel */}
                <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-800">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                            </div>
                            <input
                                type="search"
                                placeholder="Search conversations..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={loadingConversations}
                            />
                        </div>
                        {/* Filter Dropdown */}
                         <div className="relative">
                            <button
                                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                                disabled={loadingConversations}
                            >
                                 <Filter className="h-4 w-4" />
                            </button>
                            {isFilterMenuOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                        <label className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-2"
                                                checked={filterUnread}
                                                onChange={(e) => setFilterUnread(e.target.checked)}
                                            />
                                            Unread
                                        </label>
                                        {/* Add more filters here */}
                                    </div>
                                </div>
                            )}
                         </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {loadingConversations ? (
                            <p className='text-center p-4 text-gray-500 dark:text-gray-400'>Loading conversations...</p>
                        ) : filteredConversations.length > 0 ? (
                            filteredConversations.map((conv) => (
                                <button
                                    key={conv.id}
                                    className={`flex w-full items-center gap-3 p-4 text-left border-b border-gray-200 dark:border-gray-700 transition-colors ${
                                        selectedConversationId === conv.id ? 'bg-blue-50 dark:bg-blue-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                    }`}
                                    onClick={() => setSelectedConversationId(conv.id)}
                                >
                                    {/* HeroUI style Avatar */}
                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                        {conv.avatar ? (
                                            <img className="h-full w-full object-cover" src={conv.avatar} alt={conv.leadName} data-ai-hint="person face" />
                                        ) : (
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{getAvatarFallback(conv.leadName)}</span>
                                        )}
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className={`truncate text-sm font-medium ${conv.unread ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>{conv.leadName}</p>
                                        <p className={`text-xs truncate ${conv.unread ? 'text-gray-700 dark:text-gray-200' : 'text-gray-500 dark:text-gray-400'}`}>{conv.lastMessage}</p>
                                    </div>
                                    <div className="flex flex-col items-end self-start">
                                        {conv.unread && <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full mb-1">New</span>}
                                        <time className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap mt-0.5">
                                            {conv.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                        </time>
                                    </div>
                                </button>
                            ))
                        ) : (
                            <p className='text-center p-4 text-gray-500 dark:text-gray-400'>
                                {searchTerm || filterUnread ? 'No matching conversations.' : 'No conversations found.'}
                            </p>
                        )}
                    </div>
                </div>

                {/* Message Panel */}
                 <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
                    {selectedConversation ? (
                        <>
                            {/* Message Header */}
                            <div className="flex items-center gap-3 border-b border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden">
                                    {selectedConversation.avatar ? (
                                        <img className="h-full w-full object-cover" src={selectedConversation.avatar} alt={selectedConversation.leadName} data-ai-hint="person face"/>
                                    ) : (
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{getAvatarFallback(selectedConversation.leadName)}</span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white">{selectedConversation.leadName}</p>
                                     <p className="text-xs text-gray-500 dark:text-gray-400">Lead ID: {selectedConversation.leadId}</p>
                                </div>
                                {/* TODO: Add actions */}
                            </div>
                            {/* Messages Area */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {loadingMessages ? (
                                    <p className="text-center text-gray-500 dark:text-gray-400">Loading messages...</p>
                                ) : messages.length > 0 ? (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'user' || msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-lg px-4 py-2 shadow-sm ${
                                                    msg.sender === 'user' ? 'bg-blue-600 text-white' :
                                                    msg.sender === 'ai' ? 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200' :
                                                    'bg-white text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                                }`}
                                            >
                                                <p className="text-sm">{msg.text}</p>
                                                <div className="flex items-center justify-end mt-1 text-xs opacity-70">
                                                     {msg.sender === 'ai' && <Bot className="h-3 w-3 mr-1 inline"/>}
                                                     {msg.sender === 'user' && <User className="h-3 w-3 mr-1 inline"/>}
                                                    <time>
                                                        {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                                                    </time>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                     <p className="text-center text-gray-500 dark:text-gray-400">No messages in this conversation yet.</p>
                                )}
                                 <div ref={messagesEndRef} /> {/* Anchor for scrolling */}
                            </div>
                            {/* Message Input Area */}
                            <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your message..."
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="flex-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-50"
                                        disabled={loadingMessages}
                                        autoComplete="off"
                                    />
                                    <button type="submit" className="inline-flex items-center justify-center p-2 border border-transparent rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50" disabled={loadingMessages || !newMessage.trim()}>
                                        <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
                            {loadingConversations ? 'Loading...' : 'Select a conversation to view messages'}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
