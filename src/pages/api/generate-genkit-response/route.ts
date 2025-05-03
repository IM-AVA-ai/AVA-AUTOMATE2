import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/firebase/config';
import { getGenkitResponse } from '@/services/genkit';

const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const { prompt, userId } = await req.json();

    if (!prompt || !userId) {
      return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const userData = userDocSnap.data();
    const systemPrompt = userData?.systemPrompt;

    if(!systemPrompt){
        return new NextResponse(JSON.stringify({ error: 'System Prompt not found' }), { status: 404, headers: { 'Content-Type\': \'application/json\' } });
    }

    const response = await getGenkitResponse(prompt, systemPrompt);

    return new NextResponse(JSON.stringify({ response }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error generating Genkit response:', error);
    return new NextResponse(JSON.stringify({ error: 'Error generating response' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}