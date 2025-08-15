# 项目架构参考文档

本文档专为 AI 助手设计，详细描述了 Catalyst 项目的整体架构，帮助 AI 更好地理解项目的组织结构和各部分之间的关系。

## 1. 项目结构概览

```
Catalyst/
├── docs/                    # 文档目录
├── resources/               # 资源文件目录
├── src/                     # 源代码目录
│   ├── main/               # 主进程代码
│   ├── renderer/           # 渲染进程代码
│   └── shared/             # 共享代码
├── test/                   # 测试文件目录
├── package.json            # 项目配置文件
└── ...                     # 其他配置文件
```

## 2. 进程架构

Catalyst 采用 Electron 的多进程架构：

### 2.1 主进程 (Main Process)
- **职责**: 管理应用生命周期、创建和管理窗口、处理系统级操作
- **入口文件**: `src/main/index.ts`
- **主要模块**:
  - 窗口管理
  - 进程间通信 (IPC) 处理
  - 系统托盘管理
  - 自动启动设置
  - 应用更新检查

### 2.2 渲染进程 (Renderer Process)
- **职责**: UI 渲染、用户交互处理、业务逻辑执行
- **入口文件**: `src/renderer/main.tsx`
- **主要技术**: React 18 + TypeScript + Styled Components
- **状态管理**: React Context API

### 2.3 预加载脚本 (Preload Script)
- **职责**: 在渲染进程和主进程之间建立安全的通信桥梁
- **文件**: `src/main/preload.ts`
- **功能**: 暴露有限的 Electron API 给渲染进程

## 3. 模块架构

### 3.1 主进程模块

#### 3.1.1 服务层 (Services)
位于 `src/main/services/` 目录下：

1. **配置管理服务** (`config-manager.ts`)
   - 职责: 管理应用的所有配置
   - 核心功能: 配置的读取、保存、导入、导出、备份、恢复
   - 依赖: Electron Store

2. **Mihomo 服务** (`mihomo-service.ts`)
   - 职责: 管理 Mihomo 代理进程
   - 核心功能: 启动/停止代理、配置管理、API 通信
   - 依赖: Child Process, Axios

3. **LLM 服务** (`llm-service.ts`)
   - 职责: 管理与 LLM 提供商的通信
   - 核心功能: 发送消息、管理对话历史、提供商 API 调用
   - 依赖: Axios

4. **开发环境服务** (`dev-environment-service.ts`)
   - 职责: 管理开发工具的安装
   - 核心功能: 软件列表管理、安装任务管理、安装状态跟踪
   - 依赖: Child Process

5. **API 密钥管理服务** (`api-key-manager.ts`)
   - 职责: 安全存储和管理 API 密钥
   - 核心功能: 密钥加密存储、密钥获取
   - 依赖: Electron Store

#### 3.1.2 IPC 处理层 (IPC Handlers)
位于 `src/main/ipc-handlers/` 目录下：

1. **配置 IPC 处理器** (`config-ipc.ts`)
   - 处理所有与配置相关的 IPC 事件

2. **Mihomo IPC 处理器** (`mihomo-ipc.ts`)
   - 处理所有与 Mihomo 代理相关的 IPC 事件

3. **LLM IPC 处理器** (`llm-ipc.ts`)
   - 处理所有与 LLM 对话相关的 IPC 事件

4. **开发环境 IPC 处理器** (`dev-environment-ipc.ts`)
   - 处理所有与开发环境相关的 IPC 事件

### 3.2 渲染进程模块

#### 3.2.1 组件层 (Components)
位于 `src/renderer/components/` 目录下：

1. **通用组件** (`common/`)
   - Button: 按钮组件
   - Card: 卡片组件
   - PageContainer: 页面容器组件
   - StatusIndicator: 状态指示器组件
   - TitleBar: 标题栏组件

2. **业务组件**
   - MessageInput: 消息输入组件
   - MessageList: 消息列表组件
   - Modal: 模态框组件
   - ProxyGroupManager: 代理组管理组件
   - SettingsPanel: 设置面板组件

#### 3.2.2 布局层 (Layouts)
位于 `src/renderer/layouts/` 目录下：

1. **主布局** (`MainLayout.tsx`)
   - 应用的整体布局结构

2. **侧边栏** (`Sidebar.tsx`)
   - 应用的导航菜单

#### 3.2.3 页面层 (Pages)
位于 `src/renderer/pages/` 目录下：

1. **首页** (`HomePage.tsx`)
2. **系统代理页面** (`SystemProxyPage.tsx`)
3. **代理配置页面** (`MihomoConfigPage.tsx`)
4. **开发环境页面** (`DevEnvironmentPage.tsx`)
5. **AI 对话页面** (`ChatPage.tsx`)
6. **设置页面** (`SettingsPage.tsx`)
7. **信息页面** (`InfoPage.tsx`)

