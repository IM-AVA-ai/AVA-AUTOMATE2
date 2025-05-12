import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, collection, query, where, getDocs, addDoc, doc, getDoc, orderBy, limit } from 'firebase/firestore';
import { twiml, validateRequest } from 'twilio';
import { app as firebaseApp } from '@/firebase/config';
import { TwilioService } from '@/services/twilio';
import { createConversation, getConversation } from '@/services/conversations';
// Import the pg library
import { Pool } from 'pg';
import moment from 'moment-timezone'; // Import moment-timezone
// Corrected Genkit imports based on src/ai/flows/agent-customization.ts
import { ai } from '../../../functions/ai-instance'; // Import the Genkit instance
import { z } from 'genkit'; // Import z from Genkit

const twilioService = new TwilioService(process.env.TWILIO_ACCOUNT_SID || '', process.env.TWILIO_AUTH_TOKEN || '', process.env.TWILIO_PHONE_NUMBER || '');
const app = firebaseApp;
const db = getFirestore(app);

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL environment variable
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const twilioSignature = req.headers.get('x-twilio-signature') || '';

    // Extract Twilio SMS data
    const messageSid = body.get('MessageSid') as string;
    const fromPhoneNumber = body.get('From') as string; // Renamed to match functions/index.js
    const to = body.get('To') as string;
    const messageBody = body.get('Body') as string; // Renamed to match functions/index.js

    if (!messageSid || !fromPhoneNumber || !to || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        {
          status: 400,
        }
      );
    }

    const url = new URL(req.url);
    const fullUrl = `${url.protocol}//${url.host}${url.pathname}`;

    // Use the Twilio Auth Token from environment variables for validation
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

    console.log('Received SMS from:', fromPhoneNumber, 'Message:', messageBody);

    // --- Implement logic to find the lead by phone number using pg ---
    const leadsResult = await pool.query('SELECT * FROM "Lead" WHERE phone = $1', [fromPhoneNumber]);
    const lead = leadsResult.rows.length > 0 ? leadsResult.rows[0] : null;

    if (!lead) {
      console.warn(`No lead found for phone number: ${fromPhoneNumber}`);
      // Send a simple response indicating the message was received but not processed
      const response = new twiml.MessagingResponse();
      response.message('Your message was received, but we could not find a matching lead.');
      return new NextResponse(response.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    console.log(`Found lead for phone number ${fromPhoneNumber}: ${lead.id}`);
    // --- End of logic to find the lead ---

    // --- Implement logic to find or create a conversation for the lead using pg ---
    const conversationsResult = await pool.query('SELECT * FROM "Conversation" WHERE "leadId" = $1 ORDER BY "createdAt" ASC', [lead.id]);

    let conversation = null;

    if (conversationsResult.rows.length > 0) {
      // Found existing conversations, use the first one for now
      // TODO: Add logic to find the "most active" or appropriate conversation if needed
      conversation = conversationsResult.rows[0];
      console.log(`Found existing conversation for lead ${lead.id}: ${conversation.id}`);
    } else {
      // No existing conversation found, create a new one
      // TODO: Determine how to get clientId (e.g., from lead, campaign, or user context)
      // TODO: Determine how to get aiAgentId (e.g., from lead's recentCampaign, or default)
      const clientId = 'TODO_GET_CLIENT_ID'; // Placeholder
      const aiAgentId = 'TODO_GET_AI_AGENT_ID'; // Placeholder
      const newConversationId = require('uuid').v4(); // Generate UUID for new conversation

      if (clientId === 'TODO_GET_CLIENT_ID' || aiAgentId === 'TODO_GET_AI_AGENT_ID') {
          console.error('Cannot create conversation: clientId or aiAgentId not determined.');
          return new NextResponse('Internal Server Error: Cannot create conversation.', { status: 500 });
      }

      const insertConversationResult = await pool.query(
        'INSERT INTO "Conversation" ("id", "leadId", "clientId", "aiAgentId", "createdAt", "lastUpdatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [newConversationId, lead.id, clientId, aiAgentId, new Date().toISOString(), new Date().toISOString()]
      );
      conversation = insertConversationResult.rows[0];
      console.log(`Created new conversation for lead ${lead.id}: ${conversation.id}`);
    }
    // --- End of logic to find or create a conversation ---

    // --- Implement logic to record the inbound message in the Message table using pg ---
    // Format the timestamp in MM/DD/YY format and American Standard Time
    const timestamp = moment().tz('America/Chicago').format('MM/DD/YY h:mm A');
    const newMessageId = require('uuid').v4(); // Generate UUID for new message

    try {
      await pool.query(
        'INSERT INTO "Message" ("id", "conversationId", "sender", "text", "timestamp", "direction", "status") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [newMessageId, conversation.id, 'LEAD', messageBody, timestamp, 'INBOUND', 'new']
      );
      console.log('Successfully recorded inbound message');
    } catch (error) {
      console.error('Error recording inbound message:', error);
    }
    // --- End of logic to record the inbound message ---

    // --- Implement logic to trigger the AI agent and get a response using Genkit ---
    // 1. Load AI agent configuration from the database using aiAgentId (Placeholder)
    const aiAgent = {systemPrompt: "You are a helpful assistant"}; //TODO - make the agent query

    // 2. Construct the prompt
    const prompt = `
    ${aiAgent.systemPrompt}
    The lead said: ${messageBody}
    `;
    // 3. Call the Genkit model using the imported 'ai' instance
    let aiResponseText = 'Sorry, I am having trouble generating a response right now.'; // Default response
    try {
        const aiResponse = await ai.generateText({prompt});
        aiResponseText = aiResponse.text;
        console.log(`AI Agent Response: ${aiResponseText}`);
    } catch (error) {
        console.error('Error generating AI response:', error);
        // aiResponseText remains the default error message
    }
    // --- End of logic to trigger the AI agent and get a response ---

    // --- Implement logic to send the AI agent's response back via Twilio API ---
    // Use the TwilioService instance initialized earlier
    try {
      const smsResult = await twilioService.sendSMS(fromPhoneNumber, aiResponseText);
      if (smsResult.success) {
        console.log("Twilio success:", smsResult.messageSid);
        // Optionally record the outbound message in the database here if not handled by another process
        // Example:
        // const outboundMessageId = require('uuid').v4();
        // await pool.query(
        //   'INSERT INTO "Message" ("id", "conversationId", "sender", "text", "timestamp", "direction", "status") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        //   [outboundMessageId, conversation.id, 'ASSISTANT', aiResponseText, moment().tz('America/Chicago').format('MM/DD/YY h:mm A'), 'OUTBOUND', 'sent']
        // );
      } else {
        console.error("Twilio error:", smsResult.error);
        // Handle Twilio sending failure
      }
    } catch (e) {
      console.error("Twilio error during send:", e);
      // Handle unexpected errors during Twilio send
    }
    // --- End of implement logic to send the AI agent's response back via Twilio API ---

    // Send a TwiML response to acknowledge receipt to Twilio
    const response = new twiml.MessagingResponse();
    // You might not want to send a "Message received!" confirmation SMS here
    // if the AI response is sent immediately after.
    // The TwiML response is primarily to tell Twilio the webhook was processed successfully.
    // response.message('Message received!'); // Optional: send a simple TwiML message back

    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
