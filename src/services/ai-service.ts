interface AIMessage {
  role: string;
  content: string;
}

interface AIResponse {
  success: boolean;
  message?: string;
  error?: any;
}

export class AIService {
  private provider: string;
  private apiKey: string;

  constructor(provider: string, apiKey: string) {
    this.provider = provider;
    this.apiKey = apiKey;
  }

  async generateResponse(systemPrompt: string, conversation: any[]): Promise<AIResponse> {
    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversation.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      switch (this.provider) {
        case 'openai':
          return await this.generateOpenAIResponse(messages);
        case 'claude':
          return await this.generateClaudeResponse(messages);
        default:
          return { success: false, error: `Unsupported AI provider: ${this.provider}` };
      }
    } catch (error) {
      console.error(`Error generating AI response with ${this.provider}:`, error);
      return { success: false, error };
    }
  }

  private async generateOpenAIResponse(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages,
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      const message = data.choices[0]?.message?.content?.trim();
      return message ? { success: true, message } : { success: false, error: 'No response generated' };
    } catch (error) {
      return { success: false, error };
    }
  }

  private async generateClaudeResponse(messages: AIMessage[]): Promise<AIResponse> {
    try {
      const systemPrompt = messages.find(m => m.role === 'system')?.content || '';
      const conversationMessages = messages.filter(m => m.role !== 'system');

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          system: systemPrompt,
          messages: conversationMessages,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const error = await response.json();
        return { success: false, error };
      }

      const data = await response.json();
      const message = data.content[0]?.text?.trim();
      return message ? { success: true, message } : { success: false, error: 'No response generated' };
    } catch (error) {
      return { success: false, error };
    }
  }
}