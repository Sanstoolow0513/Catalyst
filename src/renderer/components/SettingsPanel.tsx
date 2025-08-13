import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Card, StatusIndicator } from './common'; // 修正导入路径

const Title = styled.h3`
  margin: 0 0 20px 0; /* 调整间距 */
  color: ${({ theme }) => theme.textPrimary}; /* 使用 textPrimary */
  font-size: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 15px; /* 调整间距 */
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px; /* 调整间距 */
  color: ${({ theme }) => theme.textPrimary}; /* 使用 textPrimary */
  font-weight: bold;
  font-size: 0.95rem;
`;

const StyledSelect = styled.select` /* 重命名为 StyledSelect */
  width: 100%;
  padding: 10px 15px; /* 调整 padding */
  border: 1px solid ${({ theme }) => theme.inputBorder}; /* 使用新的 inputBorder */
  border-radius: 8px; /* 更大的圆角 */
  background-color: ${({ theme }) => theme.inputBackground}; /* 使用新的 inputBackground */
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 0.95rem;
  appearance: none; /* 移除默认箭头 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E"); /* 自定义箭头 */
  background-repeat: no-repeat;
  background-position: right 15px center;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder}; /* 使用新的 inputFocusBorder */
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const StyledInput = styled.input` /* 重命名为 StyledInput */
  width: 100%;
  padding: 10px 15px; /* 调整 padding */
  border: 1px solid ${({ theme }) => theme.inputBorder}; /* 使用新的 inputBorder */
  border-radius: 8px; /* 更大的圆角 */
  background-color: ${({ theme }) => theme.inputBackground}; /* 使用新的 inputBackground */
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 0.95rem;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder}; /* 使用新的 inputFocusBorder */
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const StatusMessageContainer = styled.div`
  margin-top: 15px;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.sidebarBackground}; /* 使用新的 sidebarBackground */
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
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
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

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

  return (
    <Card padding="20px"> {/* 修正属性名为 padding */}
      <Title>LLM Settings</Title>
      
      <FormGroup>
        <Label>Provider</Label>
        <StyledSelect /* 使用 StyledSelect */
          value={provider}
          onChange={(e) => setProvider(e.target.value)}
          disabled={isLoading}
        >
          <option value="openai">OpenAI</option>
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <Label>Model</Label>
        <StyledSelect /* 使用 StyledSelect */
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={isLoading}
        >
          {models[provider as keyof typeof models].map((modelOption) => (
            <option key={modelOption} value={modelOption}>
              {modelOption}
            </option>
          ))}
        </StyledSelect>
      </FormGroup>

      <FormGroup>
        <Label>API Key</Label>
        <StyledInput /* 使用 StyledInput */
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder={`Enter your ${provider} API key`}
          disabled={isLoading}
        />
      </FormGroup>

      <ButtonGroup> {/* 使用 ButtonGroup */}
        <Button
          onClick={handleSaveApiKey}
          disabled={isLoading || !apiKey.trim()}
          variant="primary" /* 设置 variant */
        >
          {isLoading ? 'Saving...' : 'Save API Key'}
        </Button>
        <Button
          onClick={handleDeleteApiKey}
          disabled={isLoading || !apiKey}
          variant="secondary" /* 设置 variant */
        >
          Delete
        </Button>
      </ButtonGroup>

      {statusMessage && (
        <StatusMessageContainer> {/* 使用 StatusMessageContainer */}
          <StatusIndicator $status={isSuccess ? 'success' : 'error'} /> {/* 使用 StatusIndicator */}
          {statusMessage}
        </StatusMessageContainer>
      )}
    </Card>
  );
};

export default SettingsPanel;
