# Catalyst

## 项目简介
Catalyst 是一款基于 Electron 的桌面工具，整合代理管理（Clash）、本地内置服务、LLM 对话、系统信息读取与常用软件安装器等能力。  
目标是提供一个在本地可用的统一入口，面向开发与日常使用场景。

## 功能列表
- 代理管理：启动/停止 Clash 内核，加载与切换配置，系统代理一键设置与恢复。
- LLM：管理 API Key，提供基础对话能力（渲染层交互，主进程调度）。
- 本地服务：内置 Express 服务，包含 auth、config 等路由以支撑渲染层与服务层交互。
- 系统信息：读取 CPU、内存、网络等系统指标，用于面板展示与基础诊断。
- 安装器：提供常用软件的安装流程封装与简单的状态反馈。
- UI：渲染层页面与组件布局，包含侧边导航、监控面板、聊天与设置等。

## 架构概览
- 主进程：窗口管理、IPC 注册、服务生命周期调度。参见 [src/main/index.js](src/main/index.js)、[src/main/window.js](src/main/window.js)、[src/main/ipc-handlers/](src/main/ipc-handlers/)。
- 渲染进程：页面与组件，通过 IPC 与主进程交互。参见 [src/renderer/pages/](src/renderer/pages/)、[src/renderer/components/](src/renderer/components/)。
- IPC：定义事件与通道，承载渲染层与主进程通信。参见 [src/shared/ipc-events.js](src/shared/ipc-events.js) 与 [src/main/ipc-handlers/](src/main/ipc-handlers/)。
- 服务层：功能模块的封装与编排，涵盖 clash、llm、system、auth、installer。参见 [src/main/services/](src/main/services/)。
- 内置服务：本地 Express 服务，用于认证与配置下发等。参见 [src/main/server/server.js](src/main/server/server.js)、[src/main/server/routes/auth.js](src/main/server/routes/auth.js)、[src/main/server/routes/config.js](src/main/server/routes/config.js)。

## 快速开始
前置条件  
- 建议使用 Node LTS（如 18.x/20.x）与配套 npm 版本。  
- 确保系统具备构建 Electron 的基础依赖（不同平台要求不同）。

安装依赖
- 执行：`npm install`

开发运行
- 常见脚本为 `npm run dev`。若脚本与本仓库不一致，请参考根目录 [package.json](package.json) 的 scripts 字段，选择对应的开发命令。

打包
- 常见脚本为 `npm run build`。若脚本与本仓库不一致，请参考根目录 [package.json](package.json) 的 scripts 字段，选择对应的打包命令。

## 配置与存储
- LLM API Key  
  - 相关管理逻辑位于 [src/main/services/llm/api-key-manager.js](src/main/services/llm/api-key-manager.js) 与 [src/main/services/llm/llm-service.js](src/main/services/llm/llm-service.js)。请根据实现与 UI 提示进行设置（不在此处写明具体 Key）。
- Clash 配置  
  - 模板与默认配置位于 [src/shared/clash_config/](src/shared/clash_config/)，如 [src/shared/clash_config/config.json](src/shared/clash_config/config.json)。  
  - 服务层相关逻辑见 [src/main/services/clash/](src/main/services/clash/)（如 core、config、proxy 等）。
- 日志与缓存  
  - 默认位于 [src/data/](src/data/) 下的子目录，如 [src/data/cache/](src/data/cache/)、[src/data/logs/](src/data/logs/)。实际路径与策略以代码实现为准。

## 隐私与安全
- 数据处理  
  - 默认以本地为主，不主动上送云端数据；实际行为以代码为准。  
- 敏感信息  
  - 请妥善保管 API Key、访问令牌等敏感信息，避免将配置文件或日志上传至公共仓库。  
- 内置服务  
  - 内置 Express 服务主要面向本机或局域网场景。请根据实际网络环境与防火墙策略限制访问范围，避免暴露敏感接口。

## 目录结构（摘录）
```
.
├─ src/
│  ├─ main/                # 主进程、IPC、服务与内置服务
│  ├─ renderer/            # 渲染层页面与组件
│  ├─ shared/              # 共享配置与事件
│  ├─ data/                # 缓存与日志
│  └─ config/              # 应用与用户配置
├─ tools/                  # 开发与打包脚本
├─ docs/                   # 文档与指南
├─ package.json
└─ README.md
```

## 已知限制
- 平台差异：在 Windows/macOS/Linux 上的行为可能存在差异，需要按平台验证。  
- 外部依赖：代理能力依赖 Clash 内核及外部网络条件。  
- LLM 能力：需提供可用的 LLM API Key 才可使用对话功能。

## 许可证与贡献
- 许可证：以仓库内 License 为准（若存在 LICENSE 文件则以其为准）。  
- 贡献：欢迎提交 Issue 与 PR。建议遵循 [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) 与相关开发文档。

## 版本变更与路线
- 更多信息可参考 [docs/development/](docs/development/) 与 [docs/testing/](docs/testing/) 中的文档与记录。
