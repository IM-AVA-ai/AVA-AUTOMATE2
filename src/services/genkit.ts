// src/services/genkit.ts
import { ai } from '../../functions/ai-instance';

export const getGenkitResponse = async (prompt: string, systemPrompt: string): Promise<string | null> => {
  try {
    const result = await ai.generate({
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
