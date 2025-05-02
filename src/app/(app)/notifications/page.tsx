import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, MessageSquare, CheckCircle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  // Placeholder data - replace with actual data fetching from Firestore or notification service
  const notifications = [
    { id: '1', type: 'reply', title: 'New Reply from John Doe', message: 'Sounds interesting, tell me more.', timestamp: new Date(Date.now() - 3600000), read: false, campaignId: '1' },
    { id: '2', type: 'campaign_complete', title: 'Campaign "Q3 Follow-up" Completed', message: 'Successfully sent 100 messages.', timestamp: new Date(Date.now() - 172800000), read: true, campaignId: '3' },
    { id: '3', type: 'error', title: 'Message Failed for Jane Smith', message: 'Delivery failed - Invalid number.', timestamp: new Date(Date.now() - 86400000), read: false, leadId: '2' },
    { id: '4', type: 'follow_up_sent', title: 'Follow-up Sent to Bob Johnson', message: 'Automatic follow-up sequence initiated.', timestamp: new Date(Date.now() - 2 * 86400000), read: true, leadId: '3' },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'reply': return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'campaign_complete': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-500" />;
      case 'follow_up_sent': return <BellRing className="h-5 w-5 text-purple-500" />;
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
    return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
  };

  // TODO: Implement mark as read functionality

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Notifications</h1>
        <Button variant="outline">Mark All as Read</Button>
      </div>

       <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Stay updated on replies, campaign status, and system events.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-4 p-4 rounded-lg border ${notification.read ? 'bg-background' : 'bg-muted/50'}`}
              >
                <div className="mt-1">{getIcon(notification.type)}</div>
                <div className="flex-1">
                  <p className={`font-medium ${notification.read ? '' : 'font-bold'}`}>{notification.title}</p>
                  <p className="text-sm text-muted-foreground">{notification.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{timeAgo(notification.timestamp)}</p>
                </div>
                {!notification.read && <Badge variant="default" className="h-5">New</Badge>}
                 {/* Add context-specific actions, e.g., "View Conversation", "View Campaign" */}
                 <Button variant="ghost" size="sm">View</Button>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground">No new notifications.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
