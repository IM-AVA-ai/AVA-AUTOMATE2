"use client";

// react and next imports
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link'; // Added from DashboardContent

// third party imports
import { MessageCircle, BarChart, LineChart, PieChart, Users, Activity, CheckCircle, XCircle, UserPlus, Rocket, MessagesSquare, Brain,Calendar, Loader2, Plus, Link2Icon  } from 'lucide-react'; // Combined icons
import Cookies from 'js-cookie'
import { useInView } from "react-intersection-observer";

// custom components
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Combined imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import MetricsCard from "@/components/MetricsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {EventModal} from '@/components/CalendarEventModal';

// custom hooks
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from '@/hooks/useDebounce';

// custom components
import { Conversation } from '@/services/conversations'; // Import types from DashboardContent
import { Campaign } from '@/services/campaigns'; 
import { Lead } from '@/services/leads'; 

// firebase imports
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config"; 


interface FirestoreMessage {
  id: string;
  lead_id: string;
  content: string;
  created_at: {
    toDate(): Date; 
  };
  direction: 'inbound' | 'outbound';
  status: 'read' | 'unread'; 
}

interface ICalendarEvents {
  attendees : string[];
  created : string;
  creator : {
    displayName : string;
    email : string;
  };
  end: {
    dateTime: string;
    timeZone: string;
  };
  etag: string;
  eventType: string;
  guestsCanModify: boolean;
  htmlLink: string;
  iCalUID: string;
  id: string;
  kind: string;
  organizer: {
    email: string;
    displayName: string;
  };
  originalStartTime: {
    dateTime: string;
    timeZone: string;
  };
  recurringEventId: string;
  reminders: {
    useDefault: boolean;
  };
  sequence: number;
  start: {
    dateTime: string;
    timeZone: string;
  };
  status: string;
  summary: string;
  updated: string;
}

