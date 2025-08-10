# 工程描述文档

本文档旨在根据 `project_RPD.md` 的内容，为重构后的项目提供清晰的技术栈和环境描述。

## 1. 项目概述

本项目是一个基于 Electron、React 和 TypeScript 的综合性桌面应用程序。其目标是打造一个集成了系统代理、LLM 对话、开发环境一键部署和高度可定制化设置的强大工具。应用将注重现代化的 UI/UX 设计，并提供稳定、可维护的代码基础。

## 2. 技术栈

为了满足工程的功能要求，我们选择以下技术栈：

### 2.1. 核心框架与语言

*   **运行环境**: [Node.js](https://nodejs.org/)
*   **应用框架**: [Electron](https://www.electronjs.org/) - 用于构建跨平台的桌面应用程序。
*   **前端框架**: [React](https://react.dev/) - 用于构建用户界面。
*   **编程语言**: [TypeScript](https://www.typescriptlang.org/) - 为项目提供静态类型检查，提高代码质量和可维护性。
*   **模块系统**: 将统一采用 **ESM (ECMAScript Modules)** 标准，以确保代码的现代化和一致性。

### 2.2. UI/UX 相关库

*   **UI 库**: 项目将采用 [MUI](https://mui.com/) 作为核心 React UI 库，以构建统一、美观且功能丰富的界面。
*   **样式方案**: 项目将采用 [Styled-components](https://styled-components.com/) 进行组件化样式开发，以支持动态主题切换（明/暗模式）。
*   **动画**: 项目将采用 [Framer Motion](https://www.framer.com/motion/) 为应用添加流畅的动画效果。

### 2.3. 核心功能依赖

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

## 3. 开发环境要求

为确保开发过程的顺利进行，必须配置以下环境：

*   **Node.js**: `v18.x` 或更高版本。
*   **包管理器**: 项目将采用 `pnpm` 管理依赖，以确保依赖版本的确定性和安装效率。
*   **代码格式化**: 项目将采用 [Prettier](https://prettier.io/) 统一代码风格。
*   **代码检查**: 使用 [ESLint](https://eslint.org/) 强制执行编码规范，并与 Prettier 集成。

---

**注意**: 本文档不提供 `package.json` 的具体内容。开发者应根据上述确定的技术栈和依赖项，自行安装所需的库。