// src/renderer/types/electron.d.ts

export interface IMihomoAPI {
  start: () => Promise<{ success: boolean; error?: string }>;
  stop: () => Promise<{ success: boolean; error?: string }>;
  status: () => Promise<{ isRunning: boolean }>;
  loadConfig: () => Promise<{ success: boolean; data?: IMihomoConfig; error?: string }>;
  saveConfig: (config: IMihomoConfig) => Promise<{ success: boolean; error?: string }>;
  getConfigPath: () => Promise<{ success: boolean; data?: string; error?: string }>;
  openConfigDir: () => Promise<{ success: boolean; error?: string }>;
  getProxies: () => Promise<{ success: boolean; data?: { proxies: Record<string, unknown>; 'proxy-groups': unknown[] }; error?: string }>;
  selectProxy: (groupName: string, proxyName: string) => Promise<{ success: boolean; error?: string }>;
  fetchConfigFromURL: (url: string) => Promise<{ success: boolean; data?: IMihomoConfig; error?: string }>;
  testProxyDelay: (proxyName: string) => Promise<{ success: boolean; data?: number; error?: string }>;
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
  proxies?: Record<string, unknown>[];
  'proxy-groups'?: unknown[];
  rules?: unknown[];
  tun?: {
    enable?: boolean;
    stack?: string;
    'dns-hijack'?: string[];
    'auto-route'?: boolean;
    'auto-detect-interface'?: boolean;
  };
  'unified-delay'?: boolean;
  'tcp-concurrent'?: boolean;
  sniffer?: {
    enable?: boolean;
    'parse-pure-ip'?: boolean;
  };
  [key: string]: unknown; // 允许其他自定义字段
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
  provider: string;
  model: string;
  messages: ILLMMessage[];
  params?: ILLMParams;
}

export interface IProviderConfig {
  baseUrl: string;
  apiKey: string;
  defaultHeaders?: Record<string>;
}

export interface ILLMAPI {
  generateCompletion: (request: IGenerateCompletionRequest) => Promise<{ success: boolean; data?: string; error?: string }>;
  setApiKey: (provider: string, apiKey: string) => Promise<{ success: boolean; error?: string }>;
  getApiKey: (provider: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  getAllApiKeys: () => Promise<{ success: boolean; data?: { [provider: string]: string }; error?: string }>;
  deleteApiKey: (provider: string) => Promise<{ success: boolean; error?: string }>;
  setProviderConfig: (config: IProviderConfig & { provider: string }) => Promise<{ success: boolean; error?: string }>;
  getProviderConfig: (provider: string) => Promise<{ success: boolean; data?: IProviderConfig; error?: string }>;
  getProviders: () => Promise<{ success: boolean; data?: string[]; error?: string }>;
  getModels: (provider: string) => Promise<{ success: boolean; data?: string[]; error?: string }>;
}

// 配置管理API
export interface IConfigAPI {
  getAll: () => Promise<{ success: boolean; data?: Record<string, unknown>; error?: string }>;
  setVpnUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
  getVpnUrl: () => Promise<{ success: boolean; data?: string; error?: string }>;
  setProxyAutoStart: (autoStart: boolean) => Promise<{ success: boolean; error?: string }>;
  getProxyAutoStart: () => Promise<{ success: boolean; data?: boolean; error?: string }>;
  export: () => Promise<{ success: boolean; data?: string; error?: string }>;
  import: () => Promise<{ success: boolean; data?: string; error?: string }>;
  reset: () => Promise<{ success: boolean; error?: string }>;
  setUserName: (name: string) => Promise<{ success: boolean; error?: string }>;
  getUserName: () => Promise<{ success: boolean; data?: string; error?: string }>;
  setUserEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
  getUserEmail: () => Promise<{ success: boolean; data?: string; error?: string }>;
  setStartup: (startup: boolean) => Promise<{ success: boolean; error?: string }>;
  getStartup: () => Promise<{ success: boolean; data?: boolean; error?: string }>;
  setMinimizeToTray: (minimize: boolean) => Promise<{ success: boolean; error?: string }>;
  getMinimizeToTray: () => Promise<{ success: boolean; data?: boolean; error?: string }>;
  setNotifications: (enabled: boolean) => Promise<{ success: boolean; error?: string }>;
  getNotifications: () => Promise<{ success: boolean; data?: boolean; error?: string }>;
  setTheme: (theme: 'light' | 'dark' | 'auto') => Promise<{ success: boolean; error?: string }>;
  setLanguage: (language: string) => Promise<{ success: boolean; error?: string }>;
  getUsageStats: () => Promise<{ success: boolean; data?: { usage: number; timestamp: string }; error?: string }>;
  createBackup: () => Promise<{ success: boolean; data?: string; error?: string }>;
  restoreFromBackup: (backupPath: string) => Promise<{ success: boolean; data?: string; error?: string }>;
  getBackupFiles: () => Promise<{ success: boolean; data?: string[]; error?: string }>;
  validateConfig: (config: IMihomoConfig) => Promise<{ success: boolean; data?: { valid: boolean; errors: string[] }; error?: string }>;
  migrateConfig: () => Promise<{ success: boolean; error?: string }>;
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
      config: IConfigAPI;
      devEnvironment: IDevEnvironmentAPI;
      windowControl: IWindowControlAPI;
    };
    electron: {
      ipcRenderer: {
        send: (channel: string, ...args: unknown[]) => void;
        on: (channel: string, func: (...args: unknown[]) => void) => void;
        removeAllListeners: (channel: string) => void;
      };
    };
  }
}