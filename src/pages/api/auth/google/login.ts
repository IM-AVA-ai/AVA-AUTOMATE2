// This file contains the handler for the login route.

import type { NextApiRequest, NextApiResponse } from 'next';
import { getAuthUrl } from '@/services/google';

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
    const url = getAuthUrl();
    return res.json({ "data": url });
}