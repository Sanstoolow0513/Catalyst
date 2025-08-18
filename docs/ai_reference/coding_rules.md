# AI专用编码约定

本文档定义了一些在 Catalyst 项目中推荐或必须遵循的编码约定，特别是针对 AI 生成代码时需要注意的方面。

## 组件开发

*   **文件命名与存放**:
    *   React 组件文件使用 PascalCase 命名，例如 `Button.tsx`, `ProxyControlPanel.tsx`。
    *   组件文件通常存放在 `src/renderer/components/` 或其子目录下。通用组件放 `components/common/`，特定功能组件可按功能模块分组。
*   **组件定义**: 优先使用函数式组件 (Functional Components) 和箭头函数。
*   **Props 类型**: 为组件的 Props 显式定义 TypeScript 接口。
*   **Hooks 使用**: 合理使用 React Hooks (useState, useEffect, useContext, 自定义 Hooks)。

## IPC 通信

*   **事件常量**:
    *   所有 IPC 事件名称都定义在 `src/shared/ipc-events.ts` 文件的 `IPC_EVENTS` 对象中。
    *   例如: `export const IPC_EVENTS = { CONFIG_GET_ALL: 'config:get-all', ... };`
*   **调用方式**:
    *   在渲染进程中，通过 `window.electronAPI` 对象访问预加载脚本暴露的方法。
    *   例如: `const config = await window.electronAPI.config.getAll();`
    *   例如: `await window.electronAPI.mihomo.start();`
    *   例如: `const result = await window.electronAPI.llm.generateCompletion(request);`
*   **响应处理**:
    *   IPC 调用通常是异步的，使用 `async/await`。
    *   主进程返回的响应通常遵循统一格式: `{ success: boolean, data?: any, error?: string }`。
    *   务必检查 `response.success` 并处理 `error` 情况。

## 状态管理

*   **局部状态**: 使用 `useState` 或 `useReducer`。
*   **全局状态**: 使用 React Context API (如 `ThemeContext`, `UserContext`)。
*   **自定义 Hooks**: 将复杂的组件逻辑或可复用的状态逻辑封装成自定义 Hooks。

## 样式

*   **Styled Components**: 使用 `styled-components` 库来编写组件样式。
*   **主题**: 通过 `useTheme` Hook 获取主题变量，确保样式能适应明暗主题切换。

## 错误处理与用户体验

*   **加载状态**: 对于异步操作，提供加载指示（如禁用按钮、显示 Spinner）。
*   **错误提示**: 将 IPC 错误或 API 错误以用户友好的方式展示出来。
*   **类型安全**: 充分利用 TypeScript 进行类型检查，减少运行时错误。