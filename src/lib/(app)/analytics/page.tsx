'use client';

import React from 'react';
import { BarChart, LineChart, PieChart, Users, Activity, CheckCircle, XCircle } from 'lucide-react'; // Added more relevant icons

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


export default function AnalyticsPage() {
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
