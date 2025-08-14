import { ipcMain, IpcMainInvokeEvent, shell } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { mihomoService } from '../services/mihomo-service';
import path from 'path';

export function registerMihomoIpcHandlers() {
  ipcMain.handle(IPC_EVENTS.MIHOMO_START, async () => {
    try {
      await mihomoService.start();
      return { success: true };
    } catch (error) {
      console.error('Failed to start Mihomo:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_STOP, async () => {
    try {
      await mihomoService.stop();
      return { success: true };
    } catch (error) {
      console.error('Failed to stop Mihomo:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_STATUS, () => {
    return { isRunning: mihomoService.isRunning() };
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_LOAD_CONFIG, async () => {
    try {
      const config = await mihomoService.loadConfig();
      return { success: true, data: config };
    } catch (error) {
      console.error('Failed to load Mihomo config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_SAVE_CONFIG, async (_event, config: any) => {
    try {
      await mihomoService.saveConfig(config);
      return { success: true };
    } catch (error) {
      console.error('Failed to save Mihomo config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_GET_CONFIG_PATH, () => {
    try {
      const configPath = mihomoService.getConfigPath();
      return { success: true, data: configPath };
    } catch (error) {
      console.error('Failed to get Mihomo config path:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_OPEN_CONFIG_DIR, async () => {
    try {
      const configPath = mihomoService.getConfigPath();
      const configDir = path.dirname(configPath);
      await shell.openPath(configDir);
      return { success: true };
    } catch (error) {
      console.error('Failed to open Mihomo config directory:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_GET_PROXIES, async () => {
    try {
      const proxies = await mihomoService.getProxies();
      return { success: true, data: proxies };
    } catch (error) {
      console.error('Failed to get proxies:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.MIHOMO_SELECT_PROXY, async (_event, groupName: string, proxyName: string) => {
    try {
      await mihomoService.selectProxy(groupName, proxyName);
      return { success: true };
    } catch (error) {
      console.error('Failed to select proxy:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}