# Electron 和 React 集成参考文档

本文档专为 AI 助手设计，详细描述了 Electron 和 React 在 Catalyst 项目中的集成方式，帮助 AI 更好地理解桌面应用的特殊性。

## 1. Electron 和 React 的集成原理

### 1.1 进程分离架构
Electron 应用采用多进程架构，Catalyst 项目遵循这一架构：

1. **主进程 (Main Process)**:
   - 负责创建和管理浏览器窗口
   - 管理应用生命周期
   - 访问操作系统底层 API
   - 处理文件系统操作、网络请求等

2. **渲染进程 (Renderer Process)**:
   - 运行 React 应用
   - 负责 UI 渲染和用户交互
   - 通过 IPC 与主进程通信

### 1.2 进程间通信 (IPC)
由于安全限制，渲染进程不能直接访问 Node.js API 和 Electron API。通过 IPC 机制实现进程间通信：

1. **主进程**: 注册 IPC 处理器
2. **预加载脚本**: 暴露安全的 API 给渲染进程
3. **渲染进程**: 调用暴露的 API 与主进程通信

## 2. 项目中的具体实现

### 2.1 入口文件结构

#### 2.1.1 主进程入口 (`src/main/index.ts`)
```typescript
import { app, BrowserWindow } from 'electron';
import { initializeIPC } from './ipc-handlers';
import { createMainWindow } from './window-manager';

// 应用准备就绪时创建窗口
app.whenReady().then(() => {
  createMainWindow();
  initializeIPC(); // 初始化 IPC 处理器
});

// 处理应用激活事件
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});

// 处理所有窗口关闭事件
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
```

#### 2.1.2 预加载脚本 (`src/main/preload.ts`)
```typescript
import { contextBridge, ipcRenderer } from 'electron';
import { IPC_EVENTS } from '../shared/ipc-events';

// 安全地暴露 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 配置相关 API
  config: {
    getConfig: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET),
    setConfig: (config: any) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET, config),
    // ... 其他配置方法
  },
  
  // Mihomo 相关 API
  mihomo: {
    start: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
    stop: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
    // ... 其他 Mihomo 方法
  },
  
  // LLM 相关 API
  llm: {
    sendMessage: (params: any) => ipcRenderer.invoke(IPC_EVENTS.LLM_SEND_MESSAGE, params),
    // ... 其他 LLM 方法
  },
  
  // 开发环境相关 API
  dev: {
    getSoftwareList: () => ipcRenderer.invoke(IPC_EVENTS.DEV_GET_SOFTWARE_LIST),
    // ... 其他开发环境方法
  }
});
```

#### 2.1.3 渲染进程入口 (`src/renderer/main.tsx`)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ThemeProvider } from './contexts/ThemeContext';
import './styles/globalStyles';

// 渲染 React 应用
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

### 2.2 IPC 通信模式

#### 2.2.1 事件常量定义 (`src/shared/ipc-events.ts`)
```typescript
export const IPC_EVENTS = {
  // 配置相关事件
  CONFIG_GET: 'config:get',
  CONFIG_SET: 'config:set',
  // ... 其他配置事件
  
  // Mihomo 相关事件
  MIHOMO_START: 'mihomo:start',
  MIHOMO_STOP: 'mihomo:stop',
  // ... 其他 Mihomo 事件
  
  // LLM 相关事件
  LLM_SEND_MESSAGE: 'llm:send-message',
  // ... 其他 LLM 事件
  
  // 开发环境相关事件
  DEV_GET_SOFTWARE_LIST: 'dev:get-software-list',
  // ... 其他开发环境事件
};
```

#### 2.2.2 主进程 IPC 处理器 (`src/main/ipc-handlers/*.ts`)
```typescript
import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { configManager } from '../services/config-manager';
import { mihomoService } from '../services/mihomo-service';

// 配置相关 IPC 处理器
ipcMain.handle(IPC_EVENTS.CONFIG_GET, async () => {
  try {
    const config = configManager.getConfig();
    return { success: true, data: config };
  } catch (error) {
    console.error('Failed to get config:', error);
    return { success: false, error: (error as Error).message };
  }
});

ipcMain.handle(IPC_EVENTS.MIHOMO_START, async () => {
  try {
    const result = await mihomoService.start();
    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to start mihomo:', error);
    return { success: false, error: (error as Error).message };
  }
});
```

