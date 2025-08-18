# AI 开发指南与项目规范

本文档旨在为 AI 助手提供清晰的指引，确保其在理解和参与 Catalyst 项目开发时能够遵循统一的规范和最佳实践，生成高质量、符合项目要求的代码和建议。

## 1. 项目核心理念与目标

### 1.1 核心理念
Catalyst 是一个集成化的桌面工具平台，旨在将开发者常用的工具（如网络代理、AI助手、开发环境配置等）整合在一起，提供统一、便捷、高效的用户体验。

### 1.2 主要目标
*   **集成化**: 整合多种实用工具。
*   **易用性**: 提供直观的用户界面和流畅的交互体验。
*   **可扩展性**: 设计灵活的架构，便于未来添加新功能。
*   **跨平台**: 基于 Electron，支持 Windows, macOS, Linux。

## 2. 技术栈与架构 (Tech Stack & Architecture)

### 2.1 核心框架与库
*   **应用框架**: Electron (跨平台桌面应用)
*   **前端框架**: React 18 (用户界面)
*   **编程语言**: TypeScript (类型安全)
*   **运行时**: Node.js (Electron 后端)

### 2.2 UI/UX 相关
*   **样式方案**: Styled Components (CSS-in-JS)
*   **动画库**: Framer Motion (交互动画)
*   **图标库**: Lucide React (SVG 图标)
*   **状态管理**: React Context API (应用级), React Hooks (组件级)

### 2.3 后端/主进程相关
*   **进程间通信**: Electron IPC
*   **配置存储**: Electron Store (JSON)
*   **HTTP 客户端**: Axios (API 调用)
*   **子进程管理**: Node.js `child_process` (外部程序)

### 2.4 构建与开发工具
*   **构建工具**: Vite
*   **Electron 构建**: Electron Vite
*   **包管理器**: pnpm
*   **代码质量**: ESLint, Prettier

### 2.5 架构模式 (Electron 多进程)
1.  **主进程 (Main Process)**:
    *   职责: 应用生命周期、系统任务、后台服务、IPC 请求处理。
    *   入口: `src/main/index.ts`。
2.  **渲染进程 (Renderer Process)**:
    *   职责: 渲染 UI、处理用户交互、前端逻辑。
    *   入口: `src/renderer/main.tsx`。
3.  **预加载脚本 (Preload Script)**:
    *   职责: 安全桥接，暴露主进程功能给渲染进程。
    *   文件: `src/main/preload.ts`。

### 2.6 数据流 (Simplified)
```
[渲染进程 UI] --(window.electronAPI IPC)--&gt; [预加载脚本] --(Electron IPC)--&gt; [主进程 Services] --(API/外部程序)--&gt; [...]
```

## 3. 项目结构 (Project Structure)

```
Catalyst/
├── docs/                     # 项目文档
│   ├── ai_quickref/         # (你在这里) AI 快速参考
│   ├── planning/            # 需求与规划
│   ├── dev_context/         # 开发上下文
│   └── project/design/      # 设计文档
├── resources/                # 静态资源 (如 Mihomo 可执行文件)
├── src/                      # 源代码目录
│   ├── main/                # 主进程代码 (Node.js, Electron APIs)
│   │   ├── index.ts         # 主进程入口
│   │   ├── preload.ts       # 预加载脚本 (安全桥接)
│   │   ├── ipc-handlers/    # 处理来自渲染进程的 IPC 请求
│   │   └── services/        # 核心业务逻辑服务 (ConfigManager, MihomoService)
│   ├── renderer/            # 渲染进程代码 (React UI)
│   │   ├── App.tsx          # React 应用根组件
│   │   ├── main.tsx         # 渲染进程入口
│   │   ├── components/      # 可复用的 React 组件
│   │   │   └── common/      # 通用组件 (Button, Card, etc.)
│   │   ├── layouts/         # 页面布局组件 (MainLayout)
│   │   ├── pages/           # 页面级 React 组件
│   │   ├── contexts/        # React Context (ThemeContext)
│   │   ├── hooks/           # 自定义 React Hooks
│   │   ├── styles/          # 全局样式和主题定义
│   │   └── types/           # 渲染进程专用 TypeScript 类型
│   └── shared/              # 主进程和渲染进程共享的代码
│       └── ipc-events.ts    # IPC 事件常量定义
├── test/                     # 测试文件
├── package.json             # 项目依赖和脚本
└── ...                      # 配置文件 (tsconfig, vite config, eslint)
```

## 4. 编码规范与最佳实践 (Coding Standards & Best Practices)

### 4.1 组件开发 (Component Development)
*   **文件命名**: React 组件文件使用 `PascalCase`，例如 `Button.tsx`, `ProxyControlPanel.tsx`。
*   **文件存放**: 通用组件放 `src/renderer/components/common/`，特定功能组件按模块分组。
*   **组件定义**: 优先使用函数式组件 (Functional Components) 和箭头函数。
*   **Props 类型**: 为组件的 Props 显式定义 TypeScript 接口。
*   **Hooks 使用**: 合理使用 React Hooks (`useState`, `useEffect`, `useContext`, 自定义 Hooks)。

### 4.2 样式 (Styling)
*   **Styled Components**: 使用 `styled-components` 库编写组件样式。
*   **主题**: 通过 `useTheme` Hook 获取主题变量，确保样式能适应明暗主题切换。
*   **设计规范**: 遵循 `docs/project/design/design_guidelines.md` 中的规范（圆角、间距、颜色等）。

