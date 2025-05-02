'use server';

/**
 * @fileOverview This file defines the automatic follow-up flow.
 *
 * It includes:
 * - `automaticFollowUp`: A function to schedule and send follow-up messages based on lead responses or lack thereof.
 * - `AutomaticFollowUpInput`: The input type for the `automaticFollowUp` function.
 * - `AutomaticFollowUpOutput`: The output type for the `automaticFollowUp` function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {sendSms} from '@/services/twilio';

const AutomaticFollowUpInputSchema = z.object({
  leadId: z.string().describe('The ID of the lead.'),
  leadPhoneNumber: z.string().describe('The phone number of the lead.'),
  lastMessageSent: z.string().describe('The content of the last message sent to the lead.'),
  lastMessageReceived: z.string().optional().describe('The content of the last message received from the lead, if any.'),
  followUpDelay: z.number().describe('The delay in minutes before sending the follow-up message.'),
  followUpMessage: z.string().describe('The content of the follow-up message.'),
});

export type AutomaticFollowUpInput = z.infer<typeof AutomaticFollowUpInputSchema>;

const AutomaticFollowUpOutputSchema = z.object({
  messageId: z.string().describe('The ID of the sent follow-up message.'),
  status: z.string().describe('The status of the follow-up message.'),
});

export type AutomaticFollowUpOutput = z.infer<typeof AutomaticFollowUpOutputSchema>;

async function scheduleFollowUp(input: AutomaticFollowUpInput): Promise<AutomaticFollowUpOutput> {
  // Simulate scheduling the follow-up message using setTimeout.
  // In a real application, this would be handled by a job queue or similar system.
  await new Promise(resolve => setTimeout(resolve, input.followUpDelay * 60 * 1000));

  // Send the follow-up message.
  const smsResponse = await sendSms(input.leadPhoneNumber, input.followUpMessage);

  return {
    messageId: smsResponse.messageId,
    status: smsResponse.status,
  };
}

export async function automaticFollowUp(input: AutomaticFollowUpInput): Promise<AutomaticFollowUpOutput> {
  return automaticFollowUpFlow(input);
}

const automaticFollowUpFlow = ai.defineFlow<AutomaticFollowUpInputSchema, AutomaticFollowUpOutputSchema>(
  {
    name: 'automaticFollowUpFlow',
    inputSchema: AutomaticFollowUpInputSchema,
    outputSchema: AutomaticFollowUpOutputSchema,
  },
  async input => {
    // Call the scheduleFollowUp function to simulate scheduling and sending the follow-up message.
    return scheduleFollowUp(input);
  }
);
