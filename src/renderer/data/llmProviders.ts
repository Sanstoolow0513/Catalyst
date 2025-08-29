// LLM提供商配置系统
export interface LLMProvider {
  id: string;
  name: string;
  description: string;
  website: string;
  baseUrl: string;
  models: LLMModel[];
  parameters: LLMParameter[];
  features: ProviderFeatures;
  category: 'mainstream' | 'opensource' | 'specialized' | 'local';
  pricing?: {
    unit: string;
    inputPrice: number;
    outputPrice: number;
    currency: string;
  };
}

export interface LLMModel {
  id: string;
  name: string;
  description: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsJson: boolean;
  supportsVision: boolean;
  supportsThinking: boolean;
  category: 'chat' | 'completion' | 'embedding' | 'multimodal';
  parameters: string[];
}

export interface LLMParameter {
  key: string;
  name: string;
  description: string;
  type: 'number' | 'string' | 'boolean' | 'select';
  required: boolean;
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: any; label: string }[];
  advanced?: boolean;
}

export interface ProviderFeatures {
  streaming: boolean;
  jsonMode: boolean;
  vision: boolean;
  thinking: boolean;
  functionCalling: boolean;
  embeddings: boolean;
  fineTuning: boolean;
  moderation: boolean;
  batchProcessing: boolean;
}

export interface ProviderConfig {
  provider: string;
  baseUrl?: string;
  apiKey: string;
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  stop?: string[];
  systemPrompt: string;
  thinkingMode: boolean;
  thinkingTokens?: number;
  streamOutput: boolean;
  timeout: number;
  retryAttempts: number;
  costOptimization: boolean;
  advancedParams: Record<string, any>;
}

