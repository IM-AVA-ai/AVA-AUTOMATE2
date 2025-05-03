"use client";

import { Conversation, getRecentConversations } from '@/services/conversations';
import Link from 'next/link';
import { Button, Card, CardHeader, Chip } from '@heroui/react';
import { currentUser } from '@clerk/nextjs/server';
import { getCampaigns } from '@/services/campaigns';

import {  getLeads } from '@/services/leads';
import { Activity, UserPlus, Rocket, MessagesSquare, Brain } from "lucide-react";



import { Icon } from "@iconify/react";
import MetricsCard from "@/components/MetricsCard";

// Helper for badge variant styles (Tailwind based)
const getStatusBadgeClasses = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Changed outline to green
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // Default to yellow for draft/other
    }
  };


export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) return null;
  const userId = user.id
  const recentConversations: Conversation[] = await getRecentConversations(userId);
  
  const campaigns = await getCampaigns(userId);
  
  const leads = await getLeads(userId);

  const recentCampaigns = campaigns.map(campaign => ({
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    sent: 0, // Placeholder - replace with actual data
    replies: 0, // Placeholder - replace with actual data
  }));

  const activityFeed = [
      { id: 'a2', type: 'campaign', text: 'Campaign "Summer Solar Promo" started.', time: '1h ago' },
      { id: 'a3', type: 'message', text: 'New reply received from John Doe.', time: '3h ago' },
      { id: 'a4', type: 'agent', text: 'Agent "Roofing Lead Qualifier" created.', time: '1d ago' },
  ];


  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Add Lead */}
        <Card className="dark">
          <CardHeader>
            <Link href="/leads/create"><Button><UserPlus className="mr-2 h-4 w-4" /> Add Lead</Button></Link>
          </CardHeader>
        </Card>
        {/* Start Campaign */}
        <Card className="dark">
        <CardHeader>
            <Link href="/campaigns/create"><Button><Rocket className="mr-2 h-4 w-4" /> Start Campaign</Button></Link>
          </CardHeader>
        </Card>
        {/* View Conversations */}
        <Card className="dark">
        <CardHeader>
            <Link href="/conversations"><Button><MessagesSquare className="mr-2 h-4 w-4" /> View Conversations</Button></Link>
          </CardHeader>
        </Card>
        {/* Create Agent */}
        <Card className="dark">
        <CardHeader>
            <Link href="/agents/create"><Button><Brain className="mr-2 h-4 w-4" /> Create Agent</Button></Link>
          </CardHeader>
        </Card>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      {/* Recent Conversations */}
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
      
      {/* Stats Cards */}
        <MetricsCard leads={leads} campaigns={campaigns}/>

       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
         {/* Recent Campaigns */}
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Replies</th>
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

          {/* Activity Feed */}
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

       {/* Welcome Card */}
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Welcome to AVA Automate!</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your leads, configure AI agents, launch SMS campaigns, and monitor conversations all from this dashboard. Use the sidebar to navigate between sections.</p>
          {/* Could add quick action buttons here */}
       </div>
    </div>
  );
}