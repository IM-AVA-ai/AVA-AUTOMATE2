"use client";

// react and next imports
import React, {  useState } from "react";

// third party imports
import { Plus, Search, Trash2, Send, Loader2 } from "lucide-react";
import { addToast } from '@heroui/toast';

// custom components
import { Button } from "../ui/button";

// custom hooks
import { useDebounce } from "@/hooks/useDebounce";

// types
import { ISalesForceLeadsResponse } from "@/types/apiResponse";

interface LeadsTableClientProps {
	leads: ISalesForceLeadsResponse[];
	leadsLoading ?: boolean
	contacts : ISalesForceLeadsResponse[]
}

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

const LeadsTable: React.FC<LeadsTableClientProps> = ({ leads,contacts ,leadsLoading}) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
	const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
	const [newLeadName, setNewLeadName] = useState('');
	const [newLeadPhone, setNewLeadPhone] = useState('');
	const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

	const debouncedSearchTerm = useDebounce(searchTerm);
	

	// Add a new lead
	const addLead = async () => {
		
	};

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

	// const filteredLeads = leads.filter(lead =>
	// 	lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
	// 	lead.phone.includes(searchTerm)
	// );
	const filteredLeads = [{
		id: 'lead-1',
		name: 'John Doe',
		phone: '+15551234567',
		status: 'New',
		added: '2022-01-01',
	}]

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

		// try {
		// 	await addLead({ name: newLeadName, phone: newLeadPhone });
		// 	addToast({ title: "Lead Added", description: `${newLeadName} has been added successfully.` });
		// 	setNewLeadName('');
		// 	setNewLeadPhone('');
		// 	setIsAddLeadOpen(false);
		// } catch (err) {
		// 	addToast({ title: "Failed to Add Lead", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "solid" });
		// }
	};

	const handleBulkDelete = () => {
		// setLeads(prev => prev.filter(lead => !selectedLeads.has(lead.id)));
		// setSelectedLeads(new Set());
		// addToast({ title: "Bulk Delete", description: `Deleted ${selectedLeads.size} leads.`, variant: "solid" });
	};

	const handleBulkAddToCampaign = () => {
		addToast({ title: "Add to Campaign", description: `Functionality to add ${selectedLeads.size} leads to a campaign is not yet implemented.` });
	};

	const getStatusBadgeClasses  = (status: string): string => {
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
							<Button
								onClick={handleBulkAddToCampaign}
								disabled={loading}
								className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
							>
								<Send className="mr-2 h-4 w-4" /> Add to Campaign ({selectedLeads.size})
							</Button>
							<Button
								onClick={handleBulkDelete}
								disabled={loading}
								className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
							>
								<Trash2 className="mr-2 h-4 w-4" /> Delete Selected
							</Button>
						</>
					)}
					{/* <LeadImportForm onImport={handleImport} /> */}
					<Button
						onClick={() => setIsAddLeadOpen(true)}
						disabled={loading}
						className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
					>
						<Plus className="mr-2 h-4 w-4" /> Add Lead
					</Button>
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
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
				{leadsLoading ? (
					<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
				  </div>
				): 
				<>
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
									<th className="px-4 py-3">
										<input
											type="checkbox"
											checked={isAllSelected}
											ref={el => {
												if (el) el.indeterminate = isIndeterminate;
											}}
											onChange={handleSelectAll}
										/>
									</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
									<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Added</th>
								</tr>
							</thead>
							<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
								{leads && leads.map((lead) => (
									<tr key={lead.Id}>
										<td className="px-4 py-3">
											<input
												type="checkbox"
												checked={selectedLeads.has(lead.Id)}
												onChange={(e) => handleSelectLead(lead.Id, e)}
											/>
										</td>
										<td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.Name}</td>
										<td className="px-4 py-3 text-gray-700 dark:text-gray-300">{lead.Phone}</td>
										<td className="px-4 py-3">
											<span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{lead.attributes.type}</span>
										</td>
										<td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.attributes.url}</td>
									</tr>
								))}
								{filteredLeads.length === 0 && (
									<tr>
										<td colSpan={5} className="text-center py-6 text-gray-500 dark:text-gray-400">No leads found.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</>}
				{/* TODO: Add Pagination controls here if needed */}
			</div>
		</div>
	);
};

export default LeadsTable;

