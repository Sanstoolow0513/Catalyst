"use strict";
const electron = require("electron");
const IPC_EVENTS = {
  MIHOMO_START: "mihomo:start",
  MIHOMO_STOP: "mihomo:stop",
  MIHOMO_STATUS: "mihomo:status"
};
electron.contextBridge.exposeInMainWorld("electronAPI", {
  mihomo: {
    start: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_START),
    stop: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STOP),
    status: () => electron.ipcRenderer.invoke(IPC_EVENTS.MIHOMO_STATUS)
  }
});
