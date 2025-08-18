import React, { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import {
  Card,
  Button,
  Input,
  Textarea,
  Label,
  StatusIndicator,
  PageContainer,
  FormGroup,
  FormRow
} from '../components/common';
import ProxyGroupManager from '../components/ProxyGroupManager';
import {
  Play,
  Square,
  Download,
  RefreshCw,
  Save,
  FolderOpen
} from 'lucide-react';

// 页面组件
const PageHeader = () => (
  <div style={{ marginBottom: '32px' }}>
    <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Proxy Management</h1>
  </div>
);

// 区块组件
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{ marginBottom: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>{title}</h2>
    </div>
    {children}
  </section>
);

// 状态区域组件
const StatusSection: React.FC<{
  isLoading: boolean;
  isRunning: boolean;
  apiAvailable: boolean;
  onStart: () => void;
  onStop: () => void;
  hasConfig: boolean;
}> = ({ isLoading, isRunning, apiAvailable, onStart, onStop, hasConfig }) => {
  if (!apiAvailable) {
    return (
      <Card $padding="medium" $borderRadius="medium">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <StatusIndicator $status="error" />
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 8px 0' }}>API Unavailable</h3>
            <p style={{ margin: 0 }}>Electron API is not available. Please restart the application.</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      {isLoading ? (
        <Card $padding="medium" $borderRadius="medium">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <StatusIndicator $status="info" />
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 8px 0' }}>Loading Status</h3>
              <p style={{ margin: 0 }}>Checking Mihomo service status...</p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <Card $padding="medium" $borderRadius="medium">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <StatusIndicator $status={isRunning ? 'success' : 'error'} />
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: '0 0 8px 0' }}>Service Status</h3>
                <p style={{ margin: 0 }}>{isRunning ? 'Mihomo is Running' : 'Mihomo is Stopped'}</p>
              </div>
            </div>
          </Card>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button
              onClick={onStart}
              disabled={isRunning || isLoading || !hasConfig}
              variant="primary"
              startIcon={<Play size={16} />}
            >
              {isRunning ? 'Running' : 'Start Proxy'}
            </Button>
            <Button
              onClick={onStop}
              disabled={!isRunning || isLoading}
              variant="danger"
              startIcon={<Square size={16} />}
            >
              Stop Proxy
            </Button>
          </div>
        </>
      )}
    </>
  );
};

// 配置卡片组件
const ConfigCard: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <Card $padding="medium" $borderRadius="medium">
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 600, margin: 0 }}>{title}</h3>
    </div>
    {children}
  </Card>
);

// 控制按钮组组件
const ControlButtonGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
    {children}
  </div>
);

// 状态消息容器组件
const StatusMessageContainer: React.FC<{
  isSuccess: boolean;
  children: React.ReactNode;
}> = ({ isSuccess, children }) => (
  <div style={{ marginTop: '24px' }}>
    <Card $padding="medium" $borderRadius="medium">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
        <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
        {children}
      </div>
    </Card>
  </div>
);

// 代理组区域组件
const ProxyGroupSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section style={{ marginTop: '32px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>Proxy Group Management</h2>
    </div>
    {children}
  </section>
);

// 自动启动容器组件
const AutoStartContainer: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ checked, onChange, disabled = false, children }) => (
  <div style={{ marginBottom: '24px' }}>
    <Card $padding="medium" $borderRadius="medium">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          style={{ width: '18px', height: '18px', cursor: 'pointer' }}
        />
        {children}
      </div>
    </Card>
  </div>
);

// URL输入容器组件
const URLInputContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
    {children}
  </div>
);

// 配置文本区域组件
const ConfigTextArea: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}> = ({ value, onChange, placeholder, disabled = false }) => (
  <Textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    style={{
      minHeight: '300px',
      fontFamily: "'Fira Code', 'Consolas', 'Menlo', monospace",
      fontSize: '0.9rem'
    }}
  />
);