export const CommunicationsLogCard = () => {
  const [conversationThreads, setConversationThreads] = useState<FirestoreMessage[]>([]); // Use FirestoreMessage type
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadCount, setNewThreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Set up real-time listener for messages
    const messagesCollection = collection(db, 'messages'); 
    const q = query(messagesCollection, orderBy('created_at', 'desc'), limit(20)); // Fetch recent messages

    const unsubscribe = onSnapshot(q, (snapshot: QuerySnapshot<DocumentData>) => {
      console.log('New message data received from Firestore');
      processMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as FirestoreMessage)));
      setIsLoading(false);
    }, (error) => {
      console.error('Error fetching messages from Firestore:', error);
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive"
      });
      setIsLoading(false);
    });

   
    return () => unsubscribe();
  }, [toast]); 

  // Function to process messages and create conversation threads (simplified without ConversationThread component)
  const processMessages = (messages: FirestoreMessage[]) => {
    console.log('Processing messages:', messages.length);
    const threads: Record<string, FirestoreMessage> = {}; // Use FirestoreMessage type
    for (const message of messages) {
      // Use lead_id to group messages into threads, keeping the latest message for each lead
      const existingThread = threads[message.lead_id];
      if (!existingThread || message.created_at.toDate().getTime() > existingThread.created_at.toDate().getTime()) {
        threads[message.lead_id] = message;
      }
    }

    // Sort threads by the timestamp of their latest message (descending)
    const sortedThreads = Object.values(threads).sort((a, b) => b.created_at.toDate().getTime() - a.created_at.toDate().getTime());

    // Limit to the top 5 threads
    const top5Threads = sortedThreads.slice(0, 5);

    console.log('Processed threads:', top5Threads.length);
    setConversationThreads(top5Threads);

    // Count unread threads among the displayed ones
    const unreadCount = top5Threads.filter(thread => thread.direction === 'inbound' && thread.status !== 'read').length;
    setNewThreadCount(unreadCount);
  };

  const resetNewThreadCount = () => setNewThreadCount(0);

  return (
    <Card className="modern-glass-card">
      <CardHeader className="pb-2 flex flex-row items-center justify-between p-0 mb-4">
        <CardTitle className="font-warp text-white flex items-center font-medium text-base">
          <MessageCircle className="mr-2 h-5 w-5 text-purple-500" />
          Communications Log
        </CardTitle>
        {newThreadCount > 0 && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/50 hover-glow cursor-pointer" onClick={resetNewThreadCount}>
            {newThreadCount} New {newThreadCount === 1 ? 'Thread' : 'Threads'}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-gray-400">
            Loading...
          </div>
        ) : conversationThreads.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mb-4 opacity-40" />
            <p className="text-gray-400">No conversation threads yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Render simplified thread items directly */}
            {conversationThreads.map(thread => (
              <div key={thread.id} className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Lead {thread.lead_id.slice(0, 5)}...</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{thread.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{new Date(thread.created_at.toDate()).toISOString()}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t border-[#4B2A78]/40 pt-4 p-0 mt-4">
        <Button
          className="flex items-center justify-center gap-1.5 rounded-full px-8 py-2.5 bg-gradient-to-br from-[#0a0a0f] via-[#121018] to-[#1b1226] border border-[#4b2a78]/40 shadow-[inset_0_0_0.5px_rgba(255,255,255,0.05),0_4px_30px_rgba(0,0,0,0.4)] backdrop-blur-md hover:shadow-purple-900/20 hover:scale-105 transition-all duration-300 w-full overflow-hidden"
          // Removed radius="full"
        >
          View All Messages
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper for badge variant styles (Tailwind based) - Added from DashboardContent
const getStatusBadgeClasses = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Changed outline to green
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // Default to yellow for draft/other
    }
  };


const placeholderConversations: Conversation[] = []; // Replace with actual data fetching
const placeholderCampaigns: Campaign[] = []; // Replace with actual data fetching
const placeholderLeads: Lead[] = []; // Replace with actual data fetching


const DashboardPage = () => {
  // Placeholder data for DashboardContent props
  const recentConversations = placeholderConversations;
  const campaigns = placeholderCampaigns;
  const leads = placeholderLeads;
  const accessToken = Cookies.get('__gc_accessToken');
  const salesForceAccessToken = Cookies.get('__sf_accessToken');
  const hubSpotAccessToken = Cookies.get('__hs_accessToken');

  
  const [allCalendarEvents, setAllCalendarEvents] = useState<ICalendarEvents[]>([]);
  const [calendarLoading, setCalendarLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false); 
  const [loading, setLoading] = useState<boolean>(false);  
  const [salesForceLoading, setSalesForceLoading] = useState<boolean>(false);  
  const [hubSpotLoading, setHubSpotLoading] = useState<boolean>(false);  

  const debouncedSearchTerm = useDebounce(searchTerm);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const [loadMoreRef, inView] = useInView({
    threshold: 0,
    rootMargin: '200px',
  });

  const recentCampaigns = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    sent: 0, // Placeholder - replace with actual data
    replies: 0, // Placeholder - replace with actual data
  }));

  const activityFeed = [
      { id: 'a1', type: 'lead', text: 'New lead "Jane Doe" added.', time: 'Just now' }, // Added example activity
      { id: 'a2', type: 'campaign', text: 'Campaign "Summer Solar Promo" started.', time: '1h ago' },
      { id: 'a3', type: 'message', text: 'New reply received from John Doe.', time: '3h ago' },
      { id: 'a4', type: 'agent', text: 'Agent "Roofing Lead Qualifier" created.', time: '1d ago' },
  ];

  const getGoogleAuthUrl = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/google/login');
      const json = await res.json();
      const googleAuthUrl = json.data;
      window.open(googleAuthUrl, '_self');
    } catch (err) {
      console.error('Error fetching Google Auth URL:', err);
    }finally{
      setLoading(false);
    }
  };

  const fetchAllCalendarEvents = useCallback(async (searchQuery = '', token?: string | null, isNewSearch = false) => {
    setCalendarLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set('q', searchQuery);
      if (token) params.set('pageToken', token);
      
      const response = await fetch(`/api/calendar/events?accessToken=${accessToken}&${params.toString()}`);
      const data = await response.json();

      if (isNewSearch) {
        setAllCalendarEvents(data.items || []);
      } else {
        setAllCalendarEvents(prev => [...prev, ...(data.items || [])]);
      }
      setNextPageToken(data.nextPageToken || null);
      setHasMore(!!data.nextPageToken);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setCalendarLoading(false);
    }
  }, [accessToken, calendarLoading, hasMore]);

  const getSalesForceAuthUrl = async () => {
    setSalesForceLoading(true);
      try {
        const res = await fetch('/api/auth/salesforce/login');
        const json = await res.json();
        const salesforceAuthUrl = json.data;
        window.open(salesforceAuthUrl, '_self');
      } catch (err) {
        console.error('Error fetching Salesforce Auth URL:', err);
      }finally{
        setSalesForceLoading(false);
      }
  }
  const getHubSpotAuthUrl = async () => {
    setHubSpotLoading(true);
      try {
        const res = await fetch('/api/auth/hubspot/login');
        const json = await res.json();
        const hubSpotAuthUrl = json.data;
        window.open(hubSpotAuthUrl, '_self');
      } catch (err) {
        console.error('Error fetching HubSpot Auth URL:', err);
      }finally{
        setHubSpotLoading(false);
      }
  }

  useEffect(() => {
    if (accessToken) {
      fetchAllCalendarEvents(debouncedSearchTerm,undefined,true);
    }else{
      setCalendarLoading(false);
      setAllCalendarEvents([]);
      setNextPageToken(null);
    }
  }, [accessToken, debouncedSearchTerm]);

  useEffect(() => {
    if (inView && hasMore && !calendarLoading && nextPageToken) {
      fetchAllCalendarEvents(debouncedSearchTerm, nextPageToken);
    }
  }, [inView, hasMore, calendarLoading, debouncedSearchTerm, nextPageToken, fetchAllCalendarEvents]);


  return (
    <div className="space-y-8 p-8"> {/* Added p-8 for padding */}
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Add Lead */}
        <Card className="dark">
          <CardHeader>
            <Link href="/leads/create"><Button> <UserPlus className="mr-2 h-4 w-4" /> Add Lead</Button></Link>
          </CardHeader>
        </Card>
        {/* Start Campaign */}
        <Card className="dark">
        <CardHeader>
            <Link href="/campaigns/create"><Button> <Rocket className="mr-2 h-4 w-4" /> Start Campaign</Button></Link>
          </CardHeader>
        </Card>
        {/* View Conversations */}
        <Card className="dark">
        <CardHeader>
            <Link href="/conversations"><Button> <MessagesSquare className="mr-2 h-4 w-4" /> View Conversations</Button></Link>
          </CardHeader>
        </Card>
        {/* Create Agent */}
        <Card className="dark">
        <CardHeader>
            <Link href="/agents/create"><Button> <Brain className="mr-2 h-4 w-4" /> Create Agent</Button></Link>
          </CardHeader>
        </Card>
        {/* Fetch Google Calendar Events */}
        <Card className="dark">
          <CardHeader>
            <Button onClick={()=>getGoogleAuthUrl()} disabled={loading || !!accessToken}>
              {loading ? (
                <>
                  <Calendar className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Fetch Events
                </>
              )}
            </Button>
          </CardHeader>
        </Card>
        {/* Connect SalesForce */}
        <Card className="dark">
          <CardHeader>
            <Button onClick={()=>getSalesForceAuthUrl()} disabled={salesForceLoading || !!salesForceAccessToken}>
              {salesForceLoading ? (
                <>
                  <Link2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Link2Icon className="mr-2 h-4 w-4" />
                  Fetch Leads
                </>
              )}
            </Button>
          </CardHeader>
        </Card>
        {/* Connect Hubspot */}
        <Card className="dark">
          <CardHeader>
            <Button onClick={()=>getHubSpotAuthUrl()} disabled={hubSpotLoading || !!hubSpotAccessToken}>
              {hubSpotLoading ? (
                <>
                  <Link2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Fetching...
                </>
              ) : (
                <>
                  <Link2Icon className="mr-2 h-4 w-4" />
                  Fetch HubSpot Leads
                </>
              )}
            </Button>
          </CardHeader>
        </Card>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1> {/* Moved H1 here */}

      {/* Overview Section - Kept from original DashboardPage */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-600">
          Welcome to your dashboard! Here you can get a quick overview of your
          campaigns, leads, and overall performance.
        </p>
      </section>

      {/* Stats Cards - Replaced Key Metrics Section */}
      <MetricsCard leads={leads} campaigns={campaigns}/>

      {/* All calendar events*/}
      <Card className="dark mb-4">
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            All Calendar Events
          </h2>
          <div className="flex items-center justify-between mt-4">
            <Input
              placeholder="Search events..."
              className="max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              type='search'
            />
            <Button 
              variant="default" 
              className="dark bg-primary hover:bg-primary/90 text-white"
              onClick={() => setIsEventModalOpen(true)}
              disabled={!accessToken}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
            </Button>
          </div>
        </CardHeader>
        <div className="relative">
          <div 
            ref={tableContainerRef}
            className="p-6 overflow-y-auto max-h-[calc(100vh-300px)]"
          >
            <Table>
              <TableHeader className="sticky top-0 bg-gray-900 z-10">
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Organizer</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allCalendarEvents.length > 0 ? (
                  <>
                    {allCalendarEvents.map((event) => (
                      <TableRow key={`${event.id}-${event.created}`}>
                        <TableCell className="font-medium">{event.summary}</TableCell>
                        <TableCell>
                          <div>
                            <p>{event.creator?.displayName}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.creator?.email}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>{event.organizer?.displayName}</TableCell>
                        <TableCell>{event.status}</TableCell>
                        <TableCell>
                          {event.created && new Date(event.created).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                    
                    {/* Infinite scroll trigger */}
                    <TableRow ref={loadMoreRef}>
                      <TableCell colSpan={5} className="text-center py-4">
                        {calendarLoading ? (
                          <div className="flex justify-center">
                            <Loader2 className="h-5 w-5 animate-spin" />
                          </div>
                        ) : hasMore ? (
                          <Button 
                            variant="ghost"
                            onClick={() => fetchAllCalendarEvents(debouncedSearchTerm, nextPageToken)}
                          >
                            Load More
                          </Button>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No more events to load
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  </>
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      {calendarLoading ? (
                        <div className="flex justify-center">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                      ) : (
                        'No events found'
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {/* Recent Conversations - Added from DashboardContent */}
      <Card className="dark mb-4">
        <CardHeader>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Conversations
            </h2>
        </CardHeader>
        <div className="p-6">
          <div className="space-y-4">
            {recentConversations.length > 0 ? (
              recentConversations.map((conversation) => (
                <div key={conversation.id} className="p-4 border rounded-lg">
                  <p className="text-sm font-medium">Lead ID: {conversation.leadId}</p>
                  <p className="text-sm">{conversation.lastMessage}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {conversation.createdAt.toDate().toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>No recent conversations.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Communications Log Section - Kept from original DashboardPage */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Communications Log</h2>
        <CommunicationsLogCard />
      </section>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
         {/* Recent Campaigns - Added from DashboardContent */}
         <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
           <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Campaigns Summary</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Quick overview of your latest SMS campaigns.</p>
           </div>
           <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Sent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400">Replies</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentCampaigns.length > 0 ? (
                    recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{campaign.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(campaign.status)}`}>
                                {campaign.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.sent}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{campaign.replies}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No recent campaigns.</td>
                    </tr>
                  )}
                </tbody>
              </table>
           </div>
         </div>

          {/* Activity Feed - Added from DashboardContent */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Activity Feed</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Latest updates and notifications.</p>
            </div>
            <div className="p-4 space-y-4">
             {activityFeed.length > 0 ? (
                 activityFeed.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="pt-1 flex-shrink-0">
                        <Activity className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                      <div className="flex-1">
                            <p className="text-sm text-gray-900 dark:text-white">{activity.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                        </div>
                    </div>
                 ))
             ) : (
                <p className="text-center text-sm text-gray-500 dark:text-gray-400">No recent activity.</p>
             )}
            </div>
          </div>
       </div>

       {/* Welcome Card - Added from DashboardContent */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to AVA Automate!</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your leads, configure AI agents, launch SMS campaigns, and monitor conversations all from this dashboard. Use the sidebar to navigate between sections.</p>
          {/* Could add quick action buttons here */}
       </div>

       <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
       />
    </div>
  );
};


// Placeholder data
const campaignPerformanceData = {
    labels: ["Campaign A", "Campaign B", "Campaign C", "Campaign D"],
    datasets: [
        { label: 'Sent', data: [150, 200, 100, 250], color: 'bg-blue-500' },
        { label: 'Replies', data: [15, 25, 8, 30], color: 'bg-green-500' },
        { label: 'Failed', data: [5, 10, 2, 12], color: 'bg-red-500' } // Example
    ]
};

const leadConversionData = [
    { stage: 'New', count: 50, icon: Users, color: 'text-blue-500' },
    { stage: 'Contacted', count: 120, icon: Activity, color: 'text-yellow-500' },
    { stage: 'Qualified', count: 40, icon: CheckCircle, color: 'text-green-500' },
    { stage: 'Converted', count: 25, icon: CheckCircle, color: 'text-purple-500' }, // Example: Converted use purple
    { stage: 'Not Interested', count: 60, icon: XCircle, color: 'text-red-500' },
];


const assistantPerformanceData = [
    { agentName: 'Solar Sales Agent', replyRate: '15%', conversionRate: '5%', messagesSent: 500 },
    { agentName: 'Roofing Lead Qualifier', replyRate: '12%', conversionRate: '8%', messagesSent: 750 },
    { agentName: 'General Follow-up', replyRate: '8%', conversionRate: '3%', messagesSent: 300 },
];


export function AnalyticsPage() { // Changed to named export
     // TODO: Fetch actual analytics data

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Insights</h1>
            <p className="text-gray-600 dark:text-gray-400">
                Analyze the performance of your SMS campaigns, lead conversions, and AI assistants.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Campaign Performance Card */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <BarChart className="h-5 w-5" /> Campaign Performance Overview
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Compare key metrics across recent campaigns.</p>
                    </div>
                    <div className="p-4">
                         {/* Placeholder for Bar Chart */}
                         <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
                             Campaign Performance Chart (Placeholder)
                             {/* <ChartBar data={campaignPerformanceData} /> */}
                         </div>
                         {/* Legend Example */}
                         <div className="flex justify-center gap-4 mt-4 text-xs">
                             {campaignPerformanceData.datasets.map(dataset => (
                                 <div key={dataset.label} className="flex items-center gap-1">
                                     <span className={`h-2 w-2 rounded-full ${dataset.color}`}></span>
                                     <span className="text-gray-600 dark:text-gray-400">{dataset.label}</span>
                                 </div>
                             ))}
                         </div>
                         {/* TODO: Add filters (date range, specific campaigns) */}
                    </div>
                </div>

                {/* Lead Conversion Funnel Card */}
                 <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            <LineChart className="h-5 w-5" /> Lead Conversion Funnel
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track the progression of leads through different stages.</p>
                    </div>
                    <div className="p-4">
                        {/* Placeholder for Funnel/Pie Chart */}
                         <div className="h-64 w-full bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center text-gray-500 dark:text-gray-400">
                             Lead Conversion Funnel/Chart (Placeholder)
                             {/* <ChartPie data={leadConversionData} /> */}
                         </div>
                          {/* Display summary numbers */}
                          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            {leadConversionData.map((item) => (
                                <div key={item.stage} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                    <div className="flex items-center gap-2">
                                        <item.icon className={`h-4 w-4 ${item.color}`} />
                                        <span className="text-gray-600 dark:text-gray-300">{item.stage}:</span>
                                    </div>
                                    <span className="font-medium text-gray-900 dark:text-white">{item.count}</span>
                                </div>
                            ))}
                          </div>
                    </div>
                </div>
            </div>

            {/* AI Assistant Performance Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <PieChart className="h-5 w-5" /> AI Assistant Performance
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Compare the effectiveness of different AI agents.</p>
                </div>
                <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                         <thead className="bg-gray-50 dark:bg-gray-700">
                             <tr>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Agent Name</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Reply Rate</th>
                                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Conversion Rate</th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Messages Sent</th>
                                 {/* Add more metrics */}
                             </tr>
                         </thead>
                         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {assistantPerformanceData.length > 0 ? assistantPerformanceData.map((agent) => (
                                <tr key={agent.agentName} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{agent.agentName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.replyRate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.conversionRate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.messagesSent}</td>
                                </tr>
                            )) : (
                                <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">No agent performance data available.</td></tr>
                            )}
                         </tbody>
                     </table>
                </div>
            </div>

             {/* Add more sections/cards for other insights if needed */}

        </div>
    );
}

// TODO: Implement actual chart components (find suitable replacements or build simple ones).
// TODO: Fetch and process real data.
// TODO: Add loading states and error handling.
// TODO: Implement filtering options.

export default DashboardPage;
