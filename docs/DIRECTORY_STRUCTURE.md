# 新项目目录结构规划

本文档旨在为重构后的 Electron + Vite + React + TypeScript 项目提供一个清晰、现代化且可扩展的目录结构。

## 根目录结构

```
.
├── build/                  # 打包输出目录
├── dist/                   # 开发环境编译输出目录
├── node_modules/           # 依赖库存放目录
├── public/                 # 静态资源目录，会被直接复制到打包目录
├── resources/              # 存放外部二进制文件或资源的目录
├── src/                    # 新项目的全部源代码
│
├── .eslintrc.cjs           # ESLint 配置文件
├── .gitignore              # Git 忽略文件配置
├── .prettierrc             # Prettier 配置文件
├── electron.vite.config.ts # Electron-Vite 配置文件
├── package.json            # 项目依赖与脚本配置
├── tsconfig.json           # TypeScript 编译器配置 (全局)
├── tsconfig.node.json      # TypeScript 编译器配置 (仅 Node.js 环境，如主进程)
└── tsconfig.web.json       # TypeScript 编译器配置 (仅 Web 环境，如渲染器进程)
```

## `src` 目录详解

`src` 目录是所有开发工作的核心，其内部结构遵循 Electron 的进程模型进行划分。

```
src/
├── main/                   # 主进程 (Main Process) 源代码
│   ├── index.ts            # 主进程入口文件
│   ├── preload.ts          # 预加载脚本 (Preload Script)
│   └── ...                 # 其他主进程模块 (如窗口管理, IPC 通信处理等)
│
├── renderer/               # 渲染器进程 (Renderer Process) 源代码
│   ├── index.html          # 渲染器进程的 HTML 入口
│   ├── main.tsx            # React 应用入口文件
│   ├── App.tsx             # React 根组件
│   │
│   ├── assets/             # 静态资源 (图片, 字体, CSS)
│   │   └── styles/         # 全局样式和主题文件
│   │
│   ├── components/         # 可复用的 React 组件 (UI无关)
│   │
│   ├── hooks/              # 自定义 React Hooks
│   │
│   ├── layouts/            # 布局组件 (如侧边栏, 导航栏)
│   │
│   ├── pages/              # 页面级组件
│   │
│   ├── services/           # 前端服务 (如 API 请求)
│   │
│   └── utils/              # 前端工具函数
│
└── shared/                 # 共享代码 (主进程与渲染器进程通用)
    ├── types/              # 全局 TypeScript 类型定义
    └── constants.ts        # 共享常量 (如 IPC 事件名)
```

### 各部分职责说明

*   **`src/main`**: 存放所有与 Node.js 环境相关的代码。负责创建和管理浏览器窗口、处理原生操作系统事件、以及所有后端逻辑的实现（如调用 `mihomo` 核心、读写本地文件等）。
*   **`src/renderer`**: 存放所有与浏览器环境相关的代码，即用户看到和交互的界面。这里使用 React 和 TypeScript 构建。
*   **`src/shared`**: 存放需要被主进程和渲染器进程同时引用的代码。最典型的例子就是 TypeScript 的类型定义和 IPC 通信的事件名常量，将它们放在共享目录可以确保两端使用的数据结构和事件名始终一致。
*   **`public`**: 存放不会被 Vite 处理的静态资源，例如图标文件。这些文件在构建时会被直接复制到输出目录的根路径下。
*   **`resources`**: 存放项目运行时依赖的、非代码类的外部资源，特别是二进制可执行文件。例如 `mihomo.exe`。此目录的内容需要手动管理，并配置到构建脚本中，以确保在打包后能被正确地复制到最终的应用中。
*   **配置文件 (`.eslintrc.cjs`, `tsconfig.*.json`等)**: 明确分离的配置文件使得我们可以为不同环境（Node.js vs 浏览器）应用不同的编译和检查规则，这是大型、健壮项目所必需的。

这个结构将旧项目混乱的 `src`、`src/main`、`src/renderer` 结构替换为一个统一、清晰的 `src` 目录，并为未来的功能扩展提供了良好的基础。