### 4.3 状态管理 (State Management)
*   **局部状态**: 使用 `useState` 或 `useReducer`。
*   **全局状态**: 使用 React Context API (如 `ThemeContext`, `UserContext`)。
*   **自定义 Hooks**: 将复杂的组件逻辑或可复用的状态逻辑封装成自定义 Hooks。

### 4.4 IPC 通信 (IPC Communication)
*   **事件常量**: 所有 IPC 事件名称都定义在 `src/shared/ipc-events.ts` 文件的 `IPC_EVENTS` 对象中。
    *   例如: `export const IPC_EVENTS = { CONFIG_GET: 'config:get', ... };`
*   **调用方式**: 在渲染进程中，通过 `window.electronAPI` 对象访问预加载脚本暴露的方法。
    *   例如: `const result = await window.electronAPI.config.getConfig();`
*   **响应处理**: IPC 调用通常是异步的，使用 `async/await`。主进程返回的响应遵循统一格式: `{ success: boolean, data?: any, error?: string }`。务必检查 `response.success` 并处理 `error` 情况。

### 4.5 错误处理与用户体验 (Error Handling & UX)
*   **加载状态**: 对于异步操作，提供加载指示（如禁用按钮、显示 Spinner）。
*   **错误提示**: 将 IPC 错误或 API 错误以用户友好的方式展示出来。
*   **类型安全**: 充分利用 TypeScript 进行类型检查，减少运行时错误。

## 5. 核心概念与对象 (Core Concepts & Objects)

### 5.1 配置 (Config)
```typescript
// src/renderer/types/electron.d.ts 或类似文件中定义
interface Config {
  general: GeneralConfig; // 通用设置 (主题、语言、开机启动等)
  llm: LLMConfig;        // LLM 设置 (提供商、模型、API密钥等)
  proxy: ProxyConfig;    // 代理设置 (VPN URL, 自动启动等)
  user: UserConfig;      // 用户信息 (姓名、邮箱、头像等)
  // ... 其他配置项
}
```

### 5.2 消息 (Message)
```typescript
interface ILLMMessage { // 注意命名约定，可能以 I 开头
  role: 'user' | 'assistant' | 'system'; // 注意包含 'system'
  content: string;
  // 可能还有 id, timestamp 等
}
```

### 5.3 LLM 参数 (LLM Parameters)
```typescript
interface ILLMParams {
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  // ... 其他 LLM 参数
}
```

### 5.4 IPC 事件常量 (IPC_EVENTS)
```typescript
// src/shared/ipc-events.ts
export const IPC_EVENTS = {
  // 配置
  CONFIG_GET_ALL: 'config:get-all',
  CONFIG_SET_USER_NAME: 'config:set-user-name',
  // Mihomo 代理
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  // LLM
  LLM_GENERATE_COMPLETION: 'llm:generate-completion',
  // 窗口控制
  WINDOW_MINIMIZE: 'window:minimize',
  // ... 更多事件
};
```

### 5.5 IPC 响应通用格式
```typescript
// 在任何处理 IPC 响应的地方都应遵循此格式
{
  success: boolean;      // 操作是否成功 (必需)
  data?: T;              // 成功时返回的数据，T 为具体类型 (可选)
  error?: string;        // 失败时返回的错误信息 (可选)
}
```

## 6. 设计原则与规范 (Design Principles & Guidelines)

请参考 `docs/project/design/design_guidelines.md` 了解详细的设计规范，包括：
*   **颜色系统**: 浅色/深色主题的具体颜色值。
*   **圆角规范**: 按钮(8px), 卡片(12px)等。
*   **间距系统**: 基于 8px 的 `xs`, `sm`, `md`, `lg`, `xl`, `xxl` 间距。
*   **组件规范**: Button, Card, Input 等通用组件的具体样式和用法。
*   **页面布局**: 页面容器、标题、区块的标准布局。
*   **动画规范**: 过渡时间、缓动函数，以及**适度使用**的原则。
*   **组件化规范**: 页面结构、组件化原则。
*   **具体服务页面规范**: 简化标题、减少图标、专注内容、减少动画。

## 7. 给 AI 的特别提示 (Special Tips for AI)

1.  **上下文优先**: 在生成代码或建议前，优先查阅 `docs/ai_quickref/` 目录下的文档，确保理解项目上下文。
2.  **引用规范**: 当引用项目中的特定文件、接口或常量时，请使用其完整路径或名称，以便开发者快速定位。
3.  **代码风格**: 生成的代码应严格遵循项目已有的代码风格和规范，特别是文件组织、组件结构、样式编写和 IPC 通信方式。
4.  **假设谨慎**: 不要假设项目中存在某个库或功能，除非在 `package.json` 或项目代码中明确看到。对于不确定的部分，可以询问或在代码中添加注释说明。
5.  **设计遵循**: 生成 UI 代码时，务必遵循 `design_guidelines.md` 中的规范，特别是圆角、间距、颜色和组件使用。
6.  **安全意识**: 不要在代码中生成或处理任何真实的 API 密钥、密码或其他敏感信息。
7.  **清晰解释**: 当提供复杂逻辑或设计决策的建议时，附带清晰简洁的解释。