"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Added from DashboardContent
import { MessageCircle, BarChart, LineChart, PieChart, Users, Activity, CheckCircle, XCircle, UserPlus, Rocket, MessagesSquare, Brain } from 'lucide-react'; // Combined icons
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"; // Combined imports
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip, cn } from '@heroui/react'; // Added Chip and cn from @heroui/react
import { useToast } from "@/hooks/use-toast";
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config"; 
import { Icon } from '@iconify/react'; 
import MetricsCard from "@/components/MetricsCard"; // Added from DashboardContent
import { Conversation } from '@/services/conversations'; // Import types from DashboardContent
import { Campaign } from '@/services/campaigns'; 
import { Lead } from '@/services/leads'; 



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
