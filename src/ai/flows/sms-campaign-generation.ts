'use server';
/**
 * @fileOverview A flow to generate a set of SMS messages for an SMS campaign.
 *
 * - generateSmsCampaign - A function that handles the generation of SMS messages for a campaign.
 * - GenerateSmsCampaignInput - The input type for the generateSmsCampaign function.
 * - GenerateSmsCampaignOutput - The return type for the generateSmsCampaign function.
 */

import {ai} from '../../../functions/ai-instance';
import {z} from 'genkit';

const GenerateSmsCampaignInputSchema = z.object({
  subject: z.string().describe('The subject of the SMS campaign.'),
  targetAudience: z.string().describe('The target audience for the SMS campaign.'),
  toneOfVoice: z.string().describe('The desired tone of voice for the SMS messages.'),
  numberOfMessages: z
    .number()
    .default(3)
    .describe('The number of SMS messages to generate for the campaign.'),
});
export type GenerateSmsCampaignInput = z.infer<typeof GenerateSmsCampaignInputSchema>;

const GenerateSmsCampaignOutputSchema = z.object({
  messages: z.array(z.string()).describe('The generated SMS messages for the campaign.'),
});
export type GenerateSmsCampaignOutput = z.infer<typeof GenerateSmsCampaignOutputSchema>;

export async function generateSmsCampaign(input: GenerateSmsCampaignInput): Promise<GenerateSmsCampaignOutput> {
  return generateSmsCampaignFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSmsCampaignPrompt',
  input: {
    schema: z.object({
      subject: z.string().describe('The subject of the SMS campaign.'),
      targetAudience: z.string().describe('The target audience for the SMS campaign.'),
      toneOfVoice: z.string().describe('The desired tone of voice for the SMS messages.'),
      numberOfMessages: z
        .number()
        .default(3)
        .describe('The number of SMS messages to generate for the campaign.'),
    }),
  },
  output: {
    schema: z.object({
      messages: z.array(z.string()).describe('The generated SMS messages for the campaign.'),
    }),
  },
  prompt: `You are an expert copywriter specializing in SMS campaigns. Your goal is to generate a series of engaging SMS messages for a given campaign.

  Subject: {{subject}}
  Target Audience: {{targetAudience}}
  Tone of Voice: {{toneOfVoice}}

  Generate {{numberOfMessages}} distinct SMS messages for this campaign. Each message should be concise and attention-grabbing.
  Ensure that the messages are tailored to the target audience and reflect the specified tone of voice. The output should be an array of strings, each representing an SMS message.

  The generated messages should be highly likely to drive engagement and encourage recipients to take action. Focus on clear and compelling language.
  `,
});

const generateSmsCampaignFlow = ai.defineFlow<
  typeof GenerateSmsCampaignInputSchema,
  typeof GenerateSmsCampaignOutputSchema
>(
  {
    name: 'generateSmsCampaignFlow',
    inputSchema: GenerateSmsCampaignInputSchema,
    outputSchema: GenerateSmsCampaignOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
