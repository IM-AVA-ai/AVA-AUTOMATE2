// This file contains the types for the API response.

type ISalesForceLeadsAttributes = {
    type: string;
    url: string
}

export type ISalesForceLeadsResponse = {
    Email: string;
    Id: string;
    Name: string;
    Phone: string
    attributes: ISalesForceLeadsAttributes;
    Status: string;
    LeadSource?: string
}