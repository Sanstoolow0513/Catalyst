# Catalyst 项目结构

## 项目概述

Catalyst 是一个基于 Electron 的现代化综合性桌面应用程序，集成了系统代理管理、AI 对话、开发环境部署和统一的设置管理等功能。应用采用现代化的 UI/UX 设计，提供稳定、可维护的代码基础。

## 目录结构

```
Catalyst/
├── docs/                           # 项目文档
│   ├── mihomo_about/              # Mihomo 代理相关文档
│   │   ├── config-example.yaml    # Mihomo 配置示例
│   │   └── mihomo_manual.md       # Mihomo 使用手册
│   └── project/                   # 项目相关文档
│       ├── MIHOMO_PROXY_DESIGN.md    # Mihomo 代理设计文档
│       ├── MIHOMO_PROXY_USAGE.md     # Mihomo 代理使用说明
│       ├── PROJECT_CONTEXT.md       # 项目上下文
│       ├── PROJECT_STRUCTURE.md     # 项目结构说明（本文件）
│       ├── project_RPD.md           # 项目 RPD 文档
│       └── UI_ARCHITECTURE.md       # UI 架构设计
├── resources/                     # 资源文件
│   ├── mihomo-windows-amd64-v3-v1.19.12.zip  # Mihomo Windows 版本
│   └── mihomo.exe                 # Mihomo 可执行文件
├── src/                          # 源代码目录
│   ├── main/                     # 主进程代码
│   │   ├── index.ts              # 主进程入口
│   │   ├── preload.ts            # 预加载脚本
│   │   ├── ipc-handlers/         # IPC 事件处理器
│   │   │   ├── config-ipc.ts     # 配置管理 IPC 处理器
│   │   │   ├── dev-environment-ipc.ts  # 开发环境 IPC 处理器
│   │   │   ├── llm-ipc.ts        # LLM IPC 处理器
│   │   │   └── mihomo-ipc.ts     # Mihomo IPC 处理器
│   │   └── services/             # 服务层
│   │       ├── api-key-manager.ts    # API 密钥管理服务
│   │       ├── config-manager.ts     # 配置管理服务（已扩展）
│   │       ├── dev-environment-service.ts  # 开发环境服务
│   │       ├── llm-service.ts         # LLM 服务
│   │       └── mihomo-service.ts      # Mihomo 服务
│   ├── renderer/                 # 渲染进程代码
│   │   ├── App.tsx               # 应用主组件
│   │   ├── index.html            # HTML 入口
│   │   ├── main.tsx              # 渲染进程入口
│   │   ├── components/           # React 组件
│   │   │   ├── MessageInput.tsx  # 消息输入组件
│   │   │   ├── MessageList.tsx  # 消息列表组件
│   │   │   ├── Modal.tsx         # 模态框组件
│   │   │   ├── ProxyGroupManager.tsx  # 代理组管理组件
│   │   │   ├── SettingsPanel.tsx     # 设置面板组件
│   │   │   └── common/               # 通用组件
│   │   │       ├── Button.tsx     # 按钮组件
│   │   │       ├── Card.tsx       # 卡片组件
│   │   │       ├── index.ts       # 组件导出
│   │   │       ├── PageContainer.tsx  # 页面容器组件
│   │   │       ├── StatusIndicator.tsx  # 状态指示器组件
│   │   │       └── TitleBar.tsx   # 标题栏组件
│   │   ├── contexts/             # React Context
│   │   │   ├── ThemeContext.tsx  # 主题上下文
│   │   │   └── UserContext.tsx   # 用户上下文
│   │   ├── hooks/                # 自定义 Hooks
│   │   │   └── useChat.ts        # 聊天 Hook
│   │   ├── layouts/              # 布局组件
│   │   │   ├── MainLayout.tsx    # 主布局组件
│   │   │   └── Sidebar.tsx      # 侧边栏组件（已更新）
│   │   ├── pages/                # 页面组件
│   │   │   ├── ChatPage.tsx      # 聊天页面
│   │   │   ├── DevEnvironmentPage.tsx  # 开发环境页面
│   │   │   ├── HomePage.tsx      # 首页
│   │   │   ├── InfoPage.tsx      # 信息页面（新增）
│   │   │   ├── MihomoConfigPage.tsx  # Mihomo 配置页面
│   │   │   ├── SettingsPage.tsx      # 统一设置页面（新增）
│   │   │   ├── SystemProxyPage.tsx   # 系统代理页面
│   │   │   └── UnifiedProxyPage.tsx   # 统一代理页面
│   │   ├── styles/               # 样式文件
│   │   │   ├── globalStyles.ts  # 全局样式
│   │   │   ├── styled.d.ts      # Styled Components 类型定义
│   │   │   └── theme.ts         # 主题定义
│   │   └── types/                # TypeScript 类型定义
│   │       └── electron.d.ts     # Electron API 类型定义（已扩展）
│   └── shared/                  # 共享代码
│       └── ipc-events.ts        # IPC 事件常量（已扩展）
├── test/                         # 测试文件
│   └── mihomo-config.yaml       # Mihomo 配置测试文件
├── .eslintrc.cjs                 # ESLint 配置
├── .gitignore                    # Git 忽略文件
├── .pnpmfile.cjs                 # pnpm 配置文件
├── .prettierrc                   # Prettier 配置
├── electron.vite.config.ts       # Electron Vite 配置
├── package.json                  # 项目依赖配置
├── pnpm-lock.yaml               # pnpm 锁定文件
├── pnpm-workspace.yaml          # pnpm 工作区配置
├── tsconfig.json                 # TypeScript 配置
├── tsconfig.node.json           # Node.js TypeScript 配置
└── tsconfig.web.json            # Web TypeScript 配置
```

