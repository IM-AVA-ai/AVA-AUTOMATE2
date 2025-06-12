// This file contains the leads page that will call the leads route and display the leads in a table

"use client";

// react and next imports
import { useEffect, useState } from 'react';

// custom components
import LeadsTableClient from '@/components/leads/LeadsTable';

// custom hooks
import { useDebounce } from '@/hooks/useDebounce';

// third party imports
import { addToast } from '@heroui/react';
import Cookies from 'js-cookie';

// helpers
import { makeQueryParams } from '@/services/helpers';

// types  
import { IHubSpotContactsResponse, ISalesForceLeadsResponse } from '@/types/apiResponse';
import { IFetchHubSpotContactsQueryParamsType, IFetchLeadsQueryParamsType, IFetchSalesForceContactsQueryParamsType } from '@/types/apiRequest';


export default function LeadsPage() {
  // salesforce access token
  const accessToken = Cookies.get("__sf_accessToken");
  const instanceUrl = Cookies.get("__sf_instanceUrl");

  // hubspot access token
  const hubSpotAccessToken = Cookies.get("__hs_accessToken");

  const [loading, setLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<ISalesForceLeadsResponse[]>([]);
  const [contacts, setContacts] = useState<ISalesForceLeadsResponse[]>([]);
  const [isSalesForceIntegrated, setIsSalesForceIntegrated] = useState<boolean>(false);
  const [queryParams, setQueryParams] = useState<IFetchLeadsQueryParamsType>(({
    search: '',
    nextRecordUrl: '',
    limit: 10,
    offset: 0,
  }))
  const [hubSpotContacts, setHubSpotContacts] = useState<IHubSpotContactsResponse[]>([]);
  const [hubSpotLeads, setHubSpotLeads] = useState<[]>([]);
  const [isHubSpotIntegrated, setIsHubSpotIntegrated] = useState<boolean>(false);
  const [hubSpotQueryParams, setHubSpotQueryParams] = useState<IFetchHubSpotContactsQueryParamsType>(({
    contactSearch: '',
  }))
  const [viewType, setViewType] = useState<string>('leads')
  const [salesForceContactsQueryParams, setSalesForceContactsQueryParams] = useState<IFetchSalesForceContactsQueryParamsType>(({
    contactsSearch: '',
    contactsLimit: 10,
    contactsOffset: 0,
  }))
  const [leadsTotal, setLeadsTotal] = useState<number>(0);
  const [contactsTotal, setContactsTotal] = useState<number>(0);

  const debouncedSearchTerm = useDebounce(queryParams.search);
  const hubSpotDebouncedSearchTerm = useDebounce(hubSpotQueryParams.contactSearch as string);
  
  const fetchAllLeads = async () => {
      try {
        const result = await fetch(`/api/salesforce/leads?accessToken=${accessToken}&instanceUrl=${instanceUrl}${makeQueryParams(viewType === "leads" ? queryParams : salesForceContactsQueryParams)}`);
        const resultJson = await result.json();
        const {leads,contacts,leadsTotalCount,contactsTotalCount} = resultJson;
        setLeads(leads.records);
        setContacts(contacts.records);
        setLeadsTotal(leadsTotalCount);
        setContactsTotal(contactsTotalCount);
      } catch (err) {
        addToast({ title: "Failed to Fetch Leads", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "solid" });
      } finally {
        setLoading(false);
      }
	}

  const fetchAllHubSpotLeads = async () => {
    console.log(`/api/hubspot/leads?accessToken=${hubSpotAccessToken}${makeQueryParams(queryParams)}`,"Query...")
      try {
        const hubSpotLeads = await fetch(`/api/hubspot/leads?accessToken=${hubSpotAccessToken}${makeQueryParams(hubSpotQueryParams)}`);
        const hubSpotLeadsJson = await hubSpotLeads.json();
        const {contacts,leads} = hubSpotLeadsJson;
        setHubSpotContacts(contacts);
        setHubSpotLeads(leads);
      } catch (err) {
        addToast({ title: "Failed to Fetch Leads", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "solid" });
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    if (accessToken && instanceUrl) {
      setIsSalesForceIntegrated(true);
      fetchAllLeads();
    }
    else{
      setIsSalesForceIntegrated(false);
      setLoading(false);
    }
  },[accessToken, instanceUrl, debouncedSearchTerm, queryParams, salesForceContactsQueryParams]);
  
  useEffect(() => { 
    if (hubSpotAccessToken){ 
      setIsHubSpotIntegrated(true);
      fetchAllHubSpotLeads();
    }
    else{
      setIsHubSpotIntegrated(false);
      setLoading(false);
    }
  },[hubSpotAccessToken, hubSpotDebouncedSearchTerm]);

  return (
    <LeadsTableClient leads={leads} leadsLoading={loading} contacts={contacts} fetchAllLeads={fetchAllLeads} isSalesForceIntegrated={isSalesForceIntegrated} setQueryParams={setQueryParams} queryParams={queryParams} isHubSpotIntegrated={isHubSpotIntegrated} hubSpotContacts={hubSpotContacts} hubSpotLeads={hubSpotLeads} hubSpotQueryParams={hubSpotQueryParams} setHubSpotQueryParams={setHubSpotQueryParams} salesForceContactsQueryParams={salesForceContactsQueryParams} setSalesForceContactsQueryParams={setSalesForceContactsQueryParams} setViewType={setViewType} viewType={viewType} leadsTotal={leadsTotal} contactsTotal={contactsTotal}/>
  );
}
