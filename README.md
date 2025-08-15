# Catalyst

现代化综合性桌面应用平台

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![License](https://img.shields.io/badge/license-ISC-blue)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey)

## 简介

Catalyst 是一个集成了多种实用功能的现代化桌面应用程序，包括系统代理管理、AI 对话、开发环境部署和统一设置管理等功能。它采用 Electron + React + TypeScript 技术栈构建，支持 Windows、macOS 和 Linux 平台。

## 核心功能

### 系统代理管理
- 基于 Mihomo (Clash.Meta) 的强大代理功能
- 支持多种代理协议和智能路由
- 可视化代理组管理和节点切换

### AI 对话
- 集成多种大语言模型（OpenAI、Gemini、OpenRouter 等）
- 实时对话界面和消息历史管理
- 模型参数配置和系统提示词设置

### 开发环境部署
- 一键部署常用开发工具和环境
- 支持多种 IDE 和运行时环境
- 静默安装和进度反馈

### 统一设置管理
- 集中管理所有应用配置
- 支持配置导入导出和备份恢复
- 用户个性化设置和偏好管理

## 最新更新 (v1.1.0)

### 主页重新设计
- 采用简洁优雅的设计风格
- 使用 Framer Motion 实现流畅的动画效果
- 响应式布局，适配不同屏幕尺寸

### 设置页面重构
- 重新设计为标签页形式，分为用户、通用、LLM、代理、备份五个部分
- 添加用户个性化设置（昵称、头像、个人简介）
- 实现全局浮窗提醒系统

### LLM 配置统一化
- 统一了设置页面和聊天页面的 LLM 配置
- 实现了配置数据在两个页面间的同步
- 添加了 Base URL 配置支持多种 LLM 提供商

### 开发工具页面优化
- 重新组织为分类展示（IDE、运行时、数据库、工具和框架）
- 采用卡片式布局，提高信息密度和可读性
- 扩展了工具列表，包含主流开发工具和 IDE

### 主题和配色优化
- 调整了亮色和暗色模式下的主题配色
- 改善了视觉舒适度和用户体验
- 优化了组件间的视觉层次和对比度

## 技术栈

- **Electron**: 桌面应用框架
- **React 18**: 前端 UI 框架
- **TypeScript**: 编程语言
- **Styled Components**: CSS-in-JS 样式解决方案
- **Framer Motion**: 动画库
- **Lucide React**: 图标库
- **Electron Store**: 配置存储
- **Axios**: HTTP 客户端

## 安装

### 开发环境

```bash
# 克隆项目
git clone <repository-url>
cd Catalyst

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 生产环境

```bash
# 构建应用
pnpm build

# 打包应用
pnpm package
```

## 文档

### 用户文档
- [用户手册](./docs/user/guides/user_manual.md)
- [常见问题解答](./docs/user/faq/faq.md)

### 开发者文档
- [技术实现文档](./docs/developer/guides/technical_implementation.md)
- [API 文档](./docs/developer/api/api_documentation.md)
- [架构设计](./docs/developer/architecture/ui_architecture.md)
- [编码规范](./docs/developer/guides/coding_standards.md)

### 更新日志
- [更新日志](./docs/developer/changelog/README.md)

## 贡献

欢迎提交 Pull Request 和 Issue。请先阅读我们的贡献指南。

## 许可证

本项目采用 ISC 许可证开源。详细信息请查看 [LICENSE](LICENSE) 文件。

## 联系

如有任何问题或建议，请通过以下方式联系我们：

- 邮箱: support@catalyst.app
- GitHub: [Issues](https://github.com/username/catalyst/issues)