// This file contains the handler for the callback route.
import type { NextApiRequest, NextApiResponse } from 'next';
import { getTokensFromCode } from '@/services/google';
import Cookies from 'js-cookie'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code as string;
    const tokens = await getTokensFromCode(code);
    console.log(tokens, "tokens...........")

    // Store tokens securely in DB associated with user
    // For demo: store in cookie
    console.log(tokens.access_token, "tokens.access_token")
    console.log(tokens.refresh_token, "tokens.refresh_token")
    Cookies.set("__gc_access", tokens.access_token as string);
    Cookies.set("__gc_refresh", tokens.refresh_token as string);

    return res.json({ "data": true });

    // res.redirect('/dashboard');
}