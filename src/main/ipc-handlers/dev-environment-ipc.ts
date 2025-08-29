import { ipcMain } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { devEnvironmentService } from '../services/dev-environment-service';
import { devToolsSimple } from '../../renderer/data/devToolsSimple';

/**
 * 获取图标名称 - 简化版本，避免序列化 React 组件
 */
function getIconName(icon: { name?: string; displayName?: string }): string {
  // 简单的图标映射，避免序列化 React 组件
  const iconMap: Record<string, string> = {
    'SiNodedotjs': 'nodejs',
    'SiPython': 'python',
    'SiIntellijidea': 'intellij',
    'VscCode': 'vscode',
    'FaTerminal': 'terminal',
    'FaTools': 'tools',
    'SiTencentqq': 'qq',
    'SiObsidian': 'obsidian',
    'SiBrave': 'brave'
  };
  
  // 尝试匹配图标名称
  if (icon?.name && iconMap[icon.name]) {
    return iconMap[icon.name];
  }
  
  // 尝试从显示名称匹配
  if (icon?.displayName && iconMap[icon.displayName]) {
    return iconMap[icon.displayName];
  }
  
  // 默认返回工具 ID
  return 'default';
}

export function registerDevEnvironmentIpcHandlers() {
  // 原有的安装方法（保持兼容性）
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

  // 下载管理相关事件处理
  ipcMain.handle(IPC_EVENTS.DOWNLOAD_START_TOOL, async (_, toolId: string, toolName: string, downloadUrl: string, category: string) => {
    try {
      const result = await devEnvironmentService.startDownload(toolId, toolName, downloadUrl, category);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to start download:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_PAUSE, async (_, downloadId: string) => {
    try {
      const result = devEnvironmentService.pauseDownload(downloadId);
      return { success: result };
    } catch (error) {
      console.error('Failed to pause download:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_RESUME, async (_, downloadId: string) => {
    try {
      const result = devEnvironmentService.resumeDownload(downloadId);
      return { success: result };
    } catch (error) {
      console.error('Failed to resume download:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_CANCEL, async (_, downloadId: string) => {
    try {
      const result = devEnvironmentService.cancelDownload(downloadId);
      return { success: result };
    } catch (error) {
      console.error('Failed to cancel download:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_REMOVE, async (_, downloadId: string) => {
    try {
      const result = devEnvironmentService.removeDownload(downloadId);
      return { success: result };
    } catch (error) {
      console.error('Failed to remove download:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_GET_LIST, async () => {
    try {
      const downloads = devEnvironmentService.getDownloads();
      return { success: true, data: downloads };
    } catch (error) {
      console.error('Failed to get download list:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.DOWNLOAD_GET_STATS, async () => {
    try {
      const stats = devEnvironmentService.getDownloadStats();
      return { success: true, data: stats };
    } catch (error) {
      console.error('Failed to get download stats:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 工具管理相关事件处理
  ipcMain.handle(IPC_EVENTS.TOOL_CHECK_INSTALLATION, async (_, toolId: string) => {
    try {
      const result = await devEnvironmentService.checkToolInstallation(toolId);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to check tool installation:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOOL_GET_VERSION, async (_, toolId: string) => {
    try {
      const result = await devEnvironmentService.getToolVersion(toolId);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to get tool version:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOOL_INSTALL, async (_, toolId: string, toolName: string, downloadUrl: string, category: string) => {
    try {
      const result = await devEnvironmentService.installTool(toolId, toolName, downloadUrl, category);
      return result;
    } catch (error) {
      console.error('Failed to install tool:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOOL_UNINSTALL, async (_, toolId: string) => {
    try {
      const result = await devEnvironmentService.uninstallTool(toolId);
      return result;
    } catch (error) {
      console.error('Failed to uninstall tool:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOOL_GET_LIST, async () => {
    try {
      // 获取工具列表并检查安装状态
      const toolsWithStatus = await Promise.all(
        devToolsSimple.map(async (tool) => {
          const installed = await devEnvironmentService.checkToolInstallation(tool.id);
          const version = installed ? await devEnvironmentService.getToolVersion(tool.id) : null;
          
          // 移除无法序列化的 React 组件
          const { icon, ...toolWithoutIcon } = tool;
          
          return {
            ...toolWithoutIcon,
            installed,
            version,
            iconName: getIconName(icon) // 添加图标名称
          };
        })
      );
      return { success: true, data: toolsWithStatus };
    } catch (error) {
      console.error('Failed to get tool list:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle(IPC_EVENTS.TOOL_GET_CATEGORIES, async () => {
    try {
      const categories = [...new Set(devToolsSimple.map(tool => tool.category))];
      return { success: true, data: categories };
    } catch (error) {
      console.error('Failed to get tool categories:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 下载状态更新事件监听器
  ipcMain.on('download-update', (_, eventData) => {
    // 安全地解构数据
    if (eventData && eventData.downloadId && eventData.task) {
      const { downloadId, task } = eventData;
      console.log(`[DevEnvironmentIPC] Broadcasting download update for ${downloadId}: ${task.status}`);
      // 广播下载状态更新到所有渲染进程
      ipcMain.emit('download-status-update', { downloadId, task });
    } else {
      console.error('[DevEnvironmentIPC] Invalid download-update event data:', eventData);
    }
  });
}