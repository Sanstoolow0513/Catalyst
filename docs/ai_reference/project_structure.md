# 项目结构概览

```
Catalyst/
├── docs/                     # 项目文档 (你在这里)
├── resources/                # 静态资源文件 (如 Mihomo 可执行文件)
├── src/                      # 源代码目录
│   ├── main/                # 主进程代码 (Node.js, Electron APIs)
│   │   ├── index.ts         # 主进程入口
│   │   ├── preload.ts       # 预加载脚本 (安全桥接)
│   │   ├── ipc-handlers/    # 处理来自渲染进程的 IPC 请求
│   │   └── services/        # 核心业务逻辑服务 (如 ConfigManager, MihomoService)
│   ├── renderer/            # 渲染进程代码 (React UI)
│   │   ├── App.tsx          # React 应用根组件
│   │   ├── main.tsx         # 渲染进程入口
│   │   ├── components/      # 可复用的 React 组件
│   │   ├── layouts/         # 页面布局组件 (如 MainLayout, Sidebar)
│   │   ├── pages/           # 页面级 React 组件
│   │   ├── contexts/        # React Context (如 ThemeContext)
│   │   ├── hooks/           # 自定义 React Hooks
│   │   ├── styles/          # 全局样式和主题定义
│   │   └── types/           # 渲染进程专用 TypeScript 类型
│   └── shared/              # 主进程和渲染进程共享的代码
│       └── ipc-events.ts    # IPC 事件常量定义
├── test/                     # 测试文件
├── package.json             # 项目依赖和脚本
└── ...                      # 配置文件 (如 tsconfig, vite config, eslint)
```