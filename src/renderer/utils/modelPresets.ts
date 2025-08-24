import { ModelPreset, ConfigTemplate, ModelCapabilities } from '../types/chat';

// 常见模型预设配置
export const MODEL_PRESETS: ModelPreset[] = [
  // OpenAI 模型
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'openai',
    model: 'gpt-4o',
    baseUrl: 'https://api.openai.com/v1',
    description: '最新的多模态模型，支持文本、图像和音频',
    category: 'chat',
    isDefault: true
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'openai',
    model: 'gpt-4-turbo',
    baseUrl: 'https://api.openai.com/v1',
    description: '高性能的GPT-4模型，更快的响应速度',
    category: 'completion'
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    provider: 'openai',
    model: 'gpt-3.5-turbo',
    baseUrl: 'https://api.openai.com/v1',
    description: '经济高效的聊天模型',
    category: 'chat'
  },
  
  // Claude 模型
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'anthropic',
    model: 'claude-3-5-sonnet-20241022',
    baseUrl: 'https://api.anthropic.com/v1',
    description: 'Anthropic最新的高性能模型',
    category: 'completion'
  },
  
  // Gemini 模型
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    provider: 'gemini',
    model: 'gemini-pro',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    description: 'Google的高性能多模态模型',
    category: 'chat'
  },
  
  // 开源模型
  {
    id: 'llama-3.1-70b',
    name: 'Llama 3.1 70B',
    provider: 'openrouter',
    model: 'meta-llama/llama-3.1-70b-instruct',
    baseUrl: 'https://openrouter.ai/api/v1',
    description: 'Meta的开源大语言模型',
    category: 'completion'
  },
  
  // 代码专用模型
  {
    id: 'codestral',
    name: 'Codestral',
    provider: 'mistral',
    model: 'codestral-latest',
    baseUrl: 'https://api.mistral.ai/v1',
    description: 'Mistral专门用于代码生成的模型',
    category: 'code'
  }
];

// 模型能力映射
export const MODEL_CAPABILITIES: Record<string, ModelCapabilities> = {
  'gpt-4o': {
    maxTokens: 4096,
    supportsFunctions: true,
    supportsVision: true,
    supportsStream: true,
    contextWindow: 128000,
    inputCostPer1k: 5.00,
    outputCostPer1k: 15.00
  },
  'gpt-4-turbo': {
    maxTokens: 4096,
    supportsFunctions: true,
    supportsVision: true,
    supportsStream: true,
    contextWindow: 128000,
    inputCostPer1k: 10.00,
    outputCostPer1k: 30.00
  },
  'gpt-3.5-turbo': {
    maxTokens: 4096,
    supportsFunctions: true,
    supportsVision: false,
    supportsStream: true,
    contextWindow: 16385,
    inputCostPer1k: 0.50,
    outputCostPer1k: 1.50
  },
  'claude-3-5-sonnet-20241022': {
    maxTokens: 4096,
    supportsFunctions: true,
    supportsVision: true,
    supportsStream: true,
    contextWindow: 200000,
    inputCostPer1k: 3.00,
    outputCostPer1k: 15.00
  },
  'gemini-pro': {
    maxTokens: 2048,
    supportsFunctions: false,
    supportsVision: true,
    supportsStream: true,
    contextWindow: 32768,
    inputCostPer1k: 0.50,
    outputCostPer1k: 1.50
  }
};

// 配置模板
export const CONFIG_TEMPLATES: ConfigTemplate[] = [
  {
    id: 'balanced',
    name: '平衡模式',
    description: '适合日常对话的平衡配置',
    category: 'general',
    config: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      systemPrompt: 'You are a helpful assistant.'
    }
  },
  {
    id: 'creative',
    name: '创意模式',
    description: '适合创意写作和头脑风暴',
    category: 'creative',
    config: {
      temperature: 1.0,
      maxTokens: 4096,
      topP: 0.95,
      systemPrompt: 'You are a creative assistant that helps with brainstorming and creative writing.'
    }
  },
  {
    id: 'analytical',
    name: '分析模式',
    description: '适合逻辑分析和准确回答',
    category: 'analytical',
    config: {
      temperature: 0.3,
      maxTokens: 2048,
      topP: 0.8,
      systemPrompt: 'You are a precise and analytical assistant that provides accurate, well-reasoned responses.'
    }
  },
  {
    id: 'coding',
    name: '编程模式',
    description: '适合代码编写和技术问答',
    category: 'coding',
    config: {
      temperature: 0.1,
      maxTokens: 4096,
      topP: 0.8,
      systemPrompt: 'You are an expert programming assistant. Provide clean, well-commented code and detailed technical explanations.'
    }
  }
];

// 提供商配置
export const PROVIDER_CONFIGS = {
  openai: {
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com/v1',
    requiresAuth: true,
    authType: 'bearer',
    models: ['gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo']
  },
  anthropic: {
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com/v1',
    requiresAuth: true,
    authType: 'x-api-key',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-haiku-20240307']
  },
  gemini: {
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    requiresAuth: true,
    authType: 'api-key',
    models: ['gemini-pro', 'gemini-pro-vision']
  },
  openrouter: {
    name: 'OpenRouter',
    baseUrl: 'https://openrouter.ai/api/v1',
    requiresAuth: true,
    authType: 'bearer',
    models: ['meta-llama/llama-3.1-70b-instruct', 'anthropic/claude-3.5-sonnet']
  },
  mistral: {
    name: 'Mistral AI',
    baseUrl: 'https://api.mistral.ai/v1',
    requiresAuth: true,
    authType: 'bearer',
    models: ['mistral-large-latest', 'codestral-latest']
  }
};

// 根据提供商获取默认配置
export const getDefaultConfigForProvider = (provider: string) => {
  const preset = MODEL_PRESETS.find(p => p.provider === provider);
  return preset ? {
    provider: preset.provider,
    model: preset.model,
    baseUrl: preset.baseUrl
  } : null;
};

// 根据模型ID获取预设
export const getModelPreset = (modelId: string): ModelPreset | undefined => {
  return MODEL_PRESETS.find(preset => preset.id === modelId);
};

// 根据模型名获取能力信息
export const getModelCapabilities = (modelName: string): ModelCapabilities | undefined => {
  return MODEL_CAPABILITIES[modelName];
};

// 获取推荐的token限制
export const getRecommendedMaxTokens = (modelName: string): number => {
  const capabilities = getModelCapabilities(modelName);
  return capabilities?.maxTokens || 2048;
};

// 验证配置
export const validateConfig = (config: Partial<any>) => {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!config.provider) errors.push('请选择提供商');
  if (!config.model) errors.push('请输入模型名称');
  if (!config.apiKey) errors.push('请输入API密钥');
  if (!config.baseUrl) errors.push('请输入API基础URL');

  if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
    warnings.push('Temperature应在0-2之间');
  }

  if (config.maxTokens && config.maxTokens > 8192) {
    warnings.push('Max Tokens过大可能导致高延迟');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};