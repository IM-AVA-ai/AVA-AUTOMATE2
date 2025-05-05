import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { firebaseConfig } from '../../firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const from = body.get('From') as string;
    const message = body.get('Body') as string;
    const mediaUrl = body.get('MediaUrl0') as string | null;
    const mediaContentType = body.get('MediaContentType0') as string | null;
    const messageSid = body.get('MessageSid') as string;

    if (!from || !message || !messageSid) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const leadsRef = collection(db, 'leads');
    const q = query(leadsRef, where('phone', '==', from));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new NextResponse(JSON.stringify({ error: 'Lead not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    let leadId = '';
    let clientId = '';
    querySnapshot.forEach((doc) => {
        leadId = doc.id;
        clientId = doc.data().client_id
    });

    const messagesCollection = collection(db, 'sms_messages');
    await addDoc(messagesCollection, {
        lead_id: leadId,
        client_id: clientId,
        direction: 'inbound',
        content: message,
        twilio_message_sid: messageSid,
        status: 'received',
        timestamp: new Date(),
        mediaUrl: mediaUrl || null,
        mediaContentType: mediaContentType || null
    });
    const conversationRef = collection(db, `leads/${leadId}/conversations`);
    const conversationsQuery = query(conversationRef, orderBy('timestamp', 'desc'), limit(1))
    const conversationSnapshot = await getDocs(conversationsQuery);
    let currentConversation = '';
    if(!conversationSnapshot.empty){
        conversationSnapshot.forEach(doc=> {
            currentConversation = doc.id;
        })
    } else {
        const newConversationRef = await addDoc(conversationRef,{
            timestamp: new Date(),
            created_at: new Date()
        })
        currentConversation = newConversationRef.id;
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
    
    fetch(`${req.nextUrl.origin}/api/generate-ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ leadId }),
    }).catch((err) => console.error('Error invoking generate-ai-response:', err));

    return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error processing incoming SMS:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
