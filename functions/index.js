const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { DataConnect } = require('@firebase/data-connect');
const twilio = require('twilio');
const moment = require('moment-timezone');  // Import moment-timezone
//const { ai } = require('./ai-instance'); // Access the ai instance  -- REMOVED see line 190 - 199


admin.initializeApp();

// Get your Twilio Auth Token securely (replace with your actual method)
// Example using Firebase Environment Configuration:
const authToken = functions.config().twilio.auth_token;
//const GOOGLE_GENAI_API_KEY = functions.config().google.genai_key // todo move this call to the ai block  --REMOVED moved to inside function
exports.processIncomingSMS = functions.https.onRequest(async (req, res) => {
  // Ensure this is a POST request from Twilio
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  // --- Implement Twilio signature validation ---
  const twilioSignature = req.headers['x-twilio-signature'];
  // Reconstruct the full request URL. Be mindful of proxy headers if using a load balancer or similar.\n
  const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  const params = req.body; // Twilio sends data as URL-encoded

  const isValid = twilio.validateRequest(
    authToken,
    twilioSignature,
    requestUrl,
    params
  );

  if (!isValid) {
    console.error('Invalid Twilio signature');
    return res.status(403).send('Forbidden'); // Reject requests with invalid signatures
  }
  // --- End of Twilio signature validation ---


  const twilioData = req.body;
  const fromPhoneNumber = twilioData.From; // The sender's phone number
  const messageBody = twilioData.Body; // The message content

  if (!fromPhoneNumber || !messageBody) {
    console.error('Missing phone number or message body in Twilio webhook');
    return res.status(400).send('Missing parameters');
  }

  try {
    const dataConnect = new DataConnect({ projectId: process.env.GCLOUD_PROJECT });

    // --- Implement logic to find the lead by phone number using Data Connect query ---
    const leads = await dataConnect.query({
      leadsByContact: { // Use the leadsByContact query
        phone: fromPhoneNumber,
      },
    });

    const lead = leads && leads.leadsByContact && leads.leadsByContact.length > 0 ? leads.leadsByContact[0] : null;

    if (!lead) {
      // If no lead is found, we might want to handle this case
      // (e.g., log an error, send an automated response to the sender, etc.)
      console.warn(`No lead found for phone number: ${fromPhoneNumber}`);
      // For now, send a simple response indicating the message was received but not processed
      return res.status(200).send('<Response><Message>Your message was received, but we could not find a matching lead.</Message></Response>');
    }

    console.log(`Found lead for phone number ${fromPhoneNumber}: ${lead.id}`);
    // --- End of logic to find the lead ---

    // --- Implement logic to find or create a conversation for the lead ---
    const conversationsResult = await dataConnect.query({
      conversationsByLead: { // Use the conversationsByLead query
        leadId: lead.id,
      },
    });

    let conversation = null;

    if (conversationsResult && conversationsResult.conversationsByLead && conversationsResult.conversationsByLead.length > 0) {
      // Found existing conversations, use the first one for now
      // TODO: Add logic to find the "most active" or appropriate conversation if needed
      conversation = conversationsResult.conversationsByLead[0];
      console.log(`Found existing conversation for lead ${lead.id}: ${conversation.id}`);
    } else {
      // No existing conversation found, create a new one
      // TODO: Determine how to get clientId (e.g., from lead, campaign, or user context)
      // TODO: Determine how to get aiAgentId (e.g., from lead's recentCampaign, or default)\n
      const clientId = 'TODO_GET_CLIENT_ID';
      const aiAgentId = 'TODO_GET_AI_AGENT_ID';

      if (clientId === 'TODO_GET_CLIENT_ID' || aiAgentId === 'TODO_GET_AI_AGENT_ID') {
          console.error('Cannot create conversation: clientId or aiAgentId not determined.');
          return res.status(500).send('Internal Server Error: Cannot create conversation.');
      }

      const newConversation = await dataConnect.mutate({
        insertConversation: {
          leadId: lead.id,
          clientId: clientId,
          aiAgentId: aiAgentId,
          createdAt: new Date().toISOString(),
          lastUpdatedAt: new Date().toISOString(),
        },
      });
      conversation = newConversation.insertConversation;
      console.log(`Created new conversation for lead ${lead.id}: ${conversation.id}`);
    }
    // --- End of logic to find or create a conversation ---
    // --- Implement logic to record the inbound message in the Message table using Data Connect mutation ---

       // Format the timestamp in MM/DD/YY format and American Standard Time
       const timestamp = moment().tz('America/Chicago').format('MM/DD/YY h:mm A');

       try {
         // Insert the new message into the Message table
         await dataConnect.mutate({
           insertMessage: {
             conversationId: conversation.id,
             sender: 'LEAD',
             text: messageBody,
             timestamp: timestamp,
             direction: 'INBOUND',
             status: 'new',
           },
         });
         console.log('Successfully recorded inbound message');
       } catch (error) {
         console.error('Error recording inbound message:', error);
       }
    // --- End of logic to record the inbound message ---
    // --- Implement logic to trigger the AI agent and get a response ---
        // 1. Load AI agent configuration from the database using aiAgentId
        const aiAgent = {systemPrompt: "You are a helpful assistant"}; //TODO - make the agent query

        // 2. Construct the prompt
        const prompt = `
        ${aiAgent.systemPrompt}
        The lead said: ${messageBody}
        `;
        // 3. Call the Genkit model
        try {
            const GOOGLE_GENAI_API_KEY = functions.config().google.genai_key // MUST BE WITHIN THIS FUNCTION or it may be undefined
            const ai = genkit({ //new code here
              promptDir: './prompts', //TODO you may need to change this to a location you have
              plugins: [
                googleAI({
                  apiKey: GOOGLE_GENAI_API_KEY, // functions.config().google.genai_key // this will be secured by firebase when deployed
                }),
             ],
             model: 'googleai/gemini-2.0-flash',
           });
           
            const aiResponse = await ai.generateText({prompt}); // I am having trouble making the genkit function known so I am fixing this
            //Get the text from the aiResponse
            const nextText  = aiResponse.text;
            console.log(`AI Agent Response: ${nextText}`);
        } catch (error) {
            console.error('Error generating AI response:', error);
            return 'Sorry, I am having trouble generating a response right now.';
        }
        //This is the AI respons
    // --- End of logic to trigger the AI agent and get a response ---
    // TODO: Implement logic to send the AI agent's response back via Twilio API
  } catch (error) {
    console.error('Error processing incoming SMS:', error);
    res.status(500).send('Internal Server Error');
  }
});

