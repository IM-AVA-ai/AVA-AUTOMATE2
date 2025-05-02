'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, MessageSquare, CheckCircle, XCircle, Rocket, UserPlus } from "lucide-react"; // Added Rocket, UserPlus
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

// Placeholder Notification type - replace with actual type from Firestore/Notification service
interface Notification {
  id: string;
  type: 'reply' | 'campaign_complete' | 'campaign_started' | 'error' | 'follow_up_sent' | 'new_lead';
  title: string;
  message: string;
  timestamp: Date; // Firestore Timestamp converted to Date
  read: boolean;
  relatedId?: string; // e.g., leadId, campaignId, messageId
  relatedLink?: string; // Optional link to view context (e.g., /messages?convId=...)
}

// Placeholder hook for fetching notifications
const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // TODO: Fetch notifications from Firestore (e.g., a 'notifications' collection for the user)
        // Order by timestamp descending, maybe limit the results.
        // Implement real-time listener (onSnapshot) if needed.
        console.log("Fetching notifications (placeholder)...");
        setTimeout(() => {
            setNotifications([
                { id: '1', type: 'reply', title: 'New Reply from John Solar', message: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), read: false, relatedId: 'conv1', relatedLink: '/messages?convId=conv1' },
                { id: '2', type: 'campaign_complete', title: 'Campaign "Q3 Follow-up" Completed', message: 'Successfully sent 100 messages.', timestamp: new Date(Date.now() - 172800000), read: true, relatedId: '3', relatedLink: '/campaigns?id=3' },
                { id: '3', type: 'error', title: 'Message Failed for Jane Roof', message: 'Delivery failed - Invalid number.', timestamp: new Date(Date.now() - 86400000), read: false, relatedId: 'lead2' },
                { id: '4', type: 'campaign_started', title: 'Campaign "Summer Solar Promo" Started', message: 'Sending 150 messages...', timestamp: new Date(Date.now() - 2 * 3600000), read: true, relatedId: '1', relatedLink: '/campaigns?id=1' },
                { id: '5', type: 'new_lead', title: 'New Lead Added', message: '"Alice Green" imported via CSV.', timestamp: new Date(Date.now() - 4 * 3600000), read: true, relatedId: 'lead4', relatedLink: '/leads?id=lead4' }, // Assuming leads have direct links
            ]);
            setLoading(false);
        }, 800);
    }, []);

    // Placeholder function to mark a notification as read
    const markAsRead = async (notificationId: string) => {
        console.log(`Marking notification ${notificationId} as read (placeholder)...`);
        // TODO: Update 'read' status in Firestore for the specific notification document.
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
        // No toast needed for single read usually
    };

    // Placeholder function to mark all notifications as read
    const markAllAsRead = async () => {
        console.log("Marking all notifications as read (placeholder)...");
        // TODO: Update 'read' status in Firestore for all unread notifications for the user.
        const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
        if (unreadIds.length === 0) {
            toast({ title: "No unread notifications." });
            return;
        }
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        toast({ title: "All notifications marked as read." });
    };

    return { notifications, loading, markAsRead, markAllAsRead };
};


export default function NotificationsPage() {
    const { notifications, loading, markAsRead, markAllAsRead } = useNotifications();
    const { toast } = useToast();

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'reply': return <MessageSquare className="h-5 w-5 text-blue-500" />;
            case 'campaign_complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'campaign_started': return <Rocket className="h-5 w-5 text-indigo-500" />;
            case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
            case 'follow_up_sent': return <BellRing className="h-5 w-5 text-purple-500" />;
             case 'new_lead': return <UserPlus className="h-5 w-5 text-teal-500" />;
            default: return <BellRing className="h-5 w-5 text-gray-500" />;
        }
    };

    const timeAgo = (date: Date): string => {
        const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return interval + " year" + (interval === 1 ? "" : "s") + " ago";
        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return interval + " month" + (interval === 1 ? "" : "s") + " ago";
        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return interval + " day" + (interval === 1 ? "" : "s") + " ago";
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
        interval = Math.floor(seconds / 60);
        if (interval >= 1) return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
        return Math.max(0, Math.floor(seconds)) + " second" + (seconds === 1 ? "" : "s") + " ago";
    };

    const handleViewClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead(notification.id);
        }
        if (notification.relatedLink) {
             // Use Next.js router or simple window.location for navigation
             console.log("Navigating to:", notification.relatedLink);
             window.location.href = notification.relatedLink; // Simple navigation for now
        } else {
             toast({ title: "No Link Available", description: "No specific context link for this notification." });
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold">Notifications {unreadCount > 0 && `(${unreadCount})`}</h1>
                <Button variant="outline" onClick={markAllAsRead} disabled={loading || unreadCount === 0}>Mark All as Read</Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Stay updated on replies, campaign status, and system events.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {loading ? (
                         <p className="text-center text-muted-foreground py-8">Loading notifications...</p>
                    ): notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${notification.read ? 'bg-card hover:bg-muted/30' : 'bg-muted/50 hover:bg-muted/70 font-medium'}`}
                            >
                                <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0"> {/* Ensure text wraps */}
                                    <p className={` ${notification.read ? '' : 'font-semibold'}`}>{notification.title}</p>
                                    <p className={`text-sm ${notification.read ? 'text-muted-foreground' : 'text-foreground/90'}`}>{notification.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{timeAgo(notification.timestamp)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-auto flex-shrink-0">
                                     {!notification.read && <Badge variant="default" className="h-5 self-end">New</Badge>}
                                     {/* Context-specific actions */}
                                    <Button variant="ghost" size="sm" onClick={() => handleViewClick(notification)} disabled={!notification.relatedLink}>
                                        {notification.type === 'reply' ? 'View Convo' : notification.type.startsWith('campaign') ? 'View Campaign' : notification.type === 'new_lead' ? 'View Lead' : 'View'}
                                     </Button>
                                      {/* Optionally add a direct 'Mark as Read' button */}
                                     {/* {!notification.read && <Button variant="link" size="sm" className="text-xs h-auto p-0 text-muted-foreground" onClick={() => markAsRead(notification.id)}>Mark read</Button>} */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-8">No notifications.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

// TODO: Implement Firestore listeners for real-time updates.
// TODO: Implement Firestore updates for marking as read.
// TODO: Use Next.js Link or router for navigation in handleViewClick.
// TODO: Add pagination or infinite scroll if notification list can grow large.
