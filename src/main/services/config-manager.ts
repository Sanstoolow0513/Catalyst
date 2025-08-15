import Store from 'electron-store';
import * as path from 'path';
import * as fs from 'fs';
import { app } from 'electron';

// 统一配置接口
interface AppConfig {
  // LLM配置
  llm: {
    provider: string;
    model: string;
    apiKeys: {
      [provider: string]: string;
    };
  };
  
  // 代理配置
  proxy: {
    vpnProviderUrl?: string;
    autoStart?: boolean;
    configPath?: string;
  };
  
  // 应用设置
  app: {
    theme?: 'light' | 'dark' | 'auto';
    language?: string;
    autoUpdate?: boolean;
    startup?: boolean;
    minimizeToTray?: boolean;
    notifications?: boolean;
  };
  
  // 用户偏好
  user: {
    name?: string;
    email?: string;
    lastUsed?: string;
    usageStats?: {
      proxyUsage: number;
      chatUsage: number;
      lastActive: string;
    };
  };
}

class ConfigManager {
  private static instance: ConfigManager;
  private store: Store<AppConfig>;
  private configDir: string;

  private constructor() {
    // 确保配置目录存在
    this.configDir = path.join(app.getPath('userData'), 'config');
    if (!fs.existsSync(this.configDir)) {
      fs.mkdirSync(this.configDir, { recursive: true });
    }

    this.store = new Store<AppConfig>({
      name: 'app-config',
      defaults: {
        llm: {
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          apiKeys: {}
        },
        proxy: {
          autoStart: false
        },
        app: {
          theme: 'auto',
          language: 'zh-CN',
          autoUpdate: true,
          startup: false,
          minimizeToTray: false,
          notifications: true
        },
        user: {
          usageStats: {
            proxyUsage: 0,
            chatUsage: 0,
            lastActive: new Date().toISOString()
          }
        }
      }
    });
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // LLM配置方法
  public setLLMProvider(provider: string): void {
    this.store.set('llm.provider', provider);
  }

  public getLLMProvider(): string {
    return this.store.get('llm.provider');
  }

  public setLLMModel(model: string): void {
    this.store.set('llm.model', model);
  }

  public getLLMModel(): string {
    return this.store.get('llm.model');
  }

  public setApiKey(provider: string, apiKey: string): void {
    const apiKeys = this.store.get('llm.apiKeys');
    this.store.set('llm.apiKeys', {
      ...apiKeys,
      [provider]: apiKey
    });
  }

  public getApiKey(provider: string): string | undefined {
    return this.store.get('llm.apiKeys')[provider];
  }

  public getAllApiKeys(): { [provider: string]: string } {
    return this.store.get('llm.apiKeys');
  }

  public deleteApiKey(provider: string): void {
    const apiKeys = this.store.get('llm.apiKeys');
    delete apiKeys[provider];
    this.store.set('llm.apiKeys', apiKeys);
  }

  // 代理配置方法
  public setVpnProviderUrl(url: string): void {
    this.store.set('proxy.vpnProviderUrl', url);
  }

  public getVpnProviderUrl(): string | undefined {
    return this.store.get('proxy.vpnProviderUrl');
  }

  public setProxyAutoStart(autoStart: boolean): void {
    this.store.set('proxy.autoStart', autoStart);
  }

  public getProxyAutoStart(): boolean {
    return this.store.get('proxy.autoStart') || false;
  }

  public setProxyConfigPath(configPath: string): void {
    this.store.set('proxy.configPath', configPath);
  }

  public getProxyConfigPath(): string | undefined {
    return this.store.get('proxy.configPath');
  }

  // 应用设置方法
  public setTheme(theme: 'light' | 'dark' | 'auto'): void {
    this.store.set('app.theme', theme);
  }

  public getTheme(): 'light' | 'dark' | 'auto' {
    return this.store.get('app.theme') || 'auto';
  }

  public setLanguage(language: string): void {
    this.store.set('app.language', language);
  }

  public getLanguage(): string {
    return this.store.get('app.language') || 'en';
  }

  public setAutoUpdate(autoUpdate: boolean): void {
    this.store.set('app.autoUpdate', autoUpdate);
  }

  public getAutoUpdate(): boolean {
    return this.store.get('app.autoUpdate') || true;
  }

  // 获取完整配置
  public getAllConfig(): AppConfig {
    return this.store.store;
  }

  // 导出配置到文件
  public exportConfig(filePath: string): void {
    const config = this.getAllConfig();
    fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  }

  // 从文件导入配置
  public importConfig(filePath: string): void {
    try {
      const configContent = fs.readFileSync(filePath, 'utf8');
      const config = JSON.parse(configContent) as AppConfig;
      
      // 验证配置结构
      if (config.llm && config.proxy && config.app) {
        this.store.set(config);
      } else {
        throw new Error('Invalid configuration file structure');
      }
    } catch (error) {
      throw new Error(`Failed to import configuration: ${error}`);
    }
  }

  // 重置配置
  public resetConfig(): void {
    this.store.clear();
  }

  // 获取配置目录路径
  public getConfigDir(): string {
    return this.configDir;
  }

  // 获取配置文件路径
  public getConfigFilePath(): string {
    return path.join(this.configDir, 'app-config.json');
  }

  // 用户偏好设置方法
  public setUserName(name: string): void {
    this.store.set('user.name', name);
  }

  public getUserName(): string | undefined {
    return this.store.get('user.name');
  }

  public setUserEmail(email: string): void {
    this.store.set('user.email', email);
  }

  public getUserEmail(): string | undefined {
    return this.store.get('user.email');
  }

  public setStartup(startup: boolean): void {
    this.store.set('app.startup', startup);
  }

  public getStartup(): boolean {
    return this.store.get('app.startup') || false;
  }

  public setMinimizeToTray(minimize: boolean): void {
    this.store.set('app.minimizeToTray', minimize);
  }

  public getMinimizeToTray(): boolean {
    return this.store.get('app.minimizeToTray') || false;
  }

  public setNotifications(enabled: boolean): void {
    this.store.set('app.notifications', enabled);
  }

  public getNotifications(): boolean {
    return this.store.get('app.notifications') || true;
  }

  // 使用统计方法
  public incrementProxyUsage(): void {
    const stats = this.store.get('user.usageStats') || {
      proxyUsage: 0,
      chatUsage: 0,
      lastActive: new Date().toISOString()
    };
    this.store.set('user.usageStats', {
      ...stats,
      proxyUsage: (stats.proxyUsage || 0) + 1,
      lastActive: new Date().toISOString()
    });
  }

  public incrementChatUsage(): void {
    const stats = this.store.get('user.usageStats') || {
      proxyUsage: 0,
      chatUsage: 0,
      lastActive: new Date().toISOString()
    };
    this.store.set('user.usageStats', {
      ...stats,
      chatUsage: (stats.chatUsage || 0) + 1,
      lastActive: new Date().toISOString()
    });
  }

  public getUsageStats(): AppConfig['user']['usageStats'] {
    return this.store.get('user.usageStats');
  }

  // 配置备份和恢复
  public createBackup(): string {
    const config = this.getAllConfig();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.configDir, `backup-${timestamp}.json`);
    fs.writeFileSync(backupPath, JSON.stringify(config, null, 2));
    return backupPath;
  }

