# Catalyst 开发状态日志

## 当前开发状态

本项目目前处于功能实现阶段，核心功能已基本可用，但存在一些需要改进和完善的地方。以下是当前开发状态的详细记录。

## 功能与实现上的不足

### 1. 代码结构与模块化
- **服务功能重叠**：
  - `ClashConfigService` 和 `ConfigManager` 两个类都负责配置管理，存在功能重叠。`ClashConfigService` 专注于 Clash 配置的下载和加载，而 `ConfigManager` 也实现了类似功能，但命名更通用。这可能导致维护困难和逻辑混乱。
  - `proxy-service.js` 和 `proxy-setting.js` 都实现了系统代理设置功能，且 `ClashService` 直接使用了 `proxy-setting.js` 中的 `ProxyManager`，而 `proxy-service.js` 在 `src/main/index.js` 中被实例化但未被使用。这表明代理设置功能存在重复实现和未使用的代码。

- **依赖注入不清晰**：
  - 服务之间的依赖关系主要通过构造函数参数传递，但缺乏统一的依赖注入机制。例如，`ClashService` 在构造函数中创建了 `ProxyManager` 和 `ConfigManager` 的实例，而不是通过参数注入，这降低了模块的可测试性和灵活性。

### 2. 配置管理
- **配置文件路径硬编码**：
  - 部分配置文件路径在代码中被硬编码，例如 `src/main/services/clash/clash-config-service.js` 中的 `configDir`。虽然有 `options` 参数，但默认值是固定的，不利于在不同环境下灵活配置。
  - `src/shared/config/app-config.js` 中的 `RESOURCE_PATHS` 也是硬编码的，应考虑从环境变量或配置文件中读取。

- **配置持久化**：
  - 用户的配置（如代理设置、软件安装源）持久化机制较为简单，直接写入 YAML 或 JSON 文件。缺乏配置版本管理和迁移机制，未来升级可能导致配置不兼容。

### 3. 错误处理与日志
- **错误处理不完善**：
  - 部分异步操作的错误处理不够健壮。例如，在 `clash-core-service.js` 的 `downloadMihomoCore` 方法中，虽然有 `try-catch`，但错误被直接抛出，没有提供详细的错误上下文或重试机制。
  - `src/main/index.js` 中的 IPC 事件处理器对服务未初始化的检查（`if (!clashCoreService || !clashConfigService)`）是好的实践，但其他地方的类似检查不够全面。

- **日志记录不足**：
  - 日志记录主要集中在 `console.log` 和 `console.error`，缺乏结构化的日志系统。没有区分日志级别（debug, info, warn, error），也不支持将日志写入文件，不利于生产环境的问题排查。

### 4. 用户界面与体验
- **UI 状态管理**：
  - UI 组件（如 `ClashPanel`）的状态管理较为简单，直接在组件内部管理。当应用状态复杂时，可能会导致状态不一致。
  - `ClashPanel` 中的 `getNodeType`, `getLatency`, `getNodeStatus` 方法是模拟实现，返回随机数据。这表明与 Clash 核心的实时代理信息交互功能尚未完全实现或测试。

- **缺少加载状态和反馈**：
  - 在执行耗时操作（如下载核心、安装软件）时，UI 提供了基本的反馈（如按钮禁用、文本变化），但缺少更精细的进度指示（如进度条）。

### 5. 测试
- **缺乏自动化测试**：
  - 项目中没有发现单元测试或集成测试文件。核心服务和组件的逻辑缺乏测试覆盖，增加了修改代码时引入回归错误的风险。
  - `package.json` 中的 `test` 脚本仅为占位符，未配置实际的测试框架。

### 6. 安全性
- **外部资源加载**：
  - `src/renderer/index.html` 中直接从 CDN 加载 `tsparticles` 库，存在供应链安全风险。应考虑将关键依赖作为 npm 包安装，或使用 Subresource Integrity (SRI)。
  - `software-config.json` 中的软件下载 URL 是硬编码的，如果被恶意修改，可能导致下载恶意软件。

### 7. 文档
- **内联注释不足**：
  - 部分代码缺乏详细的 JSDoc 注释，特别是私有方法和复杂的逻辑块，增加了新开发者理解代码的难度。
  - `src/main/index.js` 中的 IPC 事件处理器有较好的注释，但其他文件的注释相对较少。

### 8. 构建与部署
- **构建配置**：
  - `package.json` 中的 `build` 配置较为基础，缺少针对不同平台的特定配置和发布流程。
  - 未配置代码压缩和混淆，可能导致应用体积较大和源码暴露。

## 待办事项
- [ ] 合并或重构 `ClashConfigService` 和 `ConfigManager`，明确职责边界。
- [ ] 移除未使用的 `proxy-service.js` 或将其与 `proxy-setting.js` 合并。
- [ ] 实现更完善的错误处理和日志记录系统。
- [ ] 为关键服务和组件编写单元测试。
- [ ] 改进 UI，实现更精确的加载状态反馈。
- [ ] 将硬编码的配置路径改为可配置。
- [ ] 为 `tsparticles` 添加 SRI 或改为 npm 包。