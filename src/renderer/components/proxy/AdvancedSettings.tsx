import React, { memo, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';


const AdvancedSettingsCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-top: 1.5rem;
`;

const SettingsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const SettingsTitle = styled.h4`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0;
`;

const SettingsDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SettingLabel = styled.label`
  flex: 1;
  color: ${props => props.theme.textPrimary};
  font-weight: 500;
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: ${props => props.theme.primary.main};
`;

const InputGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const InputField = styled.div`
  flex: 1;
  min-width: 120px;
`;

const FieldLabel = styled.label`
  display: block;
  color: ${props => props.theme.textSecondary};
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  color: ${props => props.theme.textPrimary};
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.primary.main};
    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
  }
`;

const AutoStartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  background: ${props => props.theme.surfaceVariant};
  margin-bottom: 1.5rem;
`;

interface AdvancedSettingsProps {
  autoStart: boolean;
  tunMode: boolean;
  unifiedDelay: boolean;
  tcpConcurrent: boolean;
  enableSniffer: boolean;
  port: number;
  socksPort: number;
  mixedPort: number;
  mode: string;
  logLevel: string;
  onAutoStartChange: (checked: boolean) => void;
  onTunModeChange: (checked: boolean) => void;
  onUnifiedDelayChange: (checked: boolean) => void;
  onTcpConcurrentChange: (checked: boolean) => void;
  onEnableSnifferChange: (checked: boolean) => void;
  onPortChange: (port: number) => void;
  onSocksPortChange: (port: number) => void;
  onMixedPortChange: (port: number) => void;
  onModeChange: (mode: string) => void;
  onLogLevelChange: (level: string) => void;
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = memo(({
  autoStart,
  tunMode,
  unifiedDelay,
  tcpConcurrent,
  enableSniffer,
  port,
  socksPort,
  mixedPort,
  mode,
  logLevel,
  onAutoStartChange,
  onTunModeChange,
  onUnifiedDelayChange,
  onTcpConcurrentChange,
  onEnableSnifferChange,
  onPortChange,
  onSocksPortChange,
  onMixedPortChange,
  onModeChange,
  onLogLevelChange
}) => {

  const handleAutoStartChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onAutoStartChange(e.target.checked);
  }, [onAutoStartChange]);

  const handleTunModeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTunModeChange(e.target.checked);
  }, [onTunModeChange]);

  const handleUnifiedDelayChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onUnifiedDelayChange(e.target.checked);
  }, [onUnifiedDelayChange]);

  const handleTcpConcurrentChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTcpConcurrentChange(e.target.checked);
  }, [onTcpConcurrentChange]);

  const handleEnableSnifferChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onEnableSnifferChange(e.target.checked);
  }, [onEnableSnifferChange]);

  const handlePortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onPortChange(Number(e.target.value));
  }, [onPortChange]);

  const handleSocksPortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSocksPortChange(Number(e.target.value));
  }, [onSocksPortChange]);

  const handleMixedPortChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onMixedPortChange(Number(e.target.value));
  }, [onMixedPortChange]);

  const handleModeChange = useCallback((e: React.ChangeEvent<any>) => {
    onModeChange(e.target.value);
  }, [onModeChange]);

  const handleLogLevelChange = useCallback((e: React.ChangeEvent<any>) => {
    onLogLevelChange(e.target.value);
  }, [onLogLevelChange]);

  return (
    <AdvancedSettingsCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <SettingsHeader>
        <Shield size={24} />
        <div>
          <SettingsTitle>高级设置</SettingsTitle>
          <SettingsDescription>
            调整代理配置以获得最佳性能
          </SettingsDescription>
        </div>
      </SettingsHeader>
      
      <AutoStartContainer>
        <Checkbox
          type="checkbox"
          checked={autoStart}
          onChange={handleAutoStartChange}
        />
        <SettingLabel>应用程序启动时自动启动代理</SettingLabel>
      </AutoStartContainer>
      
      <SettingRow>
        <Checkbox
          type="checkbox"
          checked={tunMode}
          onChange={handleTunModeChange}
        />
        <SettingLabel>TUN 模式（系统代理）</SettingLabel>
      </SettingRow>
      
      <SettingRow>
        <Checkbox
          type="checkbox"
          checked={unifiedDelay}
          onChange={handleUnifiedDelayChange}
        />
        <SettingLabel>统一延迟</SettingLabel>
      </SettingRow>
      
      <SettingRow>
        <Checkbox
          type="checkbox"
          checked={tcpConcurrent}
          onChange={handleTcpConcurrentChange}
        />
        <SettingLabel>TCP 并发</SettingLabel>
      </SettingRow>
      
      <SettingRow>
        <Checkbox
          type="checkbox"
          checked={enableSniffer}
          onChange={handleEnableSnifferChange}
        />
        <SettingLabel>启用嗅探器</SettingLabel>
      </SettingRow>
      
      <InputGroup>
        <InputField>
          <FieldLabel>端口</FieldLabel>
          <Input
            type="number"
            value={port}
            onChange={handlePortChange}
            min="1"
            max="65535"
          />
        </InputField>
        
        <InputField>
          <FieldLabel>SOCKS 端口</FieldLabel>
          <Input
            type="number"
            value={socksPort}
            onChange={handleSocksPortChange}
            min="1"
            max="65535"
          />
        </InputField>
        
        <InputField>
          <FieldLabel>混合端口</FieldLabel>
          <Input
            type="number"
            value={mixedPort}
            onChange={handleMixedPortChange}
            min="1"
            max="65535"
          />
        </InputField>
      </InputGroup>
      
      <InputGroup style={{ marginTop: '1rem' }}>
        <InputField>
          <FieldLabel>模式</FieldLabel>
          <Select value={mode} onChange={handleModeChange}>
            <option value="rule">规则</option>
            <option value="global">全局</option>
            <option value="direct">直连</option>
          </Select>
        </InputField>
        
        <InputField>
          <FieldLabel>日志级别</FieldLabel>
          <Select value={logLevel} onChange={handleLogLevelChange}>
            <option value="silent">静默</option>
            <option value="error">错误</option>
            <option value="warning">警告</option>
            <option value="info">信息</option>
            <option value="debug">调试</option>
          </Select>
        </InputField>
      </InputGroup>
    </AdvancedSettingsCard>
  );
});

AdvancedSettings.displayName = 'AdvancedSettings';

export default AdvancedSettings;