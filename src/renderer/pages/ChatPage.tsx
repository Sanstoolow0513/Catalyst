import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  Card,
  Button,
  Input,
  Label,
  Select,
  SelectWrapper,
  FormGroup,
  StatusIndicator,
  Textarea,
  PageContainer
} from '../components/common';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { ILLMMessage, ILLMParams } from '../types/electron';
import {
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

// 页面标题组件 - 根据设计规范，具体服务页面不需要标题

// 内容区域容器
const Content = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xl};
  flex: 1;
  overflow: hidden;

  @media (max-width: 1024px) {
    gap: ${props => props.theme.spacing.lg};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.md};
  }

  @media (max-width: 480px) {
    gap: ${props => props.theme.spacing.sm};
  }
`;


// 面板头部
const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

// 面板标题
const PanelTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

// 通用区块容器
const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.xl};
`;

// 区块头部
const SectionHeader = styled.div<{ $customPadding?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: ${props => props.$customPadding ? props.theme.spacing.sm : props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surface};
  border: ${props => props.$customPadding ? 'none' : `1px solid ${props.theme.border}`};
  margin-bottom: ${props => props.theme.spacing.lg};
  transition: all ${props => props.theme.transition.fast} ease;

  &:hover {
    background-color: ${props => props.$customPadding ? 'transparent' : props.theme.surfaceVariant};
  }
`;

// 区块标题
const SectionTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

// 切换图标
const ToggleIcon = styled.div<{ $isOpen?: boolean }>`
  display: flex;
  align-items: center;
  color: ${props => props.theme.textTertiary};
  transition: transform ${props => props.theme.transition.fast} ease;
  transform: ${props => props.$isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'};
`;

// 区块内容
const SectionContent = styled.div`
  padding: 0 ${props => props.theme.spacing.md};
`;

// 配置网格
const ConfigGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;


// 提供商信息标题
const ProviderInfoTitle = styled.h4`
  margin: 0 0 ${props => props.theme.spacing.lg} 0;
  color: ${props => props.theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

// 提供商列表
const ProviderList = styled.ul`
  margin: 0;
  padding-left: ${props => props.theme.spacing.xl};
  color: ${props => props.theme.textSecondary};
`;

// 提供商列表项
const ProviderItem = styled.li`
  margin-bottom: ${props => props.theme.spacing.md};

  &:last-child {
    margin-bottom: 0;
  }
`;

// 状态消息
const StatusMessage = styled.div<{ $status?: 'success' | 'error' }>`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => {
    if (props.$status === 'success') return `${props.theme.success.main}20`;
    return props.theme.surface;
  }};
  border: 1px solid ${props => {
    if (props.$status === 'success') return `${props.theme.success.main}40`;
    return props.theme.border;
  }};
  color: ${props => {
    if (props.$status === 'success') return props.theme.success.main;
    return props.theme.textPrimary;
  }};
  font-size: 0.9rem;
  margin-top: ${props => props.theme.spacing.lg};
`;

// 状态图标
const StatusIcon = styled.div`
  display: flex;
  align-items: center;
`;


// 聊天头部
const ChatHeader = styled.div`
  padding: ${props => props.theme.spacing.lg} ${props => props.theme.spacing.xl};
  border-bottom: 1px solid ${props => props.theme.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

// 聊天标题
const ChatTitle = styled.h3`
  margin: 0;
  color: ${props => props.theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

// 聊天消息区域
const ChatMessages = styled.div`
  flex: 1;
  overflow: hidden;
`;

// 错误消息
const ErrorMessage = styled.div`
  color: ${props => props.theme.error.main};
  text-align: center;
  padding: ${props => props.theme.spacing.md};
  font-weight: 500;
`;

// 配置面板组件的Props类型定义
interface ConfigPanelProps {
  provider: string;
  model: string;
  apiKey: string;
  baseUrl: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  systemPrompt: string;
  showBasicSettings: boolean;
  showAdvancedSettings: boolean;
  showSystemPrompt: boolean;
  isConfigValid: boolean;
  onProviderChange: (provider: string) => void;
  onModelChange: (model: string) => void;
  onApiKeyChange: (apiKey: string) => void;
  onBaseUrlChange: (baseUrl: string) => void;
  onTemperatureChange: (temperature: number) => void;
  onMaxTokensChange: (maxTokens: number) => void;
  onTopPChange: (topP: number) => void;
  onSystemPromptChange: (systemPrompt: string) => void;
  onToggleBasicSettings: () => void;
  onToggleAdvancedSettings: () => void;
  onToggleSystemPrompt: () => void;
}

// 配置面板组件
const ConfigPanel: React.FC<ConfigPanelProps> = ({
  provider,
  model,
  apiKey,
  baseUrl,
  temperature,
  maxTokens,
  topP,
  systemPrompt,
  showBasicSettings,
  showAdvancedSettings,
  showSystemPrompt,
  isConfigValid,
  onProviderChange,
  onModelChange,
  onApiKeyChange,
  onBaseUrlChange,
  onTemperatureChange,
  onMaxTokensChange,
  onTopPChange,
  onSystemPromptChange,
  onToggleBasicSettings,
  onToggleAdvancedSettings,
  onToggleSystemPrompt
}) => {
  // const providerBaseUrls: Record<string, string> = {
  //   openai: 'https://api.openai.com/v1',
  //   gemini: 'https://generativelanguage.googleapis.com/v1beta',
  //   openrouter: 'https://openrouter.ai/api/v1',
  // };

  return (
    <div className="config-panel">
      <PanelHeader>
        <PanelTitle>配置设置</PanelTitle>
      </PanelHeader>

      {/* 基本配置 */}
      <Section>
        <SectionHeader onClick={onToggleBasicSettings}>
          <SectionTitle>基本配置</SectionTitle>
          <ToggleIcon $isOpen={showBasicSettings}>
            {showBasicSettings ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
          </ToggleIcon>
        </SectionHeader>

        {showBasicSettings && (
          <SectionContent>
            <ConfigGrid>
              <FormGroup>
                <Label>提供商 *</Label>
                <SelectWrapper>
                  <Select
                    value={provider}
                    onChange={(e) => onProviderChange(e.target.value)}
                  >
                    <option value="">选择提供商</option>
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                    <option value="openrouter">OpenRouter</option>
                    <option value="custom">自定义</option>
                  </Select>
                </SelectWrapper>
              </FormGroup>

              <FormGroup>
                <Label>Base URL *</Label>
                <Input
                  type="text"
                  value={baseUrl}
                  onChange={(e) => onBaseUrlChange(e.target.value)}
                  placeholder="输入 API 基础 URL"
                />
              </FormGroup>

              <FormGroup>
                <Label>API Key *</Label>
                <Input
                  type="password"
                  value={apiKey}
                  onChange={(e) => onApiKeyChange(e.target.value)}
                  placeholder="输入您的 API 密钥"
                />
              </FormGroup>

              <FormGroup>
                <Label>模型 *</Label>
                <Input
                  type="text"
                  value={model}
                  onChange={(e) => onModelChange(e.target.value)}
                  placeholder="输入模型名称"
                />
              </FormGroup>
            </ConfigGrid>

            {provider && provider !== 'custom' && (
              <Card $padding="medium" $borderRadius="medium" className="provider-info-card">
                <ProviderInfoTitle>提供商信息</ProviderInfoTitle>
                <p style={{ color: 'var(--text-secondary)' }}>以下是常见提供商的Base URL:</p>
                <ProviderList>
                  <ProviderItem><strong>OpenAI:</strong> https://api.openai.com/v1</ProviderItem>
                  <ProviderItem><strong>Gemini:</strong> https://generativelanguage.googleapis.com/v1beta</ProviderItem>
                  <ProviderItem><strong>OpenRouter:</strong> https://openrouter.ai/api/v1</ProviderItem>
                </ProviderList>
              </Card>
            )}
          </SectionContent>
        )}
      </Section>

      {/* 高级参数设置 */}
      <Section>
        <SectionHeader onClick={onToggleAdvancedSettings}>
          <SectionTitle>高级参数设置</SectionTitle>
          <ToggleIcon $isOpen={showAdvancedSettings}>
            {showAdvancedSettings ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
          </ToggleIcon>
        </SectionHeader>

        {showAdvancedSettings && (
          <SectionContent>
            <ConfigGrid>
              <FormGroup>
                <Label>Temperature: {temperature}</Label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    accentColor: 'var(--primary-main)'
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Max Tokens: {maxTokens}</Label>
                <input
                  type="range"
                  min="1"
                  max="8192"
                  step="1"
                  value={maxTokens}
                  onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    accentColor: 'var(--primary-main)'
                  }}
                />
              </FormGroup>

              <FormGroup>
                <Label>Top P: {topP}</Label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={topP}
                  onChange={(e) => onTopPChange(parseFloat(e.target.value))}
                  style={{
                    width: '100%',
                    marginBottom: '8px',
                    accentColor: 'var(--primary-main)'
                  }}
                />
              </FormGroup>

              <SectionHeader
                onClick={onToggleSystemPrompt}
                $customPadding={true}
              >
                <SectionTitle>系统提示词</SectionTitle>
                <ToggleIcon $isOpen={showSystemPrompt}>
                  {showSystemPrompt ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
                </ToggleIcon>
              </SectionHeader>

              {showSystemPrompt && (
                <div>
                  <FormGroup>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => onSystemPromptChange(e.target.value)}
                      placeholder="输入系统提示词，例如：你是一个乐于助人的助手"
                    />
                  </FormGroup>
                </div>
              )}
            </ConfigGrid>
          </SectionContent>
        )}
      </Section>

      {/* 配置状态 */}
      {isConfigValid ? (
        <StatusMessage $status="success">
          <StatusIcon>
            <StatusIndicator $status="success" />
          </StatusIcon>
          配置已填写完成，可以开始对话
        </StatusMessage>
      ) : (
        <StatusMessage>
          <StatusIcon>
            <StatusIndicator $status="error" />
          </StatusIcon>
          请填写所有必填字段(*)以启用对话功能
        </StatusMessage>
      )}
    </div>
  );
};

// 聊天面板组件的Props类型定义
interface ChatPanelProps {
  messages: ILLMMessage[];
  isLoading: boolean;
  error: string | null;
  onSendMessage: (content: string) => void;
  onClearMessages: () => void;
}

// 聊天面板组件
const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  error,
  onSendMessage,
  onClearMessages
}) => {
  return (
    <div className="chat-panel">
      <PanelHeader>
        <PanelTitle>对话窗口</PanelTitle>
      </PanelHeader>

      <div className="chat-area" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <Card $padding="none" $borderRadius="medium" className="chat-area-card">
          <ChatHeader>
            <ChatTitle>消息记录</ChatTitle>
            <Button
              onClick={onClearMessages}
              variant="outline"
              size="small"
            >
              清空对话
            </Button>
          </ChatHeader>
          
          <ChatMessages>
            <MessageList messages={messages} />
          </ChatMessages>
          
          <MessageInput
            onSendMessage={onSendMessage}
            disabled={isLoading}
          />
          
          {error && (
            <ErrorMessage>
              {error}
            </ErrorMessage>
          )}
        </Card>
      </div>
    </div>
  );
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<ILLMMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [topP, setTopP] = useState(1);
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful assistant.');
  const [showBasicSettings, setShowBasicSettings] = useState(true);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [showSystemPrompt, setShowSystemPrompt] = useState(false);
  const [isConfigValid, setIsConfigValid] = useState(false);

  // 检查配置是否有效
  useEffect(() => {
    const valid = !!(
      apiKey.trim() && 
      baseUrl.trim() && 
      provider.trim() && 
      model.trim()
    );
    setIsConfigValid(valid);
  }, [apiKey, baseUrl, provider, model]);

  // 从localStorage和设置中加载配置
  useEffect(() => {
    // 首先尝试从设置页面保存的配置加载
    const savedConfig = localStorage.getItem('llmConfig');
    if (savedConfig) {
      try {
        const config = JSON.parse(savedConfig);
        setProvider(config.provider || '');
        setModel(config.model || '');
        setApiKey(config.apiKey || '');
        setBaseUrl(config.baseUrl || '');
        setTemperature(config.temperature || 0.7);
        setMaxTokens(config.maxTokens || 2048);
        setTopP(config.topP || 1);
        setSystemPrompt(config.systemPrompt || 'You are a helpful assistant.');
      } catch (e) {
        console.error('Failed to parse saved config', e);
      }
    } else {
      // 如果没有从聊天页面保存的配置，则尝试从设置页面加载
      const loadSettingsConfig = async () => {
        try {
          const result = await window.electronAPI.config.getAll();
          if (result.success && result.data) {
            const config = result.data;
            setProvider(config.llm.provider || '');
            setModel(config.llm.model || '');
            
            // 获取API密钥
            const apiKeyResult = await window.electronAPI.llm.getApiKey(config.llm.provider);
            if (apiKeyResult.success && apiKeyResult.data) {
              setApiKey(apiKeyResult.data);
            }
            
            // 从localStorage获取Base URL
            const savedBaseUrl = localStorage.getItem('llmBaseUrl');
            if (savedBaseUrl) {
              setBaseUrl(savedBaseUrl);
            }
          }
        } catch (error) {
          console.error('Failed to load settings config', error);
        }
      };
      
      loadSettingsConfig();
    }
  }, []);

  // 保存配置到localStorage
  const saveConfig = () => {
    const config = {
      provider,
      model,
      apiKey,
      baseUrl,
      temperature,
      maxTokens,
      topP,
      systemPrompt
    };
    localStorage.setItem('llmConfig', JSON.stringify(config));
    
    // 同时保存Base URL到独立的localStorage键，以便设置页面可以读取
    localStorage.setItem('llmBaseUrl', baseUrl);
  };

  const handleSendMessage = async (content: string) => {
    if (!isConfigValid) {
      setError('Please fill in all required configuration fields');
      return;
    }

    if (!apiKey) {
      setError('API key is required');
      return;
    }

    // 保存配置
    saveConfig();

    const userMessage: ILLMMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // 设置提供商配置
      const configResult = await window.electronAPI.llm.setProviderConfig({
        provider,
        baseUrl,
        apiKey
      });

      if (!configResult.success) {
        throw new Error(configResult.error || 'Failed to set provider config');
      }
      
      // 同时保存API密钥
      await window.electronAPI.llm.setApiKey(provider, apiKey);

      // 发送消息
      const params: ILLMParams = {
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
      };

      const request = {
        provider,
        model,
        messages: [{ role: 'system' as const, content: systemPrompt }, ...messages, userMessage],
        params,
      };

      const result = await window.electronAPI.llm.generateCompletion(request);

      if (result.success && result.data) {
        const assistantMessage: ILLMMessage = { role: 'assistant', content: result.data };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(result.error || 'Failed to get response from LLM');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(`An unexpected error occurred: ${errorMessage}`);
      // 移除用户消息
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  const providerBaseUrls: Record<string, string> = {
    openai: 'https://api.openai.com/v1',
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    openrouter: 'https://openrouter.ai/api/v1',
  };

  const handleProviderChange = (newProvider: string) => {
    setProvider(newProvider);
    if (providerBaseUrls[newProvider]) {
      setBaseUrl(providerBaseUrls[newProvider]);
    }
  };

  return (
    <PageContainer>
      <Content>
        {/* 配置面板 */}
        <div className="config-panel-wrapper" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          minWidth: '300px',
          maxWidth: '450px'
        }}>
          <ConfigPanel
            provider={provider}
            model={model}
            apiKey={apiKey}
            baseUrl={baseUrl}
            temperature={temperature}
            maxTokens={maxTokens}
            topP={topP}
            systemPrompt={systemPrompt}
            showBasicSettings={showBasicSettings}
            showAdvancedSettings={showAdvancedSettings}
            showSystemPrompt={showSystemPrompt}
            isConfigValid={isConfigValid}
            onProviderChange={handleProviderChange}
            onModelChange={setModel}
            onApiKeyChange={setApiKey}
            onBaseUrlChange={setBaseUrl}
            onTemperatureChange={setTemperature}
            onMaxTokensChange={setMaxTokens}
            onTopPChange={setTopP}
            onSystemPromptChange={setSystemPrompt}
            onToggleBasicSettings={() => setShowBasicSettings(!showBasicSettings)}
            onToggleAdvancedSettings={() => setShowAdvancedSettings(!showAdvancedSettings)}
            onToggleSystemPrompt={() => setShowSystemPrompt(!showSystemPrompt)}
          />
        </div>

        {/* 聊天面板 */}
        <div className="chat-panel-wrapper" style={{
          flex: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          minWidth: '400px'
        }}>
          <ChatPanel
            messages={messages}
            isLoading={isLoading}
            error={error}
            onSendMessage={handleSendMessage}
            onClearMessages={clearMessages}
          />
        </div>
      </Content>
    </PageContainer>
  );
};

export default ChatPage;
