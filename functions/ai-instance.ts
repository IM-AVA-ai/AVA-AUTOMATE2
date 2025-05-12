// src/ai/ai-instance.ts
import {GoogleAI, genkit} from '@genkit-ai/googleai';
import {z} from 'genkit';

const googleAIModel = new GoogleAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const ai = genkit({
  plugins: [googleAIModel],

  model: 'gemini-1.5-pro-latest',
  // The model to use for the flow.
  temperature: 0.7,
  
  responseSchema: z.object({
    response: z.string().describe('A response to the user.'),
  }),
});
