"use strict";
const electron = require("electron");
const IPC_EVENTS = {
  MIHOMO_START: "mihomo:start",
  MIHOMO_STOP: "mihomo:stop",
  MIHOMO_STATUS: "mihomo:status",
  MIHOMO_STATUS_UPDATE: "mihomo:status-update",
  MIHOMO_LOAD_CONFIG: "mihomo:load-config",
  MIHOMO_SAVE_CONFIG: "mihomo:save-config",
  MIHOMO_GET_CONFIG_PATH: "mihomo:get-config-path",
  MIHOMO_OPEN_CONFIG_DIR: "mihomo:open-config-dir",
  // Mihomo 代理组相关事件
  MIHOMO_GET_PROXIES: "mihomo:get-proxies",
  MIHOMO_SELECT_PROXY: "mihomo:select-proxy",
  MIHOMO_FETCH_CONFIG_FROM_URL: "mihomo:fetch-config-from-url",
  MIHOMO_TEST_PROXY_DELAY: "mihomo:test-proxy-delay",
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
  LLM_SET_PROVIDER_CONFIG: "llm:set-provider-config",
  LLM_GET_PROVIDER_CONFIG: "llm:get-provider-config",
  LLM_GET_PROVIDERS: "llm:get-providers",
  LLM_GET_MODELS: "llm:get-models",
  // 配置管理相关事件
  CONFIG_GET_ALL: "config:get-all",
  CONFIG_SET_VPN_URL: "config:set-vpn-url",
  CONFIG_GET_VPN_URL: "config:get-vpn-url",
  CONFIG_SET_PROXY_AUTO_START: "config:set-proxy-auto-start",
  CONFIG_GET_PROXY_AUTO_START: "config:get-proxy-auto-start",
  CONFIG_EXPORT: "config:export",
  CONFIG_IMPORT: "config:import",
  CONFIG_RESET: "config:reset",
  CONFIG_SET_USER_NAME: "config:set-user-name",
  CONFIG_GET_USER_NAME: "config:get-user-name",
  CONFIG_SET_USER_EMAIL: "config:set-user-email",
  CONFIG_GET_USER_EMAIL: "config:get-user-email",
  CONFIG_SET_THEME: "config:set-theme",
  CONFIG_GET_THEME: "config:get-theme",
  CONFIG_SET_LANGUAGE: "config:set-language",
  CONFIG_GET_LANGUAGE: "config:get-language",
  CONFIG_SET_STARTUP: "config:set-startup",
  CONFIG_GET_STARTUP: "config:get-startup",
  CONFIG_SET_MINIMIZE_TO_TRAY: "config:set-minimize-to-tray",
  CONFIG_GET_MINIMIZE_TO_TRAY: "config:get-minimize-to-tray",
  CONFIG_SET_NOTIFICATIONS: "config:set-notifications",
  CONFIG_GET_NOTIFICATIONS: "config:get-notifications",
  CONFIG_GET_USAGE_STATS: "config:get-usage-stats",
  CONFIG_CREATE_BACKUP: "config:create-backup",
  CONFIG_RESTORE_FROM_BACKUP: "config:restore-from-backup",
  CONFIG_GET_BACKUP_FILES: "config:get-backup-files",
  CONFIG_VALIDATE_CONFIG: "config:validate-config",
  CONFIG_MIGRATE_CONFIG: "config:migrate-config",
  // 测试页面相关事件
  TEST_RUN_INSTALLER: "test:run-installer",
  TEST_INSTALL_WINGET: "test:install-winget",
  // 窗口控制事件
  WINDOW_MINIMIZE: "window:minimize",
  WINDOW_MAXIMIZE: "window:maximize",
  WINDOW_CLOSE: "window:close"
};
console.log("[Preload] Script starting execution.");
try {
  console.log("[Preload] Attempting to expose electronAPI via contextBridge.");
  electron.contextBridge.exposeInMainWorld("electronAPI", {
    mihomo: {
      start: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
      stop: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
      status: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STATUS),
      loadConfig: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_LOAD_CONFIG),
      saveConfig: (config) => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SAVE_CONFIG, config),
      getConfigPath: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_CONFIG_PATH),
      openConfigDir: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_OPEN_CONFIG_DIR),
      getProxies: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_PROXIES),
      selectProxy: (groupName, proxyName) => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SELECT_PROXY, groupName, proxyName),
      fetchConfigFromURL: (url) => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_FETCH_CONFIG_FROM_URL, url),
      testProxyDelay: (proxyName) => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_TEST_PROXY_DELAY, proxyName)
    },
    llm: {
      generateCompletion: (request) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GENERATE_COMPLETION, request),
      setApiKey: (provider, apiKey) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_SET_API_KEY, { provider, apiKey }),
      getApiKey: (provider) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GET_API_KEY, provider),
      getAllApiKeys: () => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GET_ALL_API_KEYS),
      deleteApiKey: (provider) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_DELETE_API_KEY, provider),
      setProviderConfig: (config) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_SET_PROVIDER_CONFIG, config),
      getProviderConfig: (provider) => electron.ipcRenderer.invoke(IPC_EVENTS.LLM_GET_PROVIDER_CONFIG, provider)
    },
    config: {
      getAll: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_ALL),
      setVpnUrl: (url) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_VPN_URL, url),
      getVpnUrl: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_VPN_URL),
      setProxyAutoStart: (autoStart) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_PROXY_AUTO_START, autoStart),
      getProxyAutoStart: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_PROXY_AUTO_START),
      export: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_EXPORT),
      import: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_IMPORT),
      reset: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_RESET),
      setUserName: (name) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_USER_NAME, name),
      getUserName: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USER_NAME),
      setUserEmail: (email) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_USER_EMAIL, email),
      getUserEmail: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USER_EMAIL),
      setTheme: (theme) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_THEME, theme),
      getTheme: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_THEME),
      setLanguage: (language) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_LANGUAGE, language),
      getLanguage: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_LANGUAGE),
      setStartup: (startup) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_STARTUP, startup),
      getStartup: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_STARTUP),
      setMinimizeToTray: (minimize) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_MINIMIZE_TO_TRAY, minimize),
      getMinimizeToTray: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_MINIMIZE_TO_TRAY),
      setNotifications: (enabled) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_NOTIFICATIONS, enabled),
      getNotifications: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_NOTIFICATIONS),
      getUsageStats: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USAGE_STATS),
      createBackup: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_CREATE_BACKUP),
      restoreFromBackup: (backupPath) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_RESTORE_FROM_BACKUP, backupPath),
      getBackupFiles: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_BACKUP_FILES),
      validateConfig: (config) => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_VALIDATE_CONFIG, config),
      migrateConfig: () => electron.ipcRenderer.invoke(IPC_EVENTS.CONFIG_MIGRATE_CONFIG)
    },
    devEnvironment: {
      installVSCode: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE),
      installNodeJS: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS),
      installPython: () => electron.ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON)
    },
    test: {
      runInstaller: (installerPath) => electron.ipcRenderer.invoke(IPC_EVENTS.TEST_RUN_INSTALLER, installerPath),
      installWinget: () => electron.ipcRenderer.invoke(IPC_EVENTS.TEST_INSTALL_WINGET)
    },
    windowControl: {
      minimize: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_MINIMIZE),
      maximize: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_MAXIMIZE),
      close: () => electron.ipcRenderer.send(IPC_EVENTS.WINDOW_CLOSE)
    }
  });
  console.log("[Preload] electronAPI has been successfully exposed.");
} catch (error) {
  console.error("[Preload] Failed to expose electronAPI:", error);
}
