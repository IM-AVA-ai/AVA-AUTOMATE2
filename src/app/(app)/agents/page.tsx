'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Trash2, Edit, Settings } from "lucide-react";
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
import { Textarea } from '@/components/ui/textarea'; // Assuming Textarea component exists
import { useToast } from '@/hooks/use-toast';
import { customizeAgent, CustomizeAgentInput } from '@/ai/flows/agent-customization'; // Import Genkit flow

// Placeholder Agent type - replace with actual type from Firestore
interface Agent {
  id: string;
  name: string;
  industry: string;
  created: string; // Consider Date type
  prompt?: string; // Store the generated prompt
}

// Placeholder hook for fetching/managing agents
const useAgents = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        // TODO: Fetch agents from Firestore
        console.log("Fetching agents (placeholder)...");
        setTimeout(() => {
            setAgents([
                { id: '1', name: 'Solar Sales Agent', industry: 'Solar Energy', created: '2024-07-28', prompt: 'You are a helpful assistant specializing in solar energy sales...' },
                { id: '2', name: 'Roofing Lead Qualifier', industry: 'Roofing', created: '2024-07-27', prompt: 'You qualify leads interested in roofing services...' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    // Placeholder function to create an agent
    const createAgent = async (agentData: Omit<Agent, 'id' | 'created' | 'prompt'> & CustomizeAgentInput): Promise<Agent> => {
        console.log("Creating agent (placeholder):", agentData);
        setLoading(true);
        try {
            // 1. Call the Genkit flow to generate the prompt
            const customizationInput: CustomizeAgentInput = {
                industry: agentData.industry,
                sampleConversationStarters: agentData.sampleConversationStarters,
                industrySpecificKeywords: agentData.industrySpecificKeywords,
            };
            const customizationOutput = await customizeAgent(customizationInput);

            // 2. Create the agent object with the generated prompt
            const newAgent: Agent = {
                id: `agent-${Date.now()}`,
                name: agentData.name,
                industry: agentData.industry,
                created: new Date().toISOString().split('T')[0],
                prompt: customizationOutput.customizedAssistantPrompt,
            };

             // TODO: Save the newAgent object to Firestore
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate save delay

            setAgents(prev => [newAgent, ...prev]);
            toast({ title: "Agent Created", description: `Agent "${newAgent.name}" created successfully.` });
            setLoading(false);
            return newAgent;
        } catch (error) {
            console.error("Failed to create agent:", error);
            toast({ title: "Agent Creation Failed", description: error instanceof Error ? error.message : "Could not generate prompt or save agent.", variant: "destructive" });
            setLoading(false);
            throw error; // Re-throw error to handle in the component
        }
    };

    // Placeholder function to delete an agent
    const deleteAgent = async (agentId: string) => {
        console.log(`Deleting agent ${agentId} (placeholder)...`);
        // TODO: Delete agent from Firestore
        await new Promise(resolve => setTimeout(resolve, 500));
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
        toast({ title: "Agent Deleted", variant: "destructive" });
    }

    return { agents, loading, createAgent, deleteAgent };
};

export default function AgentsPage() {
    const { agents, loading, createAgent, deleteAgent } = useAgents();
    const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentIndustry, setNewAgentIndustry] = useState('');
    const [sampleStarters, setSampleStarters] = useState('');
    const [keywords, setKeywords] = useState('');
    const { toast } = useToast();

    const handleCreateAgentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAgentName || !newAgentIndustry) {
            toast({ title: "Missing Information", description: "Please provide agent name and industry.", variant: "destructive" });
            return;
        }
        try {
            await createAgent({
                name: newAgentName,
                industry: newAgentIndustry,
                sampleConversationStarters: sampleStarters,
                industrySpecificKeywords: keywords,
            });
            // Reset form and close dialog
            setNewAgentName('');
            setNewAgentIndustry('');
            setSampleStarters('');
            setKeywords('');
            setIsCreateAgentOpen(false);
        } catch (error) {
            // Error toast is handled within createAgent hook
            console.error("Submit failed:", error)
        }
    };

     const handleDeleteClick = (agentId: string, agentName: string) => {
        // Optional: Add a confirmation dialog before deleting
         if (window.confirm(`Are you sure you want to delete the agent "${agentName}"? This cannot be undone.`)) {
            deleteAgent(agentId);
        }
     }


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">AI Agents</h1>
                 <Dialog open={isCreateAgentOpen} onOpenChange={setIsCreateAgentOpen}>
                    <DialogTrigger asChild>
                         <Button disabled={loading}>
                            <Plus className="mr-2 h-4 w-4" /> Create Agent
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                        <form onSubmit={handleCreateAgentSubmit}>
                            <DialogHeader>
                                <DialogTitle>Create New AI Agent</DialogTitle>
                                <DialogDescription>
                                    Configure a new AI assistant tailored to a specific industry and purpose.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="agent-name">Agent Name</Label>
                                    <Input
                                        id="agent-name"
                                        value={newAgentName}
                                        onChange={(e) => setNewAgentName(e.target.value)}
                                        placeholder="e.g., Solar Sales Qualifier"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agent-industry">Industry</Label>
                                    <Input
                                        id="agent-industry"
                                        value={newAgentIndustry}
                                        onChange={(e) => setNewAgentIndustry(e.target.value)}
                                        placeholder="e.g., Solar Energy, Roofing, HVAC"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="agent-starters">Sample Conversation Starters (Optional)</Label>
                                    <Textarea
                                        id="agent-starters"
                                        value={sampleStarters}
                                        onChange={(e) => setSampleStarters(e.target.value)}
                                        placeholder="e.g., 'Hi [Name], interested in solar panels?'"
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">Provide examples to guide the AI's opening messages.</p>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor="agent-keywords">Industry Keywords (Optional)</Label>
                                    <Textarea
                                        id="agent-keywords"
                                        value={keywords}
                                        onChange={(e) => setKeywords(e.target.value)}
                                        placeholder="e.g., ROI, net metering, shingles, quote"
                                        rows={3}
                                    />
                                     <p className="text-xs text-muted-foreground">Help the AI understand industry context.</p>
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit" disabled={loading}>
                                    {loading ? 'Creating...' : 'Create Agent'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Manage AI Agents</CardTitle>
                    <CardDescription>Create, configure, and manage AI assistants for your campaigns.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Industry</TableHead>
                                <TableHead>Date Created</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                 <TableRow><TableCell colSpan={4} className="h-24 text-center">Loading agents...</TableCell></TableRow>
                            ) : agents.length > 0 ? (
                                agents.map((agent) => (
                                    <TableRow key={agent.id}>
                                        <TableCell className="font-medium">{agent.name}</TableCell>
                                        <TableCell>{agent.industry}</TableCell>
                                        <TableCell>{agent.created}</TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" disabled={loading}>...</Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    {/* TODO: Link to a dedicated customization/edit page or modal */}
                                                    <DropdownMenuItem disabled>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit/Customize
                                                    </DropdownMenuItem>
                                                    {/* TODO: Implement Test Agent functionality */}
                                                    <DropdownMenuItem disabled>
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        Test Agent
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleDeleteClick(agent.id, agent.name)}
                                                        disabled={loading}
                                                        >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No AI agents created yet.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}

// TODO: Implement Firestore fetching and saving for agents.
// TODO: Implement Edit/Customize functionality (likely another dialog or page).
// TODO: Implement Test Agent functionality.
// TODO: Add confirmation dialog for delete.
