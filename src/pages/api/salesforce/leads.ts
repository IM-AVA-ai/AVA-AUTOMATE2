// This file contains the handler for the calendar events route.

// next imports
import type { NextApiRequest, NextApiResponse } from 'next';

// third party imports
import jsforce from 'jsforce';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.query.accessToken as string;
    const instanceUrl = req.query.instanceUrl as string;
    const limit = req.query.limit as string;
    const search = req.query.search as string;

    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const connection = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });

        const baseLeadQuery = `SELECT Id, Name, Email, Phone,Status, CreatedDate FROM Lead`;
        const baseContactQuery = `SELECT Id, Name, Email, Phone,LeadSource, CreatedDate FROM Contact`;

        const searchCondition = search ? ` WHERE Name LIKE '%${search}%'` : '';
        const orderBy = ` ORDER BY CreatedDate DESC`;
        const limitClause = ` LIMIT ${limit || 10}`;

        const leadsQuery = `${baseLeadQuery}${searchCondition}${orderBy}${limitClause}`;
        const contactsQuery = `${baseContactQuery}${searchCondition}${orderBy}${limitClause}`;

        const leads = await connection.query(leadsQuery);
        const contacts = await connection.query(contactsQuery);

        return res.status(200).json({ leads, contacts });
    } catch (error) {
        console.error(error, "error");
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
