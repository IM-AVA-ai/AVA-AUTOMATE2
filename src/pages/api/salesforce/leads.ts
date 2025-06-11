// This file contains the handler for the calendar events route.

// next imports
import type { NextApiRequest, NextApiResponse } from 'next';

// third party imports
import jsforce from 'jsforce';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.query.accessToken as string;
    const instanceUrl = req.query.instanceUrl as string;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const page = parseInt(req.query.page as string) || 1;

    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const connection = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });

        const offset = (page - 1) * limit;

        const baseLeadQuery = `SELECT Id, Name, Email, Phone,Status, CreatedDate FROM Lead`;
        const baseContactQuery = `SELECT Id, Name, Email, Phone,LeadSource, CreatedDate FROM Contact`;

        const searchCondition = search ? ` WHERE Name LIKE '%${search}%'` : '';
        const orderBy = ` ORDER BY CreatedDate DESC`;
        const limitClause = ` LIMIT ${limit} OFFSET ${offset}`;

        const leadsQuery = `${baseLeadQuery}${searchCondition}${orderBy}${limitClause}`;
        const contactsQuery = `${baseContactQuery}${searchCondition}${orderBy}${limitClause}`;

        const [leadsResult, contactsResult] = await Promise.all([
            connection.query(leadsQuery),
            connection.query(contactsQuery),

        ]);

        return res.status(200).json({
            page,
            limit,
            leads: leadsResult,
            contacts: contactsResult
        });
    } catch (error) {
        console.error(error, "error");
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
