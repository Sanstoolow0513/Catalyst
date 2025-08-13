import Store from 'electron-store';

// 定义存储的数据结构类型
type ApiKeyStore = {
  apiKeys: {
    [provider: string]: string;
  };
};

class ApiKeyManager {
  private static instance: ApiKeyManager;
  private store: Store<ApiKeyStore>;

  private constructor() {
    this.store = new Store<ApiKeyStore>({
      name: 'api-key-storage',
      defaults: {
        apiKeys: {},
      },
    });
  }

  public static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  public setApiKey(provider: string, apiKey: string): void {
    const currentKeys = this.store.get('apiKeys');
    this.store.set('apiKeys', {
      ...currentKeys,
      [provider]: apiKey,
    });
  }

  public getApiKey(provider: string): string | undefined {
    return this.store.get('apiKeys')[provider];
  }

  public getAllApiKeys(): { [provider: string]: string } {
    return this.store.get('apiKeys');
  }

  public deleteApiKey(provider: string): void {
    const currentKeys = this.store.get('apiKeys');
    delete currentKeys[provider];
    this.store.set('apiKeys', currentKeys);
  }
}

export const apiKeyManager = ApiKeyManager.getInstance();