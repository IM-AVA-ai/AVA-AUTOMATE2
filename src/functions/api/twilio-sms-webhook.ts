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
import { v4 as uuidv4 } from 'uuid'; // Import uuid for generating IDs

// Initialize PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Use DATABASE_URL environment variable
});

// Remove global TwilioService initialization
// const twilioService = new TwilioService(process.env.TWILIO_ACCOUNT_SID || '', process.env.TWILIO_AUTH_TOKEN || '', process.env.TWILIO_PHONE_NUMBER || '');

const app = firebaseApp;
const db = getFirestore(app);

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const twilioSignature = req.headers.get('x-twilio-signature') || '';

    // Extract Twilio SMS data
    const messageSid = body.get('MessageSid') as string;
    const fromPhoneNumber = body.get('From') as string; // The sender's phone number (Lead's number)
    const toPhoneNumber = body.get('To') as string; // The recipient's phone number (User's Twilio number)
    const messageBody = body.get('Body') as string; // The message content

    if (!messageSid || !fromPhoneNumber || !toPhoneNumber || !messageBody) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        {
          status: 400,
        }
      );
    }

    const url = new URL(req.url);
    const fullUrl = `${url.protocol}//${url.host}${url.pathname}`;

    // --- Implement logic to find the User (Client) by their Twilio phone number using pg ---
    const userResult = await pool.query('SELECT "id", "twilio_account_sid", "twilio_auth_token", "twilio_phone_number" FROM "User" WHERE "twilio_phone_number" = $1', [toPhoneNumber]);
    const user = userResult.rows.length > 0 ? userResult.rows[0] : null;

    if (!user) {
      console.warn(`No user found with Twilio phone number: ${toPhoneNumber}`);
      // If no user is found for this Twilio number, we cannot process the message
      const response = new twiml.MessagingResponse();
      // Optionally send a message back indicating the number is not recognized
      // response.message('This number is not associated with an active account.');
      return new NextResponse(response.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    const clientId = user.id; // Use the found user's ID as the clientId
    const userTwilioAccountSid = user.twilio_account_sid;
    const userTwilioAuthToken = user.twilio_auth_token;
    const userTwilioPhoneNumber = user.twilio_phone_number; // This is the same as toPhoneNumber

    // Initialize TwilioService dynamically with the user's credentials
    const twilioService = new TwilioService(userTwilioAccountSid, userTwilioAuthToken, userTwilioPhoneNumber);

    // Use the user's Twilio Auth Token for validation
    const isValidRequest = validateRequest(
        userTwilioAuthToken || '', // Use the user's auth token for validation
        twilioSignature,
        fullUrl,
        Object.fromEntries(body)
      );

    if (!isValidRequest) {
      console.error('Invalid Twilio request signature for user:', clientId);
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const mediaUrl = body.get('MediaUrl0') as string | null;
    const mediaContentType = body.get('MediaContentType0') as string | null;

    console.log(`Received SMS from: ${fromPhoneNumber} to user's number: ${toPhoneNumber}. Message: ${messageBody}`);

    // --- Implement logic to find the lead by phone number using pg ---
    // Assuming Lead phone numbers are unique and stored in the "phone" column
    const leadsResult = await pool.query('SELECT * FROM "Lead" WHERE phone = $1', [fromPhoneNumber]);
    const lead = leadsResult.rows.length > 0 ? leadsResult.rows[0] : null;

    if (!lead) {
      console.warn(`No lead found for phone number: ${fromPhoneNumber} associated with user: ${clientId}`);
      // If no lead is found, we might want to handle this case
      // (e.g., create a new lead, send an automated response to the sender, etc.)
      const response = new twiml.MessagingResponse();
      response.message('Your message was received, but we could not find a matching lead.');
      return new NextResponse(response.toString(), {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    console.log(`Found lead for phone number ${fromPhoneNumber}: ${lead.id} for user: ${clientId}`);
    // --- End of logic to find the lead ---

    // --- Implement logic to find or create a conversation for the lead and user using pg ---
    // Find conversation specifically for this lead AND client (user)
    const conversationsResult = await pool.query('SELECT * FROM "Conversation" WHERE "leadId" = $1 AND "clientId" = $2 ORDER BY "createdAt" ASC', [lead.id, clientId]);

    let conversation = null;

    if (conversationsResult.rows.length > 0) {
      // Found existing conversations, use the first one for now
      // TODO: Add logic to find the "most active" or appropriate conversation if needed
      conversation = conversationsResult.rows[0];
      console.log(`Found existing conversation for lead ${lead.id} and user ${clientId}: ${conversation.id}`);
    } else {
      // No existing conversation found, create a new one
      // TODO: Determine how to get aiAgentId (e.g., from lead's recentCampaign, or default)
      const aiAgentId = 'TODO_GET_AI_AGENT_ID'; // Placeholder - needs to be determined based on user/lead/campaign context
      const newConversationId = uuidv4(); // Generate UUID for new conversation

      if (aiAgentId === 'TODO_GET_AI_AGENT_ID') {
          console.error('Cannot create conversation: aiAgentId not determined for user:', clientId);
          // Send an error response or a message to the lead
          const response = new twiml.MessagingResponse();
          response.message('Sorry, I am unable to start a new conversation at this time.');
          return new NextResponse(response.toString(), { status: 500, headers: { 'Content-Type': 'text/xml' } });
      }

      const insertConversationResult = await pool.query(
        'INSERT INTO "Conversation" ("id", "leadId", "clientId", "aiAgentId", "createdAt", "lastUpdatedAt") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [newConversationId, lead.id, clientId, aiAgentId, new Date().toISOString(), new Date().toISOString()]
      );
      conversation = insertConversationResult.rows[0];
      console.log(`Created new conversation for lead ${lead.id} and user ${clientId}: ${conversation.id}`);
    }
    // --- End of logic to find or create a conversation ---

    // --- Implement logic to record the inbound message in the Message table using pg ---
    // Format the timestamp in MM/DD/YY format and American Standard Time
    const timestamp = moment().tz('America/Chicago').format('MM/DD/YY h:mm A');
    const newMessageId = uuidv4(); // Generate UUID for new message

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
    // This should now use the aiAgentId determined when finding/creating the conversation
    const aiAgentResult = await pool.query('SELECT "systemPrompt" FROM "AIAgent" WHERE "id" = $1', [conversation.aiAgentId]);
    const aiAgent = aiAgentResult.rows.length > 0 ? aiAgentResult.rows[0] : {systemPrompt: "You are a helpful assistant"}; // Fallback prompt

    // 2. Construct the prompt
    const prompt = `
    ${aiAgent.systemPrompt}
    The lead said: ${messageBody}
    `;
    // 3. Call the Genkit model using the imported 'ai' instance
    let aiResponseText = 'Sorry, I am having trouble generating a response right now.'; // Default response
    try {
        // Assuming 'ai' is correctly initialized and configured in functions/ai-instance.ts
        // and can be used in this Next.js API route environment.
        const aiResponse = await ai.generateText({prompt});
        aiResponseText = aiResponse.text;
        console.log(`AI Agent Response: ${aiResponseText}`);
    } catch (error) {
        console.error('Error generating AI response:', error);
        // aiResponseText remains the default error message
    }
    // --- End of logic to trigger the AI agent and get a response ---

    // --- Implement logic to send the AI agent's response back via Twilio API ---
    // Use the TwilioService instance initialized earlier with user's credentials
    try {
      const smsResult = await twilioService.sendSMS(fromPhoneNumber, aiResponseText); // Send to the Lead's number
      if (smsResult.success) {
        console.log("Twilio success:", smsResult.messageSid);
        // Record the outbound message in the database
        const outboundMessageId = uuidv4();
        await pool.query(
          'INSERT INTO "Message" ("id", "conversationId", "sender", "text", "timestamp", "direction", "status") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [outboundMessageId, conversation.id, 'ASSISTANT', aiResponseText, moment().tz('America/Chicago').format('MM/DD/YY h:mm A'), 'OUTBOUND', 'sent']
        );
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
    // It's generally not recommended to send a TwiML message here if you are
    // sending the AI response immediately after via the REST API.
    // The TwiML response tells Twilio what to do *next* with the incoming message.
    // If you send a TwiML message AND use the REST API to send a message,
    // Twilio might send two messages back to the lead.
    // A common pattern is to respond with an empty TwiML <Response/> if you handle
    // the reply via the REST API.
    // response.message('Message received!'); // Removed to avoid double-sending

    return new NextResponse(response.toString(), {
      headers: { 'Content-Type': 'text/xml' },
    });

  } catch (error) {
    console.error('Error handling Twilio webhook:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
