// This file contains the handler for the calendar events route.

// src/pages/api/calendar/events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { oauth2Client, fetchCalendarEvents } from '@/services/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const accessToken = req.cookies.google_access_token;

    if (!accessToken) return res.status(401).json({ error: 'Not authenticated' });

    oauth2Client.setCredentials({ access_token: accessToken });

    try {
        const events = await fetchCalendarEvents();
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}
