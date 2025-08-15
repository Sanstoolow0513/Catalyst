# API 文档

## 1. 概述

Catalyst 应用提供了一系列 API 接口，用于主进程和渲染进程之间的通信，以及与外部服务的交互。

## 2. IPC 通信 API

### 2.1 配置管理 API

#### 2.1.1 获取所有配置
- **事件**: `config:get-all`
- **参数**: 无
- **返回**: `{ success: boolean, data?: AppConfig, error?: string }`

#### 2.1.2 设置VPN提供商URL
- **事件**: `config:set-vpn-url`
- **参数**: VPN提供商URL字符串
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.3 获取VPN提供商URL
- **事件**: `config:get-vpn-url`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.4 设置代理自动启动
- **事件**: `config:set-proxy-auto-start`
- **参数**: 布尔值 (true/false)
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.5 获取代理自动启动设置
- **事件**: `config:get-proxy-auto-start`
- **参数**: 无
- **返回**: `{ success: boolean, data?: boolean, error?: string }`

#### 2.1.6 导出配置
- **事件**: `config:export`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.7 导入配置
- **事件**: `config:import`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.8 重置配置
- **事件**: `config:reset`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.9 设置用户名
- **事件**: `config:set-user-name`
- **参数**: 用户名字符串
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.10 获取用户名
- **事件**: `config:get-user-name`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.11 设置用户邮箱
- **事件**: `config:set-user-email`
- **参数**: 用户邮箱字符串
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.12 获取用户邮箱
- **事件**: `config:get-user-email`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.13 设置开机启动
- **事件**: `config:set-startup`
- **参数**: 布尔值 (true/false)
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.14 获取开机启动设置
- **事件**: `config:get-startup`
- **参数**: 无
- **返回**: `{ success: boolean, data?: boolean, error?: string }`

#### 2.1.15 设置最小化到托盘
- **事件**: `config:set-minimize-to-tray`
- **参数**: 布尔值 (true/false)
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.16 获取最小化到托盘设置
- **事件**: `config:get-minimize-to-tray`
- **参数**: 无
- **返回**: `{ success: boolean, data?: boolean, error?: string }`

#### 2.1.17 设置通知
- **事件**: `config:set-notifications`
- **参数**: 布尔值 (true/false)
- **返回**: `{ success: boolean, error?: string }`

#### 2.1.18 获取通知设置
- **事件**: `config:get-notifications`
- **参数**: 无
- **返回**: `{ success: boolean, data?: boolean, error?: string }`

#### 2.1.19 获取使用统计
- **事件**: `config:get-usage-stats`
- **参数**: 无
- **返回**: `{ success: boolean, data?: UsageStats, error?: string }`

