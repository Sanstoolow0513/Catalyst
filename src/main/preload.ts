import { contextBridge, ipcRenderer } from 'electron'
import { IPC_EVENTS } from '../shared/ipc-events'

console.log('[Preload] Script starting execution.');

try {
  console.log('[Preload] Attempting to expose electronAPI via contextBridge.');
  contextBridge.exposeInMainWorld('electronAPI', {
    mihomo: {
      start: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
      stop: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
      status: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STATUS),
      loadConfig: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_LOAD_CONFIG),
      saveConfig: (config: any) => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SAVE_CONFIG, config),
      getConfigPath: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_CONFIG_PATH),
      openConfigDir: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_OPEN_CONFIG_DIR),
      getProxies: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_GET_PROXIES),
      selectProxy: (groupName: string, proxyName: string) =>
        ipcRenderer.invoke(IPC_EVENTS.MIHOMO_SELECT_PROXY, groupName, proxyName),
      fetchConfigFromURL: (url: string) => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_FETCH_CONFIG_FROM_URL, url),
      testProxyDelay: (proxyName: string) => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_TEST_PROXY_DELAY, proxyName),
    },
    
    llm: {
      generateCompletion: (request: any) => ipcRenderer.invoke(IPC_EVENTS.LLM_GENERATE_COMPLETION, request),
      setApiKey: (provider: string, apiKey: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_SET_API_KEY, { provider, apiKey }),
      getApiKey: (provider: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_GET_API_KEY, provider),
      getAllApiKeys: () => ipcRenderer.invoke(IPC_EVENTS.LLM_GET_ALL_API_KEYS),
      deleteApiKey: (provider: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_DELETE_API_KEY, provider),
      setProviderConfig: (config: any) => ipcRenderer.invoke(IPC_EVENTS.LLM_SET_PROVIDER_CONFIG, config),
      getProviderConfig: (provider: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_GET_PROVIDER_CONFIG, provider),
    },
    
    config: {
      getAll: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_ALL),
      setVpnUrl: (url: string) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_VPN_URL, url),
      getVpnUrl: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_VPN_URL),
      setProxyAutoStart: (autoStart: boolean) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_PROXY_AUTO_START, autoStart),
      getProxyAutoStart: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_PROXY_AUTO_START),
      export: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_EXPORT),
      import: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_IMPORT),
      reset: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_RESET),
      setUserName: (name: string) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_USER_NAME, name),
      getUserName: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USER_NAME),
      setUserEmail: (email: string) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_USER_EMAIL, email),
      getUserEmail: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USER_EMAIL),
      setTheme: (theme: 'light' | 'dark' | 'auto') => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_THEME, theme),
      getTheme: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_THEME),
      setLanguage: (language: string) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_LANGUAGE, language),
      getLanguage: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_LANGUAGE),
      setStartup: (startup: boolean) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_STARTUP, startup),
      getStartup: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_STARTUP),
      setMinimizeToTray: (minimize: boolean) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_MINIMIZE_TO_TRAY, minimize),
      getMinimizeToTray: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_MINIMIZE_TO_TRAY),
      setNotifications: (enabled: boolean) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_SET_NOTIFICATIONS, enabled),
      getNotifications: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_NOTIFICATIONS),
      getUsageStats: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_USAGE_STATS),
      createBackup: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_CREATE_BACKUP),
      restoreFromBackup: (backupPath: string) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_RESTORE_FROM_BACKUP, backupPath),
      getBackupFiles: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_GET_BACKUP_FILES),
      validateConfig: (config: any) => ipcRenderer.invoke(IPC_EVENTS.CONFIG_VALIDATE_CONFIG, config),
      migrateConfig: () => ipcRenderer.invoke(IPC_EVENTS.CONFIG_MIGRATE_CONFIG),
    },
    
    devEnvironment: {
      installVSCode: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE),
      installNodeJS: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS),
      installPython: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON),
    },
    
    test: {
      runInstaller: (installerPath: string) => ipcRenderer.invoke(IPC_EVENTS.TEST_RUN_INSTALLER, installerPath),
    },
    
    windowControl: {
      minimize: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MINIMIZE),
      maximize: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MAXIMIZE),
      close: () => ipcRenderer.send(IPC_EVENTS.WINDOW_CLOSE)
    }
  });
  console.log('[Preload] electronAPI has been successfully exposed.');
} catch (error) {
  console.error('[Preload] Failed to expose electronAPI:', error);
}