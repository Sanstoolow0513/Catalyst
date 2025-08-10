import { contextBridge, ipcRenderer } from 'electron'
import { IPC_EVENTS } from '../shared/ipc-events'

contextBridge.exposeInMainWorld('electronAPI', {
  mihomo: {
    start: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
    stop: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
    status: () => ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STATUS),
  }
})