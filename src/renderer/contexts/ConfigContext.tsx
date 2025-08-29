import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { configManager, initializeConfigManager, ILLMConfig, IQuickTool } from '../utils/configManager';
import { IChatHistory } from '@types/electron';

interface ConfigContextType {
  llmConfigs: ILLMConfig[];
  activeConfig: ILLMConfig | null;
  isConfigValid: boolean;
  isLoading: boolean;
  error: string | null;
  refreshConfigs: () => Promise<void>;
  addConfig: (config: Omit<ILLMConfig, 'id' | 'isActive'>) => Promise<ILLMConfig>;
  updateConfig: (id: string, updates: Partial<ILLMConfig>) => Promise<ILLMConfig | null>;
  deleteConfig: (id: string) => Promise<boolean>;
  setActiveConfig: (id: string) => Promise<boolean>;
  getLLMRequestConfig: () => {
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
  } | null;
  // 快捷工具管理
  quickTools: IQuickTool[];
  addQuickTool: (tool: Omit<IQuickTool, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => Promise<IQuickTool>;
  updateQuickTool: (id: string, updates: Partial<IQuickTool>) => Promise<IQuickTool | null>;
  deleteQuickTool: (id: string) => Promise<boolean>;
  reorderQuickTools: (toolIds: string[]) => Promise<void>;
  incrementToolUsage: (id: string) => Promise<void>;
  // 聊天历史管理
  chatHistories: IChatHistory[];
  createChatHistory: (title?: string) => Promise<IChatHistory>;
  updateChatHistory: (id: string, updates: Partial<IChatHistory>) => Promise<IChatHistory | null>;
  deleteChatHistory: (id: string) => Promise<boolean>;
  renameChatHistory: (id: string, newTitle: string) => Promise<boolean>;
  clearAllChatHistories: () => Promise<void>;
  searchChatHistories: (query: string) => IChatHistory[];
  autoSaveChatHistory: (chatHistoryId: string, messages: any[]) => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [llmConfigs, setLlmConfigs] = useState<ILLMConfig[]>([]);
  const [quickTools, setQuickTools] = useState<IQuickTool[]>([]);
  const [chatHistories, setChatHistories] = useState<IChatHistory[]>([]);
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConfigs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initializeConfigManager();
      const configs = configManager.getConfigs();
      const tools = configManager.getQuickTools();
      const histories = configManager.getChatHistories();
      setLlmConfigs(configs);
      setQuickTools(tools);
      setChatHistories(histories);
      setIsConfigValid(configManager.isConfigValid());
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load configs';
      setError(errorMessage);
      setIsConfigValid(false);
    } finally {
      setIsLoading(false);
    }
  };

  const addConfig = async (config: Omit<ILLMConfig, 'id' | 'isActive'>) => {
    try {
      const newConfig = await configManager.addConfig(config);
      await refreshConfigs();
      return newConfig;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add config';
      setError(errorMessage);
      throw err;
    }
  };

  const updateConfig = async (id: string, updates: Partial<ILLMConfig>) => {
    try {
      const updatedConfig = await configManager.updateConfig(id, updates);
      await refreshConfigs();
      return updatedConfig;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update config';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteConfig = async (id: string) => {
    try {
      const result = await configManager.deleteConfig(id);
      await refreshConfigs();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete config';
      setError(errorMessage);
      throw err;
    }
  };

  const setActiveConfig = async (id: string) => {
    try {
      const result = await configManager.setActiveConfig(id);
      await refreshConfigs();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to set active config';
      setError(errorMessage);
      throw err;
    }
  };

  const getLLMRequestConfig = () => {
    return configManager.getLLMRequestConfig();
  };

  // 快捷工具管理方法
  const addQuickTool = async (tool: Omit<IQuickTool, 'id' | 'createdAt' | 'updatedAt' | 'usageCount'>) => {
    try {
      const newTool = await configManager.addQuickTool(tool);
      await refreshConfigs();
      return newTool;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add quick tool';
      setError(errorMessage);
      throw err;
    }
  };

  const updateQuickTool = async (id: string, updates: Partial<IQuickTool>) => {
    try {
      const updatedTool = await configManager.updateQuickTool(id, updates);
      await refreshConfigs();
      return updatedTool;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update quick tool';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteQuickTool = async (id: string) => {
    try {
      const result = await configManager.deleteQuickTool(id);
      await refreshConfigs();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete quick tool';
      setError(errorMessage);
      throw err;
    }
  };

  const reorderQuickTools = async (toolIds: string[]) => {
    try {
      await configManager.reorderQuickTools(toolIds);
      await refreshConfigs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reorder quick tools';
      setError(errorMessage);
      throw err;
    }
  };

  const incrementToolUsage = async (id: string) => {
    try {
      await configManager.incrementToolUsage(id);
      await refreshConfigs();
    } catch (err) {
      console.warn('Failed to increment tool usage:', err);
    }
  };

  // 聊天历史管理方法
  const createChatHistory = async (title?: string) => {
    try {
      const newHistory = await configManager.createChatHistory(title);
      await refreshConfigs();
      return newHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create chat history';
      setError(errorMessage);
      throw err;
    }
  };

  const updateChatHistory = async (id: string, updates: Partial<IChatHistory>) => {
    try {
      const updatedHistory = await configManager.updateChatHistory(id, updates);
      await refreshConfigs();
      return updatedHistory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update chat history';
      setError(errorMessage);
      throw err;
    }
  };

  const deleteChatHistory = async (id: string) => {
    try {
      const result = await configManager.deleteChatHistory(id);
      await refreshConfigs();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete chat history';
      setError(errorMessage);
      throw err;
    }
  };

  const renameChatHistory = async (id: string, newTitle: string) => {
    try {
      const result = await configManager.renameChatHistory(id, newTitle);
      await refreshConfigs();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to rename chat history';
      setError(errorMessage);
      throw err;
    }
  };

  const clearAllChatHistories = async () => {
    try {
      await configManager.clearAllChatHistories();
      await refreshConfigs();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clear chat histories';
      setError(errorMessage);
      throw err;
    }
  };

  const searchChatHistories = (query: string) => {
    return configManager.searchChatHistories(query);
  };

  const autoSaveChatHistory = async (chatHistoryId: string, messages: any[]) => {
    try {
      await configManager.autoSaveChatHistory(chatHistoryId, messages);
    } catch (err) {
      console.warn('Failed to auto-save chat history:', err);
    }
  };

  useEffect(() => {
    refreshConfigs();
  }, []);

  const activeConfig = llmConfigs.find(config => config.isActive) || null;

  const value: ConfigContextType = {
    llmConfigs,
    activeConfig,
    isConfigValid,
    isLoading,
    error,
    refreshConfigs,
    addConfig,
    updateConfig,
    deleteConfig,
    setActiveConfig,
    getLLMRequestConfig,
    quickTools,
    addQuickTool,
    updateQuickTool,
    deleteQuickTool,
    reorderQuickTools,
    incrementToolUsage,
    chatHistories,
    createChatHistory,
    updateChatHistory,
    deleteChatHistory,
    renameChatHistory,
    clearAllChatHistories,
    searchChatHistories,
    autoSaveChatHistory,
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};