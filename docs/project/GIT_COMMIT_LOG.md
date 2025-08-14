# Git Commit 日志

## 问题修复和基础功能完善

* 修复应用白屏问题和运行时错误
  - 修正 PageContainer 和 StatusIndicator 导出方式
  - 修复预加载脚本路径问题
  - 解决 React 非布尔属性警告
  - 解决 styled-components 未知属性警告
  - 解决 framer-motion 动画值错误
  - 添加 Electron API 类型声明

## Mihomo 核心代理功能开发

* 实现 Mihomo 核心代理功能
  - 增强 MihomoService 类，添加 HTTP 客户端支持
  - 实现代理服务启动/停止功能
  - 实现代理组信息获取和显示功能
  - 实现代理组内具体代理切换功能
  - 添加 IPC 事件常量和处理器
  - 更新渲染进程类型定义和 API 接口
  - 创建 ProxyGroupManager 组件
  - 更新系统代理页面集成代理组管理

* 完善 Mihomo 代理功能文档
  - 创建 Mihomo 代理功能设计方案
  - 创建 Mihomo 代理功能使用指南
  - 添加 Mihomo 测试配置文件

* 更新项目文档
  - 更新项目上下文文档，添加 Mihomo 核心代理功能开发内容
  - 重新组织项目结构文档，整合技术栈描述
  - 删除重复的 PROJECT_DESCRIPTION.md 文件