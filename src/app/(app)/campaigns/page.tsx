'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Play, Pause, BarChart, Trash2, Bot, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// Placeholder types - replace with actual types
interface Campaign {
  id: string;
  name: string;
  agentId: string | null; // Link to AI Agent
  status: 'Draft' | 'Queued' | 'Active' | 'Paused' | 'Completed' | 'Failed';
  totalLeads: number;
  sentCount: number;
  replyCount: number;
  created: string; // Consider Date type
}

interface Agent {
  id: string;
  name: string;
}

interface QueuedLead {
    id: string; // Corresponds to Lead ID
    name: string;
    phone: string;
    status: 'Pending' | 'Sent' | 'Failed';
    campaignId: string;
}

// Placeholder hooks - replace with actual data fetching
const useCampaigns = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [queuedLeads, setQueuedLeads] = useState<QueuedLead[]>([]); // Manage queued leads here
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // Simulate fetching data
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
             setQueuedLeads([ // Example queued leads for a specific campaign
                { id: 'lead-101', name: 'Alice Green', phone: '+15553334444', status: 'Pending', campaignId: '4'},
                { id: 'lead-102', name: 'Charlie Brown', phone: '+15555556666', status: 'Pending', campaignId: '4'},
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Placeholder function to add a lead to the queue for a specific campaign
    const addLeadToQueue = async (leadId: string, campaignId: string) => {
        // TODO: Fetch lead details if necessary, add to Firestore 'queuedLeads' collection for the campaign
        console.log(`Adding lead ${leadId} to campaign ${campaignId} queue (placeholder)`);
        // Find lead details (assuming leads are available or fetched)
        // const lead = findLeadById(leadId); // Placeholder
        const lead = { id: leadId, name: `Lead ${leadId.slice(-3)}`, phone: `+1555${Math.random().toString().slice(2,9)}` }; // Dummy lead
        if (lead) {
            const newQueuedLead: QueuedLead = {
                ...lead,
                status: 'Pending',
                campaignId: campaignId,
            };
             // Check if lead is already queued for this campaign
            if (!queuedLeads.some(ql => ql.id === leadId && ql.campaignId === campaignId)) {
                setQueuedLeads(prev => [...prev, newQueuedLead]);
                 toast({ title: "Lead Added to Queue", description: `${lead.name} added to campaign.` });
            } else {
                 toast({ title: "Lead Already Queued", description: `${lead.name} is already in the queue for this campaign.`, variant: "default" });
            }
        } else {
            toast({ title: "Error Adding Lead", description: `Could not find lead with ID ${leadId}.`, variant: "destructive" });
        }
    };

     // Placeholder function to create a campaign
    const createCampaign = async (name: string): Promise<Campaign> => {
        console.log("Creating campaign (placeholder):", name);
        await new Promise(resolve => setTimeout(resolve, 500));
        const newCampaign: Campaign = {
            id: `camp-${Date.now()}`,
            name: name,
            agentId: null,
            status: 'Draft',
            totalLeads: 0,
            sentCount: 0,
            replyCount: 0,
            created: new Date().toISOString().split('T')[0],
        };
        setCampaigns(prev => [newCampaign, ...prev]);
        return newCampaign;
    };

     // Placeholder function to update campaign details (agent, status)
    const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
        console.log(`Updating campaign ${campaignId} (placeholder):`, updates);
        await new Promise(resolve => setTimeout(resolve, 300));
        setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...updates } : c));
        toast({ title: "Campaign Updated", description: `Campaign details saved.` });
    };

    // Placeholder function to send/start the campaign
    const sendCampaign = async (campaignId: string) => {
        const campaign = campaigns.find(c => c.id === campaignId);
        const leadsInQueue = queuedLeads.filter(ql => ql.campaignId === campaignId && ql.status === 'Pending');

        if (!campaign || leadsInQueue.length === 0 || !campaign.agentId) {
            toast({ title: "Cannot Start Campaign", description: "Ensure leads are queued and an AI agent is selected.", variant: "destructive" });
            return;
        }

        console.log(`Sending campaign ${campaignId} to ${leadsInQueue.length} leads using agent ${campaign.agentId} (placeholder)`);
        // TODO: Implement actual sending logic (e.g., call server action/API)
        // Update campaign status to Active
        updateCampaign(campaignId, { status: 'Active' });
        // Update queued leads status progressively (simulate sending)
        leadsInQueue.forEach((lead, index) => {
            setTimeout(() => {
                 setQueuedLeads(prev => prev.map(ql =>
                    ql.id === lead.id && ql.campaignId === campaignId ? { ...ql, status: 'Sent' } : ql
                 ));
                 // Update campaign sent count
                 setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, sentCount: c.sentCount + 1 } : c));

                 if (index === leadsInQueue.length - 1) {
                    // Mark campaign as completed after sending all
                    updateCampaign(campaignId, { status: 'Completed' });
                    toast({ title: "Campaign Sent", description: `Campaign "${campaign.name}" finished sending.` });
                 }
            }, (index + 1) * 500); // Simulate delay between sends
        });
    };


    return { campaigns, agents, queuedLeads, setQueuedLeads, loading, addLeadToQueue, createCampaign, updateCampaign, sendCampaign };
};


