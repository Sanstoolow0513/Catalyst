# Catalyst 项目文档

欢迎阅读 Catalyst 项目的文档。为了更好地支持AI协作和上下文编码，我们将文档按照用途分为两个主要类别：

## 文档分类

### 1. AI 快速参考 (ai_reference)
为AI助手提供快速查阅的项目核心信息，帮助AI快速理解项目结构、技术栈和核心概念。

- [项目结构](./ai_reference/project_structure.md)
- [技术栈](./ai_reference/tech_stack.md)
- [核心概念与对象](./ai_reference/core_concepts.md)
- [核心 IPC 通信](./ai_reference/ipc.md)
- [极简架构](./ai_reference/architecture.md)
- [AI专用编码约定](./ai_reference/coding_rules.md)
- [项目指南](./ai_reference/project_guidelines.md)

### 2. AI 工作流 (ai_workflow)
实现上下文编码模式，结合历史决策记录和AI协作模式模板，形成完整的上下文开发流程。

#### 上下文记录 (context)
- [设计决策](./ai_workflow/context/design_decisions) - 项目设计决策记录（ADR）
- [开发历史](./ai_workflow/context/development_history) - 项目开发历史和背景信息
- [代码模式](./ai_workflow/context/code_patterns) - 项目中的代码模式和惯用法

#### 协作模式 (collaboration)
- [提示词模板](./ai_workflow/collaboration/prompt_templates) - 与AI协作的提示词模板
- [交互模式](./ai_workflow/collaboration/interaction_patterns) - 有效的AI交互模式
- [最佳实践](./ai_workflow/collaboration/best_practices) - AI协作的最佳实践

#### 会话记录 (sessions)
- [开发会话](./ai_workflow/sessions) - 开发过程中的详细会话日志

## 使用指南

### 对于AI助手
1. 首先查阅 `ai_reference` 目录了解项目基本信息
2. 然后参考 `ai_workflow` 中的上下文信息，了解项目历史和决策背景
3. 使用 `ai_workflow/collaboration` 中的模板和模式进行更有效的协作
4. 在 `ai_workflow/sessions` 中记录交互过程，形成持续积累的知识库

### 对于开发者
1. 在 `ai_workflow/context/design_decisions` 中记录重要的设计决策
2. 在 `ai_workflow/context/code_patterns` 中记录项目中常见的代码模式
3. 在 `ai_workflow/collaboration/prompt_templates` 中创建和优化与AI协作的提示词
4. 在 `ai_workflow/sessions` 中记录开发会话，形成可追溯的开发历史

## 维护说明

此为项目文档的主索引文件。文档结构采用上下文编码模式，旨在提高AI协作效率和质量。