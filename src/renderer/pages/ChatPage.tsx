import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Card, Input, Label, Select, SelectWrapper, FormGroup } from '../components/common';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import { ILLMMessage, ILLMParams } from '../types/electron';
import { PageContainer } from '../components/common';
import { 
  Settings as SettingsIcon,
  AlertCircle as AlertIcon,
  CheckCircle as CheckIcon,
  Info as InfoIcon,
  ChevronDown as ChevronDownIcon,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';

const ChatPageContainer = styled(PageContainer)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  padding: 0;
  background-color: ${({ theme }) => theme.background};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.foreground};
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const ConfigPanel = styled.div`
  width: 40%;
  display: flex;
  flex-direction: column;
  border-right: 1px solid transparent;
  background-color: ${({ theme }) => theme.foreground};
  overflow-y: auto;
  min-width: 300px;
`;

const ChatPanel = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: ${({ theme }) => theme.background};
`;

const ConfigSection = styled.div`
  padding: 20px;
`;

const ConfigGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.textPrimary};
  font-size: 0.9rem;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${props => props.theme.accent}40;
  }
  
  &::placeholder {
    color: ${props => props.theme.textTertiary};
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 12px 0;
  border-bottom: 1px solid ${({ theme }) => theme.border};
`;

const SectionTitle = styled.h3`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ToggleIcon = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.textTertiary};
`;

const ProviderInfo = styled.div`
  background-color: ${({ theme }) => theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 16px;
  margin-top: 16px;
`;

const ProviderInfoTitle = styled.h4`
  margin: 0 0 12px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ProviderList = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: ${({ theme }) => theme.textSecondary};
`;

const ProviderItem = styled.li`
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const StatusMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.surfaceVariant};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 0.9rem;
  margin-top: 16px;
`;

const StatusIcon = styled.div`
  display: flex;
  align-items: center;
`;

const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

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
        messages: [{ role: 'system', content: systemPrompt }, ...messages, userMessage],
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
    <ChatPageContainer>
      <Header>
        <Title>AI 对话</Title>
      </Header>

      <Content>
        <ConfigPanel>
          <ConfigSection>
            <SectionHeader onClick={() => setShowBasicSettings(!showBasicSettings)}>
              <SectionTitle>
                基本配置
              </SectionTitle>
              <ToggleIcon>
                {showBasicSettings ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
              </ToggleIcon>
            </SectionHeader>

            {showBasicSettings && (
              <ConfigGrid>
                <FormGroup>
                  <Label>提供商 *</Label>
                  <SelectWrapper>
                    <Select
                      value={provider}
                      onChange={(e) => handleProviderChange(e.target.value)}
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
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="输入 API 基础 URL"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>API Key *</Label>
                  <Input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="输入您的 API 密钥"
                  />
                </FormGroup>

                <FormGroup>
                  <Label>模型 *</Label>
                  <Input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="输入模型名称"
                  />
                </FormGroup>
              </ConfigGrid>
            )}

            {showBasicSettings && provider && provider !== 'custom' && (
              <ProviderInfo>
                <ProviderInfoTitle>
                  <InfoIcon size={16} />
                  提供商信息
                </ProviderInfoTitle>
                <p>以下是常见提供商的Base URL:</p>
                <ProviderList>
                  <ProviderItem><strong>OpenAI:</strong> https://api.openai.com/v1</ProviderItem>
                  <ProviderItem><strong>Gemini:</strong> https://generativelanguage.googleapis.com/v1beta</ProviderItem>
                  <ProviderItem><strong>OpenRouter:</strong> https://openrouter.ai/api/v1</ProviderItem>
                </ProviderList>
              </ProviderInfo>
            )}

            <SectionHeader onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}>
              <SectionTitle>
                高级参数设置
              </SectionTitle>
              <ToggleIcon>
                {showAdvancedSettings ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
              </ToggleIcon>
            </SectionHeader>

            {showAdvancedSettings && (
              <ConfigGrid>
                <FormGroup>
                  <Label>Temperature: {temperature}</Label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
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
                    onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                    style={{ width: '100%' }}
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
                    onChange={(e) => setTopP(parseFloat(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </FormGroup>

                <SectionHeader onClick={() => setShowSystemPrompt(!showSystemPrompt)} style={{ padding: '8px 0', border: 'none' }}>
                  <SectionTitle>
                    系统提示词
                  </SectionTitle>
                  <ToggleIcon>
                    {showSystemPrompt ? <ChevronDownIcon size={20} /> : <ChevronRightIcon size={20} />}
                  </ToggleIcon>
                </SectionHeader>

                {showSystemPrompt && (
                  <FormGroup>
                    <Textarea
                      value={systemPrompt}
                      onChange={(e) => setSystemPrompt(e.target.value)}
                      placeholder="输入系统提示词，例如：你是一个乐于助人的助手"
                    />
                  </FormGroup>
                )}
              </ConfigGrid>
            )}

            {isConfigValid && (
              <StatusMessage style={{ backgroundColor: '#10B98120', color: '#10B981' }}>
                <StatusIcon>
                  <CheckIcon size={16} />
                </StatusIcon>
                配置已填写完成，可以开始对话
              </StatusMessage>
            )}

            {!isConfigValid && (
              <StatusMessage>
                <StatusIcon>
                  <AlertIcon size={16} />
                </StatusIcon>
                请填写所有必填字段(*)以启用对话功能
              </StatusMessage>
            )}
          </ConfigSection>
        </ConfigPanel>

        <ChatPanel>
          <ChatArea>
            <MessageList messages={messages} />
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isLoading || !isConfigValid}
            />
            {error && <p style={{ color: 'red', textAlign: 'center', padding: '10px' }}>{error}</p>}
          </ChatArea>
        </ChatPanel>
      </Content>
    </ChatPageContainer>
  );
};

export default ChatPage;