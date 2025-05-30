// This file contains the handler for the login route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

// third party imports
import { OAuth2 } from "jsforce";

const oauth2 = new OAuth2({
    clientId: process.env.SALESFORCE_APP_CLIENT_KEY,
    clientSecret: process.env.SALESFORCE_APP_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_APP_REDIRECT_URL,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const authUrl = oauth2.getAuthorizationUrl({
            scope: "api refresh_token web",
        });
        console.log(authUrl, "authUrl");
        return res.status(200).json({ "data": authUrl });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get authorization URL' });
    }
}
