import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, query, where, getDocs, addDoc, orderBy, limit } from 'firebase/firestore';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { firebaseConfig } from '../../../firebase/config';
import { Twilio } from 'twilio';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { leadId } = await req.json();

    if (!leadId) {
      return new NextResponse(JSON.stringify({ error: 'leadId is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const leadDocRef = doc(db, 'leads', leadId);
    const leadDocSnap = await getDoc(leadDocRef);

    if (!leadDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'Lead not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const leadData = leadDocSnap.data();
    const clientId = leadData?.client_id

    const apiKeyDocRef = doc(db, 'clients', clientId, 'api_keys', 'active');
    const apiKeyDocSnap = await getDoc(apiKeyDocRef)

    if(!apiKeyDocSnap.exists()){
      return new NextResponse(JSON.stringify({ error: 'No active API Key found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const activeApiKey = apiKeyDocSnap.data()?.api_key

    const clientSettingsDocRef = doc(db, 'clients', clientId, 'settings', 'twilio');
    const clientSettingsDocSnap = await getDoc(clientSettingsDocRef);
    if (!clientSettingsDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'No twilio settings found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }
    const clientSettings = clientSettingsDocSnap.data();
    const twilioSid = clientSettings?.account_sid;
    const twilioToken = clientSettings?.auth_token;
    const twilioPhone = clientSettings?.phone_number;


    const conversationsRef = collection(db, `leads/${leadId}/conversations`);
    const conversationsQuery = query(conversationsRef, orderBy('timestamp', 'asc'));
    const conversationsSnapshot = await getDocs(conversationsQuery);

    let conversationHistory: any[] = [];
    conversationsSnapshot.forEach((doc) => {
      conversationHistory.push(doc.data());
    });
    const messagesRef = collection(db, `leads/${leadId}/conversations/${conversationHistory.slice(-1)[0].id}/messages`);
    const messagesQuery = query(messagesRef, orderBy('timestamp', 'asc'));
    const messagesSnapshot = await getDocs(messagesQuery);
    let messagesHistory: any[] = [];
    messagesSnapshot.forEach((doc) => {
        messagesHistory.push(doc.data());
    });

    const systemPromptDocRef = doc(db, 'clients', clientId, 'ai_settings', 'system_prompt');
    const systemPromptDocSnap = await getDoc(systemPromptDocRef);
    const systemPrompt = systemPromptDocSnap.data()?.content || '';
    const userPreferencesDocRef = doc(db, 'clients', clientId, 'ai_settings', 'user_preferences');
    const userPreferencesDocSnap = await getDoc(userPreferencesDocRef);
    const userPreferences = userPreferencesDocSnap.data()?.content || '';
    const gemini = new GoogleGenerativeAI(activeApiKey);
    const model = gemini.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      generationConfig: {
        maxOutputTokens: 200,
      },
    });
    const history = messagesHistory.map(message=> ({
        role: message.direction === 'inbound' ? 'user' : 'model',
        parts: message.body
    }))
    const result = await chat.sendMessageStream([systemPrompt, userPreferences, ...history]);
    let response = "";
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      response = response.concat(chunkText)
    }
    await addDoc(messagesRef, {
        body: response,
        timestamp: new Date(),
        direction: 'outbound'
    });

    const twilioClient = new Twilio(twilioSid, twilioToken);
    await twilioClient.messages.create({
        to: leadData.phone,
        from: twilioPhone,
        body: response
    }).then(message=>{
        console.log(message)
    }).catch(error=>{
        console.error(error)
    })

    return new NextResponse(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}