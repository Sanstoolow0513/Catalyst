# Catalyst - 多功能系统工具

## 项目简介
Catalyst 是一款基于 Electron 构建的多功能系统工具，旨在为用户提供一个集成化的桌面应用平台。它集成了系统信息监控、网络代理管理（Clash）、软件包安装和内嵌浏览器等功能，帮助用户更高效地管理和配置他们的开发环境与系统设置。

## 核心功能
1. **系统信息监控**：实时显示 CPU、内存、磁盘、操作系统等硬件和系统信息。
2. **Clash 代理服务**：
   - 启动和停止 Clash 核心服务
   - 管理代理节点和组
   - 切换不同代理节点
   - 设置系统级代理
3. **软件包管理器**：一键安装常用开发工具（如 VS Code、Git、Node.js、Python）。
4. **内嵌浏览器**：集成 Webview 组件，支持直接在应用内浏览网页。
5. **自定义配置**：支持导入和管理 Clash 配置文件。

## 技术栈
- **主框架**：Electron (v36.2.1)
- **前端**：
  - HTML5, CSS3, JavaScript (ES6+)
  - tsParticles (用于背景动画)
- **后端/主进程**：
  - Node.js
  - Electron 主进程 API
- **依赖管理**：
  - npm
- **构建工具**：
  - Electron Builder
- **核心服务**：
  - Mihomo (Clash 核心)
- **其他库**：
  - `axios`：HTTP 请求
  - `adm-zip`：ZIP 文件解压
  - `js-yaml`：YAML 配置文件解析
  - `systeminformation`：系统信息获取
  - `winreg`：Windows 注册表操作

## 快速开始指南
1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/catalyst.git
   cd catalyst
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **启动开发模式**
   ```bash
   npm run dev
   ```

4. **构建应用**
   ```bash
   npm run build
   ```

5. **运行应用**
   ```bash
   npm start
   ```

## 目录结构
```
catalyst/
├── docs/                    # 项目文档
├── resources/               # 静态资源（Clash 核心、配置等）
├── src/
│   ├── main/                # Electron 主进程代码
│   ├── renderer/            # 渲染进程代码（前端）
│   ├── shared/              # 主进程与渲染进程共享的配置
│   └── Appdata/             # 应用数据存储目录
├── tools/                   # 构建和开发工具脚本
└── package.json
```

## 贡献
欢迎提交 Issue 和 Pull Request。请确保代码风格一致并遵循项目规范。
