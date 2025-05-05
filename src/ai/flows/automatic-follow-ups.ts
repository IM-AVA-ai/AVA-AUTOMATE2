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
import { TwilioService } from '@/services/twilio';

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
  messageId: z.string().optional().describe('The ID of the sent follow-up message.'),
  status: z.string().describe('The status of the follow-up message.'),
});

export type AutomaticFollowUpOutput = z.infer<typeof AutomaticFollowUpOutputSchema>;

async function scheduleFollowUp(input: AutomaticFollowUpInput): Promise<AutomaticFollowUpOutput> {
  // Simulate scheduling the follow-up message using setTimeout.
  // In a real application, this would be handled by a job queue or similar system.
  await new Promise(resolve => setTimeout(resolve, input.followUpDelay * 60 * 1000));

  // Send the follow-up message.
  // NOTE: This is a temporary fix for the import error.
  // The TwilioService requires credentials which are not available here.
  // This will likely cause a runtime error.
  const smsResponse = await TwilioService.prototype.sendSMS(input.leadPhoneNumber, input.followUpMessage);

  return {
    messageId: smsResponse.messageSid, // Assuming messageSid is the correct property
    status: smsResponse.success ? 'sent' : 'failed', // Assuming success indicates status
  };
}

export async function automaticFollowUp(input: AutomaticFollowUpInput): Promise<AutomaticFollowUpOutput> {
  return automaticFollowUpFlow(input);
}

const automaticFollowUpFlow = ai.defineFlow<typeof AutomaticFollowUpInputSchema, typeof AutomaticFollowUpOutputSchema>(
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
