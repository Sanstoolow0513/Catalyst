# 项目核心对象参考文档

本文档专为 AI 助手设计，详细描述了 Catalyst 项目中核心对象的结构和属性，以便 AI 能够更好地理解项目代码并提供准确的建议。

## 1. 配置对象 (Config)

### 1.1 主配置对象
```typescript
interface Config {
  general: GeneralConfig;
  llm: LLMConfig;
  proxy: ProxyConfig;
  user: UserConfig;
  statistics: StatisticsConfig;
  backup: BackupConfig;
}
```

### 1.2 通用设置 (GeneralConfig)
```typescript
interface GeneralConfig {
  theme: 'light' | 'dark';           // 应用主题
  language: string;                  // 语言设置
  autoStart: boolean;                // 开机自启动
  minimizeToTray: boolean;           // 最小化到托盘
  enableNotifications: boolean;      // 启用通知
}
```

### 1.3 LLM 设置 (LLMConfig)
```typescript
interface LLMConfig {
  provider: string;                  // LLM 提供商
  model: string;                     // 模型名称
  apiKey: string;                    // API 密钥
  temperature: number;               // 温度参数
  topP: number;                      // Top-P 参数
  maxTokens: number;                 // 最大令牌数
}
```

### 1.4 代理设置 (ProxyConfig)
```typescript
interface ProxyConfig {
  configUrl: string;                 // VPN 提供商 URL
  autoStart: boolean;                // 代理自动启动
}
```

### 1.5 用户设置 (UserConfig)
```typescript
interface UserConfig {
  name: string;                      // 用户姓名
  email: string;                     // 用户邮箱
}
```

### 1.6 统计设置 (StatisticsConfig)
```typescript
interface StatisticsConfig {
  usageData: UsageData[];            // 使用数据数组
  lastReset: string;                 // 上次重置时间
}
```

### 1.7 备份设置 (BackupConfig)
```typescript
interface BackupConfig {
  backups: BackupInfo[];             // 备份信息数组
}
```

## 2. Mihomo 相关对象

### 2.1 Mihomo 服务状态 (MihomoStatus)
```typescript
interface MihomoStatus {
  running: boolean;                  // 是否运行中
  pid?: number;                      // 进程 ID
  port?: number;                     // 监听端口
  configPath?: string;               // 配置文件路径
  version?: string;                  // Mihomo 版本
}
```

### 2.2 代理信息 (Proxies)
```typescript
interface Proxies {
  proxies: Record<string, ProxyInfo>; // 代理信息映射
}
```

### 2.3 代理信息 (ProxyInfo)
```typescript
interface ProxyInfo {
  name: string;                      // 代理名称
  type: string;                      // 代理类型
  udp: boolean;                      // 是否支持 UDP
  history: LatencyHistory[];         // 延迟历史
  all?: string[];                    // 代理组中的所有代理（仅代理组）
  now?: string;                      // 当前选中的代理（仅代理组）
}
```

### 2.4 延迟历史 (LatencyHistory)
```typescript
interface LatencyHistory {
  time: string;                      // 测试时间
  delay: number;                     // 延迟（毫秒）
}
```

## 3. LLM 相关对象

### 3.1 消息对象 (Message)
```typescript
interface Message {
  id: string;                        // 消息 ID
  role: 'user' | 'assistant';        // 消息角色
  content: string;                   // 消息内容
  timestamp: string;                 // 时间戳
  status: 'sending' | 'sent' | 'error'; // 消息状态
}
```

### 3.2 对话对象 (Conversation)
```typescript
interface Conversation {
  id: string;                        // 对话 ID
  title: string;                     // 对话标题
  messages: Message[];               // 消息数组
  createdAt: string;                 // 创建时间
  updatedAt: string;                 // 更新时间
}
```

## 4. 开发环境相关对象

### 4.1 软件信息 (SoftwareInfo)
```typescript
interface SoftwareInfo {
  id: string;                        // 软件 ID
  name: string;                      // 软件名称
  description: string;               // 软件描述
  version: string;                   // 版本
  category: 'ide' | 'runtime' | 'tool'; // 分类
  installPath?: string;              // 安装路径
  installed: boolean;                // 是否已安装
}
```

### 4.2 安装任务 (InstallTask)
```typescript
interface InstallTask {
  taskId: string;                    // 任务 ID
  softwareId: string;                // 软件 ID
  status: 'pending' | 'downloading' | 'installing' | 'completed' | 'failed'; // 状态
  progress: number;                  // 进度（0-100）
  error?: string;                    // 错误信息
}
```

## 5. 设置管理相关对象

### 5.1 使用数据 (UsageData)
```typescript
interface UsageData {
  date: string;                      // 日期
  proxyUsage: number;                // 代理使用次数
  llmUsage: number;                  // LLM 使用次数
  devEnvUsage: number;               // 开发环境使用次数
}
```

### 5.2 备份信息 (BackupInfo)
```typescript
interface BackupInfo {
  id: string;                        // 备份 ID
  name: string;                      // 备份名称
  createdAt: string;                 // 创建时间
  size: number;                      // 备份大小（字节）
}
```

