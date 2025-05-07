'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Play, Pause, BarChart, Trash2, Bot, Send, MoreVertical } from "lucide-react"; // Added MoreVertical
import { addToast } from '@heroui/toast'; // Corrected import path

// Placeholder types
interface Campaign {
    id: string;
    name: string;
    agentId: string | null;
    status: 'Draft' | 'Queued' | 'Active' | 'Paused' | 'Completed' | 'Failed';
    totalLeads: number;
    sentCount: number;
    replyCount: number;
    created: string;
}

interface Agent {
    id: string;
    name: string;
}

interface QueuedLead {
    id: string;
    name: string;
    phone: string;
    status: 'Pending' | 'Sent' | 'Failed';
    campaignId: string;
}

// Placeholder hooks
const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [queuedLeads, setQueuedLeads] = useState<QueuedLead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setCampaigns([
                { id: '1', name: 'Summer Solar Promo', agentId: '1', status: 'Active', totalLeads: 150, sentCount: 120, replyCount: 15, created: '2024-07-28' },
                { id: '2', name: 'Roof Inspection Offer', agentId: '2', status: 'Paused', totalLeads: 200, sentCount: 180, replyCount: 25, created: '2024-07-25' },
                { id: '3', name: 'Q3 Follow-up', agentId: null, status: 'Completed', totalLeads: 100, sentCount: 100, replyCount: 8, created: '2024-07-20' },
                { id: '4', name: 'New Year Discount', agentId: null, status: 'Draft', totalLeads: 0, sentCount: 0, replyCount: 0, created: '2024-08-01' },
            ]);
            setAgents([
                { id: '1', name: 'Solar Sales Agent' },
                { id: '2', name: 'Roofing Lead Qualifier' },
                { id: '3', name: 'General Follow-up Agent' },
            ]);
            setQueuedLeads([
                { id: 'lead-101', name: 'Alice Green', phone: '+15553334444', status: 'Pending', campaignId: '4' },
                { id: 'lead-102', name: 'Charlie Brown', phone: '+15555556666', status: 'Pending', campaignId: '4' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const addLeadToQueue = async (leadId: string, campaignId: string) => {
        console.log(`Adding lead ${leadId} to campaign ${campaignId} queue (placeholder)`);
        const lead = { id: leadId, name: `Lead ${leadId.slice(-3)}`, phone: `+1555${Math.random().toString().slice(2, 9)}` };
        if (lead) {
            const newQueuedLead: QueuedLead = { ...lead, status: 'Pending', campaignId: campaignId };
            if (!queuedLeads.some(ql => ql.id === leadId && ql.campaignId === campaignId)) {
                setQueuedLeads(prev => [...prev, newQueuedLead]);
                addToast({ title: "Lead Added to Queue", description: `${lead.name} added to campaign.` });
            } else {
                addToast({ title: "Lead Already Queued", description: `${lead.name} is already in the queue for this campaign.`, variant: "default" });
            }
        } else {
            addToast({ title: "Error Adding Lead", description: `Could not find lead with ID ${leadId}.`, variant: "destructive" });
        }
    };

    const createCampaign = async (name: string): Promise<Campaign> => {
        console.log("Creating campaign (placeholder):", name);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newCampaign: Campaign = {
            id: `camp-${Date.now()}`, name: name, agentId: null, status: 'Draft',
            totalLeads: 0, sentCount: 0, replyCount: 0, created: new Date().toISOString().split('T')[0],
        };
        setCampaigns(prev => [newCampaign, ...prev]);
        return newCampaign;
    };

    const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
        console.log(`Updating campaign ${campaignId} (placeholder):`, updates);
        await new Promise(resolve => setTimeout(resolve, 300));
        setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...updates } : c));
        addToast({ title: "Campaign Updated", description: `Campaign details saved.` });
    };

    const sendCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        const leadsInQueue = queuedLeads.filter(ql => ql.campaignId === campaignId && ql.status === 'Pending');

        if (!campaign || leadsInQueue.length === 0 || !campaign.agentId) {
            addToast({ title: "Cannot Start Campaign", description: "Ensure leads are queued and an AI agent is selected.", variant: "destructive" });
            return;
        }
        console.log(`Sending campaign ${campaignId} to ${leadsInQueue.length} leads using agent ${campaign.agentId} (placeholder)`);
        updateCampaign(campaignId, { status: 'Active' });
        leadsInQueue.forEach((lead, index) => {
            setTimeout(() => {
                setQueuedLeads(prev => prev.map(ql =>
                    ql.id === lead.id && ql.campaignId === campaignId ? { ...ql, status: 'Sent' } : ql
                ));
                setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, sentCount: c.sentCount + 1 } : c));
                if (index === leadsInQueue.length - 1) {
                    updateCampaign(campaignId, { status: 'Completed' });
                    addToast({ title: "Campaign Sent", description: `Campaign "${campaign.name}" finished sending.` });
                }
            }, (index + 1) * 500);
        });
    };


    return { campaigns, agents, queuedLeads, setQueuedLeads, loading, addLeadToQueue, createCampaign, updateCampaign, sendCampaign };
};

