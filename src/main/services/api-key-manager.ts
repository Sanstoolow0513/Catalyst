import { configManager } from './config-manager';

class ApiKeyManager {
  private static instance: ApiKeyManager;

  private constructor() {}

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  public setApiKey(provider: string, apiKey: string): void {
    configManager.setApiKey(provider, apiKey);
  }

  public getApiKey(provider: string): string | undefined {
    return configManager.getApiKey(provider);
  }

  public getAllApiKeys(): { [provider: string]: string } {
    return configManager.getAllApiKeys();
  }

  public deleteApiKey(provider: string): void {
    configManager.deleteApiKey(provider);
  }
}

export const apiKeyManager = ApiKeyManager.getInstance();
