# 核心 IPC 通信

本文档列出项目中关键的 IPC (Inter-Process Communication) 通信点，这是主进程和渲染进程交互的主要方式。

## 通信模式

渲染进程通过 `window.electronAPI` 对象发送请求到主进程，并接收响应。主进程通过注册处理器来响应这些请求。

## 关键 IPC 事件

### 配置管理

*   **`config:get`**: 渲染进程请求获取完整配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_GET, ...)`
    *   *渲染进程*: `const config = await window.electronAPI.config.getConfig();`
*   **`config:set`**: 渲染进程请求保存完整配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_SET, ...)`
    *   *渲染进程*: `await window.electronAPI.config.setConfig(newConfig);`

### Mihomo 代理控制

*   **`mihomo:start`**: 渲染进程请求启动代理服务。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_START, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.start();`
*   **`mihomo:stop`**: 渲染进程请求停止代理服务。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_STOP, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.stop();`

### LLM 对话

*   **`llm:send-message`**: 渲染进程请求发送消息给 LLM。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_SEND_MESSAGE, ...)`
    *   *渲染进程*: `const response = await window.electronAPI.llm.sendMessage(messageData);`

*(注：具体实现细节和更多事件请参考 `src/main/ipc-handlers/` 和 `src/main/preload.ts`)*