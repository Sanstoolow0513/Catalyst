import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { PageContainer, Button, Card, StatusIndicator } from '../components/common';

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-size: 1.8rem;
`;

const URLInputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex: 1;
  min-width: 300px;
`;

const URLInput = styled.input`
  flex: 1;
  padding: 10px 15px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const StyledTextArea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 15px;
  border: 1px solid ${({ theme }) => theme.inputBorder}; /* 使用新的 inputBorder */
  border-radius: 8px;
  background-color: ${({ theme }) => theme.inputBackground}; /* 使用新的 inputBackground */
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  font-family: 'Fira Mono', 'Consolas', 'Menlo', monospace;
  font-size: 0.95rem;
  resize: vertical; /* Allow vertical resizing */
  min-height: 200px; /* Minimum height */

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder}; /* 使用新的 inputFocusBorder */
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const StatusMessageContainer = styled.div`
  margin-top: 15px;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface}; /* 使用 surface 背景色 */
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
`;

const ConfigPathDisplay = styled.div`
  margin-top: 15px;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.surface}; /* 使用 surface 背景色 */
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary}; /* 使用新的 textPrimary */
  display: flex;
  align-items: center;
  word-break: break-all;
`;

const MihomoConfigPage: React.FC = () => {
  const [config, setConfig] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [configPath, setConfigPath] = useState('');
  const [configURL, setConfigURL] = useState('');

  useEffect(() => {
    loadConfig();
    getConfigPath();
  }, []);

  const loadConfig = async () => {
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.loadConfig();
      if (result.success && result.data) {
        // 将配置对象转换为 YAML 字符串
        const yamlStr = yaml.dump(result.data);
        setConfig(yamlStr);
        setStatusMessage('Configuration loaded successfully');
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to load configuration: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to load configuration');
      setIsSuccess(false);
      console.error('Error loading config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
      if (!config.trim()) {
        setStatusMessage('Configuration cannot be empty');
        setIsSuccess(false);
        return;
      }
  
      setIsSaving(true);
      try {
        // 将 YAML 字符串转换为对象
        const configObj = yaml.load(config);
        
        const result = await window.electronAPI.mihomo.saveConfig(configObj);
        if (result.success) {
          setStatusMessage('Configuration saved successfully');
          setIsSuccess(true);
        } else {
          setStatusMessage(`Failed to save configuration: ${result.error}`);
          setIsSuccess(false);
        }
      } catch (error) {
        setStatusMessage('Failed to save configuration. Please check the YAML format.');
        setIsSuccess(false);
        console.error('Error saving config:', error);
      } finally {
        setIsSaving(false);
      }
    };
  
    const fetchConfigFromURL = async () => {
      if (!configURL.trim()) {
        setStatusMessage('Please enter a valid URL');
        setIsSuccess(false);
        return;
      }
  
      setIsLoading(true);
      try {
        const result = await window.electronAPI.mihomo.fetchConfigFromURL(configURL);
        if (result.success && result.data) {
          // 将配置对象转换为 YAML 字符串
          const yamlStr = yaml.dump(result.data);
          setConfig(yamlStr);
          setStatusMessage('Configuration fetched successfully');
          setIsSuccess(true);
        } else {
          setStatusMessage(`Failed to fetch configuration: ${result.error}`);
          setIsSuccess(false);
        }
      } catch (error) {
        setStatusMessage('Failed to fetch configuration');
        setIsSuccess(false);
        console.error('Error fetching config:', error);
      } finally {
        setIsLoading(false);
      }
    };

  const getConfigPath = async () => {
    try {
      const result = await window.electronAPI.mihomo.getConfigPath();
      if (result.success && result.data) {
        setConfigPath(result.data);
      }
    } catch (error) {
      console.error('Error getting config path:', error);
    }
  };

  const openConfigDirectory = async () => {
    try {
      const result = await window.electronAPI.mihomo.openConfigDir();
      if (!result.success) {
        console.error('Failed to open config directory:', result.error);
      }
    } catch (error) {
      console.error('Error opening config directory:', error);
    }
  };

  return (
      <PageContainer>
        <Header>
          <Title>Mihomo Configuration</Title>
          <div>
            <Button onClick={loadConfig} disabled={isLoading || isSaving}>
              {isLoading ? 'Loading...' : 'Load Config'}
            </Button>
            <Button onClick={saveConfig} disabled={isLoading || isSaving}>
              {isSaving ? 'Saving...' : 'Save Config'}
            </Button>
            {configPath && (
              <Button
                onClick={openConfigDirectory}
                variant="outline"
              >
                Open Directory
              </Button>
            )}
          </div>
        </Header>
        
        <URLInputContainer>
          <URLInput
            type="text"
            value={configURL}
            onChange={(e) => setConfigURL(e.target.value)}
            placeholder="Enter VPN provider config URL..."
            disabled={isLoading || isSaving}
          />
          <Button onClick={fetchConfigFromURL} disabled={isLoading || isSaving}>
            {isLoading ? 'Fetching...' : 'Fetch Config'}
          </Button>
        </URLInputContainer>

      <div style={{ margin: '0 0 20px 0' }}>
        <Card>
        <StyledTextArea
          value={config}
          onChange={(e) => setConfig(e.target.value)}
          placeholder="Enter your Mihomo configuration in YAML format..."
          disabled={isLoading || isSaving}
        />
      </Card>
    </div>

      {configPath && (
        <ConfigPathDisplay>
          <strong>Config Path:</strong> {configPath}
          <Button
            onClick={openConfigDirectory}
            size="small"
            variant="outline"
          >
            Open Directory
          </Button>
        </ConfigPathDisplay>
      )}
      
      {statusMessage && (
        <StatusMessageContainer>
          <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
          {statusMessage}
        </StatusMessageContainer>
      )}
    </PageContainer>
  );
};

export default MihomoConfigPage;
