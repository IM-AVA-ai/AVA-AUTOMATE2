// This file contains the handler for the callback route.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokensFromCode } from '@/services/google';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;
    const tokens = await getTokensFromCode(code);
    return res.status(200).json(tokens);

}