import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Card, StatusIndicator, Label, Input, Select, SelectWrapper, FormGroup, Textarea } from './common';

const Title = styled.h3`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const StatusMessageContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.surfaceVariant};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const AddCustomProviderButton = styled(Button)`
  width: 100%;
  justify-content: center;
  border: 1px dashed ${({ theme }) => theme.border};
  background: none;
  color: ${({ theme }) => theme.textSecondary};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.accent};
    background-color: ${({ theme }) => theme.surfaceVariant};
    box-shadow: none;
  }
`;

const CustomProviderForm = styled.div`
  background-color: ${({ theme }) => theme.surfaceVariant};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  padding: 20px;
  margin-top: 16px;
`;

const CustomProviderTitle = styled.h4`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
`;

const ProviderList = styled.div`
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
`;

const ProviderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.foreground};
  margin-bottom: 8px;
  border: 1px solid ${({ theme }) => theme.border};
`;

const ProviderName = styled.span`
  font-weight: 500;
  color: ${({ theme }) => theme.textPrimary};
`;

const RemoveButton = styled(Button)`
  background: none;
  border: none;
  color: ${({ theme }) => theme.error.main};
  padding: 4px 8px;
  min-height: auto;
  box-shadow: none;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.error.main}20;
    box-shadow: none;
  }
`;

interface SettingsPanelProps {
  onSettingsChange: (settings: {
    provider: string;
    model: string;
    apiKey: string;
  }) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ onSettingsChange }) => {
  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customProviderName, setCustomProviderName] = useState('');
  const [customProviders, setCustomProviders] = useState<{name: string, baseUrl: string}[]>([]);
  const [selectedCustomProvider, setSelectedCustomProvider] = useState<string | null>(null);

  const models = {
    openai: [
      'gpt-4',
      'gpt-4-turbo',
      'gpt-3.5-turbo',
      'gpt-3.5-turbo-16k'
    ]
  };

  useEffect(() => {
    // Load saved API key
    const loadApiKey = async () => {
      try {
        const result = await window.electronAPI.llm.getApiKey(provider);
        if (result.success && result.data) {
          setApiKey(result.data);
        }
      } catch (error) {
        console.error('Failed to load API key:', error);
      }
    };
    loadApiKey();
  }, [provider]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      setStatusMessage('API key cannot be empty');
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    try {
      const result = await window.electronAPI.llm.setApiKey(provider, apiKey.trim());
      if (result.success) {
        setStatusMessage('API key saved successfully');
        setIsSuccess(true);
        onSettingsChange({
          provider,
          model,
          apiKey: apiKey.trim()
        });
      } else {
        setStatusMessage(`Failed to save API key: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to save API key');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteApiKey = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.llm.deleteApiKey(provider);
      if (result.success) {
        setApiKey('');
        setStatusMessage('API key deleted successfully');
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to delete API key: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to delete API key');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCustomProvider = async () => {
    if (customProviderName.trim() && baseUrl.trim()) {
      setIsLoading(true);
      try {
        // 保存提供商配置
        const configResult = await window.electronAPI.llm.setProviderConfig({
          provider: customProviderName.trim(),
          baseUrl: baseUrl.trim(),
          apiKey: '' // 初始为空，后续在设置API密钥时更新
        });
        
        if (configResult.success) {
          const newProvider = {
            name: customProviderName.trim(),
            baseUrl: baseUrl.trim()
          };
          
          setCustomProviders([...customProviders, newProvider]);
          setCustomProviderName('');
          setBaseUrl('');
          setShowCustomForm(false);
          setStatusMessage('Custom provider added successfully');
          setIsSuccess(true);
        } else {
          setStatusMessage(`Failed to add custom provider: ${configResult.error}`);
          setIsSuccess(false);
        }
      } catch (error) {
        setStatusMessage('Failed to add custom provider');
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemoveCustomProvider = async (name: string) => {
    setIsLoading(true);
    try {
      // 删除API密钥
      await window.electronAPI.llm.deleteApiKey(name);
      
      // 从自定义提供商列表中移除
      setCustomProviders(customProviders.filter(p => p.name !== name));
      if (selectedCustomProvider === name) {
        setSelectedCustomProvider(null);
      }
      setStatusMessage('Custom provider removed');
      setIsSuccess(true);
    } catch (error) {
      setStatusMessage('Failed to remove custom provider');
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card padding="24px">
      <Title>LLM Settings</Title>
      
      <FormGroup>
        <Label>Provider</Label>
        <SelectWrapper>
          <Select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            disabled={isLoading}
          >
            <option value="openai">OpenAI</option>
            {customProviders.map((p) => (
              <option key={p.name} value={p.name}>
                {p.name} (Custom)
              </option>
            ))}
          </Select>
        </SelectWrapper>
      </FormGroup>

      <FormGroup>
        <Label>Model</Label>
        <SelectWrapper>
          <Select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={isLoading}
          >
            {models[provider as keyof typeof models]?.map((modelOption) => (
              <option key={modelOption} value={modelOption}>
                {modelOption}
              </option>
            )) || <option value="">{provider} (Custom model)</option>}
          </Select>
        </SelectWrapper>
      </FormGroup>

      <FormGroup>
        <Label>API Key</Label>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter your ${provider} API key`}
          disabled={isLoading}
        />
      </FormGroup>

      <ButtonGroup>
        <Button
          onClick={handleSaveApiKey}
          disabled={isLoading || !apiKey.trim()}
          variant="primary"
        >
          {isLoading ? 'Saving...' : 'Save API Key'}
        </Button>
        <Button
          onClick={handleDeleteApiKey}
          disabled={isLoading || !apiKey}
          variant="secondary"
        >
          Delete
        </Button>
      </ButtonGroup>

      <FormGroup>
        <Label>Custom Providers</Label>
        <AddCustomProviderButton 
          onClick={() => setShowCustomForm(!showCustomForm)}
          variant="ghost"
        >
          {showCustomForm ? 'Cancel' : '+ Add Custom Provider'}
        </AddCustomProviderButton>
        
        {showCustomForm && (
          <CustomProviderForm>
            <CustomProviderTitle>Add Custom Provider</CustomProviderTitle>
            <FormGroup>
              <Label>Provider Name</Label>
              <Input
                type="text"
                value={customProviderName}
                onChange={(e) => setCustomProviderName(e.target.value)}
                placeholder="e.g., Anthropic, Mistral"
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>Base URL</Label>
              <Input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="e.g., https://api.anthropic.com/v1"
                disabled={isLoading}
              />
            </FormGroup>
            <Button
              onClick={handleAddCustomProvider}
              disabled={!customProviderName.trim() || !baseUrl.trim() || isLoading}
              variant="primary"
              size="small"
            >
              {isLoading ? 'Adding...' : 'Add Provider'}
            </Button>
          </CustomProviderForm>
        )}
        
        {customProviders.length > 0 && (
          <ProviderList>
            {customProviders.map((p) => (
              <ProviderItem key={p.name}>
                <ProviderName>{p.name}</ProviderName>
                <RemoveButton 
                  onClick={() => handleRemoveCustomProvider(p.name)}
                  disabled={isLoading}
                  variant="ghost"
                >
                  Remove
                </RemoveButton>
              </ProviderItem>
            ))}
          </ProviderList>
        )}
      </FormGroup>

      {statusMessage && (
        <StatusMessageContainer>
          <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
          {statusMessage}
        </StatusMessageContainer>
      )}
    </Card>
  );
};

export default SettingsPanel;