import React, { useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import yaml from 'js-yaml';
import { useProxyState } from '../hooks/useProxyState';
import ErrorBoundary from './common/ErrorBoundary';
import ProxyStatus from './proxy/ProxyStatus';
import WorkflowSteps from './proxy/WorkflowSteps';
import ConfigManager from './proxy/ConfigManager';
import AdvancedSettings from './proxy/AdvancedSettings';

const ProxyManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const StatusMessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  margin-top: 1rem;
  
  ${props => props.isSuccess ? `
    border: 1px solid ${props.theme.success.main};
    color: ${props.theme.success.main};
  ` : `
    border: 1px solid ${props.theme.error.main};
    color: ${props.theme.error.main};
  `}
`;

const EnhancedProxyManager: React.FC = () => {
  const { state, ...actions } = useProxyState();

  // 缓存依赖项，避免重复计算
  const apiDependencies = useMemo(() => ({
    apiAvailable: state.apiAvailable,
    hasConfig: state.hasConfig,
    isValidConfig: state.isValidConfig,
    configURL: state.configURL,
    config: state.config,
    tunMode: state.tunMode,
    unifiedDelay: state.unifiedDelay,
    tcpConcurrent: state.tcpConcurrent,
    enableSniffer: state.enableSniffer,
    port: state.port,
    socksPort: state.socksPort,
    mixedPort: state.mixedPort,
    mode: state.mode,
    logLevel: state.logLevel
  }), [
    state.apiAvailable,
    state.hasConfig,
    state.isValidConfig,
    state.configURL,
    state.config,
    state.tunMode,
    state.unifiedDelay,
    state.tcpConcurrent,
    state.enableSniffer,
    state.port,
    state.socksPort,
    state.mixedPort,
    state.mode,
    state.logLevel
  ]);

  // 计算操作状态
  const operationStatus = useMemo(() => {
    const isAnyLoading = state.isLoading || state.isConfigLoading || state.isConfigSaving;
    const canStart = state.apiAvailable && state.hasConfig && state.isValidConfig && !isAnyLoading;
    const canStop = state.apiAvailable && state.isRunning && !isAnyLoading;
    const canTest = state.apiAvailable && state.isRunning && !isAnyLoading;
    
    return {
      isAnyLoading,
      canStart,
      canStop,
      canTest,
      statusMessage: isAnyLoading ? '正在处理中，请稍候...' : state.statusMessage
    };
  }, [state]);

  // 初始化
  useEffect(() => {
    if (state.apiAvailable) {
      checkStatus();
      loadVpnUrl();
      loadAutoStart();
      loadConfig();
      getConfigPath();
    } else {
      actions.setLoading(false);
    }
  }, [state.apiAvailable]);

  // 检查状态
  const checkStatus = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    actions.setLoading(true);
    try {
      const status = await window.electronAPI.mihomo.status();
      actions.setRunning(status.isRunning);
    } catch (error) {
      console.error('Error checking Mihomo status:', error);
      actions.setStatusMessage('检查状态失败', false);
    } finally {
      actions.setLoading(false);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 加载 VPN URL
  const loadVpnUrl = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.config.getVpnUrl();
      if (result.success && result.data) {
        actions.setConfigURL(result.data);
      }
    } catch (error) {
      console.error('Error loading VPN URL:', error);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 加载自动启动设置
  const loadAutoStart = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.config.getProxyAutoStart();
      if (result.success && result.data !== undefined) {
        actions.setAutoStart(result.data);
      }
    } catch (error) {
      console.error('Error loading auto start setting:', error);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 加载配置
  const loadConfig = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    actions.setConfigLoading(true);
    try {
      const result = await window.electronAPI.mihomo.loadConfig();
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        actions.setConfig(yamlStr);
        actions.setHasConfig(true);
        
        // 提取高级设置
        try {
          const configObj = yaml.load(yamlStr) as any;
          if (configObj) {
            actions.setTunMode(!!configObj.tun);
            actions.setUnifiedDelay(configObj['unified-delay'] || false);
            actions.setTcpConcurrent(configObj['tcp-concurrent'] || false);
            actions.setEnableSniffer(configObj.sniffer?.enable || false);
            actions.setPort(configObj.port || 7890);
            actions.setSocksPort(configObj['socks-port'] || 7891);
            actions.setMixedPort(configObj['mixed-port'] || 7892);
            actions.setMode(configObj.mode || 'rule');
            actions.setLogLevel(configObj['log-level'] || 'info');
          }
        } catch (e) {
          console.error('Error parsing config for advanced settings:', e);
        }
      }
    } catch (error) {
      console.error('Error loading config:', error);
      actions.setStatusMessage('加载配置失败', false);
    } finally {
      actions.setConfigLoading(false);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 获取配置路径
  const getConfigPath = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.mihomo.getConfigPath();
      if (result.success && result.data) {
        actions.setConfigPath(result.data);
      }
    } catch (error) {
      console.error('Error getting config path:', error);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 启动代理
  const handleStart = useCallback(async () => {
    if (!apiDependencies.apiAvailable || !apiDependencies.hasConfig || !apiDependencies.isValidConfig) {
      actions.setStatusMessage('请先获取并验证配置', false);
      return;
    }
    
    actions.setLoading(true);
    try {
      const result = await window.electronAPI.mihomo.start();
      if (result.success) {
        actions.setStatusMessage('Mihomo 启动成功', true);
        actions.setCurrentStep(4);
      } else {
        actions.setStatusMessage(`启动失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('启动时发生错误', false);
      console.error('Error starting Mihomo:', error);
    } finally {
      await checkStatus();
    }
  }, [apiDependencies.apiAvailable, apiDependencies.hasConfig, apiDependencies.isValidConfig, actions, checkStatus]);

  // 停止代理
  const handleStop = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    actions.setLoading(true);
    try {
      const result = await window.electronAPI.mihomo.stop();
      if (result.success) {
        actions.setStatusMessage('Mihomo 停止成功', true);
        actions.setCurrentStep(3);
      } else {
        actions.setStatusMessage(`停止失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('停止时发生错误', false);
      console.error('Error stopping Mihomo:', error);
    } finally {
      await checkStatus();
    }
  }, [apiDependencies.apiAvailable, actions, checkStatus]);

  // 测试延迟
  const testLatency = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    actions.setStatusMessage('正在测试所有代理的延迟...', false);
    
    try {
      const result = await window.electronAPI.mihomo.getProxies();
      if (result.success && result.data) {
        actions.setStatusMessage('延迟测试完成', true);
      } else {
        actions.setStatusMessage(`延迟测试失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('延迟测试时发生错误', false);
      console.error('Error testing latency:', error);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 从 URL 获取配置
  const fetchConfigFromURL = useCallback(async () => {
    if (!apiDependencies.configURL.trim()) {
      actions.setStatusMessage('请输入有效的 URL', false);
      return;
    }

    actions.setConfigLoading(true);
    try {
      const result = await window.electronAPI.mihomo.fetchConfigFromURL(state.configURL);
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        actions.setConfig(yamlStr);
        actions.setStatusMessage('配置获取成功', true);
        actions.setHasConfig(true);
        actions.setCurrentStep(2);
        
        // 保存 VPN URL
        await window.electronAPI.config.setVpnUrl(state.configURL);
      } else {
        actions.setStatusMessage(`获取配置失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('获取配置时发生错误', false);
      console.error('Error fetching config:', error);
    } finally {
      actions.setConfigLoading(false);
    }
  }, [apiDependencies.configURL, actions]);

  // 保存配置
  const saveConfig = useCallback(async () => {
    if (!apiDependencies.config.trim()) {
      actions.setStatusMessage('配置不能为空', false);
      return;
    }

    actions.setConfigSaving(true);
    try {
      const configObj = yaml.load(state.config) as any || {};
      
      // 应用高级设置
      if (state.tunMode) {
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
      
      configObj['unified-delay'] = state.unifiedDelay;
      configObj['tcp-concurrent'] = state.tcpConcurrent;
      
      if (state.enableSniffer) {
        configObj.sniffer = {
          enable: true,
          'parse-pure-ip': true
        };
      } else {
        delete configObj.sniffer;
      }
      
      configObj.port = state.port;
      configObj['socks-port'] = state.socksPort;
      configObj['mixed-port'] = state.mixedPort;
      configObj.mode = state.mode;
      configObj['log-level'] = state.logLevel;
      
      const result = await window.electronAPI.mihomo.saveConfig(configObj);
      if (result.success) {
        const yamlStr = yaml.dump(configObj);
        actions.setConfig(yamlStr);
        actions.setStatusMessage('配置保存成功', true);
        actions.setHasConfig(true);
        actions.setValidConfig(true);
        actions.setCurrentStep(3);
      } else {
        actions.setStatusMessage(`保存配置失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('保存配置时发生错误', false);
      console.error('Error saving config:', error);
    } finally {
      actions.setConfigSaving(false);
    }
  }, [apiDependencies.config, apiDependencies.tunMode, apiDependencies.unifiedDelay, apiDependencies.tcpConcurrent, 
      apiDependencies.enableSniffer, apiDependencies.port, apiDependencies.socksPort, apiDependencies.mixedPort, 
      apiDependencies.mode, apiDependencies.logLevel, actions]);

  // 自动启动设置
  const handleAutoStartChange = useCallback(async (checked: boolean) => {
    if (!apiDependencies.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.config.setProxyAutoStart(checked);
      if (result.success) {
        actions.setAutoStart(checked);
        actions.setStatusMessage(`自动启动已${checked ? '启用' : '禁用'}`, true);
      } else {
        actions.setStatusMessage(`更新自动启动设置失败: ${result.error}`, false);
      }
    } catch (error) {
      actions.setStatusMessage('更新自动启动设置时发生错误', false);
      console.error('Error updating auto-start:', error);
    }
  }, [apiDependencies.apiAvailable, actions]);

  // 打开配置目录
  const openConfigDirectory = useCallback(async () => {
    if (!apiDependencies.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.mihomo.openConfigDir();
      if (!result.success) {
        console.error('Failed to open config directory:', result.error);
      }
    } catch (error) {
      console.error('Error opening config directory:', error);
    }
  }, [apiDependencies.apiAvailable]);

  return (
    <ErrorBoundary>
      <ProxyManagerContainer>
        <WorkflowSteps currentStep={state.currentStep} />
        
        <ProxyStatus
          isRunning={state.isRunning}
          isLoading={state.isLoading}
          onStart={handleStart}
          onStop={handleStop}
          onTestLatency={testLatency}
          hasConfig={state.hasConfig}
          isValidConfig={state.isValidConfig}
        />
        
        <ConfigManager
          configURL={state.configURL}
          config={state.config}
          configPath={state.configPath}
          isValidConfig={state.isValidConfig}
          isConfigLoading={state.isConfigLoading}
          isConfigSaving={state.isConfigSaving}
          onConfigURLChange={actions.setConfigURL}
          onConfigChange={actions.setConfig}
          onFetchConfig={fetchConfigFromURL}
          onSaveConfig={saveConfig}
          onLoadConfig={loadConfig}
          onOpenConfigDir={openConfigDirectory}
        />
        
        <AdvancedSettings
          autoStart={state.autoStart}
          tunMode={state.tunMode}
          unifiedDelay={state.unifiedDelay}
          tcpConcurrent={state.tcpConcurrent}
          enableSniffer={state.enableSniffer}
          port={state.port}
          socksPort={state.socksPort}
          mixedPort={state.mixedPort}
          mode={state.mode}
          logLevel={state.logLevel}
          onAutoStartChange={handleAutoStartChange}
          onTunModeChange={actions.setTunMode}
          onUnifiedDelayChange={actions.setUnifiedDelay}
          onTcpConcurrentChange={actions.setTcpConcurrent}
          onEnableSnifferChange={actions.setEnableSniffer}
          onPortChange={actions.setPort}
          onSocksPortChange={actions.setSocksPort}
          onMixedPortChange={actions.setMixedPort}
          onModeChange={actions.setMode}
          onLogLevelChange={actions.setLogLevel}
        />
        
        {operationStatus.statusMessage && (
          <StatusMessageContainer isSuccess={state.isSuccess}>
            {state.isSuccess ? '✓' : '✗'} {operationStatus.statusMessage}
          </StatusMessageContainer>
        )}
      </ProxyManagerContainer>
    </ErrorBoundary>
  );
};

export default EnhancedProxyManager;