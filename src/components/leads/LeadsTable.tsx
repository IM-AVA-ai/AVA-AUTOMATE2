"use client";

// react and next imports
import React, {  useEffect, useState } from "react";

// third party imports
import { Plus, Search, Trash2, Send, Loader2, AlertCircle, Lock } from "lucide-react";
import { addToast } from '@heroui/toast';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'

// custom components
import { Button } from "../ui/button";
import { SalesForceModal } from "../SalesForceModal";

// types
import { ISalesForceLeadsResponse } from "@/types/apiResponse";
import { CreateNewContactFormType, CreateNewLeadFormType, IFetchLeadsQueryParamsType } from "@/types/apiRequest";

// css
import "react-phone-input-2/lib/style.css";
import { Input } from "../ui/input";

interface LeadsTableClientProps {
	leads: ISalesForceLeadsResponse[];
	leadsLoading ?: boolean
	contacts : ISalesForceLeadsResponse[];
	fetchAllLeads : () => void;
	isSalesForceIntegrated : boolean;
	setQueryParams : (queryParams:IFetchLeadsQueryParamsType) => void;
	queryParams : IFetchLeadsQueryParamsType
}

const LeadsTable: React.FC<LeadsTableClientProps> = ({ leads,contacts ,leadsLoading, fetchAllLeads, isSalesForceIntegrated, setQueryParams, queryParams}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
	const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
	const [viewType, setViewType] = useState<string>('leads')

	const instanceUrl = Cookies.get("__sf_instanceUrl");
	const accessToken = Cookies.get("__sf_accessToken");

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		control,
	} = useForm<CreateNewLeadFormType>({
		defaultValues: {
		firstName: '',
		lastName: '',
		company: '',
		title: '',
		address: '',
		leadStatus: '',
		}
	});


	const onSubmit = async (payload : CreateNewLeadFormType | CreateNewContactFormType) => {
		payload.instanceUrl = instanceUrl || '';
		payload.accessToken = accessToken || '';
		if (!payload.instanceUrl || !payload.accessToken) {
			addToast({ title: "Error", description: "Please login to salesforce", variant: "solid" });
			return;
		}
		console.log(payload, "payload");
		setLoading(true);
		let response
		try{
			if (viewType === 'leads') {
				response = await fetch(`/api/salesforce/createLeads`,{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({payload}),
				})
			}
			else {
				response = await fetch(`/api/salesforce/createContacts`,{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({payload}),
				})
			}
			const data = await response.json();
			addToast({ title: "Success", description: "Leads created successfully", variant: "solid" });
		}catch(err){
			addToast({ title: "Error", description: "Something went wrong", variant: "solid" });
			console.log(err);
		}finally{
			setLoading(false);
			setIsAddLeadOpen(false);
			fetchAllLeads();
		}
	};

	const handleBulkDelete = () => {
		// setLeads(prev => prev.filter(lead => !selectedLeads.has(lead.id)));
		// setSelectedLeads(new Set());
		// addToast({ title: "Bulk Delete", description: `Deleted ${selectedLeads.size} leads.`, variant: "solid" });
	};

	const handleBulkAddToCampaign = () => {
		addToast({ title: "Add to Campaign", description: `Functionality to add ${selectedLeads.size} leads to a campaign is not yet implemented.` });
	};

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setQueryParams({
			...queryParams,
			search: event.target.value,
		  });
	}

	useEffect(() => {
		!isAddLeadOpen && reset();
	}, [isAddLeadOpen]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
				<div className="flex items-center gap-2">
					<Button
						onClick={() => setViewType('leads')}
						className={`px-4 py-2 rounded-l-md font-medium ${
						viewType === 'leads'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
						}`}
					>
						Leads
					</Button>
					<Button
						onClick={() => setViewType('contacts')}
						className={`px-4 py-2 rounded-r-md font-medium ${
						viewType === 'contacts'
							? 'bg-blue-600 text-white'
							: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
						}`}
					>
						Contacts
					</Button>
				</div>
				{/* <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Leads</h1> */}
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
						disabled={!isSalesForceIntegrated || loading}
						className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
						>
						{!isSalesForceIntegrated ? (
							<>
							<Lock className="mr-2 h-4 w-4" />
							Connect Salesforce to Add {viewType === 'contacts' ? 'Contact' : 'Lead'}
							</>
						) : (
							<>
							<Plus className="mr-2 h-4 w-4" />
							Add {viewType === 'contacts' ? 'Contact' : 'Lead'}
							</>
						)}
					</Button>
				</div>
			</div>

			{/* Add Lead Modal */}
			<SalesForceModal
				isOpen={isAddLeadOpen}
				onClose={() => setIsAddLeadOpen(false)}
				type={viewType === 'leads' ? 'lead' : 'contact'}
				onSubmit={onSubmit}
				loading={loading}
				control={control}
				register={register}
				handleSubmit={handleSubmit}
				errors={errors}
				submitButtonText={viewType === 'leads' ? 'Add Lead' : 'Add Contact'}
			/>

			{viewType === "leads" ? (
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
				{!isSalesForceIntegrated ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
					<AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
					<p className="text-gray-700 dark:text-gray-300 mb-4">Please connect Salesforce to view leads</p>
				</div>
				) : leadsLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
				</div>
				) : (
				<>
					<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Leads</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage your Salesforce leads</p>
					<div className="relative mt-4">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
						</div>
						<Input
						type="search"
						placeholder="Search leads by name or phone..."
						className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						value={queryParams.search}
						onChange={handleSearch}
						disabled={loading}
						/>
					</div>
					</div>

					<div className="overflow-x-auto">
					{leads && leads.length === 0 ? (
						<div className="text-center py-6 text-gray-500 dark:text-gray-400">
						No leads found in your Salesforce account
						</div>
					) : (
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Added</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{leads && leads.map((lead) => (
							<tr key={lead.Id}>
								<td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{lead.Name}</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">{lead.Phone}</td>
								<td className="px-4 py-3">
								<span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{lead.attributes.type}</span>
								</td>
								<td className="px-4 py-3">
								<span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{lead.Status}</span>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">{lead.attributes.url}</td>
							</tr>
							))}
						</tbody>
						</table>
					)}
					</div>
				</>
				)}
			</div>
			) : (
			<div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden relative min-h-[200px]">
				{!isSalesForceIntegrated ? (
				<div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
					<AlertCircle className="h-8 w-8 text-yellow-500 mb-2" />
					<p className="text-gray-700 dark:text-gray-300 mb-4">Please connect Salesforce to view contacts</p>
				</div>
				) : leadsLoading ? (
				<div className="absolute inset-0 flex items-center justify-center">
					<Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
				</div>
				) : (
				<>
					<div className="p-4 border-b border-gray-200 dark:border-gray-700">
					<h2 className="text-lg font-semibold text-gray-900 dark:text-white">Manage Contacts</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">View and manage your Salesforce contacts</p>
					<div className="relative mt-4">
						<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
						</div>
						<input
						type="search"
						placeholder="Search contacts by name or phone..."
						className="block w-full sm:w-80 pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
						value={queryParams.search}
						onChange={handleSearch}
						disabled={loading}
						/>
					</div>
					</div>

					<div className="overflow-x-auto">
					{contacts && contacts.length === 0 ? (
						<div className="text-center py-6 text-gray-500 dark:text-gray-400">
						No contacts found in your Salesforce account
						</div>
					) : (
						<table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Phone</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead Type</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Lead Source</th>
							<th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Added</th>
							</tr>
						</thead>
						<tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
							{contacts && contacts.map((contact) => (
							<tr key={contact.Id}>
								<td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{contact.Name}</td>
								<td className="px-4 py-3 text-gray-700 dark:text-gray-300">{contact.Phone}</td>
								<td className="px-4 py-3">
								<span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{contact.attributes.type}</span>
								</td>
								<td className="px-4 py-3">
								<span className={`inline-block px-2 py-1 rounded text-xs font-semibold`}>{contact.LeadSource || "-"}</span>
								</td>
								<td className="px-4 py-3 text-gray-500 dark:text-gray-400">{contact.attributes.url}</td>
							</tr>
							))}
						</tbody>
						</table>
					)}
					</div>
				</>
				)}
			</div>
			)}
		</div>
	);
};

export default LeadsTable;

