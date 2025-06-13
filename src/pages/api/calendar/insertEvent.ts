// This file contains the handler for the insert event route.

// third party imports
import { google } from 'googleapis';

// custom imports
import { oauth2Client } from '@/services/google';
import { NextApiRequest, NextApiResponse } from 'next';


export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { payload } = req.body;
        const accessToken = payload.accessToken;

        oauth2Client.setCredentials({ access_token: accessToken });

        const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: payload,
        });

        return res.status(200).json(response.data);
    } catch (error) {
        console.error('Error creating calendar event:', error);
        console.error(JSON.stringify(error));
        return res.status(500).json(
            { error: 'Failed to create calendar event' },
        );
    }
}