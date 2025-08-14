# 项目结构文档

## 1. 概述

本文档详细描述了 Catalyst 项目的目录结构和文件组织方式，帮助开发者快速了解项目架构。

## 2. 项目概述

本项目是一个基于 Electron、React 和 TypeScript 的综合性桌面应用程序。其目标是打造一个集成了系统代理、LLM 对话、开发环境一键部署和高度可定制化设置的强大工具。应用将注重现代化的 UI/UX 设计，并提供稳定、可维护的代码基础。

## 3. 技术栈

为了满足工程的功能要求，我们选择以下技术栈：

### 3.1. 核心框架与语言

*   **运行环境**: [Node.js](https://nodejs.org/)
*   **应用框架**: [Electron](https://www.electronjs.org/) - 用于构建跨平台的桌面应用程序。
*   **前端框架**: [React](https://react.dev/) - 用于构建用户界面。
*   **编程语言**: [TypeScript](https://www.typescriptlang.org/) - 为项目提供静态类型检查，提高代码质量和可维护性。
*   **模块系统**: 将统一采用 **ESM (ECMAScript Modules)** 标准，以确保代码的现代化和一致性。

### 3.2. UI/UX 相关库

*   **UI 库**: 项目将采用 [MUI](https://mui.com/) 作为核心 React UI 库，以构建统一、美观且功能丰富的界面。
*   **样式方案**: 项目将采用 [Styled-components](https://styled-components.com/) 进行组件化样式开发，以支持动态主题切换（明/暗模式）。
*   **动画**: 项目将采用 [Framer Motion](https://www.framer.com/motion/) 为应用添加流畅的动画效果。

### 3.3. 核心功能依赖

*   **系统代理**:
    *   **核心依赖**: 本应用的核心代理功能依赖于外部开源项目 [Mihomo](https://github.com/MetaCubeX/mihomo)。
    *   **获取方式**: 开发者需要自行从 Mihomo 的 GitHub Releases 页面下载适用于目标平台（如 `mihomo-windows-amd64.exe`）的最新版本。
    *   **存放位置**: 下载后的可执行文件**必须**被重命名为 `mihomo.exe` (或对应平台的名称)，并放置在项目根目录下的 `/resources` 文件夹中。此路径为硬编码，用于开发和打包。
    *   **交互方式**: 主进程将通过 `node:child_process` 模块调用 `/resources/mihomo.exe` 来启动和停止服务。
    *   **API通信**: 采用 [axios](https://axios-http.com/) 作为 HTTP 客户端库，与 `mihomo` 启动后暴露的本地 API 进行通信，以实现代理切换和规则配置。
*   **LLM 对话**:
    *   采用 [axios](https://axios-http.com/) 作为 HTTP 客户端库，与各大 LLM 提供商的 API 进行交互。
*   **配置管理**:
    *   用户配置（如 API Keys, URLs）将以 JSON 格式存储在本地，通过 `node:fs` 模块进行读写。
    *   导入/导出功能将支持 JSON 格式。
*   **开发环境部署**:
    *   将使用脚本（如 `node:child_process` 结合系统 shell 命令）来执行 IDE 和开发环境的静默安装。

## 4. 开发环境要求

为确保开发过程的顺利进行，必须配置以下环境：

*   **Node.js**: `v18.x` 或更高版本。
*   **包管理器**: 项目将采用 `pnpm` 管理依赖，以确保依赖版本的确定性和安装效率。
*   **代码格式化**: 项目将采用 [Prettier](https://prettier.io/) 统一代码风格。
*   **代码检查**: 使用 [ESLint](https://eslint.org/) 强制执行编码规范，并与 Prettier 集成。

**注意**: 本文档不提供 `package.json` 的具体内容。开发者应根据上述确定的技术栈和依赖项，自行安装所需的库。

## 5. 根目录结构

```
catalyst/
├── docs/                    # 文档目录
├── resources/               # 资源文件目录
├── src/                     # 源代码目录
├── test/                    # 测试文件目录
├── .eslintrc.cjs            # ESLint 配置文件
├── .gitignore               # Git 忽略文件配置
├── .pnpmfile.cjs            # pnpm 配置文件
├── .prettierrc              # Prettier 配置文件
├── electron.vite.config.ts  # Electron-Vite 配置文件
├── package.json             # 项目配置和依赖声明
├── pnpm-lock.yaml           # pnpm 锁定文件
├── pnpm-workspace.yaml      # pnpm 工作区配置
├── tsconfig.json            # TypeScript 配置文件
├── tsconfig.node.json       # Node.js 环境 TypeScript 配置
└── tsconfig.web.json        # Web 环境 TypeScript 配置
```

## 6. 文档目录 (docs/)

```
docs/
├── mihomo_about/            # Mihomo 相关文档和示例
│   ├── config-example.yaml  # Mihomo 配置示例
│   └── mihomo_manual.md     # Mihomo 使用手册
└── project/                 # 项目相关文档
    ├── MIHOMO_PROXY_DESIGN.md    # Mihomo 代理功能设计方案
    ├── MIHOMO_PROXY_USAGE.md     # Mihomo 代理功能使用指南
    ├── PROJECT_CONTEXT.md        # 项目问题分析与修复总结
    ├── project_RPD.md            # 项目需求文档
    └── UI_ARCHITECTURE.md        # UI 架构文档
```

## 7. 资源目录 (resources/)

```
resources/
├── mihomo-windows-amd64-v3-v1.19.12.zip  # Mihomo 可执行文件压缩包
└── mihomo.exe                            # Mihomo 核心可执行文件
```

## 8. 源代码目录 (src/)

### 8.1 主进程目录 (src/main/)

```
src/main/
├── index.ts                 # 主进程入口文件
├── preload.ts               # 预加载脚本
├── ipc-handlers/            # IPC 处理器目录
│   ├── dev-environment-ipc.ts  # 开发环境 IPC 处理器
│   ├── llm-ipc.ts           # LLM IPC 处理器
│   └── mihomo-ipc.ts        # Mihomo IPC 处理器
└── services/                # 服务层目录
    ├── api-key-manager.ts   # API 密钥管理服务
    ├── dev-environment-service.ts  # 开发环境服务
    ├── llm-service.ts       # LLM 服务
    └── mihomo-service.ts    # Mihomo 核心服务
```

### 8.2 渲染进程目录 (src/renderer/)

```
src/renderer/
├── App.tsx                  # 应用根组件
├── index.html               # HTML 模板
├── main.tsx                 # 渲染进程入口文件
├── components/              # 组件目录
│   ├── common/              # 通用组件目录
│   │   ├── Button.tsx       # 按钮组件
│   │   ├── Card.tsx         # 卡片组件
│   │   ├── PageContainer.tsx # 页面容器组件
│   │   ├── StatusIndicator.tsx # 状态指示器组件
│   │   ├── TitleBar.tsx     # 标题栏组件
│   │   └── index.ts         # 通用组件导出文件
│   ├── MessageInput.tsx     # 消息输入组件
│   ├── MessageList.tsx      # 消息列表组件
│   ├── Modal.tsx            # 模态框组件
│   ├── ProxyGroupManager.tsx # 代理组管理组件
│   └── SettingsPanel.tsx    # 设置面板组件
├── contexts/                # 上下文目录
│   └── ThemeContext.tsx     # 主题上下文
├── hooks/                   # 自定义 Hook 目录
│   └── useChat.ts           # 聊天 Hook
├── layouts/                 # 布局组件目录
│   ├── MainLayout.tsx       # 主布局组件
│   └── Sidebar.tsx          # 侧边栏组件
├── pages/                   # 页面组件目录
│   ├── ChatPage.tsx         # 聊天页面
│   ├── DevEnvironmentPage.tsx # 开发环境页面
│   ├── HomePage.tsx         # 首页
│   ├── MihomoConfigPage.tsx # Mihomo 配置页面
│   └── SystemProxyPage.tsx  # 系统代理页面
├── styles/                  # 样式目录
│   ├── globalStyles.ts      # 全局样式
│   ├── styled.d.ts          # Styled-components 类型声明
│   └── theme.ts             # 主题配置
└── types/                   # 类型声明目录
    └── electron.d.ts        # Electron API 类型声明
```

### 8.3 共享代码目录 (src/shared/)

```
src/shared/
└── ipc-events.ts            # IPC 事件常量定义
```

## 9. 测试目录 (test/)

```
test/
└── mihomo-config.yaml       # Mihomo 测试配置文件
```

## 10. 关键文件说明

### 10.1 核心配置文件

1. **package.json**: 项目配置文件，包含依赖声明、脚本命令等
2. **tsconfig.json**: TypeScript 配置文件，定义编译选项
3. **electron.vite.config.ts**: Electron-Vite 构建配置文件

### 10.2 主要源文件

1. **src/main/index.ts**: Electron 主进程入口，负责创建窗口和注册 IPC 处理器
2. **src/main/services/mihomo-service.ts**: Mihomo 核心服务，负责与 Mihomo 进程交互
3. **src/renderer/App.tsx**: React 应用根组件，定义路由结构
4. **src/renderer/pages/SystemProxyPage.tsx**: 系统代理页面，集成代理组管理功能
5. **src/renderer/components/ProxyGroupManager.tsx**: 代理组管理组件，实现代理组显示和切换

### 10.3 文档文件

1. **docs/project/project_RPD.md**: 项目需求文档，定义了项目的功能和非功能需求
2. **docs/project/UI_ARCHITECTURE.md**: UI 架构文档，详细描述了主题系统和组件设计
3. **docs/project/MIHOMO_PROXY_DESIGN.md**: Mihomo 代理功能设计方案
4. **docs/project/MIHOMO_PROXY_USAGE.md**: Mihomo 代理功能使用指南

## 11. 架构特点

### 11.1 进程分离

项目采用 Electron 的主进程-渲染进程架构：
- **主进程**: 负责系统级操作，如文件读写、进程管理、IPC 通信
- **渲染进程**: 负责 UI 渲染和用户交互

### 11.2 模块化设计

- **服务层**: 封装业务逻辑，提供统一的接口
- **IPC 层**: 处理进程间通信，隔离主进程和渲染进程
- **组件层**: 实现 UI 功能，采用组件化设计
- **页面层**: 组合组件实现具体功能页面

### 11.3 主题系统

- 支持明/暗两种主题模式
- 通过 Context API 实现主题状态管理
- 集成 MUI 主题系统，支持扩展

## 12. 开发规范

### 12.1 代码风格

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 和 Prettier 规范
- 采用 ESM (ECMAScript Modules) 模块系统

### 12.2 组件设计

- 使用 Styled-components 进行样式开发
- 集成 Framer Motion 实现动画效果
- 遵循原子设计原则，组件可复用

### 12.3 文档维护

- 所有重要功能都需要有对应的设计文档和使用指南
- 文档与代码同步更新
- 提供详细的注释和类型声明