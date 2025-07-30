# Catalyst 项目文档

## 项目概述
Catalyst 是一个基于 Electron 的代理管理工具，集成了 Clash 核心、软件安装、系统监控等功能。

## 核心架构

### 服务架构
项目采用分层架构设计：

- **ClashCoreService**: 管理 Clash 核心下载和进程控制
- **ClashConfigService**: 处理配置文件管理和更新
- **ProxyService**: 控制系统代理设置
- **SoftwareInstaller**: 软件包管理和安装

### 前端架构
- **Electron 主进程**: 系统级服务和窗口管理
- **渲染进程**: 基于 Web 技术的前端界面
- **组件化设计**: 模块化 UI 组件

## 快速开始

### 开发环境
```bash
npm install
npm run dev
```

### 构建发布
```bash
npm run build
```

## 功能模块

### 1. 代理管理
- 自动下载和管理 Clash 核心
- 配置文件自动更新
- 节点切换和延迟测试
- 系统代理设置

### 2. 软件安装
- 开发工具一键安装
- 版本管理和更新
- 安装进度监控

### 3. 系统监控
- 系统信息显示
- 资源使用监控
- 网络状态检测

## 项目结构
```
src/
├── main/           # 主进程代码
│   ├── services/   # 核心服务
│   └── index.js    # 入口文件
├── renderer/       # 渲染进程
│   ├── components/ # UI组件
│   └── styles/     # 样式文件
├── shared/         # 共享配置
└── docs/          # 项目文档
```

## 开发规范
- 使用 ESLint 代码规范
- 模块化设计原则
- 错误处理和日志记录
- 响应式设计支持

## 部署说明
支持 Windows 平台，自动处理依赖安装和环境配置。