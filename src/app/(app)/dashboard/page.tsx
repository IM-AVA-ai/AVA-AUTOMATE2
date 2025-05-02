'use client'; // Still needed for client-side interactions and hooks if used later

import { Activity, BarChartHorizontal, Bot, MessageSquare, Users } from "lucide-react";

// Helper for badge variant styles (Tailwind based)
const getStatusBadgeClasses = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'; // Changed outline to green
      default: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'; // Default to yellow for draft/other
    }
  };


export default function DashboardPage() {
  // Placeholder data - replace with actual data fetching
  const recentCampaigns = [
    { id: '1', name: 'Summer Solar Promo', status: 'Active', sent: 120, replies: 15 },
    { id: '2', name: 'Roof Inspection Offer', status: 'Paused', sent: 180, replies: 25 },
    { id: '3', name: 'Q3 Follow-up', status: 'Completed', sent: 100, replies: 8 },
  ];

  const activityFeed = [
      { id: 'a1', type: 'lead', text: 'New lead "Alice Green" added.', time: '2m ago' },
      { id: 'a2', type: 'campaign', text: 'Campaign "Summer Solar Promo" started.', time: '1h ago' },
      { id: 'a3', type: 'message', text: 'New reply received from John Doe.', time: '3h ago' },
      { id: 'a4', type: 'agent', text: 'Agent "Roofing Lead Qualifier" created.', time: '1d ago' },
  ];


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
            { title: 'Active Campaigns', value: '1', change: '+1 since last week', icon: Bot },
            { title: 'Total Leads', value: '205', change: '+10 this month', icon: Users },
            { title: 'Messages Sent (Today)', value: '85', change: 'Updated 5 mins ago', icon: MessageSquare },
            { title: 'Reply Rate (Overall)', value: '12%', change: 'Based on all campaigns', icon: BarChartHorizontal },
        ].map((stat, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h3>
                <stat.icon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.change}</p>
            </div>
        ))}
      </div>

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
