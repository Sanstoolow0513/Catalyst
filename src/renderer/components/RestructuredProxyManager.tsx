import React, { useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useEnhancedProxyState } from '../hooks/useEnhancedProxyState';
import { proxyService } from '../services/ProxyService';
import ErrorBoundary from './common/ErrorBoundary';
import ProxyOverview from './proxy/ProxyOverview';
import ProxyStatus from './proxy/ProxyStatus';
import WorkflowSteps from './proxy/WorkflowSteps';
import ConfigManager from './proxy/ConfigManager';
import AdvancedSettings from './proxy/AdvancedSettings';
import EnhancedProxyGroupManager from './proxy/EnhancedProxyGroupManager';
import * as yaml from 'js-yaml';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const StatusMessageContainer = styled(motion.div)<{ $isSuccess: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  margin-bottom: 1rem;
  
  ${props => props.$isSuccess ? `
    border: 1px solid ${props.theme.success.main};
    background: ${props.theme.success.main}10;
    color: ${props.theme.success.main};
  ` : `
    border: 1px solid ${props.theme.error.main};
    background: ${props.theme.error.main}10;
    color: ${props.theme.error.main};
  `}
`;

const StatusIcon = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
`;

const StatusText = styled.div`
  font-size: 0.9rem;
  font-weight: 500;
`;

const SectionContainer = styled(motion.div)`
  margin-bottom: 2rem;
`;

const RestructuredProxyManager: React.FC = () => {
  const {
    state,
    startProxy,
    stopProxy,
    selectProxy,
    testAllDelays,
    refreshProxyGroups,
    setConfigURL,
    setConfig,
    setAutoStart,
    setTunMode,
    setUnifiedDelay,
    setTcpConcurrent,
    setEnableSniffer,
    setPort,
    setSocksPort,
    setMixedPort,
    setMode,
    setLogLevel
  } = useEnhancedProxyState();

  // 从 URL 获取配置的增强版本
  const fetchConfigFromURL = async () => {
    if (!state.configURL.trim()) {
      return;
    }

    try {
      const result = await proxyService.fetchConfigFromURL(state.configURL);
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        setConfig(yamlStr);
        
        // 提取高级设置
        const configObj = result.data;
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
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  // 保存配置的增强版本
  const saveConfig = async () => {
    if (!state.config.trim()) {
      return;
    }

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
      
      const result = await proxyService.saveConfig(configObj);
      if (result.success) {
        const yamlStr = yaml.dump(configObj);
        setConfig(yamlStr);
      }
    } catch (error) {
      console.error('保存配置失败:', error);
    }
  };

  // 加载配置
  const loadConfig = async () => {
    try {
      const result = await proxyService.getConfig();
      if (result.success && result.data) {
        const yamlStr = yaml.dump(result.data);
        setConfig(yamlStr);
        
        // 提取高级设置
        const configObj = result.data;
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
      }
    } catch (error) {
      console.error('加载配置失败:', error);
    }
  };

  // 自动启动设置处理
  const handleAutoStartChange = async (checked: boolean) => {
    if (!state.apiAvailable) return;
    
    try {
      const result = await window.electronAPI.config.setProxyAutoStart(checked);
      if (result.success) {
        setAutoStart(checked);
      }
    } catch (error) {
      console.error('更新自动启动设置失败:', error);
    }
  };

  // 打开配置目录
  const openConfigDirectory = async () => {
    if (!state.apiAvailable) return;
    
    try {
      await window.electronAPI.mihomo.openConfigDir();
    } catch (error) {
      console.error('打开配置目录失败:', error);
    }
  };

  // 组件挂载时刷新数据
  useEffect(() => {
    if (state.apiAvailable && state.isRunning) {
      refreshProxyGroups();
    }
  }, [state.apiAvailable, state.isRunning, refreshProxyGroups]);

  return (
    <ErrorBoundary>
      <Container>
        {/* 代理概览 */}
        <ProxyOverview
          isRunning={state.isRunning}
          connectionInfo={state.connectionInfo}
          metrics={state.metrics}
          isLoading={state.isLoading}
        />

        {/* 工作流步骤 */}
        <SectionContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <WorkflowSteps currentStep={state.currentStep} />
        </SectionContainer>
        
        {/* 代理状态控制 */}
        <SectionContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProxyStatus
            isRunning={state.isRunning}
            isLoading={state.isLoading}
            onStart={startProxy}
            onStop={stopProxy}
            onTestLatency={testAllDelays}
            hasConfig={state.hasConfig}
            isValidConfig={state.isValidConfig}
          />
        </SectionContainer>
        
        {/* 配置管理 */}
        <SectionContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ConfigManager
            configURL={state.configURL}
            config={state.config}
            configPath={state.configPath}
            isValidConfig={state.isValidConfig}
            isConfigLoading={state.isConfigLoading}
            isConfigSaving={state.isConfigSaving}
            onConfigURLChange={setConfigURL}
            onConfigChange={setConfig}
            onFetchConfig={fetchConfigFromURL}
            onSaveConfig={saveConfig}
            onLoadConfig={loadConfig}
            onOpenConfigDir={openConfigDirectory}
          />
        </SectionContainer>
        
        {/* 高级设置 */}
        <SectionContainer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
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
            onTunModeChange={setTunMode}
            onUnifiedDelayChange={setUnifiedDelay}
            onTcpConcurrentChange={setTcpConcurrent}
            onEnableSnifferChange={setEnableSniffer}
            onPortChange={setPort}
            onSocksPortChange={setSocksPort}
            onMixedPortChange={setMixedPort}
            onModeChange={setMode}
            onLogLevelChange={setLogLevel}
          />
        </SectionContainer>

        {/* 代理组管理 - 只在代理运行时显示 */}
        {state.isRunning && (
          <SectionContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <EnhancedProxyGroupManager
              groups={state.proxyGroups}
              latencyData={state.latencyData}
              isLoading={state.isFetchingGroups}
              isTestingLatency={state.isTestingLatency}
              onSelectProxy={selectProxy}
              onTestLatency={testAllDelays}
              onRefreshGroups={refreshProxyGroups}
            />
          </SectionContainer>
        )}
        
        {/* 状态消息 */}
        {state.statusMessage && (
          <StatusMessageContainer 
            $isSuccess={state.isSuccess}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <StatusIcon>
              {state.isSuccess ? '✓' : '✗'}
            </StatusIcon>
            <StatusText>
              {state.statusMessage}
            </StatusText>
          </StatusMessageContainer>
        )}
      </Container>
    </ErrorBoundary>
  );
};

export default RestructuredProxyManager;