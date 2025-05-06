'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Settings, MoreVertical } from "lucide-react"; // Added MoreVertical
import { useToast } from '@heroui/toast';
import { customizeAgent, CustomizeAgentInput } from '@/ai/flows/agent-customization';

// Placeholder Agent type
interface Agent {
  id: string;
  name: string;
  industry: string;
  created: string;
  prompt?: string;
}

// Placeholder hook
const useAgents = () => {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        console.log("Fetching agents (placeholder)...");
        setTimeout(() => {
            setAgents([
                { id: '1', name: 'Solar Sales Agent', industry: 'Solar Energy', created: '2024-07-28', prompt: 'You are a helpful assistant specializing in solar energy sales...' },
                { id: '2', name: 'Roofing Lead Qualifier', industry: 'Roofing', created: '2024-07-27', prompt: 'You qualify leads interested in roofing services...' },
            ]);
            setLoading(false);
        }, 1000);
    }, []);

    const createAgent = async (agentData: Omit<Agent, 'id' | 'created' | 'prompt'> & CustomizeAgentInput): Promise<Agent> => {
        console.log("Creating agent (placeholder):", agentData);
        setLoading(true);
        try {
            const customizationInput: CustomizeAgentInput = {
                industry: agentData.industry,
                sampleConversationStarters: agentData.sampleConversationStarters,
                industrySpecificKeywords: agentData.industrySpecificKeywords,
            };
            const customizationOutput = await customizeAgent(customizationInput);

            const newAgent: Agent = {
                id: `agent-${Date.now()}`,
                name: agentData.name,
                industry: agentData.industry,
                created: new Date().toISOString().split('T')[0],
                prompt: customizationOutput.customizedAssistantPrompt,
            };

            // TODO: Save the newAgent object to Firestore
            await new Promise(resolve => setTimeout(resolve, 500));

            setAgents(prev => [newAgent, ...prev]);
            toast({ title: "Agent Created", description: `Agent "${newAgent.name}" created successfully.` });
            setLoading(false);
            return newAgent;
        } catch (error) {
            console.error("Failed to create agent:", error);
            toast({ title: "Agent Creation Failed", description: error instanceof Error ? error.message : "Could not generate prompt or save agent.", variant: "destructive" });
            setLoading(false);
            throw error;
        }
    };

    const deleteAgent = async (agentId: string) => {
        console.log(`Deleting agent ${agentId} (placeholder)...`);
        // TODO: Delete agent from Firestore
        await new Promise(resolve => setTimeout(resolve, 500));
        setAgents(prev => prev.filter(agent => agent.id !== agentId));
        toast({ title: "Agent Deleted", variant: "destructive" });
    }

    return { agents, loading, createAgent, deleteAgent };
};

