// this file contains the handler for the hubspot leads route.

// next imports
import { makeHubSpotQueryParams } from '@/services/helpers';
import { IFetchHubSpotQueryParamsType } from '@/types/apiRequest';
import { addToast } from '@heroui/react';
import type { NextApiRequest, NextApiResponse } from 'next';

// Helper functions
const fetchContacts = async (
    token: string,
    contactSearch?: string,
    addToast?: ({ title, description }: { title: string; description: string }) => void
) => {
    const baseUrl = process.env.HUBSPOT_LEADS_CONTACTS_BASE_URL;
    const isSearch = Boolean(contactSearch);

    const url = isSearch
        ? `${baseUrl}/contacts/search`
        : `${baseUrl}/contacts`;

    const options: RequestInit = {
        method: isSearch ? "POST" : "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    };

    if (isSearch) {
        const body: IFetchHubSpotQueryParamsType = { query: contactSearch };
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            const errorMsg = `Failed to fetch contacts: ${response.status} ${response.statusText}`;
            if (typeof window !== "undefined" && addToast) {
                addToast({ title: "Error", description: errorMsg });
            } else {
                console.error(errorMsg);
            }
            return { results: [] };
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching contacts:", error);
        return { results: [] };
    }
};

const fetchLeads = async (token: string, leadSearch?: string) => {
    try {
        const response = await fetch(`${process.env.HUBSPOT_LEADS_CONTACTS_BASE_URL}/leads`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            addToast({ title: "Error", description: `Failed to fetch leads: ${response.status} ${response.statusText}` });
            return { results: [] };
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching leads:", error);
        return { results: [] };
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.query.accessToken as string;
    const contactSearch = req.query.contactSearch as string;
    const leadSearch = req.query.leadSearch as string;

    try {
        const [contactsResponse, leadsResponse] = await Promise.all([
            fetchContacts(accessToken, contactSearch),
            fetchLeads(accessToken, leadSearch)
        ]);

        res.status(200).json({
            contacts: contactsResponse.results,
            leads: leadsResponse.results
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data" });
    }
}

