import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { PageContainer, Button, Card, StatusIndicator, Input, Label } from '../components/common';
import ProxyGroupManager from '../components/ProxyGroupManager';

const Title = styled.h2`
  margin: 0 0 24px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.8rem;
  font-weight: 600;
`;

const StatusCardContent = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.textPrimary};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Section = styled.div`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 16px 0;
  color: ${({ theme }) => theme.textPrimary};
  font-size: 1.3rem;
  font-weight: 600;
`;

const URLInputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const ConfigTextArea = styled.textarea`
  flex: 1;
  width: 100%;
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.inputBorder};
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.inputBackground};
  color: ${({ theme }) => theme.textPrimary};
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 200px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.accent}40;
  }
`;

const StatusMessageContainer = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  display: flex;
  align-items: center;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary};
`;

const ConfigPathDisplay = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  background-color: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textPrimary};
  display: flex;
  align-items: center;
  word-break: break-all;
`;

const AutoStartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const UnifiedProxyPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfigLoading, setIsConfigLoading] = useState(false);
  const [isConfigSaving, setIsConfigSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [configPath, setConfigPath] = useState('');
  const [configURL, setConfigURL] = useState('');
  const [config, setConfig] = useState('');
  const [autoStart, setAutoStart] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(false);

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.mihomo && window.electronAPI.config) {
      setApiAvailable(true);
      checkStatus();
      loadVpnUrl();
      loadAutoStart();
      loadConfig();
      getConfigPath();
    } else {
      console.error('Electron API is not available.');
      setIsLoading(false);
    }
  }, []);

  const checkStatus = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const status = await window.electronAPI.mihomo.status();
      setIsRunning(status.isRunning);
    } catch (error) {
      console.error('Error checking Mihomo status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadVpnUrl = async () => {
    if (!apiAvailable) return;
    try {
      const result = await window.electronAPI.config.getVpnUrl();
      if (result.success && result.data) {
        setConfigURL(result.data);
      }
    } catch (error) {
      console.error('Error loading VPN URL:', error);
    }
  };

  const loadAutoStart = async () => {
    if (!apiAvailable) return;
    try {
      const result = await window.electronAPI.config.getProxyAutoStart();
      if (result.success && result.data !== undefined) {
        setAutoStart(result.data);
      }
    } catch (error) {
      console.error('Error loading auto start setting:', error);
    }
  };

  const loadConfig = async () => {
    if (!apiAvailable) return;
    setIsConfigLoading(true);
    try {
      const result = await window.electronAPI.mihomo.loadConfig();
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        setConfig(yamlStr);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    } finally {
      setIsConfigLoading(false);
    }
  };

  const getConfigPath = async () => {
    if (!apiAvailable) return;
    try {
      const result = await window.electronAPI.mihomo.getConfigPath();
      if (result.success && result.data) {
        setConfigPath(result.data);
      }
    } catch (error) {
      console.error('Error getting config path:', error);
    }
  };

  const handleStart = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.start();
      if (result.success) {
        setStatusMessage('Mihomo started successfully');
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to start Mihomo: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('An error occurred while trying to start Mihomo');
      setIsSuccess(false);
      console.error('Error starting Mihomo:', error);
    } finally {
      await checkStatus();
    }
  };

  const handleStop = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.stop();
      if (result.success) {
        setStatusMessage('Mihomo stopped successfully');
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to stop Mihomo: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('An error occurred while trying to stop Mihomo');
      setIsSuccess(false);
      console.error('Error stopping Mihomo:', error);
    } finally {
      await checkStatus();
    }
  };

  const saveConfig = async () => {
    if (!config.trim()) {
      setStatusMessage('Configuration cannot be empty');
      setIsSuccess(false);
      return;
    }

    setIsConfigSaving(true);
    try {
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
      setIsConfigSaving(false);
    }
  };

  const fetchConfigFromURL = async () => {
    if (!configURL.trim()) {
      setStatusMessage('Please enter a valid URL');
      setIsSuccess(false);
      return;
    }

    setIsConfigLoading(true);
    try {
      const result = await window.electronAPI.mihomo.fetchConfigFromURL(configURL);
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        setConfig(yamlStr);
        setStatusMessage('Configuration fetched successfully');
        setIsSuccess(true);
        
        // 保存VPN URL
        await window.electronAPI.config.setVpnUrl(configURL);
      } else {
        setStatusMessage(`Failed to fetch configuration: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to fetch configuration');
      setIsSuccess(false);
      console.error('Error fetching config:', error);
    } finally {
      setIsConfigLoading(false);
    }
  };

  const handleAutoStartChange = async (checked: boolean) => {
    if (!apiAvailable) return;
    try {
      const result = await window.electronAPI.config.setProxyAutoStart(checked);
      if (result.success) {
        setAutoStart(checked);
        setStatusMessage(`Auto-start ${checked ? 'enabled' : 'disabled'}`);
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to update auto-start: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to update auto-start setting');
      setIsSuccess(false);
      console.error('Error updating auto-start:', error);
    }
  };

  const openConfigDirectory = async () => {
    if (!apiAvailable) return;
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
      <Title>System Proxy Management</Title>
      
      {!apiAvailable ? (
        <Card $padding="medium">
          <StatusCardContent>
            <StatusIndicator $status="error" />
            Electron API is not available. Please restart the application.
          </StatusCardContent>
        </Card>
      ) : (
        <>
          {/* 代理状态和控制 */}
          <Section>
            <SectionTitle>Proxy Status</SectionTitle>
            {isLoading ? (
              <Card $padding="medium">
                <StatusCardContent>
                  <StatusIndicator $status="info" />
                  Loading status...
                </StatusCardContent>
              </Card>
            ) : (
              <>
                <Card $padding="medium">
                  <StatusCardContent>
                    <StatusIndicator $status={isRunning ? 'success' : 'error'} />
                    {isRunning ? 'Mihomo is Running' : 'Mihomo is Stopped'}
                  </StatusCardContent>
                </Card>
                <ButtonGroup>
                  <Button onClick={handleStart} disabled={isRunning || isLoading} variant="primary">
                    Start
                  </Button>
                  <Button onClick={handleStop} disabled={!isRunning || isLoading} variant="danger">
                    Stop
                  </Button>
                </ButtonGroup>
              </>
            )}
          </Section>

          {/* 快速配置 */}
          <Section>
            <SectionTitle>Quick Configuration</SectionTitle>
            <AutoStartContainer>
              <Checkbox
                type="checkbox"
                checked={autoStart}
                onChange={(e) => handleAutoStartChange(e.target.checked)}
                disabled={isLoading}
              />
              <Label>Start proxy automatically when application launches</Label>
            </AutoStartContainer>
            
            <URLInputContainer>
              <Input
                type="text"
                value={configURL}
                onChange={(e) => setConfigURL(e.target.value)}
                placeholder="Enter VPN provider config URL..."
                disabled={isConfigLoading || isConfigSaving}
              />
              <Button onClick={fetchConfigFromURL} disabled={isConfigLoading || isConfigSaving}>
                {isConfigLoading ? 'Fetching...' : 'Fetch Config'}
              </Button>
            </URLInputContainer>
          </Section>

          {/* 高级配置 */}
          <Section>
            <SectionTitle>Advanced Configuration</SectionTitle>
            <div style={{ margin: '0 0 20px 0' }}>
              <Card>
                <ConfigTextArea
                  value={config}
                  onChange={(e) => setConfig(e.target.value)}
                  placeholder="Enter your Mihomo configuration in YAML format..."
                  disabled={isConfigLoading || isConfigSaving}
                />
              </Card>
            </div>
            
            <ButtonGroup>
              <Button onClick={loadConfig} disabled={isConfigLoading || isConfigSaving}>
                {isConfigLoading ? 'Loading...' : 'Reload Config'}
              </Button>
              <Button onClick={saveConfig} disabled={isConfigLoading || isConfigSaving}>
                {isConfigSaving ? 'Saving...' : 'Save Config'}
              </Button>
              {configPath && (
                <Button
                  onClick={openConfigDirectory}
                  variant="outline"
                >
                  Open Directory
                </Button>
              )}
            </ButtonGroup>

            {configPath && (
              <ConfigPathDisplay>
                <strong>Config Path:</strong> {configPath}
              </ConfigPathDisplay>
            )}
          </Section>

          {/* 代理组管理 */}
          {isRunning && (
            <Section>
              <SectionTitle>Proxy Group Management</SectionTitle>
              <ProxyGroupManager />
            </Section>
          )}

          {/* 状态消息 */}
          {statusMessage && (
            <StatusMessageContainer>
              <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
              {statusMessage}
            </StatusMessageContainer>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default UnifiedProxyPage;
