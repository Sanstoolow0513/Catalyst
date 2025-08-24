/**
 * ProxyService - 代理管理服务层
 * 封装所有代理相关的业务逻辑，提供统一的接口
 */

import { ApiResponse, MihomoStatus, MihomoConfig, ProxyGroup } from '../types';
import * as yaml from 'js-yaml';

// 导入通知系统（可选）
let notificationManager: any = null;
try {
  const { notificationManager: nm } = require('../components/common/NotificationSystem');
  notificationManager = nm;
} catch (e) {
  // 通知系统不可用时的静默处理
  console.warn('NotificationSystem not available');
}

export interface ProxyConnectionInfo {
  httpPort: number;
  socksPort: number;
  mixedPort: number;
  isRunning: boolean;
  uptime?: number;
}

export interface ProxyMetrics {
  totalProxies: number;
  activeProxies: number;
  avgDelay: number;
  healthyProxies: number;
}

class ProxyService {
  private static instance: ProxyService;
  private statusCheckInterval: NodeJS.Timeout | null = null;
  private metricsCache: ProxyMetrics | null = null;
  private lastStatusCheck = 0;

  private constructor() {}

  static getInstance(): ProxyService {
    if (!ProxyService.instance) {
      ProxyService.instance = new ProxyService();
    }
    return ProxyService.instance;
  }

  /**
   * 获取代理服务状态
   */
  async getStatus(): Promise<ApiResponse<MihomoStatus>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.status();
      this.lastStatusCheck = Date.now();
      
