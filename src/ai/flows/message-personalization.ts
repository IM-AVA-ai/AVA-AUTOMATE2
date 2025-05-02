'use server';

/**
 * @fileOverview A flow for personalizing SMS messages based on lead data.
 *
 * - personalizeMessage - A function that personalizes an SMS message.
 * - PersonalizeMessageInput - The input type for the personalizeMessage function.
 * - PersonalizeMessageOutput - The return type for the personalizeMessage function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PersonalizeMessageInputSchema = z.object({
  leadName: z.string().describe('The name of the lead.'),
  leadLocation: z.string().describe('The location of the lead.'),
  pastInteractions: z.string().describe('A summary of past interactions with the lead.'),
  messageTemplate: z.string().describe('The template for the SMS message.'),
});
export type PersonalizeMessageInput = z.infer<typeof PersonalizeMessageInputSchema>;

const PersonalizeMessageOutputSchema = z.object({
  personalizedMessage: z.string().describe('The personalized SMS message.'),
});
export type PersonalizeMessageOutput = z.infer<typeof PersonalizeMessageOutputSchema>;

export async function personalizeMessage(input: PersonalizeMessageInput): Promise<PersonalizeMessageOutput> {
  return personalizeMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeMessagePrompt',
  input: {
    schema: z.object({
      leadName: z.string().describe('The name of the lead.'),
      leadLocation: z.string().describe('The location of the lead.'),
      pastInteractions: z.string().describe('A summary of past interactions with the lead.'),
      messageTemplate: z.string().describe('The template for the SMS message.'),
    }),
  },
  output: {
    schema: z.object({
      personalizedMessage: z.string().describe('The personalized SMS message.'),
    }),
  },
  prompt: `You are an AI assistant tasked with personalizing SMS messages for leads.

  Based on the following lead data and message template, generate a personalized SMS message.

  Lead Name: {{{leadName}}}
  Lead Location: {{{leadLocation}}}
  Past Interactions: {{{pastInteractions}}}
  Message Template: {{{messageTemplate}}}

  Personalized Message:`, 
});

const personalizeMessageFlow = ai.defineFlow<
  typeof PersonalizeMessageInputSchema,
  typeof PersonalizeMessageOutputSchema
>({
  name: 'personalizeMessageFlow',
  inputSchema: PersonalizeMessageInputSchema,
  outputSchema: PersonalizeMessageOutputSchema,
}, async input => {
  const {output} = await prompt(input);
  return {personalizedMessage: output!.personalizedMessage};
});