  public restoreFromBackup(backupPath: string): void {
    try {
      const backupContent = fs.readFileSync(backupPath, 'utf8');
      const config = JSON.parse(backupContent) as AppConfig;
      
      // 验证备份文件结构
      if (config.llm && config.proxy && config.app && config.user) {
        this.store.set(config);
      } else {
        throw new Error('Invalid backup file structure');
      }
    } catch (error) {
      throw new Error(`Failed to restore from backup: ${error}`);
    }
  }

  public getBackupFiles(): string[] {
    try {
      const files = fs.readdirSync(this.configDir);
      return files
        .filter(file => file.startsWith('backup-') && file.endsWith('.json'))
        .map(file => path.join(this.configDir, file))
        .sort((a, b) => fs.statSync(b).mtime.getTime() - fs.statSync(a).mtime.getTime());
    } catch (error) {
      return [];
    }
  }

  // 配置验证
  public validateConfig(config: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // 验证必需字段
    if (!config.llm || typeof config.llm !== 'object') {
      errors.push('LLM configuration is missing or invalid');
    }

    if (!config.proxy || typeof config.proxy !== 'object') {
      errors.push('Proxy configuration is missing or invalid');
    }

    if (!config.app || typeof config.app !== 'object') {
      errors.push('App configuration is missing or invalid');
    }

    if (!config.user || typeof config.user !== 'object') {
      errors.push('User configuration is missing or invalid');
    }

    // 验证LLM配置
    if (config.llm) {
      if (!config.llm.provider || typeof config.llm.provider !== 'string') {
        errors.push('LLM provider is missing or invalid');
      }

      if (!config.llm.model || typeof config.llm.model !== 'string') {
        errors.push('LLM model is missing or invalid');
      }

      if (!config.llm.apiKeys || typeof config.llm.apiKeys !== 'object') {
        errors.push('LLM API keys configuration is missing or invalid');
      }
    }

    // 验证应用配置
    if (config.app) {
      const validThemes = ['light', 'dark', 'auto'];
      if (config.app.theme && !validThemes.includes(config.app.theme)) {
        errors.push('Invalid theme value');
      }

      if (config.app.autoUpdate && typeof config.app.autoUpdate !== 'boolean') {
        errors.push('Auto update setting must be a boolean');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // 配置迁移
  public migrateConfig(): void {
    const config = this.getAllConfig();
    let migrated = false;

    // 迁移旧版本配置
    if (!config.user) {
      this.store.set('user', {
        usageStats: {
          proxyUsage: 0,
          chatUsage: 0,
          lastActive: new Date().toISOString()
        }
      });
      migrated = true;
    }

    if (config.app && config.app.language === 'en') {
      this.store.set('app.language', 'zh-CN');
      migrated = true;
    }

    if (config.app && !config.app.hasOwnProperty('notifications')) {
      this.store.set('app.notifications', true);
      migrated = true;
    }

    if (migrated) {
      console.log('Configuration migrated successfully');
    }
  }
}

export const configManager = ConfigManager.getInstance();