      return {
        success: true,
        data: {
          isRunning: result.isRunning,
          pid: result.pid,
          version: result.version
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取状态失败'
      };
    }
  }

  /**
   * 启动代理服务
   */
  async start(): Promise<ApiResponse<void>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.start();
      
      if (result.success) {
        this.startStatusMonitoring();
        return { success: true };
      } else {
        return { success: false, error: result.error || '启动失败' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '启动失败'
      };
    }
  }

  /**
   * 停止代理服务
   */
  async stop(): Promise<ApiResponse<void>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.stop();
      
      if (result.success) {
        this.stopStatusMonitoring();
        return { success: true };
      } else {
        return { success: false, error: result.error || '停止失败' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '停止失败'
      };
    }
  }

  /**
   * 获取连接信息
   */
  async getConnectionInfo(): Promise<ApiResponse<ProxyConnectionInfo>> {
    try {
      const configResult = await this.getConfig();
      if (!configResult.success || !configResult.data) {
        return { success: false, error: '无法获取配置信息' };
      }

      const statusResult = await this.getStatus();
      const config = configResult.data;

      return {
        success: true,
        data: {
          httpPort: config.port,
          socksPort: config['socks-port'],
          mixedPort: config['mixed-port'],
          isRunning: statusResult.data?.isRunning || false,
          uptime: statusResult.data?.isRunning ? Date.now() - this.lastStatusCheck : undefined
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取连接信息失败'
      };
    }
  }

  /**
   * 获取配置
   */
  async getConfig(): Promise<ApiResponse<MihomoConfig>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.loadConfig();
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取配置失败'
      };
    }
  }

  /**
   * 保存配置
   */
  async saveConfig(config: MihomoConfig): Promise<ApiResponse<void>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      // 验证配置
      const validation = this.validateConfig(config);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const result = await window.electronAPI.mihomo.saveConfig(config);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '保存配置失败'
      };
    }
  }

  /**
   * 从URL获取配置
   */
  async fetchConfigFromURL(url: string): Promise<ApiResponse<MihomoConfig>> {
    try {
      if (!url.trim()) {
        return { success: false, error: '请提供有效的配置URL' };
      }

      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.fetchConfigFromURL(url);
      
      if (result.success && result.data) {
        // 缓存配置URL
        await this.saveConfigURL(url);
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取配置失败'
      };
    }
  }

  /**
   * 获取代理组列表
   */
  async getProxyGroups(): Promise<ApiResponse<ProxyGroup[]>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.getProxies();
      
      if (result.success && result.data) {
        const groups: ProxyGroup[] = [];
        
        Object.entries(result.data.proxies).forEach(([name, proxy]: [string, any]) => {
          if ((proxy.all && Array.isArray(proxy.all)) || (proxy.proxies && Array.isArray(proxy.proxies))) {
            groups.push({
              name,
              type: proxy.type,
              now: proxy.now,
              proxies: proxy.all || proxy.proxies,
              providers: proxy.providers || [],
              latencyHistory: proxy.history || []
            });
          }
        });

        return { success: true, data: groups };
      }

      return { success: false, error: '获取代理组失败' };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取代理组失败'
      };
    }
  }

  /**
   * 选择代理
   */
  async selectProxy(groupName: string, proxyName: string): Promise<ApiResponse<void>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.selectProxy(groupName, proxyName);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '选择代理失败'
      };
    }
  }

  /**
   * 测试单个代理延迟
   */
  async testProxyDelay(proxyName: string): Promise<ApiResponse<number>> {
    try {
      if (!window.electronAPI?.mihomo) {
        return { success: false, error: 'Mihomo API 不可用' };
      }

      const result = await window.electronAPI.mihomo.testProxyDelay(proxyName);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '测试延迟失败'
      };
    }
  }

  /**
   * 批量测试代理延迟
   */
  async testAllProxyDelays(): Promise<ApiResponse<Record<string, number>>> {
    try {
      const groupsResult = await this.getProxyGroups();
      if (!groupsResult.success || !groupsResult.data) {
        return { success: false, error: '无法获取代理组信息' };
      }

      const delayResults: Record<string, number> = {};
      const allProxies = new Set<string>();

      // 收集所有代理名称
      groupsResult.data.forEach(group => {
        group.proxies.forEach(proxy => allProxies.add(proxy));
      });

      // 并发测试延迟
      const delayPromises = Array.from(allProxies).map(async (proxyName) => {
        try {
          const delayResult = await this.testProxyDelay(proxyName);
          return {
            name: proxyName,
            delay: delayResult.success ? delayResult.data || -1 : -1
          };
        } catch {
          return { name: proxyName, delay: -1 };
        }
      });

      const results = await Promise.all(delayPromises);
      results.forEach(({ name, delay }) => {
        delayResults[name] = delay;
      });

      return { success: true, data: delayResults };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '批量测试延迟失败'
      };
    }
  }

  /**
   * 获取代理指标
   */
  async getProxyMetrics(): Promise<ApiResponse<ProxyMetrics>> {
    try {
      const groupsResult = await this.getProxyGroups();
      if (!groupsResult.success || !groupsResult.data) {
        return { success: false, error: '无法获取代理组信息' };
      }

      const delaysResult = await this.testAllProxyDelays();
      const delays = delaysResult.success ? delaysResult.data || {} : {};

      let totalProxies = 0;
      let activeProxies = 0;
      let totalDelay = 0;
      let healthyProxies = 0;

      groupsResult.data.forEach(group => {
        group.proxies.forEach(proxyName => {
          totalProxies++;
          if (group.now === proxyName) {
            activeProxies++;
          }
          
          const delay = delays[proxyName];
          if (delay && delay > 0) {
            healthyProxies++;
            totalDelay += delay;
          }
        });
      });

      const metrics: ProxyMetrics = {
        totalProxies,
        activeProxies,
        avgDelay: healthyProxies > 0 ? Math.round(totalDelay / healthyProxies) : 0,
        healthyProxies
      };

      this.metricsCache = metrics;
      return { success: true, data: metrics };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : '获取代理指标失败'
      };
    }
  }

  /**
   * 验证配置
   */
  private validateConfig(config: any): { isValid: boolean; error?: string } {
    if (!config || typeof config !== 'object') {
      return { isValid: false, error: '配置不能为空' };
    }

    const requiredFields = ['port', 'mode'];
    for (const field of requiredFields) {
      if (config[field] === undefined) {
        return { isValid: false, error: `缺少必需字段: ${field}` };
      }
    }

    if (typeof config.port !== 'number' || config.port < 1 || config.port > 65535) {
      return { isValid: false, error: '端口号必须在 1-65535 之间' };
    }

    const validModes = ['rule', 'global', 'direct'];
    if (!validModes.includes(config.mode)) {
      return { isValid: false, error: '无效的代理模式' };
    }

    return { isValid: true };
  }

  /**
   * 保存配置URL
   */
  private async saveConfigURL(url: string): Promise<void> {
    try {
      if (window.electronAPI?.config) {
        await window.electronAPI.config.setVpnUrl(url);
      }
    } catch (error) {
      console.warn('保存配置URL失败:', error);
    }
  }

  /**
   * 开始状态监控
   */
  private startStatusMonitoring(): void {
    if (this.statusCheckInterval) {
      return;
    }

    this.statusCheckInterval = setInterval(async () => {
      try {
        await this.getStatus();
      } catch (error) {
        console.warn('状态检查失败:', error);
      }
    }, 5000); // 每5秒检查一次
  }

  /**
   * 停止状态监控
   */
  private stopStatusMonitoring(): void {
    if (this.statusCheckInterval) {
      clearInterval(this.statusCheckInterval);
      this.statusCheckInterval = null;
    }
  }

  /**
   * 清理资源
   */
  destroy(): void {
    this.stopStatusMonitoring();
    this.metricsCache = null;
  }
}

export const proxyService = ProxyService.getInstance();
export default ProxyService;