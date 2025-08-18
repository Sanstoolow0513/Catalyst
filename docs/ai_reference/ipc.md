# 核心 IPC 通信

本文档列出项目中关键的 IPC (Inter-Process Communication) 通信点，这是主进程和渲染进程交互的主要方式。

## 通信模式

渲染进程通过 `window.electronAPI` 对象发送请求到主进程，并接收响应。主进程通过注册处理器来响应这些请求。

## 关键 IPC 事件

### 配置管理

*   **`config:get-all`**: 渲染进程请求获取完整配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_GET_ALL, ...)`
    *   *渲染进程*: `const config = await window.electronAPI.config.getAll();`
*   **`config:set-vpn-url`**: 渲染进程请求设置VPN URL。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_SET_VPN_URL, ...)`
    *   *渲染进程*: `await window.electronAPI.config.setVpnUrl(url);`
*   **`config:get-vpn-url`**: 渲染进程请求获取VPN URL。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_GET_VPN_URL, ...)`
    *   *渲染进程*: `const url = await window.electronAPI.config.getVpnUrl();`
*   **`config:set-proxy-auto-start`**: 渲染进程请求设置代理自动启动。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_SET_PROXY_AUTO_START, ...)`
    *   *渲染进程*: `await window.electronAPI.config.setProxyAutoStart(autoStart);`
*   **`config:get-proxy-auto-start`**: 渲染进程请求获取代理自动启动设置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_GET_PROXY_AUTO_START, ...)`
    *   *渲染进程*: `const autoStart = await window.electronAPI.config.getProxyAutoStart();`
*   **`config:export`**: 渲染进程请求导出配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_EXPORT, ...)`
    *   *渲染进程*: `const path = await window.electronAPI.config.export();`
*   **`config:import`**: 渲染进程请求导入配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_IMPORT, ...)`
    *   *渲染进程*: `const path = await window.electronAPI.config.import();`
*   **`config:reset`**: 渲染进程请求重置配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.CONFIG_RESET, ...)`
    *   *渲染进程*: `await window.electronAPI.config.reset();`

### Mihomo 代理控制

*   **`mihomo:start`**: 渲染进程请求启动代理服务。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_START, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.start();`
*   **`mihomo:stop`**: 渲染进程请求停止代理服务。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_STOP, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.stop();`
*   **`mihomo:status`**: 渲染进程请求获取代理服务状态。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_STATUS, ...)`
    *   *渲染进程*: `const status = await window.electronAPI.mihomo.status();`
*   **`mihomo:load-config`**: 渲染进程请求加载代理配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_LOAD_CONFIG, ...)`
    *   *渲染进程*: `const config = await window.electronAPI.mihomo.loadConfig();`
*   **`mihomo:save-config`**: 渲染进程请求保存代理配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_SAVE_CONFIG, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.saveConfig(config);`
*   **`mihomo:get-config-path`**: 渲染进程请求获取代理配置文件路径。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_GET_CONFIG_PATH, ...)`
    *   *渲染进程*: `const path = await window.electronAPI.mihomo.getConfigPath();`
*   **`mihomo:open-config-dir`**: 渲染进程请求打开代理配置目录。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_OPEN_CONFIG_DIR, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.openConfigDir();`
*   **`mihomo:get-proxies`**: 渲染进程请求获取代理列表。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_GET_PROXIES, ...)`
    *   *渲染进程*: `const proxies = await window.electronAPI.mihomo.getProxies();`
*   **`mihomo:select-proxy`**: 渲染进程请求选择代理。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_SELECT_PROXY, ...)`
    *   *渲染进程*: `await window.electronAPI.mihomo.selectProxy(groupName, proxyName);`
*   **`mihomo:fetch-config-from-url`**: 渲染进程请求从URL获取配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_FETCH_CONFIG_FROM_URL, ...)`
    *   *渲染进程*: `const config = await window.electronAPI.mihomo.fetchConfigFromURL(url);`
