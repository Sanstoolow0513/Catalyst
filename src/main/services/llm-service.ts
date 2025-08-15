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

// 定义提供商配置
interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  defaultHeaders?: Record<string>;
}

class LLMService {
  private static instance: LLMService;
  private providerConfigs: Map<string, ProviderConfig> = new Map();

  private constructor() {}

  public static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  // 设置提供商配置
  public setProviderConfig(provider: string, config: ProviderConfig) {
    this.providerConfigs.set(provider, config);
  }

  // 获取提供商配置
  public getProviderConfig(provider: string): ProviderConfig | undefined {
    return this.providerConfigs.get(provider);
  }

  // 获取支持的提供商列表
  public getProviders(): string[] {
    // In the future, this could be dynamic
    return ['openai', 'openrouter', 'custom'];
  }

  // 获取指定提供商的模型列表
  public getModels(provider: string): string[] {
    // In the future, this could be dynamic, fetched from an API
    switch (provider) {
      case 'openai':
        return ['gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo'];
      case 'openrouter':
        return ['anthropic/claude-3-opus', 'google/gemini-pro-1.5', 'mistralai/mistral-7b-instruct'];
      case 'custom':
        return ['custom-model-1', 'custom-model-2'];
      default:
        return [];
    }
  }

  public async generateCompletion(
    provider: string,
    model: string,
    messages: LLMMessage[],
    params: LLMParams = {}
  ): Promise<string> {
    // 获取提供商配置
    const providerConfig = this.providerConfigs.get(provider);
    
    // 如果是自定义提供商或有配置，使用自定义方法
    if (providerConfig) {
      return this.generateCustomCompletion(provider, model, messages, params, providerConfig);
    }
    
    // 默认使用OpenAI
    return this.generateOpenAICompletion(model, messages, params);
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

  private async generateCustomCompletion(
    provider: string,
    model: string,
    messages: LLMMessage[],
    params: LLMParams,
    config: ProviderConfig
  ): Promise<string> {
    const { baseUrl, apiKey, defaultHeaders = {} } = config;
    
    if (!apiKey) {
      throw new Error(`${provider} API key is not set.`);
    }

    // 构建请求URL
    const url = `${baseUrl}/chat/completions`;
    
    // 构建请求头
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
      ...defaultHeaders,
    };

    // 构建请求体
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
      throw new Error(`Invalid response structure from ${provider} API.`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`Error calling ${provider} API:`, error.response?.data || error.message);
      } else {
        console.error('An unexpected error occurred:', error);
      }
      throw new Error(`Failed to get completion from ${provider}.`);
    }
  }
}

export const llmService = LLMService.getInstance();