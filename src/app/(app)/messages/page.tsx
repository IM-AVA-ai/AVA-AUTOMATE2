'use client';

import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Send } from 'lucide-react';

// Placeholder data types - replace with actual types from Firestore
interface Conversation {
  id: string;
  leadName: string;
  lastMessage: string;
  timestamp: Date;
  unread?: boolean;
  avatar?: string; // Optional avatar URL
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'lead';
  timestamp: Date;
}

export default function MessagesPage() {
  // Placeholder state - replace with actual data fetching and state management
  const [conversations, setConversations] = React.useState<Conversation[]>([
    { id: '1', leadName: 'John Doe', lastMessage: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), unread: true, avatar: 'https://picsum.photos/seed/john/40/40' },
    { id: '2', leadName: 'Jane Smith', lastMessage: 'Not interested, please remove me.', timestamp: new Date(Date.now() - 86400000), avatar: 'https://picsum.photos/seed/jane/40/40' },
    { id: '3', leadName: 'Bob Johnson', lastMessage: 'Okay, thanks!', timestamp: new Date(Date.now() - 172800000), avatar: 'https://picsum.photos/seed/bob/40/40' },
  ]);
  const [selectedConversationId, setSelectedConversationId] = React.useState<string | null>('1');
  const [messages, setMessages] = React.useState<Message[]>([
     { id: 'm1', text: 'Hi John, interested in saving on your energy bill with solar?', sender: 'ai', timestamp: new Date(Date.now() - 7200000) },
     { id: 'm2', text: 'Maybe, what\'s the cost?', sender: 'lead', timestamp: new Date(Date.now() - 5400000) },
     { id: 'm3', text: 'Costs vary, but we offer free consultations. Are you available tomorrow?', sender: 'ai', timestamp: new Date(Date.now() - 4800000) },
     { id: 'm4', text: 'Sounds interesting, tell me more.', sender: 'lead', timestamp: new Date(Date.now() - 3600000) },
  ]);
  const [newMessage, setNewMessage] = React.useState('');

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = (e: React.FormEvent) => {
     e.preventDefault();
     if (!newMessage.trim()) return;
     // TODO: Implement sending message logic (update Firestore, potentially call AI)
     console.log('Sending message:', newMessage);
     // Add message optimistically (or update after successful send)
     setMessages(prev => [...prev, { id: `m${Date.now()}`, text: newMessage, sender: 'user', timestamp: new Date() }]);
     setNewMessage('');
  };

   // TODO: Implement Firestore listener (onSnapshot) to update conversations and messages in real-time

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] flex-col"> {/* Adjust height based on header/layout */}
       <h1 className="text-3xl font-bold mb-6">Messages</h1>
      <ResizablePanelGroup direction="horizontal" className="flex-1 rounded-lg border">
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
          <div className="flex h-full flex-col">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search conversations..." className="pl-8 w-full" />
              </div>
               {/* TODO: Add Filter controls here (e.g., All, Unread, AI-Handled) */}
            </div>
            <ScrollArea className="flex-1">
              {conversations.map((conv) => (
                <Button
                  key={conv.id}
                  variant="ghost"
                  className={`flex h-auto w-full items-center justify-start gap-3 rounded-none p-4 text-left ${selectedConversationId === conv.id ? 'bg-accent' : ''} ${conv.unread ? 'font-bold' : ''}`}
                  onClick={() => setSelectedConversationId(conv.id)}
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conv.avatar} alt={conv.leadName} data-ai-hint="person face" />
                    <AvatarFallback>{conv.leadName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate">{conv.leadName}</p>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                   {conv.unread && <div className="h-2 w-2 rounded-full bg-primary"></div>}
                   <time className="text-xs text-muted-foreground self-start pt-1">
                       {conv.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </time>
                </Button>
              ))}
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
                  {/* Add more lead details if needed */}
                </div>
                 {/* Add actions like 'Mark Unread', 'Assign Agent' */}
              </div>
              <ScrollArea className="flex-1 p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' || msg.sender === 'ai' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-lg px-4 py-2 ${
                        msg.sender === 'user' || msg.sender === 'ai'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <p>{msg.text}</p>
                       <time className="text-xs opacity-70 block text-right mt-1">
                           {msg.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                           {msg.sender === 'ai' && ' (AI)'}
                       </time>
                    </div>
                  </div>
                ))}
              </ScrollArea>
              <div className="border-t p-4">
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                  {/* TODO: Add button to trigger AI response if needed */}
                </form>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Select a conversation to view messages
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
