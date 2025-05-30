// This file contains the handler for the callback route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

// third party imports
import { OAuth2, Connection } from "jsforce";
import Cookies from "js-cookie";


const oauth2 = new OAuth2({
    clientId: process.env.SALESFORCE_APP_CLIENT_KEY,
    clientSecret: process.env.SALESFORCE_APP_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_APP_REDIRECT_URL,
});

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const code = req.query.code as string;
        if (!code) return res.status(400).json({ error: 'Missing code parameter' });

        const conn = new Connection({ oauth2 });
        await conn.authorize(code);
        return res.status(200).json({ "accessToken": conn.accessToken, "instanceUrl": conn.instanceUrl, "refreshToken": conn.refreshToken });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get authorization URL' });
    }
}
