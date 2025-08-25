import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { configManager, initializeConfigManager, ILLMConfig } from '../utils/configManager';

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
    systemPrompt: string;
  } | null;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
}

export const ConfigProvider: React.FC<ConfigProviderProps> = ({ children }) => {
  const [llmConfigs, setLlmConfigs] = useState<ILLMConfig[]>([]);
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshConfigs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await initializeConfigManager();
      const configs = configManager.getConfigs();
      setLlmConfigs(configs);
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