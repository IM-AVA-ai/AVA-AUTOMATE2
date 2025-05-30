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
        })
        const leads = await connection.query(`SELECT Id, Name, Email, Phone FROM Lead LIMIT ${limit || 10} ${search ? `WHERE Name LIKE '%${search}%'` : ''}`);
        const contacts = await connection.query(`SELECT Id, Name, Email, Phone FROM Contact LIMIT ${limit || 10} ${search ? `WHERE Name LIKE '%${search}%'` : ''}`);
        return res.status(200).json({ "leads": leads, "contacts": contacts });
    } catch (error) {
        console.log(error, "error");
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
