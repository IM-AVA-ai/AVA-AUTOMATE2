// This file contains the handler for the create leads route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

// third party imports
import { OAuth2, Connection } from "jsforce";


const oauth2 = new OAuth2({
    clientId: process.env.SALESFORCE_APP_CLIENT_KEY,
    clientSecret: process.env.SALESFORCE_APP_CLIENT_SECRET,
    redirectUri: process.env.SALESFORCE_APP_REDIRECT_URL,
});

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { payload } = req.body;;
        const conn = new Connection({ instanceUrl: payload.instanceUrl, accessToken: payload.accessToken });
        const lead = await conn.sobject("Lead").create({
            FirstName: payload.firstName,
            LastName: payload.lastName,
            Company: payload.company,
            Title: payload.title,
            Phone: payload.phoneNumber,
            Status: payload.leadStatus
        })

        return res.status(200).json({ success: true, lead });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get authorization URL' });
    }
}
