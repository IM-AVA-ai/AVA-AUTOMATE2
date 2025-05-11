// src/ai/ai-instance.ts
import {GoogleAI, genkit} from '@genkit-ai/googleai';
import {z} from 'genkit';

const googleAIModel = new GoogleAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export const ai = genkit({
  plugins: [googleAIModel],
  // The default model to use for the flow.
  // You can override this in the flow definition.
  model: 'gemini-1.5-pro-latest',
  // The default temperature to use for the flow.
  // You can override this in the flow definition.
  temperature: 0.7,
  // The default response schema to use for the flow.
  // You can override this in the flow definition.
  responseSchema: z.object({
    response: z.string().describe('A response to the user.'),
  }),
});
