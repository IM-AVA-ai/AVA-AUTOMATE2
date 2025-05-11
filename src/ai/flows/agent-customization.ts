// src/ai/flows/agent-customization.ts
'use server';
/**
 * @fileOverview A flow for customizing the AI assistant's behavior and knowledge base for a specific industry.
 *
 * - customizeAgent - A function that handles the agent customization process.
 * - CustomizeAgentInput - The input type for the customizeAgent function.
 * - CustomizeAgentOutput - The return type for the customizeAgent function.
 */

import {ai} from '../../../functions/ai-instance';
import {z} from 'genkit';

const CustomizeAgentInputSchema = z.object({
  industry: z.string().describe('The industry the AI assistant will be tailored for (e.g., roofing, solar energy).'),
  sampleConversationStarters: z.string().describe('Example conversation starters to guide the AI assistant.'),
  industrySpecificKeywords: z.string().describe('Industry-specific keywords to help the AI assistant understand the context.'),
});
export type CustomizeAgentInput = z.infer<typeof CustomizeAgentInputSchema>;

const CustomizeAgentOutputSchema = z.object({
  customizedAssistantPrompt: z.string().describe('The customized prompt for the AI assistant.'),
});
export type CustomizeAgentOutput = z.infer<typeof CustomizeAgentOutputSchema>;

export async function customizeAgent(input: CustomizeAgentInput): Promise<CustomizeAgentOutput> {
  return customizeAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'customizeAgentPrompt',
  input: {
    schema: z.object({
      industry: z.string().describe('The industry the AI assistant will be tailored for (e.g., roofing, solar energy).'),
      sampleConversationStarters: z.string().describe('Example conversation starters to guide the AI assistant.'),
      industrySpecificKeywords: z.string().describe('Industry-specific keywords to help the AI assistant understand the context.'),
    }),
  },
  output: {
    schema: z.object({
      customizedAssistantPrompt: z.string().describe('The customized prompt for the AI assistant.'),
    }),
  },
  prompt: `You are an AI assistant customization expert. Your task is to generate a customized prompt for an AI assistant based on the provided industry, sample conversation starters, and industry-specific keywords.

Industry: {{{industry}}}
Sample Conversation Starters: {{{sampleConversationStarters}}}
Industry-Specific Keywords: {{{industrySpecificKeywords}}}


Based on this information, generate a detailed and effective prompt for the AI assistant:
`,
});

const customizeAgentFlow = ai.defineFlow<
  typeof CustomizeAgentInputSchema,
  typeof CustomizeAgentOutputSchema
>(
  {
    name: 'customizeAgentFlow',
    inputSchema: CustomizeAgentInputSchema,
    outputSchema: CustomizeAgentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {
      customizedAssistantPrompt: output!.customizedAssistantPrompt,
    };
  }
);
