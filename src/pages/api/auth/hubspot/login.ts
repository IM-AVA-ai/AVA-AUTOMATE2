// This file contains the handler for the hubspot login route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const clientId = process.env.HUBSPOT_CLIENT_ID;
    const redirectUri = process.env.HUBSPOT_REDIRECT_URL;
    const scope = process.env.HUBSPOT_SCOPE;

    try {
        const authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;

        return res.status(200).json({ "data": authUrl });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to get authorization URL' });
    }
}