#### 3.2.4 上下文层 (Contexts)
位于 `src/renderer/contexts/` 目录下：

1. **主题上下文** (`ThemeContext.tsx`)
   - 管理应用的主题状态

#### 3.2.5 钩子层 (Hooks)
位于 `src/renderer/hooks/` 目录下：

1. **聊天钩子** (`useChat.ts`)
   - 管理聊天相关的状态和逻辑

#### 3.2.6 样式层 (Styles)
位于 `src/renderer/styles/` 目录下：

1. **全局样式** (`globalStyles.ts`)
2. **主题定义** (`theme.ts`)
3. **类型定义** (`styled.d.ts`)

#### 3.2.7 类型定义层 (Types)
位于 `src/renderer/types/` 目录下：

1. **Electron API 类型定义** (`electron.d.ts`)

### 3.3 共享模块

#### 3.3.1 IPC 事件常量
文件: `src/shared/ipc-events.ts`
- 定义所有 IPC 事件的常量，确保主进程和渲染进程使用一致的事件名称

## 4. 数据流架构

### 4.1 配置数据流
```
用户操作 → 设置页面组件 → IPC 通信 → 配置服务 → Electron Store → 磁盘文件
     ↑                                                                  ↓
用户操作 ← 设置页面组件 ← IPC 通信 ← 配置服务 ← Electron Store ← 磁盘文件
```

### 4.2 代理数据流
```
用户操作 → 代理组件 → IPC 通信 → Mihomo 服务 → Mihomo 进程 → 网络流量
     ↑                                                    ↓
状态更新 ← 代理组件 ← IPC 通信 ← Mihomo 服务 ← Mihomo 进程 ← 网络流量
```

### 4.3 对话数据流
```
用户输入 → 聊天组件 → IPC 通信 → LLM 服务 → LLM 提供商 API → AI 响应
     ↑                                               ↓
响应显示 ← 聊天组件 ← IPC 通信 ← LLM 服务 ← LLM 提供商 API ← AI 响应
```

## 5. 技术栈详解

### 5.1 核心技术
- **Electron**: 桌面应用框架
- **React 18**: UI 框架
- **TypeScript**: 编程语言
- **Node.js**: 运行时环境

### 5.2 UI 技术
- **Styled Components**: CSS-in-JS 解决方案
- **Framer Motion**: 动画库
- **Lucide React**: 图标库

### 5.3 后端技术
- **Electron Store**: 配置存储
- **Axios**: HTTP 客户端
- **Child Process**: 外部进程管理

### 5.4 构建工具
- **Vite**: 构建工具
- **Electron Vite**: Electron 的 Vite 插件
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **pnpm**: 包管理器

## 6. 关键设计模式

### 6.1 服务模式
- 每个核心功能都封装在独立的服务类中
- 服务类提供统一的接口来处理特定领域的业务逻辑
- 服务实例在应用启动时创建并全局共享

### 6.2 IPC 通信模式
- 使用预定义的事件常量确保通信的一致性
- 采用异步处理模式处理所有 IPC 请求
- 统一的响应格式 { success: boolean, data?: any, error?: string }

### 6.3 组件化模式
- 使用 React 的函数组件和 Hooks
- 通过 Props 传递数据，通过回调函数处理事件
- 合理划分组件粒度，确保组件的单一职责

### 6.4 主题模式
- 使用 React Context 管理主题状态
- 通过 CSS 变量实现主题切换
- 支持浅色和深色主题

## 7. 错误处理策略

### 7.1 IPC 错误处理
- 所有 IPC 响应都包含 success 字段表示操作是否成功
- 错误信息通过 error 字段返回
- 渲染进程根据响应结果决定如何处理错误

### 7.2 异步操作错误处理
- 使用 try/catch 包装所有异步操作
- 提供用户友好的错误提示
- 记录详细的错误日志用于调试

### 7.3 配置错误处理
- 验证配置数据的结构和类型
- 提供配置迁移机制处理版本升级
- 在配置损坏时提供恢复机制

## 8. 安全考虑

### 8.1 API 密钥安全
- 使用专门的服务类管理 API 密钥
- 密钥在本地加密存储
- 避免在日志或错误信息中暴露密钥

### 8.2 IPC 安全
- 使用预加载脚本限制暴露给渲染进程的 API
- 验证所有 IPC 请求的参数
- 避免在 IPC 通信中传递敏感信息

### 8.3 配置文件安全
- 敏感配置信息加密存储
- 配置文件权限设置
- 配置文件完整性校验