# 极简架构

## 进程模型

Catalyst 基于 Electron，采用多进程架构：

1.  **主进程 (Main Process)**:
    *   **职责**: 管理应用生命周期（创建窗口、退出等）、处理系统级任务、管理后台服务（如 Mihomo）、处理来自渲染进程的 IPC 请求。
    *   **技术栈**: Node.js, Electron APIs, `child_process`, `electron-store`, `axios`。
    *   **入口**: `src/main/index.ts`。

2.  **渲染进程 (Renderer Process)**:
    *   **职责**: 渲染用户界面 (UI)、处理用户交互、执行前端逻辑。
    *   **技术栈**: React, TypeScript, Styled Components, Framer Motion。
    *   **入口**: `src/renderer/main.tsx`。

3.  **预加载脚本 (Preload Script)**:
    *   **职责**: 在渲染进程和主进程之间建立一个安全的通信桥梁。它将主进程的功能通过 `contextBridge` 暴露给渲染进程。
    *   **文件**: `src/main/preload.ts`。

## 数据流

```
用户操作 (UI) 
   ↓
渲染进程 (React Components) 
   ↓ (通过 window.electronAPI)
预加载脚本 (Preload Script) 
   ↓ (通过 IPC)
主进程 (Services) 
   ↓ (可能调用外部程序或API)
外部服务 (Mihomo, LLM API) 
   ↓
主进程处理响应 
   ↓ (通过 IPC 回调)
预加载脚本 
   ↓
渲染进程更新 UI
```

## 关键服务

主进程包含多个服务模块，负责核心业务逻辑：
*   `ConfigManager`: 管理应用配置的读取、保存。
*   `MihomoService`: 管理 Mihomo 代理进程的启动、停止、配置。
*   `LLMService`: 管理与 LLM 提供商的通信。