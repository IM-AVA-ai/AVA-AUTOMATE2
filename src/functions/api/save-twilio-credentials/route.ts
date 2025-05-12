import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';
import { getAuth } from 'firebase-admin/auth';
// Assuming Firebase Admin is initialized in a shared utility
// import { initializeAdminApp } from '@/lib/firebase/admin'; // Uncomment and adjust path if you have this

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL environment variable
});

// Initialize Firebase Admin if not done elsewhere
// initializeAdminApp(); // Uncomment if using a shared utility

export async function POST(req: NextRequest) {
  try {
    // Authenticate user using ID token from Authorization header
    const authorizationHeader = req.headers.get('Authorization');
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }

    const idToken = authorizationHeader.substring(7);

    let decodedToken;
    try {
      // Verify the ID token using Firebase Admin SDK
      decodedToken = await getAuth().verifyIdToken(idToken);
    } catch (error: any) {
      console.error('Error verifying ID token:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userId = decodedToken.uid; // Get the authenticated user's UID

    const { accountSid, authToken, phoneNumber } = await req.json();

    if (!accountSid || !authToken || !phoneNumber) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // TODO: Optional: Validate Twilio credentials by making a test API call

    // Save credentials to the User table in PostgreSQL
    const updateResult = await pool.query(
      'UPDATE "User" SET "twilio_account_sid" = $1, "twilio_auth_token" = $2, "twilio_phone_number" = $3 WHERE "id" = $4 RETURNING *',
      [accountSid, authToken, phoneNumber, userId]
    );

    if (updateResult.rows.length === 0) {
      // User not found in the database, or update failed
      return NextResponse.json({ error: 'User not found or failed to update settings' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updateResult.rows[0] });

  } catch (error: any) {
    console.error('Error saving Twilio credentials:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
