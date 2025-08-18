# AI 工作流

本目录实现了上下文编码模式（Context Coding），结合历史决策记录和AI协作模式模板，形成完整的上下文开发流程。

## 目录结构

### 上下文记录 (context/)
- **design_decisions/** - 项目设计决策记录（ADR）
- **development_history/** - 项目开发历史和背景信息
- **code_patterns/** - 项目中的代码模式和惯用法

### 协作模式 (collaboration/)
- **prompt_templates/** - 与AI协作的提示词模板
- **interaction_patterns/** - 有效的AI交互模式
- **best_practices/** - AI协作的最佳实践

### 会话记录 (sessions/)
- 开发过程中的详细会话日志，记录与AI的交互和开发思路

## 使用方法

### 对于开发者
1. 在 `context/design_decisions` 中记录重要的设计决策
2. 在 `context/code_patterns` 中记录项目中常见的代码模式
3. 在 `collaboration/prompt_templates` 中创建和优化与AI协作的提示词
4. 在 `sessions` 中记录开发会话，形成可追溯的开发历史

### 对于AI助手
1. 首先查阅 `ai_reference` 目录了解项目基本信息
2. 然后参考本目录中的上下文信息，了解项目历史和决策背景
3. 使用 `collaboration` 中的模板和模式进行更有效的协作
4. 在 `sessions` 中记录交互过程，形成持续积累的知识库

## 上下文编码模式的优势

1. **历史决策可追溯** - 所有重要决策都有记录，新加入的AI可以快速了解项目背景
2. **协作模式标准化** - 通过模板和最佳实践，提高AI协作的效率和质量
3. **知识持续积累** - 会话记录形成项目知识库，不断积累经验
4. **开发流程优化** - 结合历史记录和协作模式，形成完整的上下文开发流程

## 维护指南

- 定期整理和优化 `prompt_templates` 和 `interaction_patterns`
- 确保所有设计决策都有明确的记录和理由
- 保持会话记录的结构化和可读性
- 定期回顾和更新最佳实践