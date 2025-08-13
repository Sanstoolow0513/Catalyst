import { ipcMain, IpcMainInvokeEvent } from 'electron';
import { IPC_EVENTS } from '../../shared/ipc-events';
import { llmService } from '../services/llm-service';
import { apiKeyManager } from '../services/api-key-manager';
import { LLMMessage, LLMParams } from '../services/llm-service';

// 定义生成补全请求的参数类型
interface GenerateCompletionRequest {
  provider: 'openai';
  model: string;
  messages: LLMMessage[];
  params?: LLMParams;
}

// 定义设置API密钥请求的参数类型
interface SetApiKeyRequest {
  provider: string;
  apiKey: string;
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
}