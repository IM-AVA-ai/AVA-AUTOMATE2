'use client';

import React, { useState, useEffect } from 'react';
import { FileUp, Plus, Search, Trash2, Send, MoreVertical } from "lucide-react"; // Added MoreVertical for dropdown trigger
import { addToast } from '@heroui/toast'; // Corrected import path
import LeadImportForm from '@/components/LeadImportForm'; // Import the LeadImportForm component

// Placeholder Lead type
interface Lead {
  id: string;
  name: string;
  phone: string;
  status: string;
  added: string;
}

// Placeholder hook
const useLeads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        setLeads([
          { id: '1', name: 'John Doe', phone: '+15551234567', status: 'New', added: '2024-07-28' },
          { id: '2', name: 'Jane Smith', phone: '+15559876543', status: 'Contacted', added: '2024-07-27' },
          { id: '3', name: 'Bob Johnson', phone: '+15551112233', status: 'Qualified', added: '2024-07-26' },
        ]);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch leads'));
        setLoading(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const addLead = async (newLeadData: Omit<Lead, 'id' | 'added' | 'status'>): Promise<Lead> => {
    console.log("Adding lead (placeholder):", newLeadData);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...newLeadData,
      status: 'New',
      added: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [newLead, ...prev]);
    return newLead;
  };

  return { leads, loading, error, addLead };
};

