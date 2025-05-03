// src/services/genkit.ts
import { generate } from 'genkit';

export const getGenkitResponse = async (prompt: string, systemPrompt: string): Promise<string | null> => {
  try {
    const result = await generate({
      prompt: `${systemPrompt}\n${prompt}`,
      tools: [],
      model: "gemini-pro"
    });

    return result.text ?? null;
  } catch (error) {
    console.error('Error generating Genkit response:', error);
    return null;
  }
};