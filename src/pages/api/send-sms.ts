import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';
import { firebaseConfig } from '../../../firebase/config';
import { sendSMS } from '../../../services/twilio';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { leadId, message, clientId } = await req.json();

    if (!leadId || !message || !clientId) {
      return new NextResponse(JSON.stringify({ error: 'leadId, message, and clientId are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const leadDocRef = doc(db, 'leads', leadId);
    const leadDocSnap = await getDoc(leadDocRef);

    if (!leadDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'Lead not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const leadData = leadDocSnap.data();
    const phone = leadData?.phone

    const twilioCredentialsDocRef = doc(db, 'clients', clientId, 'settings', 'twilio');
    const twilioCredentialsDocSnap = await getDoc(twilioCredentialsDocRef);

    if (!twilioCredentialsDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'No active Twilio credentials found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const twilioCredentials = twilioCredentialsDocSnap.data();
    const accountSid = twilioCredentials?.account_sid;
    const authToken = twilioCredentials?.auth_token;
    const twilioNumber = twilioCredentials?.phone_number

    if (!accountSid || !authToken || !twilioNumber) {
        return new NextResponse(JSON.stringify({ error: 'Incomplete Twilio credentials' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const smsResult = await sendSMS({to: phone, body: message, accountSid, authToken, from: twilioNumber });
    
    if (!smsResult.success) {
      console.error('Error sending SMS:', smsResult.error);
      return new NextResponse(JSON.stringify({ error: 'Failed to send SMS' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const messagesCollection = collection(db, 'sms_messages');
    await addDoc(messagesCollection, {
        lead_id: leadId,
        client_id: clientId,
        direction: 'outbound',
        content: message,
        twilio_message_sid: smsResult.messageSid,
        status: 'sent',
        timestamp: new Date()
    });

    return new NextResponse(JSON.stringify({ success: true, messageSid: smsResult.messageSid }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}