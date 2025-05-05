import { NextRequest, NextResponse } from 'next/server';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { firebaseConfig } from '../../firebase/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function POST(req: NextRequest) {
    try {
        const { assistantId, message } = await req.json();

        if (!assistantId || !message) {
            return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
        }

        const assistantDocRef = doc(db, 'assistants', assistantId);
        const assistantDocSnap = await getDoc(assistantDocRef);

        if (!assistantDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'Assistant not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const assistantData = assistantDocSnap.data();
        const clientId = assistantData?.client_id;
        const systemPrompt = assistantData?.system_prompt || 'You are a helpful AI assistant.';

        const apiKeyDocRef = doc(db, 'clients', clientId, 'api_keys', 'active');
        const apiKeyDocSnap = await getDoc(apiKeyDocRef);

        if (!apiKeyDocSnap.exists()) {
            return new NextResponse(JSON.stringify({ error: 'No active API Key found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
        }

        const apiKeyData = apiKeyDocSnap.data();
        const activeApiKey = apiKeyData?.api_key;

        const messagesCollection = collection(db, `assistants/${assistantId}/messages`);
        const messagesQuery = query(messagesCollection, orderBy('timestamp', 'asc'));
        const messagesSnapshot = await getDocs(messagesQuery);
        let messagesHistory: any[] = [];
        messagesSnapshot.forEach(doc => {
            messagesHistory.push(doc.data());
        });
        const gemini = new GoogleGenerativeAI(activeApiKey);
        const model = gemini.getGenerativeModel({ model: "gemini-pro" });
        const chat = model.startChat({});
        const history = messagesHistory.map(message => ({
            role: message.role,
            parts: message.content
        }))

        const result = await chat.sendMessageStream([systemPrompt, ...history, message]);
        let response = "";
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            response = response.concat(chunkText)
        }
        return new NextResponse(JSON.stringify({ message: response }), {
            headers: { 'Content-Type': 'application/json' },
            status: 200
        });
    } catch (error) {
        console.error('Error generating AI response:', error);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
