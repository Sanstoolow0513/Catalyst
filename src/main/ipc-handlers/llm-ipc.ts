import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { llmService } from '../services/llm-service';
import { apiKeyManager } from '../services/api-key-manager';
import { LLMMessage, LLMParams } from '../services/llm-service';

// 定义生成补全请求的参数类型
interface GenerateCompletionRequest {
  provider: string;
  model: string;
  messages: LLMMessage[];
  params?: LLMParams;
}

// 定义设置API密钥请求的参数类型
interface SetApiKeyRequest {
  provider: string;
  apiKey: string;
}

// 定义设置提供商配置的参数类型
interface SetProviderConfigRequest {
  provider: string;
  baseUrl: string;
  apiKey: string;
  defaultHeaders?: Record<string>;
}

export function registerLlmIpcHandlers() {
  // 生成LLM补全
  ipcMain.handle(IPC_EVENTS.LLM_GENERATE_COMPLETION, async (_event: IpcMainInvokeEvent, request: GenerateCompletionRequest) => {
    try {
      const { provider, model, messages, params = {} } = request;
      const result = await llmService.generateCompletion(provider, model, messages, params);
      return { success: true, data: result };
    } catch (error) {
      console.error('Failed to generate LLM completion:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 设置API密钥
  ipcMain.handle(IPC_EVENTS.LLM_SET_API_KEY, async (_event: IpcMainInvokeEvent, request: SetApiKeyRequest) => {
    try {
      const { provider, apiKey } = request;
      apiKeyManager.setApiKey(provider, apiKey);
      return { success: true };
    } catch (error) {
      console.error('Failed to set API key:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取API密钥
  ipcMain.handle(IPC_EVENTS.LLM_GET_API_KEY, async (_event: IpcMainInvokeEvent, provider: string) => {
    try {
      const apiKey = apiKeyManager.getApiKey(provider);
      return { success: true, data: apiKey };
    } catch (error) {
      console.error('Failed to get API key:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取所有API密钥
  ipcMain.handle(IPC_EVENTS.LLM_GET_ALL_API_KEYS, async () => {
    try {
      const apiKeys = apiKeyManager.getAllApiKeys();
      return { success: true, data: apiKeys };
    } catch (error) {
      console.error('Failed to get all API keys:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 删除API密钥
  ipcMain.handle(IPC_EVENTS.LLM_DELETE_API_KEY, async (_event: IpcMainInvokeEvent, provider: string) => {
    try {
      apiKeyManager.deleteApiKey(provider);
      return { success: true };
    } catch (error) {
      console.error('Failed to delete API key:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 设置提供商配置
  ipcMain.handle(IPC_EVENTS.LLM_SET_PROVIDER_CONFIG, async (_event: IpcMainInvokeEvent, request: SetProviderConfigRequest) => {
    try {
      const { provider, baseUrl, apiKey, defaultHeaders } = request;
      llmService.setProviderConfig(provider, { baseUrl, apiKey, defaultHeaders });
      
      // 如果设置了API密钥，也保存到API密钥管理器中
      if (apiKey) {
        apiKeyManager.setApiKey(provider, apiKey);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Failed to set provider config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取提供商配置
  ipcMain.handle(IPC_EVENTS.LLM_GET_PROVIDER_CONFIG, async (_event: IpcMainInvokeEvent, provider: string) => {
    try {
      const config = llmService.getProviderConfig(provider);
      return { success: true, data: config };
    } catch (error) {
      console.error('Failed to get provider config:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取提供商列表
  ipcMain.handle(IPC_EVENTS.LLM_GET_PROVIDERS, async () => {
    try {
      const providers = llmService.getProviders();
      return { success: true, data: providers };
    } catch (error) {
      console.error('Failed to get LLM providers:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  // 获取模型列表
  ipcMain.handle(IPC_EVENTS.LLM_GET_MODELS, async (_event: IpcMainInvokeEvent, provider: string) => {
    try {
      const models = llmService.getModels(provider);
      return { success: true, data: models };
    } catch (error) {
      console.error('Failed to get LLM models:', error);
      return { success: false, error: (error as Error).message };
    }
  });
}