export default function CampaignsPage() {
    const { campaigns, agents, queuedLeads, setQueuedLeads, loading, addLeadToQueue, createCampaign, updateCampaign, sendCampaign } = useCampaigns();
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(campaigns.length > 0 ? campaigns[0].id : null);
    const [selectedQueuedLeads, setSelectedQueuedLeads] = useState<Set<string>>(new Set());
    const [isCreateCampaignOpen, setIsCreateCampaignOpen] = useState(false);
    const [newCampaignName, setNewCampaignName] = useState('');
    const { toast } = useToast();

    useEffect(() => {
        // Select the first campaign by default if list is loaded
        if (!selectedCampaignId && !loading && campaigns.length > 0) {
            setSelectedCampaignId(campaigns[0].id);
        }
    }, [loading, campaigns, selectedCampaignId]);

    const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId);
    const currentQueuedLeads = queuedLeads.filter(ql => ql.campaignId === selectedCampaignId);

    const getStatusBadgeVariant = (status: Campaign['status']): "default" | "secondary" | "destructive" | "outline" => {
        switch (status) {
            case 'Active': return 'default'; // Using primary color
            case 'Paused': return 'secondary';
            case 'Completed': return 'outline'; // Use outline for completed
            case 'Draft':
            case 'Queued': return 'secondary'; // Queued is also secondary/grey
            case 'Failed': return 'destructive';
            default: return 'secondary';
        }
    };

    const handleSelectAllQueued = (checked: boolean | 'indeterminate') => {
        if (checked === true) {
            setSelectedQueuedLeads(new Set(currentQueuedLeads.map(lead => lead.id)));
        } else {
            setSelectedQueuedLeads(new Set());
        }
    };

    const handleSelectQueuedLead = (leadId: string, checked: boolean | 'indeterminate') => {
        setSelectedQueuedLeads(prev => {
            const newSelection = new Set(prev);
            if (checked === true) {
                newSelection.add(leadId);
            } else {
                newSelection.delete(leadId);
            }
            return newSelection;
        });
    };

    const handleRemoveSelectedQueued = () => {
        // TODO: Implement removing selected leads from the queue (update Firestore)
        console.log("Removing selected queued leads:", Array.from(selectedQueuedLeads));
         const leadsToRemove = Array.from(selectedQueuedLeads);
         setQueuedLeads(prev => prev.filter(ql => !(ql.campaignId === selectedCampaignId && leadsToRemove.includes(ql.id))));
         setSelectedQueuedLeads(new Set()); // Clear selection
         toast({ title: "Leads Removed", description: `${leadsToRemove.length} leads removed from the queue.` });
    };

     const handleCreateCampaignSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCampaignName.trim()) {
            toast({ title: "Campaign Name Required", variant: "destructive" });
            return;
        }
        try {
            const newCampaign = await createCampaign(newCampaignName);
            toast({ title: "Campaign Created", description: `"${newCampaign.name}" created successfully.` });
            setNewCampaignName('');
            setIsCreateCampaignOpen(false);
            setSelectedCampaignId(newCampaign.id); // Select the newly created campaign
        } catch (err) {
            toast({ title: "Failed to Create Campaign", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "destructive" });
        }
    };

    const handleAgentChange = (agentId: string) => {
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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">SMS Campaigns</h1>
                 <Dialog open={isCreateCampaignOpen} onOpenChange={setIsCreateCampaignOpen}>
                    <DialogTrigger asChild>
                         <Button disabled={loading}>
                            <Plus className="mr-2 h-4 w-4" /> Create Campaign
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                         <form onSubmit={handleCreateCampaignSubmit}>
                            <DialogHeader>
                            <DialogTitle>Create New Campaign</DialogTitle>
                            <DialogDescription>
                                Enter a name for your new SMS campaign. You can add leads and configure it later.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="campaign-name" className="text-right">
                                Name
                                </Label>
                                <Input
                                id="campaign-name"
                                value={newCampaignName}
                                onChange={(e) => setNewCampaignName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g., Q4 Promotion"
                                required
                                />
                            </div>
                            </div>
                            <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Create</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Campaign Selection Dropdown */}
             <Card>
                 <CardHeader>
                     <CardTitle>Select Campaign</CardTitle>
                     <CardDescription>Choose a campaign to manage its queue and settings.</CardDescription>
                 </CardHeader>
                 <CardContent>
                     {loading ? <p>Loading campaigns...</p> : (
                         <Select
                            value={selectedCampaignId || ''}
                            onValueChange={(value) => setSelectedCampaignId(value)}
                            disabled={campaigns.length === 0}
                        >
                            <SelectTrigger className="w-full md:w-[300px]">
                                <SelectValue placeholder="Select a campaign" />
                            </SelectTrigger>
                            <SelectContent>
                                {campaigns.map((campaign) => (
                                    <SelectItem key={campaign.id} value={campaign.id}>
                                        {campaign.name} (<Badge variant={getStatusBadgeVariant(campaign.status)} className="ml-1">{campaign.status}</Badge>)
                                    </SelectItem>
                                ))}
                                {campaigns.length === 0 && <SelectItem value="" disabled>No campaigns available</SelectItem>}
                            </SelectContent>
                        </Select>
                     )}
                 </CardContent>
             </Card>


            {selectedCampaign && (
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                           <div>
                             <CardTitle className="flex items-center gap-2">
                                {selectedCampaign.name}
                                <Badge variant={getStatusBadgeVariant(selectedCampaign.status)}>{selectedCampaign.status}</Badge>
                             </CardTitle>
                            <CardDescription>Manage leads queued for this campaign and initiate sending.</CardDescription>
                           </div>
                            <div className="flex items-center gap-2 flex-wrap">
                               {/* Action buttons based on status */}
                               {selectedCampaign.status === 'Active' && <Button variant="outline" size="sm" onClick={() => updateCampaign(selectedCampaign.id, { status: 'Paused'})} disabled={loading}><Pause className="mr-2 h-4 w-4" />Pause</Button>}
                               {(selectedCampaign.status === 'Paused' || selectedCampaign.status === 'Draft') && <Button variant="outline" size="sm" onClick={() => updateCampaign(selectedCampaign.id, { status: 'Active'})} disabled={loading || !selectedCampaign.agentId || currentQueuedLeads.length === 0}><Play className="mr-2 h-4 w-4" />Resume/Start</Button>}
                                <Button variant="outline" size="sm" disabled><BarChart className="mr-2 h-4 w-4" />View Stats</Button>
                                <Button variant="destructive" size="sm" disabled><Trash2 className="mr-2 h-4 w-4" />Delete Campaign</Button>
                           </div>
                        </div>

                    </CardHeader>
                    <CardContent className="space-y-6">
                         {/* Agent Selection and Send Button */}
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border rounded-lg bg-muted/50">
                             <div className="flex items-center gap-3">
                                 <Bot className="h-5 w-5 text-muted-foreground" />
                                <Select
                                    value={selectedCampaign.agentId || ''}
                                    onValueChange={handleAgentChange}
                                    disabled={loading || selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                >
                                    <SelectTrigger className="w-full sm:w-[250px]">
                                        <SelectValue placeholder="Select AI Assistant" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {agents.map((agent) => (
                                            <SelectItem key={agent.id} value={agent.id}>
                                                {agent.name}
                                            </SelectItem>
                                        ))}
                                         <SelectItem value="" disabled={agents.length > 0}>No agent selected</SelectItem>
                                         {agents.length === 0 && <SelectItem value="" disabled>No agents available</SelectItem>}
                                    </SelectContent>
                                </Select>
                             </div>
                             <Button
                                onClick={handleSendCampaign}
                                disabled={loading || currentQueuedLeads.filter(l=>l.status === 'Pending').length === 0 || !selectedCampaign.agentId || selectedCampaign.status === 'Active' || selectedCampaign.status === 'Completed'}
                                >
                                 <Send className="mr-2 h-4 w-4" />
                                 Send to Queued Leads ({currentQueuedLeads.filter(l=>l.status === 'Pending').length})
                             </Button>
                         </div>

                        {/* Queued Leads Table */}
                        <div>
                             <div className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">Queued Leads ({currentQueuedLeads.length})</h3>
                                {selectedQueuedLeads.size > 0 && (
                                    <Button variant="destructive" size="sm" onClick={handleRemoveSelectedQueued} disabled={loading || selectedCampaign.status === 'Active'}>
                                        <Trash2 className="mr-2 h-4 w-4" /> Remove Selected ({selectedQueuedLeads.size})
                                    </Button>
                                )}
                             </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                         <TableHead padding="checkbox" className="w-[50px]">
                                            <Checkbox
                                                checked={isQueueAllSelected ? true : isQueueIndeterminate ? 'indeterminate' : false}
                                                onCheckedChange={handleSelectAllQueued}
                                                aria-label="Select all queued leads"
                                                disabled={loading || currentQueuedLeads.length === 0 || selectedCampaign.status === 'Active'}
                                            />
                                        </TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Phone Number</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {loading ? (
                                         <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading queue...</TableCell></TableRow>
                                    ) : currentQueuedLeads.length > 0 ? (
                                        currentQueuedLeads.map((lead) => (
                                            <TableRow key={lead.id} data-state={selectedQueuedLeads.has(lead.id) ? 'selected' : ''}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={selectedQueuedLeads.has(lead.id)}
                                                        onCheckedChange={(checked) => handleSelectQueuedLead(lead.id, checked)}
                                                        aria-label={`Select queued lead ${lead.name}`}
                                                         disabled={loading || selectedCampaign.status === 'Active'}
                                                    />
                                                </TableCell>
                                                <TableCell>{lead.name}</TableCell>
                                                <TableCell>{lead.phone}</TableCell>
                                                <TableCell>
                                                    <Badge variant={lead.status === 'Sent' ? 'outline' : lead.status === 'Failed' ? 'destructive' : 'secondary'}>
                                                        {lead.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center">
                                                No leads queued for this campaign. Add leads from the Leads page.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!selectedCampaign && !loading && (
                <Card>
                    <CardContent className="pt-6">
                        <p className="text-center text-muted-foreground">
                           {campaigns.length > 0 ? 'Select a campaign above to manage it.' : 'No campaigns found. Create a campaign to get started.'}
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// TODO: Implement Firestore listeners for real-time updates on campaigns and queued leads.
// TODO: Implement actual sending logic via Twilio (likely through a server action/API).
// TODO: Implement campaign deletion and statistics view.
// TODO: Consider pagination for campaigns and queued leads if lists become long.
// TODO: Connect 'Add to Campaign' from Leads page to `addLeadToQueue` function here.
