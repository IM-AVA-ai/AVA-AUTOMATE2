"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, BarChart, LineChart, PieChart, Users, Activity, CheckCircle, XCircle } from 'lucide-react'; // Combined icons
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { collection, query, orderBy, limit, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";
import { db } from "@/firebase/config"; // Assuming your Firebase config is here
import { Icon } from '@iconify/react'; // Assuming Iconify is used for the bell icon

// Define the structure of a message document in Firestore
interface FirestoreMessage {
  id: string;
  lead_id: string;
  content: string;
  created_at: {
    toDate(): Date; // Firestore Timestamps have a toDate() method
  };
  direction: 'inbound' | 'outbound';
  status: 'read' | 'unread'; // Assuming status can be read/unread
}

export const CommunicationsLogCard = () => {
  const [conversationThreads, setConversationThreads] = useState<FirestoreMessage[]>([]); // Use FirestoreMessage type
  const [isLoading, setIsLoading] = useState(true);
  const [newThreadCount, setNewThreadCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // Set up real-time listener for messages
    const messagesCollection = collection(db, 'messages'); // Assuming 'messages' is your collection name
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

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, [toast]); // Added toast to dependency array

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

const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Overview Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Overview</h2>
        <p className="text-gray-600">
          Welcome to your dashboard! Here you can get a quick overview of your
          campaigns, leads, and overall performance.
        </p>
      </section>

      {/* Key Metrics Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Leads Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Total Leads</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* New Leads Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">New Leads</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* Campaigns Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Campaigns</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
          {/* Messages Sent Card */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="font-medium">Messages Sent</h3>
            <p className="text-2xl mt-2">--</p>
          </div>
        </div>
      </section>

      {/* Communications Log Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Communications Log</h2>
        <CommunicationsLogCard />
      </section>
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
