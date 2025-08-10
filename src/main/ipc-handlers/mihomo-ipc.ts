import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { mihomoService } from '../services/mihomo-service';

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
}