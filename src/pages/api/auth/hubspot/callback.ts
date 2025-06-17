// This file contains the handler for the hubspot callback route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

// custom imports
import { apiService } from "@/services/apiServices";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    try {
        const code = req.query.code as string;
        if (!code) return res.status(400).json({ error: 'Missing code parameter' });

        const data = await apiService(
            process.env.HUBSPOT_AUTH_URL as string,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                data: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.HUBSPOT_CLIENT_ID!,
                    client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
                    redirect_uri: process.env.HUBSPOT_REDIRECT_URL!,
                    code: code,
                }),
            }

        )
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Failed to get authorization URL' });
    }
}
