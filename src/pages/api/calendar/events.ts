// This file contains the handler for the calendar events route.

// third party imports
import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client } from '@/services/google';
import { google } from 'googleapis';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.query.accessToken as string;
    const limit = req.query.limit as string;
    const pageToken = req.query.pageToken as string;
    const search = req.query.search as string;

    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
        const response = await calendar.events.list({
            calendarId: 'primary',
            maxResults: Number(limit) || 10,
            orderBy: 'updated',
            pageToken: pageToken || '',
            q: search
        });
        return res.status(200).json(response.data);
    } catch (error) {
        console.log(error, "error");
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