## 主要模块说明

### 1. 主进程 (src/main/)
- **index.ts**: 主进程入口，负责窗口创建、生命周期管理和事件处理
- **preload.ts**: 预加载脚本，为渲染进程提供安全的 API 访问
- **ipc-handlers/**: IPC 事件处理器，处理主进程和渲染进程间的通信
  - **config-ipc.ts**: 配置管理 IPC 处理器（已扩展，支持用户设置、备份管理等）
  - **dev-environment-ipc.ts**: 开发环境 IPC 处理器
  - **llm-ipc.ts**: LLM IPC 处理器
  - **mihomo-ipc.ts**: Mihomo IPC 处理器
- **services/**: 服务层，提供各种业务逻辑服务
  - **config-manager.ts**: 配置管理服务（已大幅扩展，支持用户偏好、使用统计、备份恢复等）
  - **api-key-manager.ts**: API 密钥管理服务
  - **dev-environment-service.ts**: 开发环境服务
  - **llm-service.ts**: LLM 服务
  - **mihomo-service.ts**: Mihomo 服务

### 2. 渲染进程 (src/renderer/)
- **App.tsx**: 应用主组件，路由配置（已添加新页面路由）
- **components/**: 可复用的 React 组件
- **contexts/**: React Context，提供全局状态管理
- **hooks/**: 自定义 Hooks，封装常用逻辑
- **layouts/**: 布局组件，定义应用整体结构
  - **Sidebar.tsx**: 侧边栏组件（已更新，添加设置和关于页面导航）
- **pages/**: 页面组件，对应不同的功能模块
  - **InfoPage.tsx**: 信息页面（新增，包含应用介绍、功能说明等）
  - **SettingsPage.tsx**: 统一设置页面（新增，包含通用设置、LLM设置、代理设置、用户设置、备份管理等）
- **styles/**: 样式文件，包括主题和全局样式
- **types/**: TypeScript 类型定义
  - **electron.d.ts**: Electron API 类型定义（已扩展，包含新的配置管理API）

### 3. 共享代码 (src/shared/)
- **ipc-events.ts**: IPC 事件常量（已大幅扩展，包含新的配置管理事件）

### 4. 文档 (docs/)
- **mihomo_about/**: Mihomo 代理相关文档
- **project/**: 项目相关文档，包括设计、使用说明等

### 5. 资源文件 (resources/)
- **mihomo-***: Mihomo 代理的可执行文件和配置

### 6. 配置文件
- **electron.vite.config.ts**: Electron Vite 构建配置
- **package.json**: 项目依赖和脚本配置
- **tsconfig*.json**: TypeScript 编译配置
- **.eslintrc.cjs**: ESLint 代码检查配置
- **.prettierrc**: Prettier 代码格式化配置

## 技术栈

### 前端技术
- **React 18**: 用户界面框架
- **TypeScript**: 类型安全的 JavaScript
- **Styled Components**: CSS-in-JS 样式解决方案
- **Framer Motion**: 动画库
- **React Router**: 路由管理
- **Lucide React**: 图标库

### 后端技术
- **Electron**: 桌面应用框架
- **Node.js**: 运行时环境
- **Electron Store**: 配置存储
- **IPC**: 进程间通信

### 构建工具
- **Vite**: 快速的构建工具
- **Electron Vite**: Electron 的 Vite 插件

## 核心功能模块

### 1. 配置管理系统
- **统一配置接口**: 支持多种设置类型的统一管理
- **用户偏好设置**: 姓名、邮箱、主题、语言等
- **应用行为设置**: 开机启动、最小化到托盘、通知等
- **使用统计**: 自动记录和展示用户使用情况
- **备份恢复**: 配置备份创建、恢复和管理
- **配置验证**: 配置文件结构验证
- **配置迁移**: 版本升级时的配置迁移

### 2. 系统代理管理
- **Mihomo 集成**: 与 Mihomo 代理核心的深度集成
- **代理组管理**: 可视化代理组显示和切换
- **规则配置**: 代理规则的配置和管理
- **状态监控**: 实时监控代理运行状态

### 3. LLM 对话功能
- **多提供商支持**: 支持 OpenAI 等多个 LLM 提供商
- **API 密钥管理**: 安全的 API 密钥存储和管理
- **对话历史**: 消息历史记录和管理
- **参数配置**: 温度、top_p 等生成参数配置

### 4. 开发环境部署
- **IDE 安装**: VSCode 等开发环境的静默安装
- **运行时环境**: Node.js、Python 等运行时环境的安装
- **一键部署**: 简化开发环境的配置过程

### 5. 统一设置界面
- **分类设置**: 通用、LLM、代理、用户、备份等分类设置
- **实时预览**: 设置变更的实时预览效果
- **导入导出**: 配置的导入和导出功能
- **重置功能**: 一键重置所有设置

## 开发指南

### 1. 环境准备
- 安装 Node.js (推荐版本 16+)
- 安装 pnpm 包管理器

### 2. 项目设置
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建应用
pnpm build

# 打包应用
pnpm package
```

### 3. 代码规范
- 使用 TypeScript 进行类型检查
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循 React 最佳实践

### 4. 目录约定
- 组件文件使用 PascalCase 命名
- 工具函数文件使用 camelCase 命名
- 样式文件使用 kebab-case 命名
- 类型定义文件使用 .d.ts 扩展名

## 部署说明

### 开发环境
- 使用 `pnpm dev` 启动开发服务器
- 支持热重载和调试工具

### 生产环境
- 使用 `pnpm build` 构建应用
- 使用 `pnpm package` 打包成可执行文件

### 配置文件位置
- **Windows**: `%APPDATA%/Catalyst/config/`
- **macOS**: `~/Library/Application Support/Catalyst/config/`
- **Linux**: `~/.config/Catalyst/config/`

## 扩展指南

### 1. 添加新页面
1. 在 `src/renderer/pages/` 目录下创建新的页面组件
2. 在 `src/renderer/App.tsx` 中添加路由配置
3. 在 `src/renderer/layouts/Sidebar.tsx` 中添加导航项

### 2. 添加新服务
1. 在 `src/main/services/` 目录下创建新的服务文件
2. 在 `src/main/ipc-handlers/` 目录下创建对应的 IPC 处理器
3. 在 `src/shared/ipc-events.ts` 中添加事件常量
4. 在 `src/main/preload.ts` 中暴露 API
5. 在 `src/renderer/types/electron.d.ts` 中添加类型定义

### 3. 添加新配置项
1. 在 `src/main/services/config-manager.ts` 中添加配置方法
2. 在 `src/main/ipc-handlers/config-ipc.ts` 中添加 IPC 处理器
3. 在 `src/shared/ipc-events.ts` 中添加事件常量
4. 在 `src/main/preload.ts` 中暴露 API
5. 在 `src/renderer/types/electron.d.ts` 中添加类型定义
6. 在 `src/renderer/pages/SettingsPage.tsx` 中添加 UI 控件

### 4. 添加新组件
1. 在 `src/renderer/components/` 目录下创建组件文件
2. 导出组件供其他模块使用
3. 编写相应的样式和类型定义

### 5. 主题定制
1. 修改 `src/renderer/styles/theme.ts` 中的主题变量
2. 在组件中使用 styled-components 引用主题变量
3. 确保支持浅色和深色主题

## 项目特色

### 1. 模块化架构
- 清晰的模块划分，便于维护和扩展
- 统一的接口设计，保证模块间的松耦合

### 2. 类型安全
- 全面的 TypeScript 类型定义
- 严格的类型检查，减少运行时错误

### 3. 现代化 UI
- 响应式设计，适配不同屏幕尺寸
- 流畅的动画效果和交互体验
- 支持明暗主题切换

### 4. 配置管理
- 统一的配置管理系统
- 支持配置备份和恢复
- 自动配置验证和迁移

### 5. 扩展性
- 插件化的架构设计
- 易于添加新功能和模块
- 完善的开发文档和指南

## 版本历史

### v1.0.0 (当前版本)
- ✅ 完成基础架构搭建
- ✅ 实现系统代理管理功能
- ✅ 集成 LLM 对话功能
- ✅ 添加开发环境部署功能
- ✅ 创建统一的设置管理系统
- ✅ 实现信息页面和导航
- ✅ 完善配置备份和恢复功能
- ✅ 添加使用统计功能

## 未来规划

### 短期目标
- 🔄 完善错误处理和日志系统
- 🔄 添加单元测试和集成测试
- 🔄 优化性能和内存使用
- 🔄 完善多语言支持

### 长期目标
- 🚀 实现插件系统
- 🚀 添加云同步功能
- 🚀 支持多用户账户
- 🚀 开发主题市场
- 🚀 移动端适配
