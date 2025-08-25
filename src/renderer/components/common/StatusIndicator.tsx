import React from 'react';
import styled from 'styled-components';
import { Check, AlertCircle, Loader, Save } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'idle' | 'saving' | 'saved' | 'error' | 'changed' | 'success' | 'info';
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const StatusContainer = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  gap: ${props => {
    switch (props.$size) {
      case 'small': return '4px';
      case 'large': return '12px';
      default: return '8px';
    }
  }};
  padding: ${props => {
    switch (props.$size) {
      case 'small': return '4px 8px';
      case 'large': return '8px 16px';
      default: return '6px 12px';
    }
  }};
  border-radius: ${props => props.theme.borderRadius.small};
  font-size: ${props => {
    switch (props.$size) {
      case 'small': return '0.75rem';
      case 'large': return '0.875rem';
      default: return '0.8125rem';
    }
  }};
  font-weight: 500;
  transition: all ${props => props.theme.transition.fast} ease;
  
  &.idle {
    background: ${props => props.theme.surface};
    color: ${props => props.theme.textSecondary};
    border: 1px solid ${props => props.theme.border};
  }
  
  &.saving {
    background: ${props => props.theme.info.light + '20'};
    color: ${props => props.theme.info.main};
    border: 1px solid ${props => props.theme.info.light};
  }
  
  &.saved {
    background: ${props => props.theme.success.light + '20'};
    color: ${props => props.theme.success.main};
    border: 1px solid ${props => props.theme.success.light};
  }
  
  &.error {
    background: ${props => props.theme.error.light + '20'};
    color: ${props => props.theme.error.main};
    border: 1px solid ${props => props.theme.error.light};
  }
  
  &.changed {
    background: ${props => props.theme.warning.light + '20'};
    color: ${props => props.theme.warning.main};
    border: 1px solid ${props => props.theme.warning.light};
  }
  
  &.success {
    background: ${props => props.theme.success.light + '20'};
    color: ${props => props.theme.success.main};
    border: 1px solid ${props => props.theme.success.light};
  }
  
  &.info {
    background: ${props => props.theme.info.light + '20'};
    color: ${props => props.theme.info.main};
    border: 1px solid ${props => props.theme.info.light};
  }
`;

const StatusIcon = styled.div<{ $size: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.saving {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const StatusText = styled.span`
  font-weight: 500;
`;

const StatusIndicator = React.memo<StatusIndicatorProps>(({ 
  status, 
  message, 
  size = 'medium' 
}) => {
  const getStatusConfig = React.useCallback(() => {
    switch (status) {
      case 'saving':
        return {
          icon: <Loader size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '保存中...',
          className: 'saving'
        };
      case 'saved':
        return {
          icon: <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '已保存',
          className: 'saved'
        };
      case 'error':
        return {
          icon: <AlertCircle size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '错误',
          className: 'error'
        };
      case 'changed':
        return {
          icon: <Save size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '未保存的更改',
          className: 'changed'
        };
      case 'success':
        return {
          icon: <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '成功',
          className: 'success'
        };
      case 'info':
        return {
          icon: <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '信息',
          className: 'info'
        };
      default:
        return {
          icon: <Check size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />,
          defaultMessage: '就绪',
          className: 'idle'
        };
    }
  }, [status, size]);

  const config = React.useMemo(() => getStatusConfig(), [getStatusConfig]);
  const displayMessage = React.useMemo(() => message || config.defaultMessage, [message, config.defaultMessage]);

  return (
    <StatusContainer className={config.className} $size={size}>
      <StatusIcon $size={size}>
        {config.icon}
      </StatusIcon>
      <StatusText>{displayMessage}</StatusText>
    </StatusContainer>
  );
});

export default StatusIndicator;
