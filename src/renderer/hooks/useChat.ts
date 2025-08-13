import { useState, useCallback, useEffect } from 'react'; // 导入 useEffect
import { ILLMMessage, ILLMParams } from '../types/electron';

interface ChatSettings {
  provider: string;
  model: string;
  apiKey: string;
}

interface UseChatReturn {
  messages: ILLMMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string, params: ILLMParams) => Promise<void>;
  clearMessages: () => void;
  updateSettings: (settings: ChatSettings) => void;
  settings: ChatSettings;
}

const useChat = (initialSettings: ChatSettings = {
  provider: 'openai',
  model: 'gpt-3.5-turbo',
  apiKey: ''
}): UseChatReturn => {
  const [messages, setMessages] = useState<ILLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState<ChatSettings>(initialSettings);

  // 在组件挂载时加载 API Key
  useEffect(() => {
    const loadApiKey = async () => {
      try {
        const result = await window.electronAPI.llm.getApiKey(settings.provider);
        if (result.success && result.data) {
          setSettings(prev => ({ ...prev, apiKey: result.data as string }));
        } else {
          // 如果没有 API Key，设置错误信息
          setError('Please set your API key in the settings to use LLM chat.');
        }
      } catch (err) {
        console.error('Failed to load API key:', err);
        setError('Failed to load API key. Please check settings.');
      }
    };
    loadApiKey();
  }, [settings.provider]); // 依赖于 provider，如果 provider 改变则重新加载

  const sendMessage = useCallback(async (content: string, params: ILLMParams) => {
    if (!settings.apiKey) {
      setError('Please set your API key in the settings');
      return;
    }

    const userMessage: ILLMMessage = {
      role: 'user',
      content
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const request = {
        provider: settings.provider as 'openai',
        model: settings.model,
        messages: [...messages, userMessage],
        params
      };

      const result = await window.electronAPI.llm.generateCompletion(request);
      
      if (result.success && result.data) {
        const assistantMessage: ILLMMessage = {
          role: 'assistant',
          content: result.data
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error || 'Failed to get response from LLM');
      }
    } catch (err) {
      setError('An unexpected error occurred while sending message');
      console.error('Error sending message:', err);
    } finally {
      setIsLoading(false);
    }
  }, [settings, messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const updateSettings = useCallback((newSettings: ChatSettings) => {
    setSettings(newSettings);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    updateSettings,
    settings
  };
};

export default useChat;
