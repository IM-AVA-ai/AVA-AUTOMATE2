// This file contains the handler for the insert event route.

// next imports

// third party imports
import { google } from 'googleapis';

// custom imports
import { oauth2Client } from '@/services/google';
import { NextApiRequest, NextApiResponse } from 'next';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { eventData } = await req.body;

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: eventData,
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating calendar event:', error);
        return res.status(500).json(
            { error: 'Failed to create calendar event' },
        );
    }
}