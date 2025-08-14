import { contextBridge, ipcRenderer } from 'electron'
import { IPC_EVENTS } from '../shared/ipc-events'

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
  },
  
  llm: {
    generateCompletion: (request: any) => ipcRenderer.invoke(IPC_EVENTS.LLM_GENERATE_COMPLETION, request),
    setApiKey: (provider: string, apiKey: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_SET_API_KEY, { provider, apiKey }),
    getApiKey: (provider: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_GET_API_KEY, provider),
    getAllApiKeys: () => ipcRenderer.invoke(IPC_EVENTS.LLM_GET_ALL_API_KEYS),
    deleteApiKey: (provider: string) => ipcRenderer.invoke(IPC_EVENTS.LLM_DELETE_API_KEY, provider),
  },
  
  devEnvironment: {
    installVSCode: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE),
    installNodeJS: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS),
    installPython: () => ipcRenderer.invoke(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON),
  },
  
  windowControl: {
    minimize: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MINIMIZE),
    maximize: () => ipcRenderer.send(IPC_EVENTS.WINDOW_MAXIMIZE),
    close: () => ipcRenderer.send(IPC_EVENTS.WINDOW_CLOSE)
  }
})
