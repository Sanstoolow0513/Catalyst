import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { 
  Card, 
  Button, 
  Input, 
  Label, 
  StatusIndicator,
  Select,
  SelectWrapper
} from './common';
import { 
  Play, 
  Square, 
  Download, 
  RefreshCw, 
  Save, 
  FolderOpen,
  Wifi,
  Gauge,
  Timer,
  CheckCircle
} from 'lucide-react';

const ProxyManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 768px) {
    gap: 16px;
  }
`;

const Section = styled.section`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const StatusCard = styled(Card)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 24px;
  
  @media (max-width: 768px) {
    padding: 16px;
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 8px 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const StatusDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const ControlButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
  
  @media (max-width: 480px) {
    width: 100%;
    
    & > ${Button} {
      flex: 1;
    }
  }
`;

const ConfigCard = styled(Card)`
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
`;

const ConfigHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
`;

const ConfigTitle = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const URLInputContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
  }
`;

const ConfigTextArea = styled.textarea`
  width: 100%;
  padding: 16px;
  border: 1px solid ${props => props.theme.inputBorder};
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.inputBackground};
  color: ${props => props.theme.textPrimary};
  font-family: 'Fira Code', 'Consolas', 'Menlo', monospace;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 300px;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.inputFocusBorder};
    box-shadow: 0 0 0 2px ${props => props.theme.accent}40;
  }
`;

const ConfigActions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const ConfigPathDisplay = styled.div`
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  font-size: 0.9rem;
  color: ${props => props.theme.textPrimary};
  display: flex;
  align-items: center;
  gap: 12px;
`;

const AutoStartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

const StatusMessageContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9rem;
  color: ${props => props.theme.textPrimary};
`;

const AdvancedSettingsContainer = styled.div`
  margin-top: 24px;
  padding: 16px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const StepIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  border-radius: ${props => props.theme.borderRadius.medium};
  background-color: ${props => props.theme.surfaceVariant};
`;

const Step = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  background-color: ${props => 
    props.$completed ? props.theme.success.main : 
    props.$active ? props.theme.primary.main : 
    props.theme.border};
  color: ${props => 
    props.$completed || props.$active ? '#FFFFFF' : props.theme.textSecondary};
  font-weight: 500;
  transition: all 0.3s ease;
