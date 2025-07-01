# Catalyst

**Catalyst 是为qmr设计的工具，关于系统控制、网络管理与开发环境配置和工作流**

## 设计哲学

Catalyst 的核心设计哲学是 **"专业内核，极简体验"**。我们旨在：
- **功能强大 (Pro)**: 提供深入的系统控制和网络管理能力，满足高级用户的专业需求。
- **流程简化 (Easy)**: 将复杂的操作（如环境配置、代理切换）封装成直观、一键式的操作，降低使用门槛。
- **界面直观 (Intuitive)**: 采用简洁、现代的设计语言，确保用户能够轻松地找到所需功能，并快速理解信息。

## 功能特性

- **仪表盘** - 集中展示系统核心信息与实时资源监控（CPU、内存、GPU）。
- **代理服务** - 集成 Clash (Mihomo) 核心，提供配置管理、节点切换与系统代理功能。
- **工具箱** - 一键安装常用的开发工具和环境，简化您的开发配置流程。
- **内嵌浏览器** - 提供一个轻量、便捷的内置浏览器，满足临时浏览需求。

## 技术架构

Catalyst 遵循标准的 Electron 应用架构，将应用分为主进程和渲染进程，并采用服务化的思想来组织后端逻辑。

```mermaid
graph TD
    A[主进程 (Main Process)] <--> B(渲染进程 (UI));
    A -- 管理 --> C{窗口 (BrowserWindow)};
    A -- 运行 --> D[后台服务 (Services)];
    B -- 发送异步消息 --> E{IPC 通信};
    D -- 通过主进程转发 --> E;

    subgraph "src/main"
        A
        C
        D
    end

    subgraph "src/renderer"
        B
    end

    style A fill:#3f3d56,stroke:#6c63ff,stroke-width:2px,color:#fff
    style B fill:#3f3d56,stroke:#6c63ff,stroke-width:2px,color:#fff
```

- **主进程 (`src/main/index.js`)**:
  - **职责**: 应用的生命周期管理、创建和控制浏览器窗口、运行所有后台服务。
  - **特点**: 所有与操作系统底层交互、文件系统操作和后台进程管理的核心逻辑都在此执行。

- **渲染进程 (`src/renderer/index.js`)**:
  - **职责**: 负责应用界面的展示和用户交互。
  - **特点**: 使用标准的 Web 技术 (HTML/CSS/JS) 构建，并通过 `ipcRenderer` 与主进程进行异步通信，以请求数据或触后台能。

- **服务层 (`src/main/services/`)**:
  - **职责**: 将不同的后端功能模块化，每个服务负责一项具体的任务（如Clash管理、系统信息获取），使得逻辑更清晰、更易于维护。

- **IPC通信**:
  - 渲染进程（UI）通过发送消息到特定的IPC通道（如 `'start-clash'`）来请求操作。
  - 主进程监听这些通道，在接收到消息后，调用相应的服务来执行任务。
  - 服务执行完成后，通过主进程将结果或状态更新（如 `'clash-status-update'`）回传给渲染进程，UI随之更新。

## 核心模块详解

- `ClashService`: 作为代理功能的核心，它封装了对Mihomo核心的全部操作，包括：
    - 启动和停止Mihomo子进程。
    - 通过`ConfigManager`下载和管理配置文件。
    - 直接从`config.yaml`解析节点列表，实现即时预览。
    - 通过RESTful API与运行中的Clash核心通信，以切换代理、测试延迟。
    - 调用`ProxyManager`来修改系统级代理设置。

- `SoftwareInstallerService`: 驱动"工具箱"功能，负责下载和静默安装预设的开发软件。

- `SystemInfo` & `ResourceMonitor`: 这两个服务利用 `systeminformation` 库来获取系统硬件信息和实时的资源使用率，为"仪表盘"提供数据。

## 技术栈

- Electron
- Node.js
- Clash (MetaCubeX Mihomo)
- systeminformation

## 项目结构

```
catalyst/
  ├── assets/             # 静态资源
  │
  ├── src/
  │   ├── main/           # 主进程代码
  │   ├── renderer/       # 渲染进程代码
  │   └── shared/         # 共享代码
  │
  ├── resources/          # 应用资源
  │
  ├── package.json
  └── README.md
```

## 开发说明

### 安装依赖

```bash
npm install
```

### 开发模式运行

```bash
npm run dev
```

### 打包构建

```bash
npm run build
```

## 配置说明

### Clash配置

Clash配置文件位于 `resources/clash/configs` 目录中。程序会根据 `url.txt` 中指定的URL下载配置文件。

### 软件安装配置

软件安装配置位于 `src/shared/config/software-config.json`，可以根据需要添加或修改软件项。

## 许可证

ISC

## repo adding

- 2025.6.4：完成了代理组管理和开发，主要用命令行实现，调用为mihomo.exe 版本1.19.9 [其中代理部分通过pwsh调用实现]

- 2025.6.6:初步完成整体构建，使用AI实现整体框架，接下来是功能调整修改和打磨

- 2025.6.21:完成所有的通信设计和cjs确定，后面修正更多的效果和功能。

- 2025.6.25: 对项目进行了大规模重构和重塑，命名为 "Catalyst"。优化了UI布局，修复了多项核心功能缺陷（如应用退出逻辑、节点加载方式），并提升了代码的健壮性和用户体验。