import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, query, where, getDocs, addDoc } from '@firebase/firestore';
import { twiml, validateRequest } from 'twilio';
import { app as firebaseApp } from '@/firebase/config';
import { TwilioService } from '@/services/twilio';
import { createConversation, getConversation } from '@/services/conversations';

const twilioService = new TwilioService(process.env.TWILIO_ACCOUNT_SID || '', process.env.TWILIO_AUTH_TOKEN || '', process.env.TWILIO_PHONE_NUMBER || '');
const app = firebaseApp;
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const twilioSignature = req.headers.get('x-twilio-signature') || '';

    // Extract Twilio SMS data
    const messageSid = body.get('MessageSid') as string;
    const from = body.get('From') as string;
    const to = body.get('To') as string;
    const message = body.get('Body') as string;
    
    if (!messageSid || !from || !to || !message) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { 
          status: 400,
        }
      );
    }

    const url = new URL(req.url);
    const fullUrl = `${url.protocol}//${url.host}${url.pathname}`;
    
    const isValidRequest = validateRequest(
        process.env.TWILIO_AUTH_TOKEN || '',
        twilioSignature,
        fullUrl,
        Object.fromEntries(body)
      );

        if (!isValidRequest) {
      console.error('Invalid Twilio request');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const mediaUrl = body.get('MediaUrl0') as string | null;
    const mediaContentType = body.get('MediaContentType0') as string | null;

    console.log('Received SMS from:', from, 'Message:', message);

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('phone', '==', from));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.error('No lead found with phone number:', from);
      return new NextResponse('No lead found', { status: 404 });
    }

    let leadId = '';
    querySnapshot.forEach((doc) => {
        leadId = doc.id
    });

    const conversationRef = collection(db, `leads/${leadId}/conversations`);
    let currentConversation = await getConversation(conversationRef);
    
    if (currentConversation === undefined) {
      currentConversation = await createConversation(conversationRef);
    }
    
    // Log the incoming message
    const smsMessagesRef = collection(db, 'sms_messages');
    await addDoc(smsMessagesRef, {
      lead_id: leadId,
      from,
      to: process.env.TWILIO_PHONE_NUMBER,
      direction: 'inbound',
      content: message,
      twilio_message_sid: messageSid,
      status: 'received',
      timestamp: new Date()
    });

    const messagesRef = collection(db, `leads/${leadId}/conversations/${currentConversation}/messages`);  
    await addDoc(messagesRef, {      
      body: message,
      from,
      mediaUrl: mediaUrl || null,
      mediaContentType: mediaContentType || null,
      timestamp: new Date(),
      direction: 'inbound',
    });

        // Send a TwiML response
        const response = new twiml.MessagingResponse();
        response.message('Message received!');
        await twilioService.sendSMS(from, 'Message received!');



    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}