// Basic Modal Component (HeroUI style)
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
      <style jsx>{`
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


export default function LeadsPage() {
  const { leads, loading, error, addLead } = useLeads();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null); // For individual row actions

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    if (isChecked) {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    } else {
      setSelectedLeads(new Set());
    }
  };

  const handleSelectLead = (leadId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = event.target.checked;
    setSelectedLeads(prev => {
      const newSelection = new Set(prev);
      if (isChecked) {
        newSelection.add(leadId);
      } else {
        newSelection.delete(leadId);
      }
      return newSelection;
    });
  };

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.phone.includes(searchTerm)
  );

  const isAllSelected = filteredLeads.length > 0 && selectedLeads.size === filteredLeads.length;
  const isIndeterminate = selectedLeads.size > 0 && selectedLeads.size < filteredLeads.length;

  const handleAddLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadPhone) {
      addToast({ title: "Missing Information", description: "Please enter both name and phone number.", variant: "solid" });
      return;
    }
    if (!/^\+?[1-9]\d{1,14}$/.test(newLeadPhone)) {
      addToast({ title: "Invalid Phone Number", description: "Please enter a valid phone number (e.g., +15551234567).", variant: "solid" });
      return;
    }

    try {
      await addLead({ name: newLeadName, phone: newLeadPhone });
      addToast({ title: "Lead Added", description: `${newLeadName} has been added successfully.` });
      setNewLeadName('');
      setNewLeadPhone('');
      setIsAddLeadOpen(false);
    } catch (err) {
      addToast({ title: "Failed to Add Lead", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "solid" });
    }
  };

  const handleImportCsv = () => {
    console.log("Import CSV clicked");
    addToast({ title: "Import CSV", description: "CSV import functionality is not yet implemented." });
  };

  const handleBulkDelete = () => {
    console.log("Deleting selected leads:", Array.from(selectedLeads));
    addToast({ title: "Bulk Delete", description: `Delete functionality for ${selectedLeads.size} leads is not yet implemented.`, variant: "solid" });
  };

  const handleBulkAddToCampaign = () => {
    console.log("Adding selected leads to campaign:", Array.from(selectedLeads));
    addToast({ title: "Add to Campaign", description: `Functionality to add ${selectedLeads.size} leads to a campaign is not yet implemented.` });
  };

  // Helper for badge variant styles (Tailwind based)
  const getStatusBadgeClasses = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'new': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'qualified': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedLeads.size > 0 && (
            <>
              {/* HeroUI Style Buttons */}
              <button
                onClick={handleBulkAddToCampaign}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Send className="mr-2 h-4 w-4" /> Add to Campaign ({selectedLeads.size})
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete ({selectedLeads.size})
              </button>
            </>
          )}
          {/* Replace the old Import CSV button with the new component */}
          <LeadImportForm />
          <button
            onClick={() => setIsAddLeadOpen(true)}
            disabled={loading}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={isAddLeadOpen} onClose={() => setIsAddLeadOpen(false)} title="Add New Lead">
        <form onSubmit={handleAddLeadSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
            <input
              id="name"
              type="text"
              value={newLeadName}
              onChange={(e) => setNewLeadName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
            <input
              id="phone"
              type="tel"
              value={newLeadPhone}
              onChange={(e) => setNewLeadPhone(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="+15551234567"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={() => setIsAddLeadOpen(false)} className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Save Lead
            </button>
          </div>
        </form>
      </Modal>


      {/* Leads Table Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Leads</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View, add, import, and manage your leads. Select leads to add them to a campaign.</p>
          <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="search"
              placeholder="Search leads by name or phone..."
              className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {error && <p className="text-red-600 dark:text-red-400 text-center p-4">Error loading leads: {error.message}</p>}
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                    checked={!loading && isAllSelected}
                    ref={input => { // Handle indeterminate state
                      if (input) {
                        input.indeterminate = !loading && isIndeterminate;
                      }
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all leads"
                    disabled={loading || filteredLeads.length === 0}
                  />
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone Number</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date Added</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    Loading leads...
                  </td>
                </tr>
              ) : filteredLeads.length > 0 ? (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedLeads.has(lead.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:bg-gray-600 dark:border-gray-500"
                        checked={selectedLeads.has(lead.id)}
                        onChange={(e) => handleSelectLead(lead.id, e)}
                        aria-label={`Select lead ${lead.name}`}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{lead.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClasses(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{lead.added}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                      {/* Basic Dropdown (HeroUI style) */}
                      <button
                        onClick={() => setOpenDropdownId(openDropdownId === lead.id ? null : lead.id)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                        aria-haspopup="true"
                        aria-expanded={openDropdownId === lead.id}
                        disabled={loading}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {openDropdownId === lead.id && (
                        <div
                          className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                          role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex={-1}
                          onBlur={() => setTimeout(() => setOpenDropdownId(null), 100)} // Close on blur with delay
                        >
                          <div className="py-1" role="none">
                            <button className="text-gray-700 dark:text-gray-200 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50" role="menuitem" tabIndex={-1} disabled>Edit</button>
                            <button className="text-gray-700 dark:text-gray-200 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50" role="menuitem" tabIndex={-1} disabled>View Details</button>
                            <div className="border-t border-gray-200 dark:border-gray-600 my-1"></div>
                            <button className="text-red-600 dark:text-red-400 block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50" role="menuitem" tabIndex={-1} disabled>Delete</button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
                    {searchTerm ? 'No leads match your search.' : 'No leads found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* TODO: Add Pagination controls here if needed */}
      </div>
    </div>
  );
}

</final_file_content>

IMPORTANT: For any future changes to this file, use the final_file_content shown above as your reference. This content reflects the current state of the file, including any auto-formatting (e.g., if you used single quotes but the formatter converted them to double quotes). Always base your SEARCH/REPLACE operations on this final version to ensure accuracy.

<environment_details>
# VSCode Visible Files
../../../../../response_59354cde-d8fa-4c6e-9901-fca527b6006b/0
src/app/dashboard/conversations/page.tsx
src/app/dashboard/conversations/page.tsx
src/app/dashboard/layout.tsx
src/app/dashboard/layout.tsx
src/components/Sidebar.tsx
src/components/Sidebar.tsx
src/app/dashboard/leads/page.tsx

# VSCode Open Tabs
.env.example
src/components/UseCaseCard.tsx
.next/types/app/pages/dashboard/page.ts
.env.local
src/app/(auth)/sign-in/page.tsx
src/landing-page(s)/public/placeholder-logo.png
src/components/Providers/QueryProvider.tsx
src/functions/api/twilio-sms-webhook.ts
functions/index.js
functions/ai-instance.ts
PROJECT_OVERVIEW.md
functions/src/PostgreSQL-sql.md
src/app/dashboard/page.tsx
src/components/LeadImportForm.tsx
src/app/dashboard/leads/page.tsx
src/prompt-container-empty.tsx
PROJECTSTRUCTURE.md
src/components/Header.tsx
src/app/globals.css
src/components/TopNav.tsx
src/components/DashboardContent.tsx
src/app/dashboard/conversations/page.tsx
src/components/Sidebar.tsx
.git/config
src/firebase/config.ts
src/features-cards.tsx
src/app/dashboard/campaigns/page.tsx
public/images/square-logo-white.jpg
public/images/long-logo.jpg
../../../Downloads/Untitled design (5).png
../../../Downloads/IM. AVA.AI.jpg
../../../Downloads/IM. AVA.AI (1).jpg

# Current Time
5/11/2025, 8:33:35 PM (America/Chicago, UTC-5:00)

# Context Window Usage
713,733 / 1,048.576K tokens used (68%)

# Current Mode
ACT MODE
</environment_details>
