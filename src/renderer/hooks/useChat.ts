import { useState, useCallback, useEffect } from 'react';
import { ILLMMessage, ILLMParams } from '../types/electron';

export interface ChatSettings {
  provider: string;
  model: string;
  apiKey: string;
  temperature: number;
  topP: number;
  maxTokens: number;
}

interface UseChatReturn {
  messages: ILLMMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, params: ILLMParams) => Promise<void>;
  clearMessages: () => void;
  updateSettings: (newSettings: Partial<ChatSettings>) => void;
  settings: ChatSettings;
  systemPrompt: string;
  setSystemPrompt: (prompt: string) => void;
}

const useChat = (initialSettings: Partial<ChatSettings> = {}): UseChatReturn => {
  const [messages, setMessages] = useState<ILLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [systemPrompt, setSystemPrompt] = useState<string>('You are a helpful assistant.');

  const [settings, setSettings] = useState<ChatSettings>({
    provider: '',
    model: '',
    apiKey: '',
    temperature: 0.7,
    topP: 1,
    maxTokens: 2048,
    ...initialSettings,
  });

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const result = await window.electronAPI.llm.getApiKey(settings.provider);
        if (result.success && result.data) {
          setSettings(prev => ({ ...prev, apiKey: result.data as string }));
        } else {
          setSettings(prev => ({ ...prev, apiKey: '' }));
        }
      } catch (err) {
        console.error('Failed to load API key:', err);
        setError('Failed to load API key.');
      }
    };
    if (settings.provider) {
      loadApiKey();
    }
  }, [settings.provider]);

  const sendMessage = useCallback(async (content: string, params: ILLMParams) => {
    if (!settings.apiKey) {
      setError(`API key for ${settings.provider} is not set.`);
      return;
    }

    const userMessage: ILLMMessage = { role: 'user', content };
    const currentMessages = [...messages, userMessage];
    setMessages(currentMessages);
    setIsLoading(true);
    setError(null);

    const messagesWithSystemPrompt: ILLMMessage[] = [
      { role: 'system', content: systemPrompt },
      ...messages.filter(m => m.role !== 'system'), // Remove old system messages
      userMessage,
    ];

    try {
      // 设置提供商配置
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider: settings.provider,
        baseUrl: '', // 这里应该从配置中获取
        apiKey: settings.apiKey
      });

      if (!configResult.success) {
        throw new Error(configResult.error || 'Failed to set provider config');
      }

      const request = {
        provider: settings.provider,
        model: settings.model,
        messages: messagesWithSystemPrompt,
        params,
      };

      const result = await window.electronAPI.llm.generateCompletion(request);

      if (result.success && result.data) {
        const assistantMessage: ILLMMessage = { role: 'assistant', content: result.data };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error || 'Failed to get response from LLM');
        // Revert user message on error
        setMessages(prev => prev.slice(0, -1));
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`An unexpected error occurred: ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1));
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings, messages, systemPrompt]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<ChatSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    updateSettings,
    settings,
    systemPrompt,
    setSystemPrompt,
  };
};

export default useChat;