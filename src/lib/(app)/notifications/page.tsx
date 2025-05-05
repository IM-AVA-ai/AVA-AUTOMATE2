'use client';

import React, { useState, useEffect } from 'react';
import { BellRing, MessageSquare, CheckCircle, XCircle, Rocket, UserPlus } from "lucide-react";
import { useToast } from '@/components/BasicToaster'; // Corrected import path

// Placeholder Notification type
interface Notification {
  id: string;
  type: 'reply' | 'campaign_complete' | 'campaign_started' | 'error' | 'follow_up_sent' | 'new_lead';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  relatedId?: string;
  relatedLink?: string;
}

// Placeholder hook
const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        console.log("Fetching notifications (placeholder)...");
        setTimeout(() => {
            setNotifications([
                { id: '1', type: 'reply', title: 'New Reply from John Solar', message: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), read: false, relatedId: 'conv1', relatedLink: '/messages?convId=conv1' },
                { id: '2', type: 'campaign_complete', title: 'Campaign "Q3 Follow-up" Completed', message: 'Successfully sent 100 messages.', timestamp: new Date(Date.now() - 172800000), read: true, relatedId: '3', relatedLink: '/campaigns?id=3' },
                { id: '3', type: 'error', title: 'Message Failed for Jane Roof', message: 'Delivery failed - Invalid number.', timestamp: new Date(Date.now() - 86400000), read: false, relatedId: 'lead2' },
                { id: '4', type: 'campaign_started', title: 'Campaign "Summer Solar Promo" Started', message: 'Sending 150 messages...', timestamp: new Date(Date.now() - 2 * 3600000), read: true, relatedId: '1', relatedLink: '/campaigns?id=1' },
                { id: '5', type: 'new_lead', title: 'New Lead Added', message: '"Alice Green" imported via CSV.', timestamp: new Date(Date.now() - 4 * 3600000), read: true, relatedId: 'lead4', relatedLink: '/leads?id=lead4' },
            ]);
            setLoading(false);
        }, 800);
    }, []);

    const markAsRead = async (notificationId: string) => {
        console.log(`Marking notification ${notificationId} as read (placeholder)...`);
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    };

    const markAllAsRead = async () => {
        console.log("Marking all notifications as read (placeholder)...");
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
        if (!notification.read) markAsRead(notification.id);
        if (notification.relatedLink) {
             console.log("Navigating to:", notification.relatedLink);
             window.location.href = notification.relatedLink;
        } else {
             toast({ title: "No Link Available", description: "No specific context link for this notification." });
        }
    }

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications {unreadCount > 0 && `(${unreadCount})`}</h1>
                 <button
                    onClick={markAllAsRead}
                    disabled={loading || unreadCount === 0}
                    className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Mark All as Read
                 </button>
            </div>

            {/* Notifications List Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stay updated on replies, campaign status, and system events.</p>
                </div>
                <div className="p-4 space-y-4">
                    {loading ? (
                         <p className="text-center text-gray-500 dark:text-gray-400 py-8">Loading notifications...</p>
                    ): notifications.length > 0 ? (
                        notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`flex items-start gap-4 p-4 rounded-lg border dark:border-gray-700 transition-colors ${
                                    notification.read
                                    ? 'bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50'
                                    : 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 font-medium'
                                }`}
                            >
                                <div className="mt-1 flex-shrink-0">{getIcon(notification.type)}</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${notification.read ? 'text-gray-900 dark:text-white' : 'font-semibold text-gray-900 dark:text-white'}`}>{notification.title}</p>
                                    <p className={`text-sm ${notification.read ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>{notification.message}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{timeAgo(notification.timestamp)}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2 ml-auto flex-shrink-0">
                                     {!notification.read && <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded-full self-end">New</span>}
                                     <button
                                        className="px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => handleViewClick(notification)}
                                        disabled={!notification.relatedLink}
                                      >
                                        {notification.type === 'reply' ? 'View Convo' : notification.type.startsWith('campaign') ? 'View Campaign' : notification.type === 'new_lead' ? 'View Lead' : 'View'}
                                     </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">No notifications.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