#### 2.2.3 渲染进程类型定义 (`src/renderer/types/electron.d.ts`)
```typescript
export interface IElectronAPI {
  config: {
    getConfig: () => Promise<{ success: boolean; data?: Config; error?: string }>;
    setConfig: (config: Config) => Promise<{ success: boolean; error?: string }>;
    // ... 其他配置方法
  };
  
  mihomo: {
    start: () => Promise<{ success: boolean; error?: string }>;
    stop: () => Promise<{ success: boolean; error?: string }>;
    // ... 其他 Mihomo 方法
  };
  
  llm: {
    sendMessage: (params: any) => Promise<{ success: boolean; data?: any; error?: string }>;
    // ... 其他 LLM 方法
  };
  
  dev: {
    getSoftwareList: () => Promise<{ success: boolean; data?: SoftwareInfo[]; error?: string }>;
    // ... 其他开发环境方法
  }
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
```

### 2.3 React 组件中使用 Electron API

#### 2.3.1 函数组件中使用
```typescript
import React, { useState, useEffect } from 'react';

const SystemProxyPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  
  const startProxy = async () => {
    const response = await window.electronAPI.mihomo.start();
    if (response.success) {
      setIsRunning(true);
    } else {
      console.error('Failed to start proxy:', response.error);
    }
  };
  
  const stopProxy = async () => {
    const response = await window.electronAPI.mihomo.stop();
    if (response.success) {
      setIsRunning(false);
    } else {
      console.error('Failed to stop proxy:', response.error);
    }
  };
  
  return (
    <div>
      <h1>系统代理</h1>
      <button onClick={startProxy} disabled={isRunning}>
        {isRunning ? '运行中' : '启动'}
      </button>
      <button onClick={stopProxy} disabled={!isRunning}>
        停止
      </button>
    </div>
  );
};
```

#### 2.3.2 自定义 Hook 封装
```typescript
import { useState, useEffect } from 'react';

export const useMihomoStatus = () => {
  const [status, setStatus] = useState<MihomoStatus>({ running: false });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      const response = await window.electronAPI.mihomo.getStatus();
      if (response.success) {
        setStatus(response.data!);
      }
      setLoading(false);
    };
    
    fetchStatus();
    
    // 定时更新状态
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const startProxy = async () => {
    const response = await window.electronAPI.mihomo.start();
    if (response.success) {
      setStatus({ ...status, running: true });
    }
    return response;
  };
  
  const stopProxy = async () => {
    const response = await window.electronAPI.mihomo.stop();
    if (response.success) {
      setStatus({ ...status, running: false });
    }
    return response;
  };
  
  return { status, loading, startProxy, stopProxy };
};
```

## 3. 安全考虑

### 3.1 上下文隔离 (Context Isolation)
Electron 默认启用上下文隔离，确保渲染进程不能直接访问 Node.js API。

### 3.2 预加载脚本的安全性
预加载脚本只能暴露有限的、经过审查的 API 给渲染进程。

### 3.3 IPC 参数验证
在主进程中验证所有来自渲染进程的 IPC 参数，防止恶意输入。

## 4. 性能优化

### 4.1 避免频繁 IPC 调用
- 合并多个数据请求
- 使用缓存机制
- 实现数据订阅模式

### 4.2 渲染进程优化
- 使用 React.memo 避免不必要的重渲染
- 使用 useMemo 和 useCallback 优化计算和函数创建
- 合理使用懒加载

## 5. 调试技巧

### 5.1 主进程调试
- 使用 VS Code 的调试功能
- 添加 console.log 输出调试信息

### 5.2 渲染进程调试
- 使用浏览器开发者工具
- 查看控制台输出和网络请求

### 5.3 IPC 调试
- 在主进程和渲染进程中都添加日志输出
- 使用 Electron 的调试工具

## 6. 常见问题和解决方案

### 6.1 IPC 调用失败
1. 检查事件名称是否匹配
2. 检查主进程是否正确注册了处理器
3. 检查参数是否正确传递

### 6.2 API 未定义错误
1. 检查预加载脚本是否正确暴露了 API
2. 检查类型定义文件是否正确
3. 确保在渲染进程正确访问 window.electronAPI

### 6.3 数据不同步
1. 检查状态管理是否正确
2. 确保 IPC 响应处理正确
3. 添加适当的错误处理

## 7. 最佳实践

### 7.1 统一的错误处理
所有 IPC 响应都应遵循统一格式:
```typescript
{
  success: boolean;
  data?: any;
  error?: string;
}
```

### 7.2 类型安全
- 为所有 IPC 参数和响应定义 TypeScript 类型
- 使用接口定义复杂数据结构
- 定期更新类型定义文件

### 7.3 文档化
- 为所有 IPC 接口编写文档
- 在代码中添加适当的注释
- 维护最新的 API 文档