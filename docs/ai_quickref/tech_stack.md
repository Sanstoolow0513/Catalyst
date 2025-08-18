# 技术栈

## 核心框架与库

*   **应用框架**: Electron (用于构建跨平台桌面应用)
*   **前端框架**: React 18 (用于构建用户界面)
*   **编程语言**: TypeScript (JavaScript 的超集，提供类型安全)
*   **运行时**: Node.js (Electron 的后端运行时)

## UI/UX 相关

*   **样式方案**: Styled Components (CSS-in-JS)
*   **动画库**: Framer Motion (用于实现流畅的交互动画)
*   **图标库**: Lucide React (简洁的 SVG 图标)
*   **状态管理**: React Context API (应用级状态), React Hooks (组件级状态)

## 后端/主进程相关

*   **进程间通信**: Electron IPC (主进程与渲染进程通信)
*   **配置存储**: Electron Store (简单的本地 JSON 存储)
*   **HTTP 客户端**: Axios (用于 API 调用，如与 Mihomo API 通信)
*   **子进程管理**: Node.js `child_process` (用于启动/停止外部程序，如 Mihomo)

## 构建与开发工具

*   **构建工具**: Vite (快速的前端构建工具)
*   **Electron 构建插件**: Electron Vite
*   **包管理器**: pnpm
*   **代码质量**: ESLint (代码检查), Prettier (代码格式化)