*   **`mihomo:test-proxy-delay`**: 渲染进程请求测试代理延迟。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.MIHOMO_TEST_PROXY_DELAY, ...)`
    *   *渲染进程*: `const delay = await window.electronAPI.mihomo.testProxyDelay(proxyName);`

### LLM 服务

*   **`llm:generate-completion`**: 渲染进程请求生成LLM补全。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GENERATE_COMPLETION, ...)`
    *   *渲染进程*: `const result = await window.electronAPI.llm.generateCompletion(request);`
*   **`llm:set-api-key`**: 渲染进程请求设置API密钥。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_SET_API_KEY, ...)`
    *   *渲染进程*: `await window.electronAPI.llm.setApiKey(provider, apiKey);`
*   **`llm:get-api-key`**: 渲染进程请求获取API密钥。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GET_API_KEY, ...)`
    *   *渲染进程*: `const apiKey = await window.electronAPI.llm.getApiKey(provider);`
*   **`llm:get-all-api-keys`**: 渲染进程请求获取所有API密钥。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GET_ALL_API_KEYS, ...)`
    *   *渲染进程*: `const apiKeys = await window.electronAPI.llm.getAllApiKeys();`
*   **`llm:delete-api-key`**: 渲染进程请求删除API密钥。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_DELETE_API_KEY, ...)`
    *   *渲染进程*: `await window.electronAPI.llm.deleteApiKey(provider);`
*   **`llm:set-provider-config`**: 渲染进程请求设置提供商配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_SET_PROVIDER_CONFIG, ...)`
    *   *渲染进程*: `await window.electronAPI.llm.setProviderConfig(config);`
*   **`llm:get-provider-config`**: 渲染进程请求获取提供商配置。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GET_PROVIDER_CONFIG, ...)`
    *   *渲染进程*: `const config = await window.electronAPI.llm.getProviderConfig(provider);`
*   **`llm:get-providers`**: 渲染进程请求获取提供商列表。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GET_PROVIDERS, ...)`
    *   *渲染进程*: `const providers = await window.electronAPI.llm.getProviders();`
*   **`llm:get-models`**: 渲染进程请求获取模型列表。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.LLM_GET_MODELS, ...)`
    *   *渲染进程*: `const models = await window.electronAPI.llm.getModels(provider);`

### 开发环境

*   **`dev-env:install-vscode`**: 渲染进程请求安装VSCode。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE, ...)`
    *   *渲染进程*: `const result = await window.electronAPI.devEnvironment.installVSCode();`
*   **`dev-env:install-nodejs`**: 渲染进程请求安装Node.js。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS, ...)`
    *   *渲染进程*: `const result = await window.electronAPI.devEnvironment.installNodeJS();`
*   **`dev-env:install-python`**: 渲染进程请求安装Python。
    *   *主进程*: `ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON, ...)`
    *   *渲染进程*: `const result = await window.electronAPI.devEnvironment.installPython();`

### 窗口控制

*   **`window:minimize`**: 渲染进程请求最小化窗口。
    *   *主进程*: `ipcMain.on(IPC_EVENTS.WINDOW_MINIMIZE, ...)`
    *   *渲染进程*: `window.electronAPI.windowControl.minimize();`
*   **`window:maximize`**: 渲染进程请求最大化窗口。
    *   *主进程*: `ipcMain.on(IPC_EVENTS.WINDOW_MAXIMIZE, ...)`
    *   *渲染进程*: `window.electronAPI.windowControl.maximize();`
*   **`window:close`**: 渲染进程请求关闭窗口。
    *   *主进程*: `ipcMain.on(IPC_EVENTS.WINDOW_CLOSE, ...)`
    *   *渲染进程*: `window.electronAPI.windowControl.close();`

*(注：具体实现细节和更多事件请参考 `src/main/ipc-handlers/` 和 `src/main/preload.ts`)*