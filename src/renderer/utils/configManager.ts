
// 导入提供商配置
import { 
  getProviderById, 
  getProviderDefaults
} from '../data/llmProviders';
import { IChatHistory } from '@types/electron';

// 快捷工具配置接口
export interface IQuickTool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  color: string;
  category: 'frequent' | 'recent' | 'recommended' | 'custom';
  action: {
    type: 'navigate' | 'command' | 'link' | 'function';
    value: string;
    params?: Record<string, any>;
  };
  isCustom?: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
}

// 扩展的LLM配置接口
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
  topK?: number;
  frequencyPenalty?: number;
  presencePenalty?: number;
  systemPrompt: string;
  isActive: boolean;
  
  // 新增高级配置
  thinkingMode: boolean;
  thinkingTokens?: number;
  streamOutput: boolean;
  timeout: number;
  retryAttempts: number;
  costOptimization: boolean;
  advancedParams: Record<string, any>;
  
  // 元数据
  createdAt: string;
  updatedAt: string;
  lastUsed?: string;
  usageCount: number;
  
  // 提供商特定配置
  providerConfig?: {
    apiVersion?: string;
    organization?: string;
    project?: string;
    region?: string;
  };
}

// 配置管理器类
class ConfigManager {
  private static instance: ConfigManager;
  private configs: ILLMConfig[] = [];
  private quickTools: IQuickTool[] = [];
  private chatHistories: IChatHistory[] = [];
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

      // 加载快捷工具配置
      const savedQuickTools = localStorage.getItem('quickTools');
      let quickTools: IQuickTool[] = [];

      if (savedQuickTools) {
        try {
          const parsedQuickTools = JSON.parse(savedQuickTools);
          if (Array.isArray(parsedQuickTools)) {
            quickTools = parsedQuickTools;
          }
        } catch (error) {
          console.error('解析快捷工具配置失败:', error);
        }
      }

      // 加载聊天历史配置
      const savedChatHistories = localStorage.getItem('chatHistories');
      let chatHistories: IChatHistory[] = [];

      if (savedChatHistories) {
        try {
          const parsedChatHistories = JSON.parse(savedChatHistories);
          if (Array.isArray(parsedChatHistories)) {
            chatHistories = parsedChatHistories;
          }
        } catch (error) {
          console.error('解析聊天历史配置失败:', error);
        }
      }

      // 如果没有保存的快捷工具，创建默认工具
      if (quickTools.length === 0) {
        quickTools = this.getDefaultQuickTools();
        await this.saveQuickTools(quickTools);
      }

      this.configs = configs;
      this.quickTools = quickTools;
      this.chatHistories = chatHistories;

