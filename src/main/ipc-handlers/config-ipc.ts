import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { configManager } from '../services/config-manager';
import * as path from 'path';
import { dialog } from 'electron';

export function registerConfigIpcHandlers() {
  // 获取所有配置
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_ALL, async () => {
    try {
      const config = configManager.getAllConfig();
      return { success: true, data: config };
    } catch (error) {
      console.error('Failed to get all config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 设置VPN提供商URL
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_VPN_URL, async (_event: IpcMainInvokeEvent, url: string) => {
    try {
      configManager.setVpnProviderUrl(url);
      return { success: true };
    } catch (error) {
      console.error('Failed to set VPN URL:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取VPN提供商URL
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_VPN_URL, async () => {
    try {
      const url = configManager.getVpnProviderUrl();
      return { success: true, data: url };
    } catch (error) {
      console.error('Failed to get VPN URL:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 设置代理自动启动
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_PROXY_AUTO_START, async (_event: IpcMainInvokeEvent, autoStart: boolean) => {
    try {
      configManager.setProxyAutoStart(autoStart);
      return { success: true };
    } catch (error) {
      console.error('Failed to set proxy auto start:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取代理自动启动设置
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_PROXY_AUTO_START, async () => {
    try {
      const autoStart = configManager.getProxyAutoStart();
      return { success: true, data: autoStart };
    } catch (error) {
      console.error('Failed to get proxy auto start:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 导出配置
  ipcMain.handle(IPC_EVENTS.CONFIG_EXPORT, async () => {
    try {
      const result = await dialog.showSaveDialog({
        title: 'Export Configuration',
        defaultPath: path.join(configManager.getConfigDir(), 'catalyst-config.json'),
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      });

      if (!result.canceled && result.filePath) {
        configManager.exportConfig(result.filePath);
        return { success: true, data: result.filePath };
      } else {
        return { success: false, error: 'Export canceled by user' };
      }
    } catch (error) {
      console.error('Failed to export config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 导入配置
  ipcMain.handle(IPC_EVENTS.CONFIG_IMPORT, async () => {
    try {
      const result = await dialog.showOpenDialog({
        title: 'Import Configuration',
        filters: [
          { name: 'JSON Files', extensions: ['json'] },
          { name: 'All Files', extensions: ['*'] }
        ],
        properties: ['openFile']
      });

      if (!result.canceled && result.filePaths.length > 0) {
        configManager.importConfig(result.filePaths[0]);
        return { success: true, data: result.filePaths[0] };
      } else {
        return { success: false, error: 'Import canceled by user' };
      }
    } catch (error) {
      console.error('Failed to import config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 重置配置
  ipcMain.handle(IPC_EVENTS.CONFIG_RESET, async () => {
    try {
      configManager.resetConfig();
      return { success: true };
    } catch (error) {
      console.error('Failed to reset config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 用户名设置
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_USER_NAME, async (_event: IpcMainInvokeEvent, name: string) => {
    try {
      configManager.setUserName(name);
      return { success: true };
    } catch (error) {
      console.error('Failed to set user name:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取用户名
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_USER_NAME, async () => {
    try {
      const name = configManager.getUserName();
      return { success: true, data: name };
    } catch (error) {
      console.error('Failed to get user name:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 用户邮箱设置
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_USER_EMAIL, async (_event: IpcMainInvokeEvent, email: string) => {
    try {
      configManager.setUserEmail(email);
      return { success: true };
    } catch (error) {
      console.error('Failed to set user email:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取用户邮箱
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_USER_EMAIL, async () => {
    try {
      const email = configManager.getUserEmail();
      return { success: true, data: email };
    } catch (error) {
      console.error('Failed to get user email:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 开机启动设置
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_STARTUP, async (_event: IpcMainInvokeEvent, startup: boolean) => {
    try {
      configManager.setStartup(startup);
      return { success: true };
    } catch (error) {
      console.error('Failed to set startup:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取开机启动设置
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_STARTUP, async () => {
    try {
      const startup = configManager.getStartup();
      return { success: true, data: startup };
    } catch (error) {
      console.error('Failed to get startup:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 最小化到托盘设置
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_MINIMIZE_TO_TRAY, async (_event: IpcMainInvokeEvent, minimize: boolean) => {
    try {
      configManager.setMinimizeToTray(minimize);
      return { success: true };
    } catch (error) {
      console.error('Failed to set minimize to tray:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取最小化到托盘设置
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_MINIMIZE_TO_TRAY, async () => {
    try {
      const minimize = configManager.getMinimizeToTray();
      return { success: true, data: minimize };
    } catch (error) {
      console.error('Failed to get minimize to tray:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 通知设置
  ipcMain.handle(IPC_EVENTS.CONFIG_SET_NOTIFICATIONS, async (_event: IpcMainInvokeEvent, enabled: boolean) => {
    try {
      configManager.setNotifications(enabled);
      return { success: true };
    } catch (error) {
      console.error('Failed to set notifications:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取通知设置
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_NOTIFICATIONS, async () => {
    try {
      const notifications = configManager.getNotifications();
      return { success: true, data: notifications };
    } catch (error) {
      console.error('Failed to get notifications:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取使用统计
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_USAGE_STATS, async () => {
    try {
      const stats = configManager.getUsageStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 创建备份
  ipcMain.handle(IPC_EVENTS.CONFIG_CREATE_BACKUP, async () => {
    try {
      const backupPath = configManager.createBackup();
      return { success: true, data: backupPath };
    } catch (error) {
      console.error('Failed to create backup:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 从备份恢复
  ipcMain.handle(IPC_EVENTS.CONFIG_RESTORE_FROM_BACKUP, async (_event: IpcMainInvokeEvent, backupPath: string) => {
    try {
      configManager.restoreFromBackup(backupPath);
      return { success: true, data: backupPath };
    } catch (error) {
      console.error('Failed to restore from backup:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取备份文件列表
  ipcMain.handle(IPC_EVENTS.CONFIG_GET_BACKUP_FILES, async () => {
    try {
      const backupFiles = configManager.getBackupFiles();
      return { success: true, data: backupFiles };
    } catch (error) {
      console.error('Failed to get backup files:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 验证配置
  ipcMain.handle(IPC_EVENTS.CONFIG_VALIDATE_CONFIG, async (_event: IpcMainInvokeEvent, config: any) => {
    try {
      const validation = configManager.validateConfig(config);
      return { success: true, data: validation };
    } catch (error) {
      console.error('Failed to validate config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 迁移配置
  ipcMain.handle(IPC_EVENTS.CONFIG_MIGRATE_CONFIG, async () => {
    try {
      configManager.migrateConfig();
      return { success: true };
    } catch (error) {
      console.error('Failed to migrate config:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}
