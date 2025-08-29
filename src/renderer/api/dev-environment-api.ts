import { DownloadStatus } from '../components/download/SimpleDownloadItem';

// 声明 window.electronAPI 类型
declare global {
  interface Window {
    electronAPI: {
      devEnvironment: {
        installVSCode: () => Promise<{ success: boolean; error?: string }>;
        installNodeJS: () => Promise<{ success: boolean; error?: string }>;
        installPython: () => Promise<{ success: boolean; error?: string }>;
        download: {
          startTool: (toolId: string, toolName: string, downloadUrl: string, category: string) => Promise<any>;
          pause: (downloadId: string) => Promise<any>;
          resume: (downloadId: string) => Promise<any>;
          cancel: (downloadId: string) => Promise<any>;
          remove: (downloadId: string) => Promise<any>;
          getList: () => Promise<any>;
          getStats: () => Promise<any>;
        };
        tool: {
          checkInstallation: (toolId: string) => Promise<any>;
          getVersion: (toolId: string) => Promise<any>;
          install: (toolId: string, toolName: string, downloadUrl: string, category: string) => Promise<any>;
          uninstall: (toolId: string) => Promise<any>;
          getList: () => Promise<any>;
          getCategories: () => Promise<any>;
        };
        onDownloadUpdate: (callback: (downloadId: string, task: any) => void) => () => void;
        onToolStatusUpdate: (callback: (toolId: string, tool: any) => void) => () => void;
      };
    };
  }
}

export interface DownloadTask {
  id: string;
  name: string;
  url: string;
  status: DownloadStatus;
  progress: number;
  speed: number;
  eta: number;
  totalSize: number;
  downloadedSize: number;
  filePath: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
}

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  category: string;
  website: string;
  downloadUrl: string;
  installed: boolean;
  version?: string;
  icon?: any;
}

export interface DownloadStats {
  total: number;
  downloading: number;
  completed: number;
  paused: number;
  failed: number;
  totalSpeed: number;
}

class DevEnvironmentAPI {
  // 检查 electronAPI 是否可用
  private get electronAPI() {
    if (typeof window !== 'undefined' && window.electronAPI) {
      return window.electronAPI.devEnvironment;
    }
    throw new Error('Electron API not available. Make sure you are running in Electron environment.');
  }

  // 下载管理相关方法
  async startDownload(toolId: string, toolName: string, downloadUrl: string, category: string): Promise<DownloadTask> {
    const response = await this.electronAPI.download.startTool(toolId, toolName, downloadUrl, category);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  async pauseDownload(downloadId: string): Promise<boolean> {
    const response = await this.electronAPI.download.pause(downloadId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.success;
  }

  async resumeDownload(downloadId: string): Promise<boolean> {
    const response = await this.electronAPI.download.resume(downloadId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.success;
  }

  async cancelDownload(downloadId: string): Promise<boolean> {
    const response = await this.electronAPI.download.cancel(downloadId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.success;
  }

  async removeDownload(downloadId: string): Promise<boolean> {
    const response = await this.electronAPI.download.remove(downloadId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.success;
  }

  async getDownloads(): Promise<DownloadTask[]> {
    const response = await this.electronAPI.download.getList();
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  async getDownloadStats(): Promise<DownloadStats> {
    const response = await this.electronAPI.download.getStats();
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  // 工具管理相关方法
  async checkToolInstallation(toolId: string): Promise<boolean> {
    const response = await this.electronAPI.tool.checkInstallation(toolId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  async getToolVersion(toolId: string): Promise<string | null> {
    const response = await this.electronAPI.tool.getVersion(toolId);
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  async installTool(toolId: string, toolName: string, downloadUrl: string, category: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.electronAPI.tool.install(toolId, toolName, downloadUrl, category);
    return response;
  }

  async uninstallTool(toolId: string): Promise<{ success: boolean; error?: string }> {
    const response = await this.electronAPI.tool.uninstall(toolId);
    return response;
  }

  async getTools(): Promise<ToolInfo[]> {
    const response = await this.electronAPI.tool.getList();
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  async getCategories(): Promise<string[]> {
    const response = await this.electronAPI.tool.getCategories();
    if (!response.success) {
      throw new Error(response.error);
    }
    return response.data;
  }

  // 事件监听器
  onDownloadUpdate(callback: (downloadId: string, task: DownloadTask) => void): () => void {
    return this.electronAPI.onDownloadUpdate(callback);
  }

  onToolStatusUpdate(callback: (toolId: string, tool: ToolInfo) => void): () => void {
    return this.electronAPI.onToolStatusUpdate(callback);
  }

  // 兼容性方法（保持与原有接口兼容）
  async installVSCode(): Promise<{ success: boolean; error?: string }> {
    return await this.electronAPI.installVSCode();
  }

  async installNodeJS(): Promise<{ success: boolean; error?: string }> {
    return await this.electronAPI.installNodeJS();
  }

  async installPython(): Promise<{ success: boolean; error?: string }> {
    return await this.electronAPI.installPython();
  }
}

export const devEnvironmentAPI = new DevEnvironmentAPI();