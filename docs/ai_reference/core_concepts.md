# 核心概念与对象

本文档定义了项目中使用的核心数据结构和概念。

## 配置 (AppConfig)

应用的核心配置对象，存储用户偏好、服务设置等。

```typescript
interface AppConfig {
  // LLM配置
  llm: {
    provider: string;
    model: string;
    apiKeys: {
      [provider: string]: string;
    };
  };
  
  // 代理配置
  proxy: {
    vpnProviderUrl?: string;
    autoStart?: boolean;
    configPath?: string;
  };
  
  // 应用设置
  app: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    autoUpdate?: boolean;
    startup?: boolean;
    minimizeToTray?: boolean;
    notifications?: boolean;
  };
  
  // 用户偏好
  user: {
    name?: string;
    email?: string;
    lastUsed?: string;
    usageStats?: {
      proxyUsage: number;
      chatUsage: number;
      lastActive: string;
    };
  };
}
```

## LLM消息 (LLMMessage)

LLM 对话中的单条消息。

```typescript
export type LLMMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};
```

## LLM参数 (LLMParams)

LLM 生成补全时的参数设置。

```typescript
export type LLMParams = {
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
};
```

## 生成补全请求 (GenerateCompletionRequest)

请求LLM生成补全的参数结构。

```typescript
interface GenerateCompletionRequest {
  provider: string;
  model: string;
  messages: LLMMessage[];
  params?: LLMParams;
}
```

## 提供商配置 (ProviderConfig)

LLM 提供商的配置信息。

```typescript
interface ProviderConfig {
  baseUrl: string;
  apiKey: string;
  defaultHeaders?: Record<string>;
}
```

## IPC 事件常量 (IPC_EVENTS)

定义了主进程和渲染进程之间通信的事件名称，位于 `src/shared/ipc-events.ts`。

```typescript
export const IPC_EVENTS = {
  // Mihomo 相关事件
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  MIHOMO_STATUS: 'mihomo:status',
  MIHOMO_STATUS_UPDATE: 'mihomo:status-update',
  MIHOMO_LOAD_CONFIG: 'mihomo:load-config',
  MIHOMO_SAVE_CONFIG: 'mihomo:save-config',
  MIHOMO_GET_CONFIG_PATH: 'mihomo:get-config-path',
  MIHOMO_OPEN_CONFIG_DIR: 'mihomo:open-config-dir',
  
  // Mihomo 代理组相关事件
  MIHOMO_GET_PROXIES: 'mihomo:get-proxies',
  MIHOMO_SELECT_PROXY: 'mihomo:select-proxy',
  MIHOMO_FETCH_CONFIG_FROM_URL: 'mihomo:fetch-config-from-url',
  MIHOMO_TEST_PROXY_DELAY: 'mihomo:test-proxy-delay',
  
  // 开发环境相关事件
  DEV_ENV_INSTALL_VSCODE: 'dev-env:install-vscode',
  DEV_ENV_INSTALL_NODEJS: 'dev-env:install-nodejs',
  DEV_ENV_INSTALL_PYTHON: 'dev-env:install-python',
  
  // LLM 相关事件
  LLM_GENERATE_COMPLETION: 'llm:generate-completion',
  LLM_SET_API_KEY: 'llm:set-api-key',
  LLM_GET_API_KEY: 'llm:get-api-key',
  LLM_GET_ALL_API_KEYS: 'llm:get-all-api-keys',
  LLM_DELETE_API_KEY: 'llm:delete-api-key',
  LLM_SET_PROVIDER_CONFIG: 'llm:set-provider-config',
  LLM_GET_PROVIDER_CONFIG: 'llm:get-provider-config',
  LLM_GET_PROVIDERS: 'llm:get-providers',
  LLM_GET_MODELS: 'llm:get-models',
  
  // 配置管理相关事件
  CONFIG_GET_ALL: 'config:get-all',
  CONFIG_SET_VPN_URL: 'config:set-vpn-url',
  CONFIG_GET_VPN_URL: 'config:get-vpn-url',
  CONFIG_SET_PROXY_AUTO_START: 'config:set-proxy-auto-start',
  CONFIG_GET_PROXY_AUTO_START: 'config:get-proxy-auto-start',
  CONFIG_EXPORT: 'config:export',
  CONFIG_IMPORT: 'config:import',
  CONFIG_RESET: 'config:reset',
  CONFIG_SET_USER_NAME: 'config:set-user-name',
  CONFIG_GET_USER_NAME: 'config:get-user-name',
  CONFIG_SET_USER_EMAIL: 'config:set-user-email',
  CONFIG_GET_USER_EMAIL: 'config:get-user-email',
  CONFIG_SET_STARTUP: 'config:set-startup',
  CONFIG_GET_STARTUP: 'config:get-startup',
  CONFIG_SET_MINIMIZE_TO_TRAY: 'config:set-minimize-to-tray',
  CONFIG_GET_MINIMIZE_TO_TRAY: 'config:get-minimize-to-tray',
  CONFIG_SET_NOTIFICATIONS: 'config:set-notifications',
  CONFIG_GET_NOTIFICATIONS: 'config:get-notifications',
  CONFIG_GET_USAGE_STATS: 'config:get-usage-stats',
  CONFIG_CREATE_BACKUP: 'config:create-backup',
  CONFIG_RESTORE_FROM_BACKUP: 'config:restore-from-backup',
  CONFIG_GET_BACKUP_FILES: 'config:get-backup-files',
  CONFIG_VALIDATE_CONFIG: 'config:validate-config',
  CONFIG_MIGRATE_CONFIG: 'config:migrate-config',
  
  // 窗口控制事件
  WINDOW_MINIMIZE: 'window:minimize',
  WINDOW_MAXIMIZE: 'window:maximize',
  WINDOW_CLOSE: 'window:close',
};
```

## IPC 响应通用格式

为了保证前后端交互的一致性，主进程处理 IPC 请求后返回的响应通常遵循以下格式：

```typescript
{
  success: boolean;      // 操作是否成功
  data?: T;              // 成功时返回的数据，类型 T 根据具体接口而定
  error?: string;        // 失败时返回的错误信息
}
```

渲染进程在调用 `window.electronAPI` 的方法后，应检查 `response.success` 来判断操作结果，并根据需要处理 `data` 或 `error`。

## 主要服务

### ConfigManager
负责应用配置的读取、保存和管理。提供配置的导入、导出、备份和恢复功能。

### MihomoService
管理 Mihomo 代理进程的启动、停止和配置。提供代理选择、延迟测试和配置获取功能。

### LLMService
管理与 LLM 提供商的通信，支持多种提供商（OpenAI、OpenRouter、自定义）。提供模型列表和生成补全功能。

### ApiKeyManager
管理 LLM 服务的 API 密钥，支持多个提供商的密钥存储和检索。