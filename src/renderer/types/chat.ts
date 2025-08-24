// Chat页面专用类型定义
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  tokens?: number;
  model?: string;
}

export interface ModelPreset {
  id: string;
  name: string;
  provider: string;
  model: string;
  baseUrl: string;
  description?: string;
  category: 'completion' | 'chat' | 'code' | 'creative';
  isDefault?: boolean;
}

export interface ChatConfig {
  // 模型配置
  provider: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  
  // 生成参数
  temperature: number;
  maxTokens: number;
  topP: number;
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  
  // 系统配置
  systemPrompt: string;
  contextLength: number; // 上下文窗口长度
  
  // UI配置
  showTokenCount: boolean;
  autoScroll: boolean;
  streamResponse: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  config: ChatConfig;
  createdAt: number;
  updatedAt: number;
}

export interface ChatState {
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  isLoading: boolean;
  error: string | null;
  currentConfig: ChatConfig;
}

// 模型能力定义
export interface ModelCapabilities {
  maxTokens: number;
  supportsFunctions: boolean;
  supportsVision: boolean;
  supportsStream: boolean;
  contextWindow: number;
  inputCostPer1k: number; // 每1k token的价格
  outputCostPer1k: number;
}

// 预设配置模板
export interface ConfigTemplate {
  id: string;
  name: string;
  description: string;
  config: Partial<ChatConfig>;
  category: 'general' | 'creative' | 'analytical' | 'coding';
}

export interface ChatFormData {
  provider: string;
  apiKey: string;
  model: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}