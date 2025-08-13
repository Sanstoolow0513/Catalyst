import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { devEnvironmentService } from '../services/dev-environment-service';

export function registerDevEnvironmentIpcHandlers() {
  ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_VSCODE, async () => {
    try {
      const result = await devEnvironmentService.installVSCode();
      return result;
    } catch (error) {
      console.error('Failed to install VSCode:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_NODEJS, async () => {
    try {
      const result = await devEnvironmentService.installNodeJS();
      return result;
    } catch (error) {
      console.error('Failed to install Node.js:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DEV_ENV_INSTALL_PYTHON, async () => {
    try {
      const result = await devEnvironmentService.installPython();
      return result;
    } catch (error) {
      console.error('Failed to install Python:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 可以添加更多工具的 IPC 事件处理
}