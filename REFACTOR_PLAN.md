# Electron项目重构计划

## 重构目标
- 提升代码可维护性和可扩展性
- 应用设计模式解决架构问题
- 建立工程化规范
- 保持纯JavaScript实现（无TypeScript）

## 架构重构方案

### 模块化结构
```
src/
├── main-process/
│   ├── services/         // 核心服务
│   │   ├── ClashService.js
│   │   ├── DownloadService.js
│   │   ├── ProxyService.js
│   │   └── UIService.js
│   ├── managers/         // 管理类
│   │   ├── StateManager.js
│   │   └── ConfigManager.js
│   └── main.js           // 精简后的入口文件
├── renderer-process/
│   ├── ui/               // UI组件
│   │   ├── ClashUI.js
│   │   └── DownloadUI.js
│   └── utils/            // 工具函数
└── shared/               // 共享代码
    ├── events.js         // IPC事件常量
    └── logger.js         // 统一日志
```

### 设计模式应用
1. **观察者模式** - 状态管理
```javascript
// StateManager.js
class StateManager {
  constructor() {
    this.state = { clashRunning: false };
    this.observers = [];
  }
  
  subscribe(observer) {
    this.observers.push(observer);
  }
  
  setState(newState) {
    this.state = {...this.state, ...newState};
    this.notify();
  }
  
  notify() {
    this.observers.forEach(observer => observer(this.state));
  }
}
```

2. **策略模式** - 跨平台代理
```javascript
// ProxyService.js
const strategies = {
  win32: {
    set: async () => { /* PowerShell实现 */ },
    clear: async () => { /* PowerShell实现 */ }
  },
  darwin: {
    set: async () => { /* networksetup实现 */ },
    clear: async () => { /* networksetup实现 */ }
  }
};

class ProxyService {
  constructor() {
    this.strategy = strategies[process.platform] || strategies.win32;
  }

  async setProxy() {
    return this.strategy.set();
  }
}
```

## 工程化规范

### ESLint配置 (.eslintrc.js)
```javascript
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: ['airbnb-base'],
  rules: {
    'no-console': 'off',
    'import/no-unresolved': 'off',
    'class-methods-use-this': 'off',
    'max-len': ['error', { code: 120 }]
  }
};
```

### 文档规范
- 所有公共方法使用JSDoc
- 示例：
```javascript
/**
 * 启动Clash服务
 * @param {string} configUrl - 配置文件URL
 * @returns {Promise<{success: boolean, message: string}>} 
 */
async startClash(configUrl) {
  // ...
}
```

## 重构路线图

### 阶段一：模块解耦 (2天)
1. 创建服务目录结构
2. 实现核心服务接口
3. 建立依赖注入机制

### 阶段二：模式实现 (3天)
1. 状态管理模块
2. 代理服务策略工厂
3. IPC通信抽象层

### 阶段三：工程化 (1天)
1. 配置ESLint
2. 添加Pre-commit钩子
3. 编写基础测试用例

### 阶段四：功能完善 (2天)
1. 实现开发工具安装功能
2. 添加系统监控模块
3. 编写架构文档

## 实施准备
1. 创建`REFACTOR`分支
2. 安装开发依赖：
```bash
npm install eslint eslint-config-airbnb-base --save-dev
```

## 下一步
- [ ] 创建重构分支
- [ ] 初始化ESLint
- [ ] 开始模块拆分