// 配置操作组件
const ConfigActions: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
    {children}
  </div>
);

// 配置路径显示组件
const ConfigPathDisplay: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ marginTop: '16px' }}>
    <Card $padding="medium" $borderRadius="medium">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem' }}>
        {children}
      </div>
    </Card>
  </div>
);

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
  const [hasConfig, setHasConfig] = useState(false);

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
        setHasConfig(true);
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
    if (!apiAvailable || !hasConfig) {
      setStatusMessage('Please load or save configuration before starting');
      setIsSuccess(false);
      return;
    }
    
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
        setHasConfig(true);
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
        setHasConfig(true);
        
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
      <PageHeader />
      
      {!apiAvailable ? (
        <StatusSection
          isLoading={isLoading}
          isRunning={isRunning}
          apiAvailable={apiAvailable}
          onStart={handleStart}
          onStop={handleStop}
          hasConfig={hasConfig}
        />
      ) : (
        <>
          {/* 代理状态和控制 */}
          <Section title="Proxy Status">
            <StatusSection
              isLoading={isLoading}
              isRunning={isRunning}
              apiAvailable={apiAvailable}
              onStart={handleStart}
              onStop={handleStop}
              hasConfig={hasConfig}
            />
          </Section>

          {/* 配置管理 */}
          <Section title="Configuration">
            <AutoStartContainer
              checked={autoStart}
              onChange={handleAutoStartChange}
              disabled={isLoading}
            >
              <Label>Start proxy automatically when application launches</Label>
            </AutoStartContainer>
            
            <ConfigCard title="Quick Configuration">
              <URLInputContainer>
                <Input
                  type="text"
                  value={configURL}
                  onChange={(e) => setConfigURL(e.target.value)}
                  placeholder="Enter VPN provider config URL..."
                  disabled={isConfigLoading || isConfigSaving}
                />
                <Button
                  onClick={fetchConfigFromURL}
                  disabled={isConfigLoading || isConfigSaving}
                  startIcon={isConfigLoading ? <RefreshCw size={16} /> : <Download size={16} />}
                >
                  {isConfigLoading ? 'Fetching...' : 'Fetch Config'}
                </Button>
              </URLInputContainer>
            </ConfigCard>
            
            <ConfigCard title="Advanced Configuration">
              <ConfigTextArea
                value={config}
                onChange={(e) => setConfig(e.target.value)}
                placeholder="Enter your Mihomo configuration in YAML format..."
                disabled={isConfigLoading || isConfigSaving}
              />
              
              <ConfigActions>
                <Button
                  onClick={loadConfig}
                  disabled={isConfigLoading || isConfigSaving}
                  variant="outline"
                  startIcon={<RefreshCw size={16} />}
                >
                  {isConfigLoading ? 'Loading...' : 'Reload Config'}
                </Button>
                <Button
                  onClick={saveConfig}
                  disabled={isConfigLoading || isConfigSaving}
                  variant="primary"
                  startIcon={<Save size={16} />}
                >
                  {isConfigSaving ? 'Saving...' : 'Save Config'}
                </Button>
                {configPath && (
                  <Button
                    onClick={openConfigDirectory}
                    variant="outline"
                    startIcon={<FolderOpen size={16} />}
                  >
                    Open Directory
                  </Button>
                )}
              </ConfigActions>
              
              {configPath && (
                <ConfigPathDisplay>
                  <strong>Config Path:</strong> {configPath}
                </ConfigPathDisplay>
              )}
            </ConfigCard>
            
            {statusMessage && (
              <StatusMessageContainer isSuccess={isSuccess}>
                {statusMessage}
              </StatusMessageContainer>
            )}
          </Section>

          {/* 代理组管理 */}
          {isRunning && (
            <ProxyGroupSection>
              <ProxyGroupManager />
            </ProxyGroupSection>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default UnifiedProxyPage;