`;

const ProxyManager: React.FC = () => {
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
  const [isValidConfig, setIsValidConfig] = useState(false);
  
  // Workflow steps
  const [currentStep, setCurrentStep] = useState(1); // 1: Set URL, 2: Fetch Config, 3: Validate Config, 4: Start Proxy
  
  // Advanced settings
  const [tunMode, setTunMode] = useState(false);
  const [unifiedDelay, setUnifiedDelay] = useState(false);
  const [tcpConcurrent, setTcpConcurrent] = useState(false);
  const [enableSniffer, setEnableSniffer] = useState(false);
  const [port, setPort] = useState(7890);
  const [socksPort, setSocksPort] = useState(7891);
  const [mixedPort, setMixedPort] = useState(7892);
  const [mode, setMode] = useState('rule');
  const [logLevel, setLogLevel] = useState('info');

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

  useEffect(() => {
    // Check if config is valid
    if (config.trim()) {
      try {
        const configObj = yaml.load(config) as any;
        setIsValidConfig(!!configObj && typeof configObj === 'object');
      } catch {
        setIsValidConfig(false);
      }
    } else {
      setIsValidConfig(false);
    }
  }, [config]);

  const checkStatus = async () => {
    if (!apiAvailable) return;
    setIsLoading(true);
    try {
      const status = await window.electronAPI.mihomo.status();
      setIsRunning(status.isRunning);
      if (status.isRunning) {
        setCurrentStep(4); // If running, we're at the final step
      }
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
        
        // Extract advanced settings from config
        try {
          const configObj = yaml.load(yamlStr) as any;
          if (configObj) {
            setTunMode(!!configObj.tun);
            setUnifiedDelay(configObj['unified-delay'] || false);
            setTcpConcurrent(configObj['tcp-concurrent'] || false);
            setEnableSniffer(configObj.sniffer?.enable || false);
            setPort(configObj.port || 7890);
            setSocksPort(configObj['socks-port'] || 7891);
            setMixedPort(configObj['mixed-port'] || 7892);
            setMode(configObj.mode || 'rule');
            setLogLevel(configObj['log-level'] || 'info');
          }
        } catch (e) {
          console.error('Error parsing config for advanced settings:', e);
        }
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
    if (!apiAvailable || !hasConfig || !isValidConfig) {
      setStatusMessage('Please fetch and validate configuration before starting');
      setIsSuccess(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await window.electronAPI.mihomo.start();
      if (result.success) {
        setStatusMessage('Mihomo started successfully');
        setIsSuccess(true);
        setCurrentStep(4); // Move to final step
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
        setCurrentStep(3); // Go back to config validation step
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
      // Parse the current config
      const configObj = yaml.load(config) as any || {};
      
      // Apply advanced settings to config
      if (tunMode) {
        configObj.tun = {
          enable: true,
          stack: 'system',
          'dns-hijack': ['any:53'],
          'auto-route': true,
          'auto-detect-interface': true
        };
      } else {
        delete configObj.tun;
      }
      
      configObj['unified-delay'] = unifiedDelay;
      configObj['tcp-concurrent'] = tcpConcurrent;
      
      if (enableSniffer) {
        configObj.sniffer = {
          enable: true,
          'parse-pure-ip': true
        };
      } else {
        delete configObj.sniffer;
      }
      
      configObj.port = port;
      configObj['socks-port'] = socksPort;
      configObj['mixed-port'] = mixedPort;
      configObj.mode = mode;
      configObj['log-level'] = logLevel;
      
      // Save the modified config
      const result = await window.electronAPI.mihomo.saveConfig(configObj);
      if (result.success) {
        // Update the YAML display
        const yamlStr = yaml.dump(configObj);
        setConfig(yamlStr);
        
        setStatusMessage('Configuration saved successfully');
        setIsSuccess(true);
        setHasConfig(true);
        setIsValidConfig(true);
        setCurrentStep(3); // Move to validation step
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
        setCurrentStep(2); // Move to config fetched step
        
        // Save VPN URL
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

  const testLatency = async () => {
    if (!apiAvailable) return;
    setStatusMessage('Testing latency for all proxies...');
    setIsSuccess(false);
    
    try {
      const result = await window.electronAPI.mihomo.getProxies();
      if (result.success && result.data) {
        setStatusMessage('Latency test completed for all proxies');
        setIsSuccess(true);
      } else {
        setStatusMessage(`Failed to test latency: ${result.error}`);
        setIsSuccess(false);
      }
    } catch (error) {
      setStatusMessage('Failed to test latency');
      setIsSuccess(false);
      console.error('Error testing latency:', error);
    }
  };

  return (
    <ProxyManagerContainer>
      {/* Workflow Steps */}
      <Section>
        <SectionHeader>
          <Gauge size={20} />
          <SectionTitle>Setup Workflow</SectionTitle>
        </SectionHeader>
        
        <StepIndicator>
          <Step $active={currentStep === 1} $completed={currentStep > 1}>
            {currentStep > 1 ? <CheckCircle size={16} /> : '1'} Set Provider URL
          </Step>
          <Step $active={currentStep === 2} $completed={currentStep > 2}>
            {currentStep > 2 ? <CheckCircle size={16} /> : (currentStep === 2 ? '2' : '‧‧‧')} Fetch Config
          </Step>
          <Step $active={currentStep === 3} $completed={currentStep > 3}>
            {currentStep > 3 ? <CheckCircle size={16} /> : (currentStep === 3 ? '3' : '‧‧‧')} Validate Config
          </Step>
          <Step $active={currentStep === 4} $completed={currentStep > 4}>
            {currentStep > 4 ? <CheckCircle size={16} /> : (currentStep === 4 ? '4' : '‧‧‧')} Start Proxy
          </Step>
        </StepIndicator>
      </Section>
      
      {/* Service Status */}
      <Section>
        <SectionHeader>
          <Wifi size={20} />
          <SectionTitle>Service Status</SectionTitle>
        </SectionHeader>
        
        {isLoading ? (
          <StatusCard>
            <StatusIndicator $status="info" />
            <StatusContent>
              <StatusTitle>Loading Status</StatusTitle>
              <StatusDescription>
                Checking Mihomo service status...
              </StatusDescription>
            </StatusContent>
          </StatusCard>
        ) : (
          <>
            <StatusCard>
              <StatusIndicator $status={isRunning ? 'success' : 'error'} />
              <StatusContent>
                <StatusTitle>Service Status</StatusTitle>
                <StatusDescription>
                  {isRunning ? 'Mihomo is Running' : 'Mihomo is Stopped'}
                </StatusDescription>
              </StatusContent>
            </StatusCard>
            
            <ControlButtonGroup>
              <Button 
                onClick={handleStart} 
                disabled={isRunning || isLoading || !hasConfig || !isValidConfig}
                variant="primary"
                startIcon={<Play size={16} />}
              >
                {isRunning ? 'Running' : 'Start Proxy'}
              </Button>
              <Button 
                onClick={handleStop} 
                disabled={!isRunning || isLoading}
                variant="danger"
                startIcon={<Square size={16} />}
              >
                Stop Proxy
              </Button>
              <Button 
                onClick={testLatency} 
                disabled={!isRunning || isLoading}
                variant="outline"
                startIcon={<Timer size={16} />}
              >
                Test Latency
              </Button>
            </ControlButtonGroup>
          </>
        )}
      </Section>

      {/* Configuration Management */}
      <Section>
        <SectionHeader>
          <Gauge size={20} />
          <SectionTitle>Configuration Management</SectionTitle>
        </SectionHeader>
        
        <AutoStartContainer>
          <Checkbox
            type="checkbox"
            checked={autoStart}
            onChange={(e) => handleAutoStartChange(e.target.checked)}
            disabled={isLoading}
          />
          <Label>Start proxy automatically when application launches</Label>
        </AutoStartContainer>
        
        <ConfigCard>
          <ConfigHeader>
            <ConfigTitle>Step 1: Provider Configuration</ConfigTitle>
          </ConfigHeader>
          
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
              disabled={isConfigLoading || isConfigSaving || !configURL.trim()}
              startIcon={isConfigLoading ? <RefreshCw size={16} /> : <Download size={16} />}
            >
              {isConfigLoading ? 'Fetching...' : 'Fetch Config'}
            </Button>
          </URLInputContainer>
        </ConfigCard>
        
        <ConfigCard>
          <ConfigHeader>
            <ConfigTitle>Step 2: Advanced Configuration</ConfigTitle>
          </ConfigHeader>
          
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
              disabled={isConfigLoading || isConfigSaving || !config.trim()}
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
          
          {/* Config validation status */}
          <StatusMessageContainer style={{ marginTop: 16 }}>
            {isValidConfig ? (
              <>
                <StatusIndicator $status="success" />
                Configuration is valid and ready to use
              </>
            ) : (
              <>
                <StatusIndicator $status="error" />
                Configuration is invalid or empty. Please fetch or enter a valid configuration.
              </>
            )}
          </StatusMessageContainer>
        </ConfigCard>
        
        {/* Advanced Settings */}
        <AdvancedSettingsContainer>
          <SectionHeader>
            <SectionTitle>Advanced Settings</SectionTitle>
          </SectionHeader>
          
          <SettingRow>
            <Checkbox
              type="checkbox"
              checked={tunMode}
              onChange={(e) => setTunMode(e.target.checked)}
            />
            <Label>TUN Mode (System Proxy)</Label>
          </SettingRow>
          
          <SettingRow>
            <Checkbox
              type="checkbox"
              checked={unifiedDelay}
              onChange={(e) => setUnifiedDelay(e.target.checked)}
            />
            <Label>Unified Delay</Label>
          </SettingRow>
          
          <SettingRow>
            <Checkbox
              type="checkbox"
              checked={tcpConcurrent}
              onChange={(e) => setTcpConcurrent(e.target.checked)}
            />
            <Label>TCP Concurrent</Label>
          </SettingRow>
          
          <SettingRow>
            <Checkbox
              type="checkbox"
              checked={enableSniffer}
              onChange={(e) => setEnableSniffer(e.target.checked)}
            />
            <Label>Enable Sniffer</Label>
          </SettingRow>
          
          <SettingRow>
            <FormGroup>
              <Label>Port</Label>
              <Input
                type="number"
                value={port}
                onChange={(e) => setPort(Number(e.target.value))}
                min="1"
                max="65535"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>SOCKS Port</Label>
              <Input
                type="number"
                value={socksPort}
                onChange={(e) => setSocksPort(Number(e.target.value))}
                min="1"
                max="65535"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Mixed Port</Label>
              <Input
                type="number"
                value={mixedPort}
                onChange={(e) => setMixedPort(Number(e.target.value))}
                min="1"
                max="65535"
              />
            </FormGroup>
          </SettingRow>
          
          <SettingRow>
            <FormGroup>
              <Label>Mode</Label>
              <SelectWrapper>
                <Select value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option value="rule">Rule</option>
                  <option value="global">Global</option>
                  <option value="direct">Direct</option>
                </Select>
              </SelectWrapper>
            </FormGroup>
            
            <FormGroup>
              <Label>Log Level</Label>
              <SelectWrapper>
                <Select value={logLevel} onChange={(e) => setLogLevel(e.target.value)}>
                  <option value="silent">Silent</option>
                  <option value="error">Error</option>
                  <option value="warning">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                </Select>
              </SelectWrapper>
            </FormGroup>
          </SettingRow>
        </AdvancedSettingsContainer>
        
        {statusMessage && (
          <StatusMessageContainer>
            <StatusIndicator $status={isSuccess ? 'success' : 'error'} />
            {statusMessage}
          </StatusMessageContainer>
        )}
      </Section>
    </ProxyManagerContainer>
  );
};

export default ProxyManager;