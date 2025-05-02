import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { twiml } from 'twilio';
import { firebaseConfig } from '../../../firebase/config';
import { validateTwilioRequest } from '../../../services/twilio';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const twilioSignature = req.headers.get('x-twilio-signature') || '';
    const url = new URL(req.url);
    const fullUrl = `${url.protocol}//${url.host}${url.pathname}`;
    
    const isValidRequest = validateTwilioRequest(
      twilioSignature,
      fullUrl,
      Object.fromEntries(body)
    );

    if (!isValidRequest) {
      console.error('Invalid Twilio request');
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const from = body.get('From') as string;
    const message = body.get('Body') as string;
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
    const conversationsQuery = query(conversationRef, orderBy('timestamp', 'desc'), limit(1))
    const conversationSnapshot = await getDocs(conversationsQuery);
    let currentConversation = '';
    if(!conversationSnapshot.empty){
        conversationSnapshot.forEach(doc=>{
            currentConversation = doc.id
        })
    } else {
        const newConversationRef = await addDoc(conversationRef,{
            timestamp: new Date(),
            created_at: new Date()
        })
        currentConversation = newConversationRef.id
    }

    const messagesRef = collection(db, `leads/${leadId}/conversations/${currentConversation}/messages`);
    await addDoc(messagesRef, {
        body: message,
        from,
        mediaUrl: mediaUrl || null,
        mediaContentType: mediaContentType || null,
        timestamp: new Date(),
        direction: 'inbound',
    });

    const response = new twiml.MessagingResponse();
    response.message('Message received!');

    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}