import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { devEnvironmentService } from './dev-environment-service';
import { devToolsSimple } from '../../renderer/data/devToolsSimple';
import { ToolInfo } from './dev-environment-service';
import { ipcMain } from 'electron';
import { logger } from '../../shared/logger';

export interface ExtendedToolInfo extends ToolInfo {
  icon?: string; // 改为图标的名称或标识符，而不是React组件
  installed: boolean;
  version?: string;
  lastChecked?: Date;
  installPath?: string;
}

class ToolManagerService {
  private static instance: ToolManagerService;
  private toolsCache: Map<string, ExtendedToolInfo> = new Map();
  private lastUpdate: Date = new Date();
  private configPath: string;

  private constructor() {
    this.configPath = path.join(app.getPath('userData'), 'tool-manager-config.json');
    this.initializeTools();
  }

  /**
   * 获取图标名称 - 简化版本
   */
  private getIconName(icon: any): string {
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

  public static getInstance(): ToolManagerService {
    if (!ToolManagerService.instance) {
      ToolManagerService.instance = new ToolManagerService();
    }
    return ToolManagerService.instance;
  }

  private saveTools(): void {
    try {
      const data = Array.from(this.toolsCache.values()).map(tool => ({
        id: tool.id,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        website: tool.website,
        downloadUrl: tool.downloadUrl,
        installed: tool.installed,
        version: tool.version,
        lastChecked: tool.lastChecked,
        installPath: tool.installPath,
        icon: tool.icon // 保存图标名称
      }));
      
      fs.writeFileSync(this.configPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error('[ToolManagerService] Failed to save tools:', error);
    }
  }

  private loadTools(): void {
    try {
      if (fs.existsSync(this.configPath)) {
        const data = JSON.parse(fs.readFileSync(this.configPath, 'utf8'));
        
        for (const savedTool of data) {
          const toolDef = devToolsSimple.find(t => t.id === savedTool.id);
          if (toolDef) {
            const extendedTool: ExtendedToolInfo = {
              ...savedTool,
              icon: this.getIconName(toolDef.icon), // 存储图标名称而不是组件
              lastChecked: savedTool.lastChecked ? new Date(savedTool.lastChecked) : new Date()
            };
            this.toolsCache.set(savedTool.id, extendedTool);
          }
        }
      }
    } catch (error) {
      console.error('[ToolManagerService] Failed to load tools:', error);
    }
  }

  private async initializeTools(): Promise<void> {
    try {
      logger.info('[ToolManagerService] Initializing tools...');
      
      // 加载已保存的工具状态
      this.loadTools();
      
      // 初始化新工具（如果有）
      for (const tool of devToolsSimple) {
        if (!this.toolsCache.has(tool.id)) {
          const extendedTool: ExtendedToolInfo = {
            id: tool.id,
            name: tool.name,
            description: tool.description,
            category: tool.category,
            website: tool.website,
            downloadUrl: tool.downloadUrl,
            icon: this.getIconName(tool.icon), // 存储图标名称而不是组件
            installed: false,
            version: undefined,
            lastChecked: new Date(),
            installPath: undefined
          };
          
          this.toolsCache.set(tool.id, extendedTool);
        }
      }
      
      // 保存初始化后的状态
      this.saveTools();
      
      // 初始检查工具状态
      await this.checkAllToolsStatus();
      
      logger.info('[ToolManagerService] Tools initialized successfully');
    } catch (error) {
      logger.error('[ToolManagerService] Failed to initialize tools:', error);
    }
  }

  public async checkAllToolsStatus(): Promise<void> {
    try {
      logger.info('[ToolManagerService] Checking all tools status...');
      
      const checkPromises = Array.from(this.toolsCache.values()).map(async (tool) => {
        try {
          const installed = await devEnvironmentService.checkToolInstallation(tool.id);
          const version = installed ? await devEnvironmentService.getToolVersion(tool.id) : null;
          
          tool.installed = installed;
          tool.version = version;
          tool.lastChecked = new Date();
          
          this.toolsCache.set(tool.id, tool);
        } catch (error) {
          console.error(`[ToolManagerService] Failed to check status for ${tool.name}:`, error);
        }
      });
      
      await Promise.all(checkPromises);
      this.lastUpdate = new Date();
      
      logger.info('[ToolManagerService] All tools status checked');
    } catch (error) {
      logger.error('[ToolManagerService] Failed to check tools status:', error);
    }
  }

  public async getTools(): Promise<ExtendedToolInfo[]> {
    try {
      // 如果超过5分钟未更新，重新检查状态
      const now = new Date();
      const timeDiff = now.getTime() - this.lastUpdate.getTime();
      
      if (timeDiff > 5 * 60 * 1000) {
        await this.checkAllToolsStatus();
      }
      
      return Array.from(this.toolsCache.values());
    } catch (error) {
      console.error('[ToolManagerService] Failed to get tools:', error);
      return [];
    }
  }

  public async getTool(toolId: string): Promise<ExtendedToolInfo | null> {
    try {
      const tool = this.toolsCache.get(toolId);
      if (!tool) return null;
      
      // 检查工具状态
      const installed = await devEnvironmentService.checkToolInstallation(toolId);
      const version = installed ? await devEnvironmentService.getToolVersion(toolId) : null;
      
      tool.installed = installed;
      tool.version = version;
      tool.lastChecked = new Date();
      
      this.toolsCache.set(toolId, tool);
      
      return tool;
    } catch (error) {
      console.error(`[ToolManagerService] Failed to get tool ${toolId}:`, error);
      return null;
    }
  }

  public async getToolsByCategory(category: string): Promise<ExtendedToolInfo[]> {
    try {
      const tools = await this.getTools();
      return tools.filter(tool => tool.category === category);
    } catch (error) {
      console.error(`[ToolManagerService] Failed to get tools by category ${category}:`, error);
      return [];
    }
  }

  public async getCategories(): Promise<string[]> {
    try {
      const tools = await this.getTools();
      const categories = [...new Set(tools.map(tool => tool.category))];
      return categories;
    } catch (error) {
      console.error('[ToolManagerService] Failed to get categories:', error);
      return [];
    }
  }

  public async installTool(toolId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tool = this.toolsCache.get(toolId);
      if (!tool) {
        return { success: false, error: `Tool ${toolId} not found` };
      }
      
      logger.info(`[ToolManagerService] Installing tool: ${tool.name}`);
      
      // 实现重试机制
      const maxRetries = 3;
      const baseDelay = 1000; // 1秒基础延迟
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const result = await devEnvironmentService.installTool(
            tool.id,
            tool.name,
            tool.downloadUrl,
            tool.category
          );
          
          if (result.success) {
            // 安装成功后更新状态
            await this.checkToolStatus(toolId);
            logger.info(`[ToolManagerService] Tool ${tool.name} installed successfully on attempt ${attempt}`);
            return result;
          } else {
            // 如果安装失败但不是网络错误，不重试
            if (result.error && !this.isRetryableError(result.error)) {
              logger.error(`[ToolManagerService] Tool ${tool.name} installation failed with non-retryable error: ${result.error}`);
              return result;
            }
            
            // 如果是最后一次尝试，返回失败结果
            if (attempt === maxRetries) {
              logger.error(`[ToolManagerService] Tool ${tool.name} installation failed after ${maxRetries} attempts`);
              return { success: false, error: `Installation failed after ${maxRetries} attempts: ${result.error}` };
            }
            
            // 等待延迟后重试
            const delay = baseDelay * Math.pow(2, attempt - 1); // 指数退避
            logger.warn(`[ToolManagerService] Tool ${tool.name} installation failed (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
            await this.sleep(delay);
          }
        } catch (error) {
          // 如果是最后一次尝试，抛出错误
          if (attempt === maxRetries) {
            logger.error(`[ToolManagerService] Tool ${tool.name} installation failed after ${maxRetries} attempts:`, error);
            throw error;
          }
          
          // 检查是否是可重试的错误
          if (!this.isRetryableError(error)) {
            logger.error(`[ToolManagerService] Tool ${tool.name} installation failed with non-retryable error:`, error);
            return { success: false, error: (error as Error).message };
          }
          
          // 等待延迟后重试
          const delay = baseDelay * Math.pow(2, attempt - 1);
          logger.warn(`[ToolManagerService] Tool ${tool.name} installation threw error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
      
      return { success: false, error: 'Unknown installation error' };
    } catch (error) {
      logger.error(`[ToolManagerService] Failed to install tool ${toolId}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  private isRetryableError(error: any): boolean {
    if (!error) return false;
    
    const errorMessage = error.message || error.toString() || '';
    const retryableErrors = [
      'network',
      'connection',
      'timeout',
      'econnrefused',
      'econnreset',
      'etimedout',
      'fetch',
      'download',
      'internet',
      'offline',
      'unreachable'
    ];
    
    return retryableErrors.some(keyword => 
      errorMessage.toLowerCase().includes(keyword)
    );
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  public async uninstallTool(toolId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const tool = this.toolsCache.get(toolId);
      if (!tool) {
        return { success: false, error: `Tool ${toolId} not found` };
      }
      
      logger.info(`[ToolManagerService] Uninstalling tool: ${tool.name}`);
      
      const result = await devEnvironmentService.uninstallTool(toolId);
      
      if (result.success) {
        // 卸载成功后更新状态
        await this.checkToolStatus(toolId);
      }
      
      return result;
    } catch (error) {
      logger.error(`[ToolManagerService] Failed to uninstall tool ${toolId}:`, error);
      return { success: false, error: (error as Error).message };
    }
  }

  private async checkToolStatus(toolId: string): Promise<void> {
    try {
      const tool = this.toolsCache.get(toolId);
      if (!tool) return;
      
      const installed = await devEnvironmentService.checkToolInstallation(toolId);
      const version = installed ? await devEnvironmentService.getToolVersion(toolId) : null;
      
      tool.installed = installed;
      tool.version = version;
      tool.lastChecked = new Date();
      
      this.toolsCache.set(toolId, tool);
      this.saveTools();
      
      // 通知前端工具状态更新
      ipcMain.emit('tool-status-update', { toolId, tool });
    } catch (error) {
      logger.error(`[ToolManagerService] Failed to check tool status ${toolId}:`, error);
    }
  }

  public async getToolStats() {
    try {
      const tools = await this.getTools();
      const categories = await this.getCategories();
      
      const stats = {
        totalTools: tools.length,
        installedTools: tools.filter(t => t.installed).length,
        categories: categories.length,
        categoryStats: categories.map(category => ({
          name: category,
          total: tools.filter(t => t.category === category).length,
          installed: tools.filter(t => t.category === category && t.installed).length
        }))
      };
      
      return stats;
    } catch (error) {
      logger.error('[ToolManagerService] Failed to get tool stats:', error);
      return null;
    }
  }

  public async refreshTools(): Promise<void> {
    try {
      logger.info('[ToolManagerService] Refreshing tools...');
      await this.checkAllToolsStatus();
      logger.info('[ToolManagerService] Tools refreshed successfully');
    } catch (error) {
      logger.error('[ToolManagerService] Failed to refresh tools:', error);
    }
  }

  public async searchTools(query: string): Promise<ExtendedToolInfo[]> {
    try {
      const tools = await this.getTools();
      const lowercaseQuery = query.toLowerCase();
      
      return tools.filter(tool => 
        tool.name.toLowerCase().includes(lowercaseQuery) ||
        tool.description.toLowerCase().includes(lowercaseQuery) ||
        tool.category.toLowerCase().includes(lowercaseQuery)
      );
    } catch (error) {
      console.error(`[ToolManagerService] Failed to search tools with query "${query}":`, error);
      return [];
    }
  }
}

export const toolManagerService = ToolManagerService.getInstance();