## 6. IPC 事件常量

### 6.1 配置相关事件
```typescript
const IPC_EVENTS = {
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',
  CONFIG_GET_ITEM: 'config:get-item',
  CONFIG_SET_ITEM: 'config:set-item',
  CONFIG_RESET: 'config:reset',
  CONFIG_EXPORT: 'config:export',
  CONFIG_IMPORT: 'config:import',
  CONFIG_GET_STATISTICS: 'config:get-statistics',
  CONFIG_RESET_STATISTICS: 'config:reset-statistics',
  CONFIG_GET_BACKUPS: 'config:get-backups',
  CONFIG_CREATE_BACKUP: 'config:create-backup',
  CONFIG_RESTORE_BACKUP: 'config:restore-backup',
  CONFIG_DELETE_BACKUP: 'config:delete-backup'
};
```

### 6.2 Mihomo 相关事件
```typescript
const IPC_EVENTS = {
  // ... 配置相关事件
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  MIHOMO_GET_STATUS: 'mihomo:get-status',
  MIHOMO_GET_CONFIG: 'mihomo:get-config',
  MIHOMO_SAVE_CONFIG: 'mihomo:save-config',
  MIHOMO_GET_PROXIES: 'mihomo:get-proxies',
  MIHOMO_SELECT_PROXY: 'mihomo:select-proxy',
  MIHOMO_GET_CONFIG_URL: 'mihomo:get-config-url',
  MIHOMO_UPDATE_CONFIG_FROM_URL: 'mihomo:update-config-from-url'
};
```

### 6.3 LLM 相关事件
```typescript
const IPC_EVENTS = {
  // ... 其他事件
  LLM_SEND_MESSAGE: 'llm:send-message',
  LLM_GET_CONVERSATIONS: 'llm:get-conversations',
  LLM_CREATE_CONVERSATION: 'llm:create-conversation',
  LLM_DELETE_CONVERSATION: 'llm:delete-conversation',
  LLM_GET_MODELS: 'llm:get-models',
  LLM_GET_PROVIDERS: 'llm:get-providers'
};
```

### 6.4 开发环境相关事件
```typescript
const IPC_EVENTS = {
  // ... 其他事件
  DEV_GET_SOFTWARE_LIST: 'dev:get-software-list',
  DEV_INSTALL_SOFTWARE: 'dev:install-software',
  DEV_GET_INSTALL_STATUS: 'dev:get-install-status',
  DEV_GET_INSTALLED_SOFTWARE: 'dev:get-installed-software'
};
```

## 7. 服务类核心方法

### 7.1 配置管理服务 (ConfigManager)
```typescript
class ConfigManager {
  getConfig(): Config;               // 获取完整配置
  saveConfig(config: Config): void;  // 保存完整配置
  getConfigItem<T>(key: string): T;  // 获取配置项
  setConfigItem(key: string, value: any): void; // 设置配置项
  resetConfig(): void;               // 重置配置
  exportConfig(): string;            // 导出配置
  importConfig(data: string): boolean; // 导入配置
  getStatistics(): UsageData[];      // 获取统计信息
  resetStatistics(): void;           // 重置统计信息
  getBackups(): BackupInfo[];        // 获取备份列表
  createBackup(name: string): boolean; // 创建备份
  restoreBackup(id: string): boolean; // 恢复备份
  deleteBackup(id: string): boolean; // 删除备份
}
```

### 7.2 Mihomo 服务 (MihomoService)
```typescript
class MihomoService {
  start(): Promise<boolean>;         // 启动服务
  stop(): Promise<boolean>;          // 停止服务
  getStatus(): MihomoStatus;         // 获取状态
  getConfig(): Promise<string>;      // 获取配置文件内容
  saveConfig(config: string): Promise<boolean>; // 保存配置文件
  getProxies(): Promise<Proxies>;    // 获取代理信息
  selectProxy(groupName: string, proxyName: string): Promise<boolean>; // 选择代理
  getConfigUrl(): string;            // 获取配置 URL
  updateConfigFromUrl(): Promise<boolean>; // 从 URL 更新配置
}
```

### 7.3 LLM 服务 (LLMService)
```typescript
class LLMService {
  sendMessage(message: string, conversationId: string, model: string, parameters: object): Promise<any>; // 发送消息
  getConversations(): Conversation[]; // 获取对话列表
  createConversation(title: string): Conversation; // 创建对话
  deleteConversation(id: string): boolean; // 删除对话
  getModels(): string[];             // 获取模型列表
  getProviders(): string[];          // 获取提供商列表
}
```

### 7.4 开发环境服务 (DevEnvironmentService)
```typescript
class DevEnvironmentService {
  getSoftwareList(): SoftwareInfo[]; // 获取软件列表
  installSoftware(softwareId: string): string; // 安装软件，返回任务 ID
  getInstallStatus(taskId: string): InstallTask; // 获取安装状态
  getInstalledSoftware(): SoftwareInfo[]; // 获取已安装软件
}
```