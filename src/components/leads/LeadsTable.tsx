"use client";

// react and next imports
import React, {  useEffect, useState } from "react";

// third party imports
import { addToast } from '@heroui/toast';
import { useForm } from "react-hook-form";
import Cookies from 'js-cookie'

// custom components
import { Button } from "../ui/button";
import { SalesForceModal } from "../SalesForceModal";
import { SalesforceView } from "./SalesForceView";
import { HubSpotView } from "./HubSpotView";

// types
import { IHubSpotContactsResponse, ISalesForceLeadsResponse } from "@/types/apiResponse";
import { CreateNewContactFormType, CreateNewLeadFormType, IFetchHubSpotContactsQueryParamsType, IFetchLeadsQueryParamsType } from "@/types/apiRequest";

// css
import "react-phone-input-2/lib/style.css";

interface LeadsTableClientProps {
	leads: ISalesForceLeadsResponse[];
	leadsLoading : boolean
	contacts : ISalesForceLeadsResponse[];
	fetchAllLeads : () => void;
	isSalesForceIntegrated : boolean;
	setQueryParams : (queryParams:IFetchLeadsQueryParamsType) => void;
	queryParams : IFetchLeadsQueryParamsType;
	isHubSpotIntegrated: boolean;
	hubSpotContacts: IHubSpotContactsResponse[]
	hubSpotLeads: []
	setHubSpotQueryParams : (queryParams:IFetchHubSpotContactsQueryParamsType) => void;
	hubSpotQueryParams : IFetchHubSpotContactsQueryParamsType;
}

const LeadsTable: React.FC<LeadsTableClientProps> = ({ leads,contacts ,leadsLoading, fetchAllLeads, isSalesForceIntegrated, setQueryParams, queryParams, isHubSpotIntegrated, hubSpotContacts, hubSpotLeads, setHubSpotQueryParams, hubSpotQueryParams}) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
	const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
	const [viewType, setViewType] = useState<string>('leads')
	const [crmPlatform, setCrmPlatform] = useState<string>('salesforce');

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
	const handleHubSpotSearch = (event: React.ChangeEvent<HTMLInputElement>)=>{
		setHubSpotQueryParams({
			...hubSpotQueryParams,
			contactSearch: event.target.value,
		  });
	}

	useEffect(() => {
		!isAddLeadOpen && reset();
	}, [isAddLeadOpen]);

	return (
		<div className="space-y-6">
		  {/* CRM Platform Toggle - Topmost */}
		  <div className="flex justify-center sm:justify-start">
			<div className="flex items-center gap-2">
			  <Button
				onClick={() => setCrmPlatform('salesforce')}
				className={`px-4 py-2 rounded-l-md font-medium ${
				  crmPlatform === 'salesforce'
					? 'bg-blue-600 text-white'
					: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
				}`}
			  >
				Salesforce
			  </Button>
			  <Button
				onClick={() => setCrmPlatform('hubspot')}
				className={`px-4 py-2 rounded-r-md font-medium ${
				  crmPlatform === 'hubspot'
					? 'bg-blue-600 text-white'
					: 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200'
				}`}
			  >
				Hubspot
			  </Button>
			</div>
		  </div>
	
		  {/* Render the appropriate view based on CRM platform */}
		  {crmPlatform === 'salesforce' ? (
			<SalesforceView
			  viewType={viewType}
			  setViewType={setViewType}
			  leadsLoading={leadsLoading}
			  isSalesForceIntegrated={isSalesForceIntegrated}
			  loading={loading}
			  selectedLeads={selectedLeads}
			  handleBulkAddToCampaign={handleBulkAddToCampaign}
			  handleBulkDelete={handleBulkDelete}
			  setIsAddLeadOpen={setIsAddLeadOpen}
			  leads={leads}
			  contacts={contacts}
			  queryParams={queryParams}
			  handleSearch={handleSearch}
			  crmPlatform={crmPlatform}
			/>
		  ) : (
			<HubSpotView
			  viewType={viewType}
			  setViewType={setViewType}
			  leadsLoading={leadsLoading}
			  isHubspotIntegrated={isHubSpotIntegrated}
			  loading={loading}
			  setIsAddLeadOpen={setIsAddLeadOpen}
			  leads={hubSpotLeads}
			  hubSpotContacts={hubSpotContacts}
			  queryParams={hubSpotQueryParams}
			  handleHubSpotSearchSearch={handleHubSpotSearch}
			  crmPlatform={crmPlatform}
			/>
		  )}
	
		  {/* Modals can stay here if they're shared between both views */}
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
		</div>
	  );
};

export default LeadsTable;

