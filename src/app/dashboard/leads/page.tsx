// This file contains the leads page that will call the leads route and display the leads in a table

"use client";

// react and next imports
import { useEffect, useState } from 'react';

// custom components
import LeadsTableClient from '@/components/leads/LeadsTable';

// third party imports
import { addToast } from '@heroui/react';
import Cookies from 'js-cookie';

// types  
import { ISalesForceLeadsResponse } from '@/types/apiResponse';

export default function LeadsPage() {
  // salesforce access token
  const accessToken = Cookies.get("__sf_accessToken");
  const instanceUrl = Cookies.get("__sf_instanceUrl");

  const [loading, setLoading] = useState<boolean>(true);
  const [leads, setLeads] = useState<ISalesForceLeadsResponse[]>([]);
  const [contacts, setContacts] = useState<ISalesForceLeadsResponse[]>([]);

  const fetchAllLeads = async () => {
      try {
        const leads = await fetch(`/api/salesforce/leads?accessToken=${accessToken}&instanceUrl=${instanceUrl}`);
        const leadsJson = await leads.json();
        setLeads(leadsJson.leads.records);
        setContacts(leadsJson.contacts.records);
      } catch (err) {
        addToast({ title: "Failed to Fetch Leads", description: err instanceof Error ? err.message : "An unknown error occurred.", variant: "solid" });
      } finally {
        setLoading(false);
      }
	}
  useEffect(() => {
    if (accessToken && instanceUrl) {
      fetchAllLeads();
    }
  },[accessToken, instanceUrl]);
  return (
    <LeadsTableClient leads={leads} leadsLoading={loading} contacts={contacts} fetchAllLeads={fetchAllLeads}/>
  );
}
