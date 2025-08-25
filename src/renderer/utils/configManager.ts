
// LLM配置接口
export interface ILLMConfig {
  id: string;
  name: string;
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  isActive: boolean;
}

// 配置管理器类
class ConfigManager {
  private static instance: ConfigManager;
  private configs: ILLMConfig[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  // 初始化配置管理器
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.loadConfigs();
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize config manager:', error);
      throw error;
    }
  }

  // 加载配置
  private async loadConfigs(): Promise<void> {
    try {
      // 首先从localStorage加载配置
      const savedConfigs = localStorage.getItem('llmConfigs');
      let configs: ILLMConfig[] = [];

      if (savedConfigs) {
        try {
          const parsedConfigs = JSON.parse(savedConfigs);
          if (Array.isArray(parsedConfigs) && parsedConfigs.length > 0) {
            configs = parsedConfigs;
          }
        } catch (error) {
          console.error('解析LLM配置失败:', error);
        }
      }

      // 如果没有保存的配置，创建一个默认配置
      if (configs.length === 0) {
        const defaultConfig: ILLMConfig = {
          id: this.generateId(),
          name: '默认配置',
          provider: 'openai',
          model: 'gpt-3.5-turbo',
          apiKey: '',
          baseUrl: 'https://api.openai.com/v1',
          temperature: 0.7,
          maxTokens: 2048,
          topP: 1,
          systemPrompt: 'You are a helpful assistant.',
          isActive: true
        };
        configs = [defaultConfig];
        await this.saveConfigs(configs);
      }

      // 获取当前激活配置的API密钥
      const activeConfig = configs.find(config => config.isActive) || configs[0];
      if (activeConfig) {
        const apiKeyResult = await window.electronAPI.llm.getApiKey(activeConfig.provider);
        if (apiKeyResult.success && apiKeyResult.data) {
          // 更新激活配置的API密钥
          configs = configs.map(config => 
            config.isActive ? { ...config, apiKey: apiKeyResult.data } : config
          );
        }
      }

      this.configs = configs;
    } catch (error) {
      console.error('加载配置失败:', error);
      throw error;
    }
  }

  // 保存配置到localStorage和electron
  private async saveConfigs(configs: ILLMConfig[]): Promise<void> {
    try {
      // 保存到localStorage
      localStorage.setItem('llmConfigs', JSON.stringify(configs));
      
      // 保存激活的配置到electron
      const activeConfig = configs.find(config => config.isActive);
      if (activeConfig) {
        await window.electronAPI.llm.setApiKey(activeConfig.provider, activeConfig.apiKey);
        await window.electronAPI.llm.setProviderConfig({
          provider: activeConfig.provider,
          baseUrl: activeConfig.baseUrl,
          apiKey: activeConfig.apiKey
        });
        localStorage.setItem('llmBaseUrl', activeConfig.baseUrl);
      }

      this.configs = configs;
    } catch (error) {
      console.error('保存配置失败:', error);
      throw error;
    }
  }

  // 获取所有配置
  public getConfigs(): ILLMConfig[] {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }
    return [...this.configs];
  }

  // 获取激活的配置
  public getActiveConfig(): ILLMConfig | null {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }
    return this.configs.find(config => config.isActive) || null;
  }

  // 检查配置是否有效
  public isConfigValid(): boolean {
    if (!this.isInitialized) {
      return false;
    }
    
    const activeConfig = this.getActiveConfig();
    if (!activeConfig) {
      return false;
    }

    return !!(activeConfig.provider && 
             activeConfig.model && 
             activeConfig.apiKey && 
             activeConfig.baseUrl);
  }

  // 添加配置
  public async addConfig(config: Omit<ILLMConfig, 'id' | 'isActive'>): Promise<ILLMConfig> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const newConfig: ILLMConfig = {
      ...config,
      id: this.generateId(),
      isActive: this.configs.length === 0 // 第一个配置默认激活
    };

    // 如果添加的是第一个配置，激活它
    if (this.configs.length === 0) {
      this.configs = [newConfig];
    } else {
      this.configs = [...this.configs, newConfig];
    }

    await this.saveConfigs(this.configs);
    return newConfig;
  }

  // 更新配置
  public async updateConfig(id: string, updates: Partial<ILLMConfig>): Promise<ILLMConfig | null> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const configIndex = this.configs.findIndex(config => config.id === id);
    if (configIndex === -1) {
      return null;
    }

    const updatedConfig = { ...this.configs[configIndex], ...updates };
    const newConfigs = [...this.configs];
    newConfigs[configIndex] = updatedConfig;

    // 如果更新的是激活状态，需要处理其他配置的激活状态
    if (updates.isActive && updates.isActive) {
      newConfigs.forEach(config => {
        if (config.id !== id) {
          config.isActive = false;
        }
      });
    }

    await this.saveConfigs(newConfigs);
    return updatedConfig;
  }

  // 删除配置
  public async deleteConfig(id: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const configToDelete = this.configs.find(c => c.id === id);
    if (!configToDelete) {
      return false;
    }

    // 如果删除的是激活的配置，激活另一个配置
    const newConfigs = this.configs.filter(config => config.id !== id);
    if (configToDelete.isActive && newConfigs.length > 0) {
      newConfigs[0].isActive = true;
    }

    await this.saveConfigs(newConfigs);
    return true;
  }

  // 设置激活配置
  public async setActiveConfig(id: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const configExists = this.configs.some(config => config.id === id);
    if (!configExists) {
      return false;
    }

    const newConfigs = this.configs.map(config => ({
      ...config,
      isActive: config.id === id
    }));

    await this.saveConfigs(newConfigs);
    return true;
  }

  // 获取用于LLM调用的配置
  public getLLMRequestConfig(): {
    provider: string;
    model: string;
    apiKey: string;
    baseUrl: string;
    temperature: number;
    maxTokens: number;
    topP: number;
    systemPrompt: string;
  } | null {
    if (!this.isInitialized || !this.isConfigValid()) {
      return null;
    }

    const activeConfig = this.getActiveConfig();
    if (!activeConfig) {
      return null;
    }

    return {
      provider: activeConfig.provider,
      model: activeConfig.model,
      apiKey: activeConfig.apiKey,
      baseUrl: activeConfig.baseUrl,
      temperature: activeConfig.temperature,
      maxTokens: activeConfig.maxTokens,
      topP: activeConfig.topP,
      systemPrompt: activeConfig.systemPrompt
    };
  }

  // 生成唯一ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 刷新配置（重新从localStorage和electron加载）
  public async refresh(): Promise<void> {
    await this.loadConfigs();
  }
}

// 导出单例实例
export const configManager = ConfigManager.getInstance();

// 导出初始化函数
export const initializeConfigManager = async (): Promise<void> => {
  await configManager.initialize();
};

// 导出类型
export type { ILLMConfig };