// Basic Modal Component (HeroUI style)
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">X</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default function CampaignsPage() {
    console.log('CampaignsPage rendering');
    const { campaigns, agents, queuedLeads, setQueuedLeads, loading, addLeadToQueue, createCampaign, updateCampaign, sendCampaign } = useCampaigns();
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [selectedQueuedLeads, setSelectedQueuedLeads] = useState<Set<string>>(new Set());
    const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');

    useEffect(() => {
        console.log('useEffect in CampaignsPage running');
        if (!selectedCampaignId && !loading && campaigns.length > 0) {
            console.log('Setting selectedCampaignId to:', campaigns[0].id);
            setSelectedCampaignId(campaigns[0].id);
        }
        console.log('loading:', loading, 'campaigns:', campaigns);
    }, [loading, campaigns, selectedCampaignId]);

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    console.log('selectedCampaign:', selectedCampaign);
    const currentQueuedLeads = queuedLeads.filter(ql => ql.campaignId === selectedCampaignId);

    // Helper for badge variant styles (Tailwind based)
    const getStatusBadgeClasses = (status: Campaign['status']): string => {
        switch (status) {
            case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'Paused': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
            case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Queued': return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200';
            case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    const getLeadStatusBadgeClasses = (status: QueuedLead['status']): string => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'Sent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'Failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };


    const handleSelectAllQueued = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        if (isChecked) {
            setSelectedQueuedLeads(new Set(currentQueuedLeads.map(lead => lead.id)));
        } else {
            setSelectedQueuedLeads(new Set());
        }
    };

    const handleSelectQueuedLead = (leadId: string, event: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        setSelectedQueuedLeads(prev => {
            const newSelection = new Set(prev);
            if (isChecked) newSelection.add(leadId);
            else newSelection.delete(leadId);
            return newSelection;
        });
    };

    const handleRemoveSelectedQueued = () => {
        console.log("Removing selected queued leads:", Array.from(selectedQueuedLeads));
        const leadsToRemove = Array.from(selectedQueuedLeads);
        setQueuedLeads(prev => prev.filter(ql => !(ql.campaignId === selectedCampaignId && leadsToRemove.includes(ql.id))));
        setSelectedQueuedLeads(new Set());
        addToast({ title: "Leads Removed", description: `${leadsToRemove.length} leads removed from the queue.` });
    };

    const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCampaignName.trim()) {
            addToast({ title: "Campaign Name Required", variant: "destructive" });
            return;
        }
        try {
            const newCampaign = await createCampaign(newCampaignName);
            addToast({ title: "Campaign Created", description: `"${newCampaign.name}" created successfully.` });
            setNewCampaignName('');
            setIsCreateCampaignOpen(false);
            setSelectedCampaignId(newCampaign.id);
        } catch (err) {
            addToast({ title: "Failed to Create Campaign", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "destructive" });
        }
    };

    const handleAgentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const agentId = event.target.value || null; // Handle empty string for 'No agent'
        if (selectedCampaignId) {
            updateCampaign(selectedCampaignId, { agentId });
        }
    };

    const handleSendCampaign = () => {
        if (selectedCampaignId) {
            sendCampaign(selectedCampaignId);
        }
    }

    const isQueueAllSelected = currentQueuedLeads.length > 0 && selectedQueuedLeads.size === currentQueuedLeads.length;
    const isQueueIndeterminate = selectedQueuedLeads.size > 0 && selectedQueuedLeads.size < currentQueuedLeads.length;


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">SMS Campaigns</h1>
                <button
                    onClick={() => setIsCreateCampaignOpen(true)}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    <Plus className="mr-2 h-4 w-4" /> Create Campaign
                </button>
            </div>

            {/* Create Campaign Modal */}
            <Modal isOpen={isCreateCampaignOpen} onClose={() => setIsCreateCampaignOpen(false)} title="Create New Campaign">
                <form onSubmit={handleCreateCampaignSubmit} className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enter a name for your new SMS campaign. You can add leads and configure it later.
                    </p>
                    <div>
                        <label htmlFor="campaign-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                            id="campaign-name"
                            type="text"
                            value={newCampaignName}
                            onChange={(e) => setNewCampaignName(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            placeholder="e.g., Q4 Promotion"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={() => setIsCreateCampaignOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Create
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Campaign Selection Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Select Campaign</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Choose a campaign to manage its queue and settings.</p>
                {loading ? <p className="text-gray-500 dark:text-gray-400">Loading campaigns...</p> : (
                    <select
                        value={selectedCampaignId || ''}
                        onChange={(e) => setSelectedCampaignId(e.target.value)}
                        disabled={campaigns.length === 0}
                        className="block w-full md:w-80 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-700"
                    >
                        <option value="" disabled={selectedCampaignId !== null}>Select a campaign</option>
                        {campaigns.map((campaign) => (
                            <option key={campaign.id} value={campaign.id}>
                                {campaign.name} ({campaign.status})
                            </option>
                        ))}
                        {campaigns.length === 0 && <option value="" disabled>No campaigns available</option>}
                    </select>
                )}
            </div>


            {/* Selected Campaign Details Card */}
            {selectedCampaign && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                    {selectedCampaign.name}
                                    <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(selectedCampaign.status)}`}>
                                        {selectedCampaign.status}
                                    </span>
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage leads queued for this campaign and initiate sending.</p>
                            </div>
                            {/* Action buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {selectedCampaign.status === 'Active' && <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50" onClick={() => updateCampaign(selectedCampaign.id, { status: 'Paused' })} disabled={loading}><Pause className="mr-1 h-4 w-4" />Pause</button>}
                                {(selectedCampaign.status === 'Paused' || selectedCampaign.status === 'Draft') && <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50" onClick={() => updateCampaign(selectedCampaign.id, { status: 'Active' })} disabled={loading || !selectedCampaign.agentId || currentQueuedLeads.length === 0}><Play className="mr-1 h-4 w-4" />Resume/Start</button>}
                                <button className="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50" disabled><BarChart className="mr-1 h-4 w-4" />View Stats</button>
                                <button className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 disabled:opacity-50" disabled><Trash2 className="mr-1 h-4 w-4" />Delete Campaign</button>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="p-4 space-y-6">
                        {/* Agent Selection and Send Button Area */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <Bot className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                <select
                                    value={selectedCampaign.agentId || ''}
                                    onChange={handleAgentChange}
                                    disabled={loading || selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                    className="block w-full sm:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900 dark:text-white disabled:bg-gray-100 dark:disabled:bg-gray-600"
                                >
                                    <option value="">Select AI Assistant</option>
                                    {agents.map((agent) => (
                                        <option key={agent.id} value={agent.id}>
                                            {agent.name}
                                        </option>
                                    ))}
                                    {agents.length === 0 && <option value="" disabled>No agents available</option>}
                                </select>
                            </div>
                            <button
                                onClick={handleSendCampaign}
                                disabled={loading || currentQueuedLeads.filter(l => l.status === 'Pending').length === 0 || !selectedCampaign.agentId || selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <Send className="mr-2 h-4 w-4" />
                                Send to Queued Leads ({currentQueuedLeads.filter(l => l.status === 'Pending').length})
                            </button>
                        </div>

                        {/* Queued Leads Table */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Queued Leads ({currentQueuedLeads.length})</h3>
                                {selectedQueuedLeads.size > 0 && (
                                    <button
                                        onClick={handleRemoveSelectedQueued}
                                        disabled={loading || selectedCampaign.status === 'Active'}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 disabled:opacity-50"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove Selected ({selectedQueuedLeads.size})
                                    </button>
                                )}
                            </div>
                            <div className="overflow-x-auto border dark:border-gray-700 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-4 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                    checked={!loading && isQueueAllSelected}
                                                    ref={input => { // Handle indeterminate state
                                                        if (input) input.indeterminate = !loading && isQueueIndeterminate;
                                                    }}
                                                    onChange={handleSelectAllQueued}
                                                    aria-label="Select all queued leads"
                                                    disabled={loading || currentQueuedLeads.length === 0 || selectedCampaign.status === 'Active'}
                                                />
                                            </th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone Number</th>
                                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {loading ? (
                                            <tr><td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading queue...</td></tr>
                                        ) : currentQueuedLeads.length > 0 ? (
                                            currentQueuedLeads.map((lead) => (
                                                <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedQueuedLeads.has(lead.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                                                    <td className="px-4 py-4">
                                                        <input
                                                            type="checkbox"
                                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                                                            checked={selectedQueuedLeads.has(lead.id)}
                                                            onChange={(e) => handleSelectQueuedLead(lead.id, e)}
                                                            aria-label={`Select queued lead ${lead.name}`}
                                                            disabled={loading || selectedCampaign.status === 'Active'}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{lead.name}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.phone}</td>
                                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLeadStatusBadgeClasses(lead.status)}`}>
                                                            {lead.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No leads queued for this campaign. Add leads from the Leads page.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!selectedCampaign && !loading && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <p className="text-center text-gray-500 dark:text-gray-400">
                        {campaigns.length > 0 ? 'Select a campaign above to manage it.' : 'No campaigns found. Create a campaign to get started.'}
                    </p>
                </div>
            )}
        </div>
    );
}
