// This file contains the handler for the create leads route.

// next imports
import { NextApiRequest, NextApiResponse } from "next";

// third party imports
import { Connection } from "jsforce";

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
        return res.status(500).json({ error: 'Failed to create lead in Salesforce' });
    }
}