      // 如果没有保存的配置，创建一个默认配置
      if (configs.length === 0) {
        const providerDefaults = getProviderDefaults('openai');
        const now = new Date().toISOString();
        
        const defaultConfig: ILLMConfig = {
          id: this.generateId(),
          name: '默认配置',
          provider: 'openai',
          model: providerDefaults.model || 'gpt-3.5-turbo',
          apiKey: '',
          baseUrl: providerDefaults.baseUrl || 'https://api.openai.com/v1',
          temperature: providerDefaults.temperature || 0.7,
          maxTokens: providerDefaults.maxTokens || 2048,
          topP: providerDefaults.topP || 1,
          topK: providerDefaults.topK,
          frequencyPenalty: providerDefaults.frequencyPenalty,
          presencePenalty: providerDefaults.presencePenalty,
          systemPrompt: providerDefaults.systemPrompt || 'You are a helpful assistant.',
          isActive: true,
          
          // 新增高级配置
          thinkingMode: providerDefaults.thinkingMode || false,
          thinkingTokens: providerDefaults.thinkingTokens,
          streamOutput: providerDefaults.streamOutput || true,
          timeout: providerDefaults.timeout || 30000,
          retryAttempts: providerDefaults.retryAttempts || 3,
          costOptimization: providerDefaults.costOptimization || false,
          advancedParams: providerDefaults.advancedParams || {},
          
          // 元数据
          createdAt: now,
          updatedAt: now,
          usageCount: 0,
          
          // 提供商特定配置
          providerConfig: {}
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

    // 基础验证
    const basicValid = !!(activeConfig.provider && 
                         activeConfig.model && 
                         activeConfig.apiKey && 
                         activeConfig.baseUrl);

    if (!basicValid) {
      return false;
    }

    // 提供商特定验证
    const provider = getProviderById(activeConfig.provider);
    if (!provider) {
      // 自定义提供商只需要基础验证
      return activeConfig.provider === 'custom';
    }

    // 检查模型是否存在
    const modelExists = provider.models.some(model => model.id === activeConfig.model);
    if (!modelExists) {
      return false;
    }

    // 检查必需参数
    const requiredParams = provider.parameters.filter(param => param.required);
    for (const param of requiredParams) {
      const configValue = activeConfig[param.key as keyof ILLMConfig];
      if (configValue === undefined || configValue === null || configValue === '') {
        return false;
      }
    }

    return true;
  }

  // 添加配置
  public async addConfig(config: Omit<ILLMConfig, 'id' | 'isActive'>): Promise<ILLMConfig> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const now = new Date().toISOString();
    
    // 获取提供商默认值
    const providerDefaults = getProviderDefaults(config.provider);
    
    const newConfig: ILLMConfig = {
      ...config,
      id: this.generateId(),
      isActive: this.configs.length === 0, // 第一个配置默认激活
      
      // 合并提供商默认值
      baseUrl: config.baseUrl || providerDefaults.baseUrl || '',
      temperature: config.temperature ?? providerDefaults.temperature ?? 0.7,
      maxTokens: config.maxTokens ?? providerDefaults.maxTokens ?? 2048,
      topP: config.topP ?? providerDefaults.topP ?? 1,
      topK: config.topK ?? providerDefaults.topK,
      frequencyPenalty: config.frequencyPenalty ?? providerDefaults.frequencyPenalty,
      presencePenalty: config.presencePenalty ?? providerDefaults.presencePenalty,
      systemPrompt: config.systemPrompt || providerDefaults.systemPrompt || 'You are a helpful assistant.',
      
      // 新增高级配置
      thinkingMode: config.thinkingMode ?? providerDefaults.thinkingMode ?? false,
      thinkingTokens: config.thinkingTokens ?? providerDefaults.thinkingTokens,
      streamOutput: config.streamOutput ?? providerDefaults.streamOutput ?? true,
      timeout: config.timeout ?? providerDefaults.timeout ?? 30000,
      retryAttempts: config.retryAttempts ?? providerDefaults.retryAttempts ?? 3,
      costOptimization: config.costOptimization ?? providerDefaults.costOptimization ?? false,
      advancedParams: config.advancedParams || providerDefaults.advancedParams || {},
      
      // 元数据
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      
      // 提供商特定配置
      providerConfig: config.providerConfig || {}
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

    // 如果更改了提供商，获取新提供商的默认值
    let providerDefaults = {};
    if (updates.provider && updates.provider !== this.configs[configIndex].provider) {
      providerDefaults = getProviderDefaults(updates.provider);
    }

    const updatedConfig = { 
      ...this.configs[configIndex], 
      ...updates,
      // 更新时间戳
      updatedAt: new Date().toISOString(),
      
      // 合并提供商默认值（如果更改了提供商）
      ...(updates.provider && {
        baseUrl: updates.baseUrl || providerDefaults.baseUrl || '',
        temperature: updates.temperature ?? providerDefaults.temperature ?? 0.7,
        maxTokens: updates.maxTokens ?? providerDefaults.maxTokens ?? 2048,
        topP: updates.topP ?? providerDefaults.topP ?? 1,
        topK: updates.topK ?? providerDefaults.topK,
        frequencyPenalty: updates.frequencyPenalty ?? providerDefaults.frequencyPenalty,
        presencePenalty: updates.presencePenalty ?? providerDefaults.presencePenalty,
        thinkingMode: updates.thinkingMode ?? providerDefaults.thinkingMode ?? false,
        streamOutput: updates.streamOutput ?? providerDefaults.streamOutput ?? true,
      })
    };
    
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
    topK?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    systemPrompt: string;
    thinkingMode: boolean;
    thinkingTokens?: number;
    streamOutput: boolean;
    timeout: number;
    retryAttempts: number;
    advancedParams: Record<string, any>;
  } | null {
    if (!this.isInitialized || !this.isConfigValid()) {
      return null;
    }

    const activeConfig = this.getActiveConfig();
    if (!activeConfig) {
      return null;
    }

    // 更新使用统计
    activeConfig.lastUsed = new Date().toISOString();
    activeConfig.usageCount += 1;
    this.saveConfigs(this.configs).catch(err => {
      console.warn('Failed to update usage stats:', err);
    });

    return {
      provider: activeConfig.provider,
      model: activeConfig.model,
      apiKey: activeConfig.apiKey,
      baseUrl: activeConfig.baseUrl,
      temperature: activeConfig.temperature,
      maxTokens: activeConfig.maxTokens,
      topP: activeConfig.topP,
      topK: activeConfig.topK,
      frequencyPenalty: activeConfig.frequencyPenalty,
      presencePenalty: activeConfig.presencePenalty,
      systemPrompt: activeConfig.systemPrompt,
      thinkingMode: activeConfig.thinkingMode,
      thinkingTokens: activeConfig.thinkingTokens,
      streamOutput: activeConfig.streamOutput,
      timeout: activeConfig.timeout,
      retryAttempts: activeConfig.retryAttempts,
      advancedParams: activeConfig.advancedParams
    };
  }

  // 获取默认快捷工具
  private getDefaultQuickTools(): IQuickTool[] {
    const now = new Date().toISOString();
    return [
      {
        id: this.generateId(),
        name: 'AI 对话',
        description: '与AI助手开始智能对话',
        iconName: 'MessageSquare',
        color: '#8B5CF6',
        category: 'frequent',
        action: {
          type: 'navigate',
          value: '/chat',
        },
        isCustom: false,
        order: 0,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
      {
        id: this.generateId(),
        name: '代理管理',
        description: '配置和管理代理设置',
        iconName: 'Settings',
        color: '#3B82F6',
        category: 'frequent',
        action: {
          type: 'navigate',
          value: '/proxy-management',
        },
        isCustom: false,
        order: 1,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
      {
        id: this.generateId(),
        name: '开发环境',
        description: '部署开发工具和环境',
        iconName: 'Code',
        color: '#10B981',
        category: 'recent',
        action: {
          type: 'navigate',
          value: '/dev-environment',
        },
        isCustom: false,
        order: 2,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
      {
        id: this.generateId(),
        name: '终端',
        description: '打开系统终端',
        iconName: 'SquareTerminal',
        color: '#F59E0B',
        category: 'recommended',
        action: {
          type: 'command',
          value: 'terminal',
        },
        isCustom: false,
        order: 3,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
      {
        id: this.generateId(),
        name: '浏览器',
        description: '打开内置浏览器',
        iconName: 'ExternalLink',
        color: '#EF4444',
        category: 'recommended',
        action: {
          type: 'navigate',
          value: '/browser',
        },
        isCustom: false,
        order: 4,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
      {
        id: this.generateId(),
        name: '下载管理',
        description: '管理下载任务',
        iconName: 'Download',
        color: '#8B5CF6',
        category: 'recent',
        action: {
          type: 'navigate',
          value: '/downloads',
        },
        isCustom: false,
        order: 5,
        createdAt: now,
        updatedAt: now,
        usageCount: 0,
      },
    ];
  }

  // 保存快捷工具
  private async saveQuickTools(quickTools: IQuickTool[]): Promise<void> {
    try {
      localStorage.setItem('quickTools', JSON.stringify(quickTools));
      this.quickTools = quickTools;
    } catch (error) {
      console.error('保存快捷工具失败:', error);
      throw error;
    }
  }

  // 生成唯一ID
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  // 获取所有快捷工具
  public getQuickTools(): IQuickTool[] {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }
    return [...this.quickTools].sort((a, b) => a.order - b.order);
  }

  // 添加快捷工具
  public async addQuickTool(tool: Omit<IQuickTool, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>): Promise<IQuickTool> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const now = new Date().toISOString();
    const newTool: IQuickTool = {
      ...tool,
      id: this.generateId(),
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
    };

    this.quickTools = [...this.quickTools, newTool];
    await this.saveQuickTools(this.quickTools);
    return newTool;
  }

  // 更新快捷工具
  public async updateQuickTool(id: string, updates: Partial<IQuickTool>): Promise<IQuickTool | null> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const toolIndex = this.quickTools.findIndex(tool => tool.id === id);
    if (toolIndex === -1) {
      return null;
    }

    const updatedTool = { 
      ...this.quickTools[toolIndex], 
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    const newTools = [...this.quickTools];
    newTools[toolIndex] = updatedTool;

    await this.saveQuickTools(newTools);
    return updatedTool;
  }

  // 删除快捷工具
  public async deleteQuickTool(id: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const toolToDelete = this.quickTools.find(tool => tool.id === id);
    if (!toolToDelete || !toolToDelete.isCustom) {
      return false; // 只能删除自定义工具
    }

    const newTools = this.quickTools.filter(tool => tool.id !== id);
    await this.saveQuickTools(newTools);
    return true;
  }

  // 重新排序快捷工具
  public async reorderQuickTools(toolIds: string[]): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const newTools = this.quickTools.map(tool => {
      const newOrder = toolIds.indexOf(tool.id);
      return {
        ...tool,
        order: newOrder === -1 ? tool.order : newOrder,
      };
    });

    await this.saveQuickTools(newTools);
  }

  // 增加工具使用次数
  public async incrementToolUsage(id: string): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const tool = this.quickTools.find(tool => tool.id === id);
    if (tool) {
      tool.usageCount += 1;
      tool.lastUsed = new Date().toISOString();
      await this.saveQuickTools(this.quickTools);
    }
  }

  // 刷新配置（重新从localStorage和electron加载）
  public async refresh(): Promise<void> {
    await this.loadConfigs();
  }

  // ========== 聊天历史管理方法 ==========

  // 获取所有聊天历史
  public getChatHistories(): IChatHistory[] {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }
    return [...this.chatHistories].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  // 获取单个聊天历史
  public getChatHistory(id: string): IChatHistory | null {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }
    return this.chatHistories.find(history => history.id === id) || null;
  }

  // 创建新的聊天历史
  public async createChatHistory(title?: string): Promise<IChatHistory> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const now = new Date().toISOString();
    const activeConfig = this.getActiveConfig();
    
    const newChatHistory: IChatHistory = {
      id: this.generateId(),
      title: title || `新对话 ${this.chatHistories.length + 1}`,
      messages: [],
      createdAt: now,
      updatedAt: now,
      messageCount: 0,
      config: activeConfig ? {
        provider: activeConfig.provider,
        model: activeConfig.model,
        systemPrompt: activeConfig.systemPrompt
      } : undefined
    };

    this.chatHistories = [newChatHistory, ...this.chatHistories];
    await this.saveChatHistories();
    return newChatHistory;
  }

