import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { firebaseConfig } from '../../firebase/config';
import { TwilioService } from '../../services/twilio'; // Import TwilioService

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Define interface for Lead data
interface LeadData {
    id: string;
    phone: string;
    // Add other lead properties if needed
}

export async function POST(req: NextRequest) {
    try {
        const { assistantId, leadIds } = await req.json();

        if (!assistantId || !leadIds || !Array.isArray(leadIds)) {
            return new NextResponse(JSON.stringify({ error: 'assistantId and leadIds (array) are required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const assistantDocRef = doc(db, 'assistants', assistantId);
        const assistantDocSnap = await getDoc(assistantDocRef);

        if (!assistantDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'Assistant not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const assistantData = assistantDocSnap.data();
        const clientId = assistantData?.client_id;
        const systemPrompt = assistantData?.system_prompt || 'You are a helpful AI assistant.';

        const leadsQuery = query(collection(db, 'leads'), where('__name__', 'in', leadIds));
        const leadsSnapshot = await getDocs(leadsQuery);

        if (leadsSnapshot.empty) {
            return new NextResponse(JSON.stringify({ error: 'No leads found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        // Type the leads array
        const leads: LeadData[] = leadsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LeadData));

        const apiKeyDocRef = doc(db, 'clients', clientId, 'api_keys', 'active');
        const apiKeyDocSnap = await getDoc(apiKeyDocRef);

        if (!apiKeyDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'No active API Key found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        const activeApiKey = apiKeyDocSnap.data()?.api_key;

        const twilioCredentialsDocRef = doc(db, 'clients', clientId, 'settings', 'twilio');
        const twilioCredentialsDocSnap = await getDoc(twilioCredentialsDocRef);

        if (!twilioCredentialsDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'No active Twilio credentials found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        const twilioCredentials = twilioCredentialsDocSnap.data();
        const accountSid = twilioCredentials?.account_sid;
        const authToken = twilioCredentials?.auth_token;
        const twilioNumber = twilioCredentials?.phone_number;

        if (!accountSid || !authToken || !twilioNumber) {
            return new NextResponse(JSON.stringify({ error: 'Incomplete Twilio credentials' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
        }

        const results: { leadId: string; success: boolean; messageSid?: string; error?: any; }[] = [];
        const gemini = new GoogleGenerativeAI(activeApiKey);
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });

        for (const lead of leads) {
            try {
                const chat = model.startChat({});
                const result = await chat.sendMessageStream([systemPrompt, `Here is information about the lead: ${JSON.stringify(lead)}`]);
                let response = "";
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    response = response.concat(chunkText)
                }

                // Create TwilioService instance and call sendSMS method
                const twilioService = new TwilioService(accountSid, authToken, twilioNumber);
                const smsResult = await twilioService.sendSMS(lead.phone, response);

                if (smsResult.success) {
                    await addDoc(collection(db, 'sms_messages'), {
                        lead_id: lead.id,
                        client_id: clientId,
                        direction: 'outbound',
                        content: response,
                        twilio_message_sid: smsResult.messageSid,
                        status: 'sent',
                        timestamp: new Date()
                    });
                    results.push({ leadId: lead.id, success: true, messageSid: smsResult.messageSid });
                } else {
                    results.push({ leadId: lead.id, success: false, error: smsResult.error });
                }
            } catch (error) {
                console.error(`Error processing lead ${lead.id}:`, error);
                results.push({ leadId: lead.id, success: false, error });
            }
        }

        return new NextResponse(JSON.stringify({ results }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error sending bulk SMS:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
