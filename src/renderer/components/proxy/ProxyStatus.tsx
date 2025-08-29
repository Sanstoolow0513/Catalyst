import React, { memo, useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Wifi, Activity, XCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import StatusIndicator from '../common/StatusIndicator';

const StatusCard = styled(motion.div)`
  background: ${props => props.theme.surface};
  border: 1px solid ${props => props.theme.border};
  border-radius: ${props => props.theme.borderRadius.large};
  padding: 1.5rem;
  margin-top: ${({ theme }) => theme.spacing.lg};
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
`;

const StatusContent = styled.div`
  flex: 1;
`;

const StatusTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${props => props.theme.textPrimary};
  margin: 0 0 0.5rem 0;
`;

const StatusDescription = styled.p`
  color: ${props => props.theme.textSecondary};
  margin: 0;
  font-size: 0.9rem;
`;

const ControlButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ErrorMessage = styled.div`
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: ${props => props.theme.error.main}10;
  border: 1px solid ${props => props.theme.error.main}30;
  border-radius: ${props => props.theme.borderRadius.medium};
  color: ${props => props.theme.error.main};
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚠️';
    font-size: 0.9rem;
  }
`;

const ControlButton = styled(motion.button)<{ $variant: 'primary' | 'danger' | 'outline' }>`
  padding: 0.75rem 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  border: none;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  
  ${props => {
    switch (props.$variant) {
      case 'primary':
        return `
          background: ${props.theme.primary.main};
          color: ${props.theme.primary.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.dark};
          }
        `;
      case 'danger':
        return `
          background: ${props.theme.error.main};
          color: ${props.theme.error.contrastText};
          &:hover:not(:disabled) {
            background: ${props.theme.error.dark};
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${props.theme.primary.main};
          border: 1px solid ${props.theme.primary.main};
          &:hover:not(:disabled) {
            background: ${props.theme.primary.main};
            color: ${props.theme.primary.contrastText};
          }
        `;
      default:
        return '';
    }
  }}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

interface ProxyStatusProps {
  isRunning: boolean;
  isLoading: boolean;
  onStart: () => void;
  onStop: () => void;
  onTestLatency: () => void;
  hasConfig: boolean;
  isValidConfig: boolean;
  lastError?: string | null;
}

const ProxyStatus: React.FC<ProxyStatusProps> = memo(({
  isRunning,
  isLoading,
  onStart,
  onStop,
  onTestLatency,
  hasConfig,
  isValidConfig,
  lastError
}) => {
  useTheme();

  const statusText = useMemo(() => {
    if (isLoading) return '🔄 正在检查状态...';
    if (lastError) return `🔴 错误: ${lastError}`;
    return isRunning ? '🟢 Mihomo 代理服务正在运行' : '🔴 Mihomo 代理服务已停止';
  }, [isLoading, isRunning, lastError]);
  const startButtonTooltip = useMemo(() => {
    if (isRunning) return '代理正在运行中';
    if (isLoading) return '正在处理中，请稍候';
    if (!hasConfig) return '请先获取配置';
    if (!isValidConfig) return '配置无效，请检查配置';
    return '启动 Mihomo 代理服务';
  }, [isRunning, isLoading, hasConfig, isValidConfig]);

  const isStartDisabled = useMemo(() => isRunning || isLoading || !hasConfig || !isValidConfig, [isRunning, isLoading, hasConfig, isValidConfig]);
  const isStopDisabled = useMemo(() => !isRunning || isLoading, [isRunning, isLoading]);
  const isTestDisabled = useMemo(() => !isRunning || isLoading, [isRunning, isLoading]);

  return (
    <StatusCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <StatusIndicator status={isRunning ? 'success' : 'error'} size="small" />
      <StatusContent>
        <StatusTitle>代理服务状态</StatusTitle>
        <StatusDescription>
          {statusText}
        </StatusDescription>
      </StatusContent>
      
      <ControlButtonGroup>
        <ControlButton
          $variant="primary"
          onClick={onStart}
          disabled={isStartDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          title={startButtonTooltip}
        >
          <Wifi size={16} />
          {isRunning ? '运行中' : '启动代理'}
        </ControlButton>
        
        <ControlButton
          $variant="danger"
          onClick={onStop}
          disabled={isStopDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <XCircle size={16} />
          停止代理
        </ControlButton>
        
        <ControlButton
          $variant="outline"
          onClick={onTestLatency}
          disabled={isTestDisabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Activity size={16} />
          测试延迟
        </ControlButton>
      </ControlButtonGroup>
      
      {lastError && (
        <ErrorMessage>
          {lastError}
        </ErrorMessage>
      )}
    </StatusCard>
  );
});

ProxyStatus.displayName = 'ProxyStatus';

export default ProxyStatus;