// Basic Modal Component (HeroUI style) - Reusable
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity duration-300" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-95 opacity-0 animate-modal-in" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                {children}
            </div>
             {/* Add simple keyframes for animation */}
            <style>{`
                @keyframes modal-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-modal-in {
                    animation: modal-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};


export default function AgentsPage() {
    const { agents, loading, createAgent, deleteAgent } = useAgents();
    const [isCreateAgentOpen, setIsCreateAgentOpen] = useState(false);
    const [newAgentName, setNewAgentName] = useState('');
    const [newAgentIndustry, setNewAgentIndustry] = useState('');
    const [sampleStarters, setSampleStarters] = useState('');
    const [keywords, setKeywords] = useState('');
    const { toast } = useToast();
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // For individual row actions


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
            setNewAgentName('');
            setNewAgentIndustry('');
            setSampleStarters('');
            setKeywords('');
            setIsCreateAgentOpen(false);
        } catch (error) {
            console.error("Submit failed:", error)
        }
    };

     const handleDeleteClick = (agentId: string, agentName: string) => {
         if (window.confirm(`Are you sure you want to delete the agent "${agentName}"? This cannot be undone.`)) {
            deleteAgent(agentId);
        }
     }


    return (
        <div className="space-y-6">
             {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Agents</h1>
                 <button
                    onClick={() => setIsCreateAgentOpen(true)}
                    disabled={loading}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Create Agent
                </button>
            </div>

             {/* Create Agent Modal */}
             <Modal isOpen={isCreateAgentOpen} onClose={() => setIsCreateAgentOpen(false)} title="Create New AI Agent">
                 <form onSubmit={handleCreateAgentSubmit} className="space-y-4">
                     <p className="text-sm text-gray-600 dark:text-gray-400">
                         Configure a new AI assistant tailored to a specific industry and purpose.
                     </p>
                     <div>
                         <label htmlFor="agent-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Agent Name</label>
                         <input
                             id="agent-name"
                             type="text"
                             value={newAgentName}
                             onChange={(e) => setNewAgentName(e.target.value)}
                             className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                             placeholder="e.g., Solar Sales Qualifier"
                             required
                         />
                     </div>
                     <div>
                         <label htmlFor="agent-industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry</label>
                         <input
                             id="agent-industry"
                             type="text"
                             value={newAgentIndustry}
                             onChange={(e) => setNewAgentIndustry(e.target.value)}
                             className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                             placeholder="e.g., Solar Energy, Roofing, HVAC"
                             required
                         />
                     </div>
                     <div>
                         <label htmlFor="agent-starters" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sample Conversation Starters (Optional)</label>
                         <textarea
                             id="agent-starters"
                             value={sampleStarters}
                             onChange={(e) => setSampleStarters(e.target.value)}
                             className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                             placeholder="e.g., 'Hi [Name], interested in solar panels?'"
                             rows={3}
                         />
                         <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Provide examples to guide the AI's opening messages.</p>
                     </div>
                      <div>
                         <label htmlFor="agent-keywords" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Industry Keywords (Optional)</label>
                         <textarea
                             id="agent-keywords"
                             value={keywords}
                             onChange={(e) => setKeywords(e.target.value)}
                             className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                             placeholder="e.g., ROI, net metering, shingles, quote"
                             rows={3}
                         />
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Help the AI understand industry context.</p>
                     </div>
                     <div className="flex justify-end space-x-3 pt-2">
                         <button type="button" onClick={() => setIsCreateAgentOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                             Cancel
                         </button>
                         <button type="submit" disabled={loading} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50">
                             {loading ? 'Creating...' : 'Create Agent'}
                         </button>
                     </div>
                 </form>
            </Modal>


            {/* Agent List Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                 <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage AI Agents</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Create, configure, and manage AI assistants for your campaigns.</p>
                </div>

                {/* Agent Table */}
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Industry</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Created</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                 <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">Loading agents...</td></tr>
                            ) : agents.length > 0 ? (
                                agents.map((agent) => (
                                    <tr key={agent.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{agent.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.industry}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{agent.created}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                                            {/* Basic Dropdown (HeroUI style) */}
                                            <button
                                                onClick={() => setOpenDropdownId(openDropdownId === agent.id ? null : agent.id)}
                                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none disabled:opacity-50"
                                                aria-haspopup="true"
                                                aria-expanded={openDropdownId === agent.id}
                                                disabled={loading}
                                            >
                                                <MoreVertical className="h-5 w-5" />
                                            </button>
                                            {openDropdownId === agent.id && (
                                                <div
                                                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                                                    role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}
                                                    onBlur={() => setTimeout(() => setOpenDropdownId(null), 100)} // Close on blur with delay
                                                >
                                                    <div className="py-1" role="none">
                                                        <button className="text-gray-700 dark:text-gray-200 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50" role="menuitem" tabIndex={-1} disabled>
                                                             <Edit className="mr-2 h-4 w-4 inline-block" /> Edit/Customize
                                                        </button>
                                                        <button className="text-gray-700 dark:text-gray-200 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50" role="menuitem" tabIndex={-1} disabled>
                                                             <Settings className="mr-2 h-4 w-4 inline-block" /> Test Agent
                                                        </button>
                                                        <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                                                        <button
                                                            className="text-red-600 dark:text-red-400 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50"
                                                            role="menuitem"
                                                            tabIndex={-1}
                                                            onClick={() => handleDeleteClick(agent.id, agent.name)}
                                                            disabled={loading}
                                                        >
                                                             <Trash2 className="mr-2 h-4 w-4 inline-block" /> Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">No AI agents created yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// TODO: Implement Firestore fetching and saving for agents.
// TODO: Implement Edit/Customize functionality (likely another modal or page).
// TODO: Implement Test Agent functionality.
