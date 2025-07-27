# Clash服务架构重构计划

## 当前架构分析

当前的`ClashService`类承担了过多职责：
1. 下载和管理clash核心（Mihomo）
2. 加载和管理配置文件
3. 启动和停止clash进程
4. 管理代理设置
5. 获取代理列表、测试延迟、切换代理等

## 新架构设计

为了更好地分离关注点，我们将重构为以下三个独立的服务：

### 1. ClashCoreService - Clash核心服务
负责下载和维护clash核心：
- 检查clash核心是否存在
- 下载Mihomo核心
- 启动和停止clash进程

### 2. ClashConfigService - Clash配置服务
负责管理clash配置：
- 下载和更新配置文件
- 管理配置文件URL列表
- 保存用户配置（config.yaml）

### 3. ProxyService - 代理服务
负责代理设置：
- 设置和清除系统代理
- 管理代理地址更新

## 实现步骤

1. 创建ClashCoreService类
2. 创建ClashConfigService类
3. 创建ProxyService类
4. 更新主进程代码以使用新的服务架构
5. 更新renderer组件以适配新的架构
6. 测试新的架构确保功能正常

## 文件结构

```
src/
├── main/
│   └── services/
│       └── clash/
│           ├── clash-core-service.js
│           ├── clash-config-service.js
│           └── proxy-service.js
```

## 类接口设计

### ClashCoreService
```javascript
class ClashCoreService {
  constructor(options = {}) {
    this.clashCorePath = options.clashCorePath;
    this.clashProcess = null;
  }
  
  async checkAndDownloadCore() { }
  async downloadMihomoCore(targetPath) { }
  async startMihomo(configPath) { }
  async stopMihomo() { }
}
```

### ClashConfigService
```javascript
class ClashConfigService {
  constructor(options = {}) {
    this.configBaseDir = options.configBaseDir;
    this.currentConfigPath = null;
  }
  
  async downloadConfigFromUrl() { }
  async loadConfig(configPath) { }
  async saveUserConfig(config) { }
  getCurrentConfigPath() { }
}
```

### ProxyService
```javascript
class ProxyService {
  constructor(options = {}) {
    this.PROXY_SERVER = options.PROXY_SERVER;
    this.PROXY_OVERRIDE = options.PROXY_OVERRIDE;
  }
  
  async clearSystemProxy() { }
  async setSystemProxy() { }
}