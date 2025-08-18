# 核心概念与对象

本文档定义了项目中使用的核心数据结构和概念。

## 配置 (Config)

应用的核心配置对象，存储用户偏好、服务设置等。

```typescript
interface Config {
  general: GeneralConfig; // 通用设置 (主题、语言、开机启动等)
  llm: LLMConfig;        // LLM 设置 (提供商、模型、API密钥等)
  proxy: ProxyConfig;    // 代理设置 (VPN URL, 自动启动等)
  user: UserConfig;      // 用户信息 (姓名、邮箱、头像等)
  // ... 其他配置项
}
```

## 消息 (Message)

LLM 对话中的单条消息。

```typescript
interface Message {
  id: string;                     // 唯一标识
  role: 'user' | 'assistant';     // 发送者角色
  content: string;                // 消息内容
  timestamp: string;              // 发送时间
}
```

## 对话 (Conversation)

LLM 对话会话，包含一系列消息。

```typescript
interface Conversation {
  id: string;              // 唯一标识
  title: string;           // 会话标题
  messages: Message[];     // 消息列表
  createdAt: string;       // 创建时间
  updatedAt: string;       // 更新时间
}
```

## 代理信息 (ProxyInfo)

Mihomo 代理或代理组的信息。

```typescript
interface ProxyInfo {
  name: string;           // 代理/组名称
  type: string;           // 类型 (如 'ss', 'vmess', 'select')
  // ... 其他属性 (如延迟、当前选中节点等)
}
```

## IPC 事件常量 (IPC_EVENTS)

定义了主进程和渲染进程之间通信的事件名称，位于 `src/shared/ipc-events.ts`。

```typescript
export const IPC_EVENTS = {
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  LLM_SEND_MESSAGE: 'llm:send-message',
  // ... 更多事件
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