import axios from 'axios';
import { apiKeyManager } from './api-key-manager';

// 定义通用的 LLM 参数类型
export type LLMParams = {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
};

// 定义通用的消息结构
export type LLMMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

class LLMService {
  private static instance: LLMService;

  private constructor() {}

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  public async generateCompletion(
    provider: 'openai', // 初始只支持 openai，未来可扩展为联合类型
    model: string,
    messages: LLMMessage[],
    params: LLMParams = {}
  ): Promise<string> {
    if (provider === 'openai') {
      return this.generateOpenAICompletion(model, messages, params);
    }
    throw new Error(`Unsupported LLM provider: ${provider}`);
  }

  private async generateOpenAICompletion(
    model: string,
    messages: LLMMessage[],
    params: LLMParams
  ): Promise<string> {
    const apiKey = apiKeyManager.getApiKey('openai');
    if (!apiKey) {
      throw new Error('OpenAI API key is not set.');
    }

    const url = 'https://api.openai.com/v1/chat/completions';
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    };

    const body = {
      model,
      messages,
      ...params,
    };

    try {
      const response = await axios.post(url, body, { headers });
      if (response.data.choices && response.data.choices.length > 0) {
        return response.data.choices[0].message.content;
      }
      throw new Error('Invalid response structure from OpenAI API.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error calling OpenAI API:', error.response?.data || error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      throw new Error('Failed to get completion from OpenAI.');
    }
  }
}

export const llmService = LLMService.getInstance();