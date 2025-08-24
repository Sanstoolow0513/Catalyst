import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { v4 as uuidv4 } from 'uuid';
import ModelConfigPanel from '../components/ModelConfigPanel';
import ChatArea from '../components/ChatArea';
import { ChatConfig, ChatMessage, ChatSession } from '../types/chat';
import { CONFIG_TEMPLATES, validateConfig } from '../utils/modelPresets';
import { ILLMMessage, ILLMParams } from '../types/electron';

const PageContainer = styled.div`
  height: 100vh;
  padding: 20px;
  display: flex;
  gap: 20px;
  background: ${props => props.theme.background};
  box-sizing: border-box;
`;

const EnhancedChatPage: React.FC = () => {
  // 聊天状态
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 配置状态
  const [config, setConfig] = useState<ChatConfig>({
    provider: '',
    model: '',
    baseUrl: '',
    apiKey: '',
    temperature: 0.7,
    maxTokens: 2048,
    topP: 1,
    systemPrompt: 'You are a helpful assistant.',
    contextLength: 10,
    showTokenCount: true,
    autoScroll: true,
    streamResponse: false
  });

  // UI 状态
  const [isConfigCollapsed, setIsConfigCollapsed] = useState(false);

  // 初始化配置
  useEffect(() => {
    loadSavedConfig();
  }, []);

  // 加载保存的配置
  const loadSavedConfig = () => {
    try {
      const savedConfig = localStorage.getItem('enhancedChatConfig');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig(prev => ({ ...prev, ...parsed }));
      }

      const savedSession = localStorage.getItem('currentChatSession');
      if (savedSession) {
        const session = JSON.parse(savedSession);
        setCurrentSession(session);
        setMessages(session.messages || []);
      }

      const savedCollapsed = localStorage.getItem('configPanelCollapsed');
      if (savedCollapsed) {
        setIsConfigCollapsed(JSON.parse(savedCollapsed));
      }
    } catch (error) {
      console.error('Failed to load saved config:', error);
    }
  };

  // 保存配置
  const saveConfig = useCallback((newConfig: ChatConfig) => {
    localStorage.setItem('enhancedChatConfig', JSON.stringify(newConfig));
  }, []);

  // 保存会话
  const saveSession = useCallback((session: ChatSession) => {
    localStorage.setItem('currentChatSession', JSON.stringify(session));
  }, []);

  // 处理配置变更
  const handleConfigChange = useCallback((newConfig: ChatConfig) => {
    setConfig(newConfig);
    saveConfig(newConfig);
  }, [saveConfig]);

  // 处理配置面板折叠
  const handleConfigCollapse = useCallback((collapsed: boolean) => {
    setIsConfigCollapsed(collapsed);
    localStorage.setItem('configPanelCollapsed', JSON.stringify(collapsed));
  }, []);

  // 创建新消息
  const createMessage = (role: 'user' | 'assistant', content: string, model?: string): ChatMessage => {
    return {
      id: uuidv4(),
      role,
      content,
      timestamp: Date.now(),
      model,
      tokens: estimateTokens(content)
    };
  };

  // 简单的token估算
  const estimateTokens = (text: string): number => {
    return Math.ceil(text.length / 4);
  };

  // 发送消息
  const handleSendMessage = async (content: string) => {
    const validation = validateConfig(config);
    if (!validation.isValid) {
      setError('配置不完整，请检查必填项');
      return;
    }

    const userMessage = createMessage('user', content);
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      // 设置提供商配置
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider: config.provider,
        baseUrl: config.baseUrl,
        apiKey: config.apiKey
      });

      if (!configResult.success) {
        throw new Error(configResult.error || 'Failed to set provider config');
      }

      // 保存API密钥
      await window.electronAPI.llm.setApiKey(config.provider, config.apiKey);

      // 准备消息上下文
      const contextMessages = [
        { role: 'system' as const, content: config.systemPrompt },
        ...newMessages.slice(-config.contextLength).map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ];

      // 发送请求
      const params: ILLMParams = {
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        top_p: config.topP,
      };

      const request = {
        provider: config.provider,
        model: config.model,
        messages: contextMessages,
        params,
      };

      const result = await window.electronAPI.llm.generateCompletion(request);

      if (result.success && result.data) {
        const assistantMessage = createMessage('assistant', result.data, config.model);
        const finalMessages = [...newMessages, assistantMessage];
        setMessages(finalMessages);

        // 更新或创建会话
        const session: ChatSession = {
          id: currentSession?.id || uuidv4(),
          title: currentSession?.title || generateSessionTitle(content),
          messages: finalMessages,
          config: { ...config },
          createdAt: currentSession?.createdAt || Date.now(),
          updatedAt: Date.now()
        };

        setCurrentSession(session);
        saveSession(session);
      } else {
        throw new Error(result.error || 'Failed to get response from LLM');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`发送消息失败: ${errorMessage}`);
      // 移除用户消息
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  // 生成会话标题
  const generateSessionTitle = (firstMessage: string): string => {
    const title = firstMessage.length > 30 
      ? firstMessage.substring(0, 30) + '...' 
      : firstMessage;
    return title;
  };

  // 清空消息
  const handleClearMessages = () => {
    setMessages([]);
    setError(null);
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        messages: [],
        updatedAt: Date.now()
      };
      setCurrentSession(updatedSession);
      saveSession(updatedSession);
    }
  };

  // 导出聊天记录
  const handleExportChat = () => {
    if (messages.length === 0) return;

    const exportData = {
      session: currentSession,
      messages,
      config: {
        model: config.model,
        provider: config.provider,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      },
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PageContainer>
      <ModelConfigPanel
        config={config}
        onChange={handleConfigChange}
        isCollapsed={isConfigCollapsed}
        onCollapse={handleConfigCollapse}
      />
      
      <ChatArea
        messages={messages}
        config={config}
        isLoading={isLoading}
        error={error}
        onSendMessage={handleSendMessage}
        onClearMessages={handleClearMessages}
        onExportChat={handleExportChat}
      />
    </PageContainer>
  );
};

export default EnhancedChatPage;