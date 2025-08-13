// src/renderer/types/electron.d.ts

export interface IMihomoAPI {
  start: () => Promise<{ success: boolean; error?: string }>;
  stop: () => Promise<{ success: boolean; error?: string }>;
  status: () => Promise<{ isRunning: boolean }>;
  loadConfig: () => Promise<{ success: boolean; data?: any; error?: string }>;
  saveConfig: (config: any) => Promise<{ success: boolean; error?: string }>;
  getConfigPath: () => Promise<{ success: boolean; data?: string; error?: string }>;
  openConfigDir: () => Promise<{ success: boolean; error?: string }>;
}

// Mihomo 配置类型定义
export interface IMihomoConfig {
  port?: number;
  'socks-port'?: number;
  'redir-port'?: number;
  'mixed-port'?: number;
  'allow-lan'?: boolean;
  mode?: string;
  'log-level'?: string;
  ipv6?: boolean;
  'external-controller'?: string;
  proxies?: any[];
  'proxy-groups'?: any[];
  rules?: any[];
  [key: string]: any; // 允许其他自定义字段
}

// 开发环境相关类型定义
export interface IDevEnvironmentAPI {
  installVSCode: () => Promise<{ success: boolean; error?: string }>;
  installNodeJS: () => Promise<{ success: boolean; error?: string }>;
  installPython: () => Promise<{ success: boolean; error?: string }>;
}

// LLM 相关类型定义
export interface ILLMMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ILLMParams {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
}

export interface IGenerateCompletionRequest {
  provider: 'openai';
  model: string;
  messages: ILLMMessage[];
  params?: ILLMParams;
}

export interface ILLMAPI {
  generateCompletion: (request: IGenerateCompletionRequest) => Promise<{ success: boolean; data?: string; error?: string }>;
  setApiKey: (provider: string, apiKey: string) => Promise<{ success: boolean; error?: string }>;
  getApiKey: (provider: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  getAllApiKeys: () => Promise<{ success: boolean; data?: { [provider: string]: string }; error?: string }>;
  deleteApiKey: (provider: string) => Promise<{ success: boolean; error?: string }>;
}

// 窗口控制API
export interface IWindowControlAPI {
  minimize: () => void;
  maximize: () => void;
  close: () => void;
}

declare global {
  interface Window {
    electronAPI: {
      mihomo: IMihomoAPI;
      llm: ILLMAPI;
      devEnvironment: IDevEnvironmentAPI;
      windowControl: IWindowControlAPI;
    };
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: any[]) => void;
        on: (channel: string, func: (...args: any[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
  }
}