// 主流LLM提供商配置
export const LLM_PROVIDERS: LLMProvider[] = [
  // OpenAI
  {
    id: 'openai',
    name: 'OpenAI',
    description: '最流行的AI模型提供商，提供GPT系列模型',
    website: 'https://openai.com',
    baseUrl: 'https://api.openai.com/v1',
    models: [
      {
        id: 'gpt-4o',
        name: 'GPT-4o',
        description: '最新的多模态旗舰模型',
        maxTokens: 128000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      },
      {
        id: 'gpt-4o-mini',
        name: 'GPT-4o Mini',
        description: '经济高效的多模态模型',
        maxTokens: 128000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      },
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: '高性能的GPT-4模型',
        maxTokens: 128000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: '经典的经济型模型',
        maxTokens: 16385,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      }
    ],
    parameters: [
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-2之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      },
      {
        key: 'max_tokens',
        name: 'Max Tokens',
        description: '最大生成长度',
        type: 'number',
        required: false,
        defaultValue: 2048,
        min: 1,
        max: 8192
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01
      },
      {
        key: 'frequency_penalty',
        name: 'Frequency Penalty',
        description: '频率惩罚，-2到2之间',
        type: 'number',
        required: false,
        defaultValue: 0,
        min: -2,
        max: 2,
        step: 0.1,
        advanced: true
      },
      {
        key: 'presence_penalty',
        name: 'Presence Penalty',
        description: '存在惩罚，-2到2之间',
        type: 'number',
        required: false,
        defaultValue: 0,
        min: -2,
        max: 2,
        step: 0.1,
        advanced: true
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: true,
      thinking: false,
      functionCalling: true,
      embeddings: true,
      fineTuning: true,
      moderation: true,
      batchProcessing: true
    },
    category: 'mainstream',
    pricing: {
      unit: '1K tokens',
      inputPrice: 0.0025,
      outputPrice: 0.01,
      currency: 'USD'
    }
  },

  // Anthropic Claude
  {
    id: 'anthropic',
    name: 'Anthropic',
    description: '专注于AI安全的Claude系列模型',
    website: 'https://anthropic.com',
    baseUrl: 'https://api.anthropic.com',
    models: [
      {
        id: 'claude-3-5-sonnet-20241022',
        name: 'Claude 3.5 Sonnet',
        description: '最新的高性能模型',
        maxTokens: 200000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['max_tokens', 'temperature', 'top_p', 'top_k']
      },
      {
        id: 'claude-3-haiku-20240307',
        name: 'Claude 3 Haiku',
        description: '快速响应的轻量级模型',
        maxTokens: 200000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['max_tokens', 'temperature', 'top_p', 'top_k']
      }
    ],
    parameters: [
      {
        key: 'max_tokens',
        name: 'Max Tokens',
        description: '最大生成长度',
        type: 'number',
        required: true,
        defaultValue: 1024,
        min: 1,
        max: 8192
      },
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 1,
        step: 0.1
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 0.9,
        min: 0,
        max: 1,
        step: 0.01
      },
      {
        key: 'top_k',
        name: 'Top K',
        description: '采样候选数量',
        type: 'number',
        required: false,
        defaultValue: 40,
        min: 0,
        max: 500,
        advanced: true
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: true,
      thinking: false,
      functionCalling: true,
      embeddings: false,
      fineTuning: false,
      moderation: true,
      batchProcessing: true
    },
    category: 'mainstream',
    pricing: {
      unit: '1K tokens',
      inputPrice: 0.003,
      outputPrice: 0.015,
      currency: 'USD'
    }
  },

  // Google Gemini
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google的多模态AI模型系列',
    website: 'https://gemini.google.com',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    models: [
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        description: '高性能多模态模型',
        maxTokens: 2097152,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'maxOutputTokens', 'topP', 'topK']
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        description: '快速响应的轻量级模型',
        maxTokens: 1048576,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: true,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'maxOutputTokens', 'topP', 'topK']
      }
    ],
    parameters: [
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-2之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      },
      {
        key: 'maxOutputTokens',
        name: 'Max Output Tokens',
        description: '最大生成长度',
        type: 'number',
        required: false,
        defaultValue: 2048,
        min: 1,
        max: 8192
      },
      {
        key: 'topP',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 0.9,
        min: 0,
        max: 1,
        step: 0.01
      },
      {
        key: 'topK',
        name: 'Top K',
        description: '采样候选数量',
        type: 'number',
        required: false,
        defaultValue: 40,
        min: 1,
        max: 100,
        advanced: true
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: true,
      thinking: false,
      functionCalling: true,
      embeddings: true,
      fineTuning: false,
      moderation: true,
      batchProcessing: true
    },
    category: 'mainstream',
    pricing: {
      unit: '1M tokens',
      inputPrice: 1.25,
      outputPrice: 5.0,
      currency: 'USD'
    }
  },

  // DeepSeek
  {
    id: 'deepseek',
    name: 'DeepSeek',
    description: '中国领先的AI模型提供商，支持思考模式',
    website: 'https://deepseek.com',
    baseUrl: 'https://api.deepseek.com/v1',
    models: [
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        description: '通用对话模型',
        maxTokens: 32768,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: true,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      },
      {
        id: 'deepseek-coder',
        name: 'DeepSeek Coder',
        description: '代码专用模型',
        maxTokens: 16384,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p', 'frequency_penalty', 'presence_penalty']
      }
    ],
    parameters: [
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-2之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      },
      {
        key: 'max_tokens',
        name: 'Max Tokens',
        description: '最大生成长度',
        type: 'number',
        required: false,
        defaultValue: 2048,
        min: 1,
        max: 8192
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01
      },
      {
        key: 'frequency_penalty',
        name: 'Frequency Penalty',
        description: '频率惩罚，-2到2之间',
        type: 'number',
        required: false,
        defaultValue: 0,
        min: -2,
        max: 2,
        step: 0.1,
        advanced: true
      },
      {
        key: 'presence_penalty',
        name: 'Presence Penalty',
        description: '存在惩罚，-2到2之间',
        type: 'number',
        required: false,
        defaultValue: 0,
        min: -2,
        max: 2,
        step: 0.1,
        advanced: true
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: false,
      thinking: true,
      functionCalling: true,
      embeddings: true,
      fineTuning: false,
      moderation: false,
      batchProcessing: true
    },
    category: 'mainstream',
    pricing: {
      unit: '1K tokens',
      inputPrice: 0.0014,
      outputPrice: 0.0028,
      currency: 'USD'
    }
  },

  // Groq
  {
    id: 'groq',
    name: 'Groq',
    description: '超高速推理平台，提供极快的响应速度',
    website: 'https://groq.com',
    baseUrl: 'https://api.groq.com/openai/v1',
    models: [
      {
        id: 'llama-3.1-70b-versatile',
        name: 'Llama 3.1 70B Versatile',
        description: '高性能通用模型',
        maxTokens: 131072,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p']
      },
      {
        id: 'llama-3.1-8b-instant',
        name: 'Llama 3.1 8B Instant',
        description: '超快速响应模型',
        maxTokens: 131072,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p']
      }
    ],
    parameters: [
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-2之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 2,
        step: 0.1
      },
      {
        key: 'max_tokens',
        name: 'Max Tokens',
        description: '最大生成长度',
        type: 'number',
        required: false,
        defaultValue: 2048,
        min: 1,
        max: 8192
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: false,
      thinking: false,
      functionCalling: true,
      embeddings: false,
      fineTuning: false,
      moderation: false,
      batchProcessing: true
    },
    category: 'mainstream',
    pricing: {
      unit: '1M tokens',
      inputPrice: 0.59,
      outputPrice: 0.79,
      currency: 'USD'
    }
  },

  // Mistral AI
  {
    id: 'mistral',
    name: 'Mistral AI',
    description: '欧洲领先的AI模型提供商',
    website: 'https://mistral.ai',
    baseUrl: 'https://api.mistral.ai/v1',
    models: [
      {
        id: 'mistral-large-latest',
        name: 'Mistral Large',
        description: '高性能旗舰模型',
        maxTokens: 128000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p']
      },
      {
        id: 'open-mistral-nemo',
        name: 'Mistral Nemo',
        description: '多语言通用模型',
        maxTokens: 128000,
        supportsStreaming: true,
        supportsJson: true,
        supportsVision: false,
        supportsThinking: false,
        category: 'chat',
        parameters: ['temperature', 'max_tokens', 'top_p']
      }
    ],
    parameters: [
      {
        key: 'temperature',
        name: 'Temperature',
        description: '控制随机性，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 0.7,
        min: 0,
        max: 1,
        step: 0.1
      },
      {
        key: 'max_tokens',
        name: 'Max Tokens',
        description: '最大生成长度',
        type: 'number',
        required: false,
        defaultValue: 2048,
        min: 1,
        max: 8192
      },
      {
        key: 'top_p',
        name: 'Top P',
        description: '核采样，0-1之间',
        type: 'number',
        required: false,
        defaultValue: 1,
        min: 0,
        max: 1,
        step: 0.01
      }
    ],
    features: {
      streaming: true,
      jsonMode: true,
      vision: false,
      thinking: false,
      functionCalling: true,
      embeddings: true,
      fineTuning: false,
      moderation: false,
      batchProcessing: true
    },
    category: 'opensource',
    pricing: {
      unit: '1M tokens',
      inputPrice: 2.0,
      outputPrice: 6.0,
      currency: 'USD'
    }
  },

  // 更多提供商...
];