  // 更新聊天历史
  public async updateChatHistory(id: string, updates: Partial<IChatHistory>): Promise<IChatHistory | null> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const historyIndex = this.chatHistories.findIndex(history => history.id === id);
    if (historyIndex === -1) {
      return null;
    }

    const updatedHistory = { 
      ...this.chatHistories[historyIndex], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    // 如果更新了消息列表，更新消息数量和最后消息
    if (updates.messages) {
      updatedHistory.messageCount = updates.messages.length;
      const lastMessage = updates.messages[updates.messages.length - 1];
      if (lastMessage) {
        updatedHistory.lastMessage = lastMessage.content.substring(0, 100) + (lastMessage.content.length > 100 ? '...' : '');
      }
    }
    
    const newHistories = [...this.chatHistories];
    newHistories[historyIndex] = updatedHistory;

    await this.saveChatHistories(newHistories);
    return updatedHistory;
  }

  // 删除聊天历史
  public async deleteChatHistory(id: string): Promise<boolean> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const historyToDelete = this.chatHistories.find(history => history.id === id);
    if (!historyToDelete) {
      return false;
    }

    const newHistories = this.chatHistories.filter(history => history.id !== id);
    await this.saveChatHistories(newHistories);
    return true;
  }

  // 重命名聊天历史
  public async renameChatHistory(id: string, newTitle: string): Promise<boolean> {
    const result = await this.updateChatHistory(id, { title: newTitle });
    return result !== null;
  }

  // 清空所有聊天历史
  public async clearAllChatHistories(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    this.chatHistories = [];
    await this.saveChatHistories(this.chatHistories);
  }

  // 搜索聊天历史
  public searchChatHistories(query: string): IChatHistory[] {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const lowercaseQuery = query.toLowerCase();
    return this.chatHistories.filter(history => 
      history.title.toLowerCase().includes(lowercaseQuery) ||
      history.lastMessage?.toLowerCase().includes(lowercaseQuery) ||
      history.messages.some(msg => msg.content.toLowerCase().includes(lowercaseQuery))
    );
  }

  // 保存聊天历史到localStorage
  private async saveChatHistories(histories?: IChatHistory[]): Promise<void> {
    try {
      const historiesToSave = histories || this.chatHistories;
      localStorage.setItem('chatHistories', JSON.stringify(historiesToSave));
      if (histories) {
        this.chatHistories = histories;
      }
    } catch (error) {
      console.error('保存聊天历史失败:', error);
      throw error;
    }
  }

  // 自动保存聊天历史
  public async autoSaveChatHistory(chatHistoryId: string, messages: ILLMMessage[]): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('ConfigManager not initialized');
    }

    const history = this.getChatHistory(chatHistoryId);
    if (!history) {
      console.warn('Chat history not found for auto-save:', chatHistoryId);
      return;
    }

    await this.updateChatHistory(chatHistoryId, { messages });
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