#### 2.1.20 创建备份
- **事件**: `config:create-backup`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.21 从备份恢复
- **事件**: `config:restore-from-backup`
- **参数**: 备份文件路径字符串
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.1.22 获取备份文件列表
- **事件**: `config:get-backup-files`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string[], error?: string }`

#### 2.1.23 验证配置
- **事件**: `config:validate-config`
- **参数**: 配置对象
- **返回**: `{ success: boolean, data?: { valid: boolean, errors: string[] }, error?: string }`

#### 2.1.24 迁移配置
- **事件**: `config:migrate-config`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

### 2.2 Mihomo 代理 API

#### 2.2.1 启动代理
- **事件**: `mihomo:start`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.2.2 停止代理
- **事件**: `mihomo:stop`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.2.3 获取代理状态
- **事件**: `mihomo:status`
- **参数**: 无
- **返回**: `{ isRunning: boolean }`

#### 2.2.4 加载配置
- **事件**: `mihomo:load-config`
- **参数**: 无
- **返回**: `{ success: boolean, data?: any, error?: string }`

#### 2.2.5 保存配置
- **事件**: `mihomo:save-config`
- **参数**: 配置对象
- **返回**: `{ success: boolean, error?: string }`

#### 2.2.6 获取配置文件路径
- **事件**: `mihomo:get-config-path`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.2.7 打开配置目录
- **事件**: `mihomo:open-config-dir`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.2.8 获取代理组信息
- **事件**: `mihomo:get-proxies`
- **参数**: 无
- **返回**: `{ success: boolean, data?: any, error?: string }`

#### 2.2.9 选择代理节点
- **事件**: `mihomo:select-proxy`
- **参数**: { groupName: string, proxyName: string }
- **返回**: `{ success: boolean, error?: string }`

#### 2.2.10 从URL获取配置
- **事件**: `mihomo:fetch-config-from-url`
- **参数**: 配置URL字符串
- **返回**: `{ success: boolean, data?: any, error?: string }`

### 2.3 LLM 对话 API

#### 2.3.1 生成补全
- **事件**: `llm:generate-completion`
- **参数**: GenerateCompletionRequest对象
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.3.2 设置API密钥
- **事件**: `llm:set-api-key`
- **参数**: { provider: string, apiKey: string }
- **返回**: `{ success: boolean, error?: string }`

#### 2.3.3 获取API密钥
- **事件**: `llm:get-api-key`
- **参数**: 提供商名称字符串
- **返回**: `{ success: boolean, data?: string, error?: string }`

#### 2.3.4 获取所有API密钥
- **事件**: `llm:get-all-api-keys`
- **参数**: 无
- **返回**: `{ success: boolean, data?: { [provider: string]: string }, error?: string }`

#### 2.3.5 删除API密钥
- **事件**: `llm:delete-api-key`
- **参数**: 提供商名称字符串
- **返回**: `{ success: boolean, error?: string }`

#### 2.3.6 设置提供商配置
- **事件**: `llm:set-provider-config`
- **参数**: ProviderConfig对象
- **返回**: `{ success: boolean, error?: string }`

#### 2.3.7 获取提供商配置
- **事件**: `llm:get-provider-config`
- **参数**: 提供商名称字符串
- **返回**: `{ success: boolean, data?: ProviderConfig, error?: string }`

#### 2.3.8 获取提供商列表
- **事件**: `llm:get-providers`
- **参数**: 无
- **返回**: `{ success: boolean, data?: string[], error?: string }`

#### 2.3.9 获取模型列表
- **事件**: `llm:get-models`
- **参数**: 提供商名称字符串
- **返回**: `{ success: boolean, data?: string[], error?: string }`

### 2.4 开发环境 API

#### 2.4.1 安装VSCode
- **事件**: `dev-env:install-vscode`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.4.2 安装NodeJS
- **事件**: `dev-env:install-nodejs`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

#### 2.4.3 安装Python
- **事件**: `dev-env:install-python`
- **参数**: 无
- **返回**: `{ success: boolean, error?: string }`

### 2.5 窗口控制 API

#### 2.5.1 最小化窗口
- **事件**: `window:minimize`
- **参数**: 无
- **返回**: 无

#### 2.5.2 最大化窗口
- **事件**: `window:maximize`
- **参数**: 无
- **返回**: 无

#### 2.5.3 关闭窗口
- **事件**: `window:close`
- **参数**: 无
- **返回**: 无

## 3. 外部服务 API

### 3.1 Mihomo RESTful API

Catalyst 集成的 Mihomo 提供了 RESTful API 用于管理代理服务。

#### 3.1.1 基础信息
- **Base URL**: `http://127.0.0.1:9090`
- **认证**: 如果配置了 secret，需要在请求头中添加 `Authorization: Bearer <secret>`

#### 3.1.2 常用端点
- `GET /logs`: 获取实时日志
- `GET /traffic`: 获取实时流量
- `GET /memory`: 获取实时内存占用
- `GET /version`: 获取版本信息
- `GET /configs`: 获取当前配置
- `PUT /configs`: 重新加载配置文件
- `PATCH /configs`: 修改部分配置
- `GET /proxies`: 获取所有代理和策略组信息
- `PUT /proxies/{group}`: 选择特定代理组下的节点
- `GET /connections`: 获取当前所有连接
- `DELETE /connections`: 关闭所有连接

## 4. 数据结构

### 4.1 配置对象 (AppConfig)
```typescript
{
  llm: {
    provider: string;
    model: string;
    apiKeys: {
      [provider: string]: string;
    };
  };
  
  proxy: {
    vpnProviderUrl?: string;
    autoStart?: boolean;
    configPath?: string;
  };
  
  app: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    autoUpdate?: boolean;
    startup?: boolean;
    minimizeToTray?: boolean;
    notifications?: boolean;
  };
  
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

### 4.2 代理状态对象
```typescript
{
  isRunning: boolean;
}
```

### 4.3 使用统计对象 (UsageStats)
```typescript
{
  proxyUsage: number;
  chatUsage: number;
  lastActive: string;
}
```

### 4.4 LLM 消息对象 (LLMMessage)
```typescript
{
  role: 'user' | 'assistant' | 'system';
  content: string;
}
```

### 4.5 LLM 参数对象 (LLMParams)
```typescript
{
  temperature?: number;
  top_p?: number;
  top_k?: number;
  max_tokens?: number;
}
```

### 4.6 生成补全请求对象 (GenerateCompletionRequest)
```typescript
{
  provider: string;
  model: string;
  messages: LLMMessage[];
  params?: LLMParams;
}
```

### 4.7 提供商配置对象 (ProviderConfig)
```typescript
{
  baseUrl: string;
  apiKey: string;
  defaultHeaders?: Record<string>;
}
```

## 5. UI 相关接口

### 5.1 主题管理
UI 主题管理通过配置管理 API 进行：
- 获取主题: `config:get-all` -> `data.app.theme`
- 设置主题: 通过修改配置对象中的 `app.theme` 字段并调用配置保存接口

### 5.2 状态更新
- 代理状态更新事件: `mihomo:status-update`
- 通过 IPC 监听此事件可实时获取代理状态变化

### 5.3 UI 组件接口
UI 组件通过对应的 IPC 事件与主进程通信，实现功能调用和数据获取。