// 自定义提供商配置
export const CUSTOM_PROVIDER: LLMProvider = {
  id: 'custom',
  name: '自定义提供商',
  description: '配置自定义的LLM API端点',
  website: '',
  baseUrl: '',
  models: [],
  parameters: [
    {
      key: 'temperature',
      name: 'Temperature',
      description: '控制随机性',
      type: 'number',
      required: false,
      defaultValue: 0.7,
      min: 0,
      max: 2,
      step: 0.1
    },
    {
      key: 'max_tokens',
      name: 'Max Tokens',
      description: '最大生成长度',
      type: 'number',
      required: false,
      defaultValue: 2048,
      min: 1,
      max: 8192
    },
    {
      key: 'top_p',
      name: 'Top P',
      description: '核采样',
      type: 'number',
      required: false,
      defaultValue: 1,
      min: 0,
      max: 1,
      step: 0.01
    }
  ],
  features: {
    streaming: false,
    jsonMode: false,
    vision: false,
    thinking: false,
    functionCalling: false,
    embeddings: false,
    fineTuning: false,
    moderation: false,
    batchProcessing: false
  },
  category: 'specialized'
};

// 工具函数
export const getProviderById = (id: string): LLMProvider | undefined => {
  return LLM_PROVIDERS.find(provider => provider.id === id);
};

export const getModelById = (providerId: string, modelId: string): LLMModel | undefined => {
  const provider = getProviderById(providerId);
  return provider?.models.find(model => model.id === modelId);
};

export const getProvidersByCategory = (category: LLMProvider['category']): LLMProvider[] => {
  return LLM_PROVIDERS.filter(provider => provider.category === category);
};

export const getAllProviders = (): LLMProvider[] => {
  return [...LLM_PROVIDERS, CUSTOM_PROVIDER];
};

export const getDefaultModelForProvider = (providerId: string): string => {
  const provider = getProviderById(providerId);
  return provider?.models[0]?.id || '';
};

export const getProviderDefaults = (providerId: string): Partial<ProviderConfig> => {
  const provider = getProviderById(providerId);
  if (!provider) return {};

  const defaults: Partial<ProviderConfig> = {
    provider: providerId,
    baseUrl: provider.baseUrl,
    model: getDefaultModelForProvider(providerId),
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    systemPrompt: 'You are a helpful assistant.',
    thinkingMode: provider.features.thinking,
    streamOutput: provider.features.streaming,
    timeout: 30000,
    retryAttempts: 3,
    costOptimization: false,
    advancedParams: {}
  };

  // 设置提供商特定的默认值
  provider.parameters.forEach(param => {
    if (param.key === 'max_tokens') {
      defaults.maxTokens = param.defaultValue;
    } else if (param.key === 'temperature') {
      defaults.temperature = param.defaultValue;
    } else if (param.key === 'top_p') {
      defaults.topP = param.defaultValue;
    } else if (param.key === 'top_k') {
      defaults.topK = param.defaultValue;
    } else if (param.key === 'frequency_penalty') {
      defaults.frequencyPenalty = param.defaultValue;
    } else if (param.key === 'presence_penalty') {
      defaults.presencePenalty = param.defaultValue;
    }
  });

  return defaults;
};