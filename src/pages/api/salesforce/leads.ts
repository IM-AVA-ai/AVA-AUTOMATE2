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
    const offset = parseInt(req.query.offset as string) || 0;
    const contactOffset = parseInt(req.query.contactsOffset as string) || 0;
    const contactsLimit = parseInt(req.query.contactsLimit as string) || 10;
    const contactSearch = req.query.contactsSearch as string;

    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

    try {
        const connection = new jsforce.Connection({
            instanceUrl: instanceUrl,
            accessToken: accessToken
        });

        const baseLeadQuery = `SELECT Id, Name, Email, Phone,Status, CreatedDate FROM Lead`;
        const baseContactQuery = `SELECT Id, Name, Email, Phone,LeadSource, CreatedDate FROM Contact`;

        const searchCondition = search ? ` WHERE Name LIKE '%${search}%'` : '';
        const contactSearchCondition = contactSearch ? ` WHERE Name LIKE '%${contactSearch}%'` : '';

        const orderBy = ` ORDER BY CreatedDate DESC`;
        const leadsLimitClause = ` LIMIT ${limit} OFFSET ${offset}`;
        const contactsLimitClause = ` LIMIT ${contactsLimit} OFFSET ${contactOffset}`;

        const leadsQuery = `${baseLeadQuery}${searchCondition}${orderBy}${leadsLimitClause}`;
        const contactsQuery = `${baseContactQuery}${contactSearchCondition}${orderBy}${contactsLimitClause}`;

        const leadsCountQuery = `SELECT COUNT() FROM Lead`;
        const contactsCountQuery = `SELECT COUNT() FROM Contact`;

        const [leadsResult, contactsResult, leadsTotal, contactsTotal] = await Promise.all([
            connection.query(leadsQuery),
            connection.query(contactsQuery),
            connection.query(leadsCountQuery),
            connection.query(contactsCountQuery)
        ]);

        return res.status(200).json({
            leads: leadsResult,
            contacts: contactsResult,
            leadsTotalCount: leadsTotal.totalSize,
            contactsTotalCount: contactsTotal.totalSize
        });
    } catch (error) {
        console.error(error, "error");
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
