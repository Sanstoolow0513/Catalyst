"use strict";
const electron = require("electron");
const IPC_EVENTS = {
  MIHOMO_START: "mihomo:start",
  MIHOMO_STOP: "mihomo:stop",
  MIHOMO_STATUS: "mihomo:status",
  MIHOMO_LOAD_CONFIG: "mihomo:load-config",
  MIHOMO_SAVE_CONFIG: "mihomo:save-config",
  MIHOMO_GET_CONFIG_PATH: "mihomo:get-config-path",
  MIHOMO_OPEN_CONFIG_DIR: "mihomo:open-config-dir",
  // 开发环境相关事件
  DEV_ENV_INSTALL_VSCODE: "dev-env:install-vscode",
  DEV_ENV_INSTALL_NODEJS: "dev-env:install-nodejs",
  DEV_ENV_INSTALL_PYTHON: "dev-env:install-python",
  // LLM 相关事件
  LLM_GENERATE_COMPLETION: "llm:generate-completion",
  LLM_SET_API_KEY: "llm:set-api-key",
  LLM_GET_API_KEY: "llm:get-api-key",
  LLM_GET_ALL_API_KEYS: "llm:get-all-api-keys",
  LLM_DELETE_API_KEY: "llm:delete-api-key",
  // 窗口控制事件
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close"
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  mihomo: {
    start: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
    stop: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
    status: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STATUS),
    loadConfig: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_LOAD_CONFIG),
    saveConfig: (config) => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SAVE_CONFIG, config),
    getConfigPath: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_CONFIG_PATH),
    openConfigDir: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_OPEN_CONFIG_DIR)
  },
  llm: {
    generateCompletion: (request) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GENERATE_COMPLETION, request),
    setApiKey: (provider, apiKey) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_SET_API_KEY, { provider, apiKey }),
    getApiKey: (provider) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GET_API_KEY, provider),
    getAllApiKeys: () => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GET_ALL_API_KEYS),
    deleteApiKey: (provider) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_DELETE_API_KEY, provider)
  },
  devEnvironment: {
    installVSCode: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE),
    installNodeJS: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS),
    installPython: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON)
  },
  windowControl: {
    minimize: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_MINIMIZE),
    maximize: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_MAXIMIZE),
    close: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_CLOSE)
  }
});
